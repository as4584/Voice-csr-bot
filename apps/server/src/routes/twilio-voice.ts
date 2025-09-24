import { Router } from "express";

const router = Router();

router.post("/voice", (_req, res) => {
  const wsUrl = (process.env.PUBLIC_URL || "ws://localhost:3000") + "/twilio/stream";
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Connecting you to our assistant.</Say>
  <Start>
    <Stream url="${wsUrl}" />
  </Start>
  <Pause length="600"/>
</Response>`;
  res.type("text/xml").send(twiml);
});

export default router;
