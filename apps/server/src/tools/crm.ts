export async function upsertCustomer(args: {
  name: string;
  phone?: string;
  email?: string;
}) {
  // TODO: persist to your CRM / DB
  return { ok: true, customerId: `CUST-${Math.random().toString(36).slice(2, 8)}` };
}
