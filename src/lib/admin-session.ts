const encoder = new TextEncoder();
export const sessionCookie =
  process.env.NODE_ENV === "production"
    ? "__Host-fynna_pipin_admin"
    : "fynna_pipin_admin";
async function key() {
  const secret = process.env.FYNNA_PIPIN_SESSION_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Admin session is not configured");
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}
function hex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
export async function createAdminSession() {
  const payload = `${Date.now() + 8 * 60 * 60 * 1000}:${crypto.randomUUID()}`;
  return `${payload}.${hex(await crypto.subtle.sign("HMAC", await key(), encoder.encode(payload)))}`;
}
export async function validAdminSession(value?: string) {
  try {
    if (!value) return false;
    const [payload, signature, extra] = value.split(".");
    const expiry = Number(payload?.split(":")[0]);
    if (
      extra ||
      !Number.isFinite(expiry) ||
      !/^[a-f0-9]{64}$/.test(signature || "") ||
      expiry <= Date.now()
    )
      return false;
    const bytes = Uint8Array.from(signature.match(/.{2}/g)!, (byte) =>
      parseInt(byte, 16),
    );
    return crypto.subtle.verify(
      "HMAC",
      await key(),
      bytes,
      encoder.encode(payload),
    );
  } catch {
    return false;
  }
}
