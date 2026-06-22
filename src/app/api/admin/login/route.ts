import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// TODO(security): Consider using OAuth or a proper auth provider for production.
// TODO(security): Consider MFA for admin authentication.
// TODO(security): Consider rate limiting this endpoint.
// TODO(security): Consider leaked password detection.

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = (body.password ?? "").trim();
  if (!password) {
    return NextResponse.json(
      { error: "Password wajib diisi." },
      { status: 400 }
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    // Fail-safe: if no admin password is configured, deny all access
    console.error("ADMIN_PASSWORD environment variable is not set.");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  // Constant-time comparison to prevent timing attacks
  const inputBuf = Buffer.from(password);
  const correctBuf = Buffer.from(adminPassword);
  const isValid =
    inputBuf.length === correctBuf.length &&
    crypto.timingSafeEqual(inputBuf, correctBuf);

  if (!isValid) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  // Generate a session token
  const sessionToken = crypto.randomBytes(32).toString("hex");

  const res = NextResponse.json({ success: true });

  // Set HttpOnly, Secure, SameSite cookie
  // __Host- prefix requires HTTPS; use plain name in development
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Host-admin_session"
      : "admin_session";

  res.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return res;
}
