# TwiML App Configuration (Optional)

Instead of pointing the phone number directly to your webhook, you can:
1) Create a TwiML App in Twilio Console.
2) Set its Voice Request URL to: `https://<your-domain>/twilio/voice`
3) Assign the TwiML App to your phone number.

This lets you reuse the same app across numbers/environments.
