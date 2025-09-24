import express from "express";
import bodyParser from "body-parser";
import voiceRouter from "./routes/twilio-voice";
import streamRouter, { attachWs } from "./routes/twilio-stream";
import monitorRouter from "./routes/monitor";
import path from "path";
import expressStatic from "express";
import dotenv from "dotenv";
import expressWs from "express-ws";

dotenv.config({ path: process.cwd() + "/apps/server/.env" });

const app = express();
expressWs(app); // patch app with .ws()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve monitor UI
app.use(expressStatic.static(path.join(process.cwd(), "apps/server/public")));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Attach WebSocket route for Twilio media stream
attachWs(app);

app.use("/twilio", voiceRouter);
app.use("/twilio", streamRouter);
app.use("/monitor", monitorRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server up on :${port}`));
