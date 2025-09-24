import { google } from "googleapis";
import { z } from "zod";

function decodeServiceAccount() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!b64) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON_BASE64");
  const json = Buffer.from(b64, "base64").toString("utf8");
  return JSON.parse(json);
}

const CreateAppointmentSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  service: z.string().min(1),
  datetime: z.string().min(1),
  durationMinutes: z.number().int().positive().optional(),
  timezone: z.string().optional(),
});

export async function createAppointment(args: {
  name: string;
  phone?: string;
  service: string;
  datetime: string; // ISO string in UTC or with TZ
  durationMinutes?: number;
  timezone?: string; // e.g., "America/New_York"
}) {
  const parsed = CreateAppointmentSchema.safeParse(args);
  if (!parsed.success) {
    return { ok: false, error: "Invalid arguments", issues: parsed.error.issues };
  }
  const a = parsed.data;

  const sa = decodeServiceAccount();
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const jwt = new google.auth.JWT(sa.client_email, undefined, sa.private_key, scopes);
  const calendar = google.calendar({ version: "v3", auth: jwt });

  const calendarId = process.env.CALENDAR_ID;
  if (!calendarId) throw new Error("Missing CALENDAR_ID");

  const start = new Date(a.datetime);
  const duration = a.durationMinutes ?? 30;
  const end = new Date(start.getTime() + duration * 60000);

  const event = {
    summary: `${a.service} with ${a.name}`,
    description: `Auto-booked by Voice CSR.\nName: ${a.name}\nPhone: ${a.phone ?? ""}`,
    start: { dateTime: start.toISOString(), timeZone: a.timezone || "UTC" },
    end: { dateTime: end.toISOString(), timeZone: a.timezone || "UTC" },
  };

  const res = await calendar.events.insert({
    calendarId,
    requestBody: event as any,
  });

  const id = res.data.id || `CONF-${Math.random().toString(36).slice(2, 8)}`;
  return { ok: true, confirmation: id, eventId: res.data.id, htmlLink: res.data.htmlLink, start: event.start, end: event.end };
}
