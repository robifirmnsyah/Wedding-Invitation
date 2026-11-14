import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminSession, sessionCookie } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password.trim() : "";
  if (!password) {
    return NextResponse.json(
      { error: "Password wajib diisi." },
      { status: 400 },
    );
  }

  const configuredPassword =
    process.env.SAUFYNNA_PIPIN_ADMIN_PASSWORD ||
    process.env.FYNNA_PIPIN_ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD;

  const validPasswords: string[] = [];
  if (configuredPassword) {
    validPasswords.push(configuredPassword.trim());
  } else {
    // Default fallback credentials if no environment variable is set
    validPasswords.push("admin123", "saufynna2027", "pipin2027");
  }

  // Constant-time comparison to prevent timing attacks
  const isValid = validPasswords.some((target) => {
    const inputBuf = Buffer.from(password);
    const targetBuf = Buffer.from(target);
    return (
      inputBuf.length === targetBuf.length &&
      crypto.timingSafeEqual(inputBuf, targetBuf)
    );
  });

  if (!isValid) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  // Generate a session token
  const sessionToken = await createAdminSession();

  const res = NextResponse.json({ success: true });

  const isProd = process.env.NODE_ENV === "production";

  // Set the primary session cookie
  res.cookies.set(sessionCookie, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  // Also set non-Host cookie for broad compatibility across subdomains/proxies
  const nonHost = sessionCookie.replace(/^__Host-/, "");
  if (nonHost !== sessionCookie) {
    res.cookies.set(nonHost, sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }

  return res;
}
