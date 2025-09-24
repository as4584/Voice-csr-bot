/**
 * Server-side adapter to OpenAI Realtime over WebSocket.
 * - Connects to wss://api.openai.com/v1/realtime?model=...
 * - Sends/receives binary audio frames (PCM16)
 * This is a minimal example; production should add retries, heartbeats, etc.
 */
import { WebSocket } from "ws";
import { EventEmitter } from "events";
import { registerTools } from "../tools";
import { loadSystemPrompt } from "./system";
import { toolSpecs } from "./toolspec";
import { emitEvent } from "./bus";

const OPENAI_RT_URL = "wss://api.openai.com/v1/realtime";

type ToolHandler = (args: any) => Promise<any>;

export async function makeRealtimeSession() {
  const bus = new EventEmitter();
  const model = process.env.OPENAI_REALTIME_MODEL || "gpt-4o-realtime-preview";

  const ws = new WebSocket(`${OPENAI_RT_URL}?model=${encodeURIComponent(model)}`, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Beta": "realtime=v1"
    }
  });

  // Maintain tool registry locally; forward via JSON messages
  const tools: Record<string, ToolHandler> = {};
  const rt: any = {
    registerTool: (name: string, fn: ToolHandler) => { tools[name] = fn; }
  };

  registerTools(rt);
  const systemPrompt = await loadSystemPrompt();

  ws.on("open", () => {
    // Send initial session instructions (system prompt) if supported
    const init = {
      type: "session.update",
      session: {
        instructions: systemPrompt,
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
      }
    };
    // Include tool specs so model knows how to call functions
    const toolDeclaration = {
      type: "session.tools.add",
      tools: toolSpecs
    };
    ws.send(JSON.stringify(init));
    ws.send(JSON.stringify(toolDeclaration));
  });

  ws.on("message", async (data: Buffer) => {
    // Two kinds of frames may arrive: JSON control frames and binary audio.
    // Realtime service generally sends JSON events; audio is wrapped inside events.
    try {
      // Try parse as JSON first
      const txt = data.toString("utf8");
      if (txt.startsWith("{") || txt.startsWith("[")) {
        const event = JSON.parse(txt);

        // Minimal handling: audio chunk event
        if (event.type === "response.message.delta" && event.delta?.text) {
          emitEvent("assistant_text", { text: event.delta.text });
        }
        if (event.type === "response.audio.delta" && event.audio) {
          const chunk = Buffer.from(event.audio, "base64");
          bus.emit("audio_out", chunk);
          emitEvent("assistant_audio", { bytes: chunk.length });
        }

        // Tool call from model
        if ((event.type === "response.function_call" || event.type === "response.tool_call") && event.name) {
          emitEvent("tool_call", { name: event.name, arguments: event.arguments });
          const fn = tools[event.name];
          const args = event.arguments || {};
          let result: any = { ok: false, error: "tool not found" };
          if (fn) {
            try { result = await fn(args); } catch (e: any) { result = { ok: false, error: e?.message || String(e) }; }
          }
          const toolResult = {
            type: "response.function_call_output",
            name: event.name,
            result
          };
          ws.send(JSON.stringify(toolResult));
        }

        return;
      }
    } catch {
      // fallthrough to binary path
    }

    // If not JSON, treat as binary audio? (Most events will be JSON though.)
    // We don't expect raw audio from OpenAI without an envelope, so ignore.
  });

  ws.on("close", () => {
    bus.removeAllListeners();
  });

  return {
    onAudioOut: (fn: (b: Buffer) => void) => bus.on("audio_out", fn),
    sendAudio: (pcm: Buffer) => {
      // Stream caller audio to model
      const frame = {
        type: "input_audio_buffer.append",
        audio: pcm.toString("base64")
      };
      ws.send(JSON.stringify(frame));
      // Ask model to respond
      const commit = { type: "input_audio_buffer.commit" };
      const respond = { type: "response.create" };
      ws.send(JSON.stringify(commit));
      ws.send(JSON.stringify(respond));
    },
    close: () => ws.close(),
  };
}
