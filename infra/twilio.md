# Twilio Voice + Media Streams Setup

1) Buy a Twilio Voice number.
2) Set Voice webhook (CALL STATUS CHANGES/VOICE) to POST: https://<your-domain>/twilio/voice
3) Your `/twilio/voice` returns TwiML with:
   ```xml
   <Start><Stream url="wss://<your-domain>/twilio/stream"/></Start>
   ```
4) Ensure your server is reachable via HTTPS/WSS (use ngrok in dev).
5) Audio frames will flow over WebSocket. The server forwards them to OpenAI Realtime.
