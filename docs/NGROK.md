# Ngrok for Local Development

1) Install ngrok and sign in.
2) Run a tunnel:
   ```bash
   ngrok http 3000
   ```
3) Copy the **https** URL it prints (e.g., `https://abcd.ngrok-free.app`).
4) Set `PUBLIC_URL` in `.env` to that URL.
5) In Twilio Console, set your Voice webhook to: `https://<ngrok-domain>/twilio/voice`.
