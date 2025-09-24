import { createAppointment } from "./appointment";
import { upsertCustomer } from "./crm";

import { emitEvent } from "../realtime/bus";

export function registerTools(rt: any) {
  rt.registerTool?.("create_appointment", async (args: any) => {
    const res = await createAppointment(args);
    emitEvent("tool_result", { name: "create_appointment", result: res });
    return res;
  });
  rt.registerTool?.("upsert_customer", async (args: any) => {
    const res = await upsertCustomer(args);
    emitEvent("tool_result", { name: "upsert_customer", result: res });
    return res;
  });
}
