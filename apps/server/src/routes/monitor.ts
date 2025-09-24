import { Router } from "express";
import { bus } from "../realtime/bus";

const router = Router();

router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const handler = (evt: any) => {
    res.write(`data: ${JSON.stringify(evt)}\n\n`);
  };
  bus.on("monitor:event", handler);

  req.on("close", () => {
    bus.off("monitor:event", handler);
    res.end();
  });
});

export default router;
