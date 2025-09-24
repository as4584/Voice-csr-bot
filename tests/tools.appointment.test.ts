import { describe, it, expect } from "vitest";
import { createAppointment } from "../apps/server/src/tools/appointment";

describe("appointment tool", () => {
  it("creates a confirmation", async () => {
    const res = await createAppointment({name:"Alex", service:"Consult", datetime:"2025-09-25T10:00:00Z"});
    expect(res.ok).toBe(true);
    expect(res.confirmation).toBeTruthy();
  });
});
