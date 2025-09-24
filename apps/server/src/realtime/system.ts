import fs from "fs";
import path from "path";

export async function loadSystemPrompt() {
  const p = path.join(__dirname, "..", "prompts", "system.md");
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "You are a helpful voice CSR.";
  }
}
