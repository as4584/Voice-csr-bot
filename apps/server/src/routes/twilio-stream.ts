import { Router } from "express";
import type { Application } from "express";
import { makeRealtimeSession } from "../realtime/session";

const router = Router();

export function attachWs(app: Application) {
  (app as any).ws("/twilio/stream", async (ws: any) => {
    const rt = await makeRealtimeSession();

    rt.onAudioOut((chunk: Buffer) => {
      try { ws.send(chunk); } catch {}
    });

    ws.on("message", (msg: Buffer) => {
      // Twilio sends JSON and audio frames; handle both if needed.
      // For simplicity we assume raw PCM16 chunks are forwarded.
      rt.sendAudio(msg);
    });

    ws.on("close", () => rt.close());
  });
}

export default router;
