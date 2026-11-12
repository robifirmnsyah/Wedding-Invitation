import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear session cookie
  const cookieName = sessionCookie;

  res.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
