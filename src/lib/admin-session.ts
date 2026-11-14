const encoder = new TextEncoder();

export const sessionCookie =
  process.env.NODE_ENV === "production"
    ? "__Host-saufynna_pipin_admin"
    : "saufynna_pipin_admin";

export const legacySessionCookies = [
  "__Host-fynna_pipin_admin",
  "fynna_pipin_admin",
  "__Host-admin_session",
  "admin_session",
];

export function getSessionCookieNames(): string[] {
  return [sessionCookie, ...legacySessionCookies];
}

async function getSecret(): Promise<string> {
  const custom =
    process.env.SAUFYNNA_PIPIN_SESSION_SECRET ||
    process.env.FYNNA_PIPIN_SESSION_SECRET ||
    process.env.SESSION_SECRET;
  if (custom && custom.length >= 32) return custom;

  const password =
    process.env.SAUFYNNA_PIPIN_ADMIN_PASSWORD ||
    process.env.FYNNA_PIPIN_ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    "saufynna_pipin_default_admin_password_2027";

  const data = encoder.encode(`${password}:saufynna_pipin_session_salt_2027`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

async function key() {
  const secret = await getSecret();
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
