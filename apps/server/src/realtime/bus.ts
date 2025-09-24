import { EventEmitter } from "events";
export const bus = new EventEmitter();

// Helper to emit structured events for the monitor UI
export function emitEvent(type: string, payload: any) {
  bus.emit("monitor:event", { type, ts: Date.now(), payload });
}
