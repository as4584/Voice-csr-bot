export const toolSpecs = [
  {
    name: "create_appointment",
    description: "Create a new calendar appointment for a customer.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer full name" },
        phone: { type: "string", description: "Customer phone number, optional" },
        service: { type: "string", description: "Service name, e.g., 'Standard consult'" },
        datetime: { type: "string", description: "Start time ISO8601, e.g., 2025-09-25T15:30:00-04:00" },
        durationMinutes: { type: "number", description: "Duration in minutes (default 30)" },
        timezone: { type: "string", description: "IANA timezone, e.g., 'America/New_York' (default UTC)" }
      },
      required: ["name", "service", "datetime"]
    }
  },
  {
    name: "upsert_customer",
    description: "Create or update a customer in CRM.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" }
      },
      required: ["name"]
    }
  }
];
