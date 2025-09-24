export function redactPII(s: string) {
  return s.replace(/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g, "***-**-****");
}
