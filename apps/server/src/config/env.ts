import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().default("3000"),
  PUBLIC_URL: z.string().url().optional(),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_VOICE_NUMBER: z.string().optional(),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_REALTIME_MODEL: z.string().default("gpt-4o-realtime-preview"),

  GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: z.string().optional(),
  CALENDAR_ID: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
