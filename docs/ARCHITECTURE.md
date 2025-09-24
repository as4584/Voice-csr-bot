# ARCHITECTURE (Realtime + Calendar)

Caller ↔ Twilio Number → Media Streams (WebSocket)
      ↕
  Node/Express Bridge (attachWs at /twilio/stream)
      ↕
OpenAI Realtime (wss://api.openai.com/v1/realtime?model=...)
      ↕
Tools (function calling): create_appointment → Google Calendar API
