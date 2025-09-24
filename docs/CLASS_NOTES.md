# CLASS NOTES — Voice CSR, Twilio, OpenAI Realtime, MCP

Goal: Voice-to-voice AI CSR that answers calls and books appointments.

Pipeline:
- Twilio phone number + Media Streams → your Node bridge → OpenAI Realtime → tools (calendar/CRM)

Terminology:
- TCP/IP (not dcp/ip)
- Chat Completions/Responses API = standard endpoints to talk to the model
- MCP (Model Context Protocol) = a standard to expose tools to LLMs (the model's "hands")

Examples:
- eBay MCP tool: model can price items & create listings.
- Browser MCP: safe web lookup.

Pitch:
- Live demo call; booking; transcript; after-hours coverage; reminders.


Add-ons:
- Tool schemas declared to the model (name/params) so it knows how to call `create_appointment`.
- Confirmation policy baked into the system prompt.
- Ngrok + TwiML App docs for quick dev + clean routing.
