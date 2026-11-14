import { NextResponse } from "next/server";
import { getSessionCookieNames } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ success: true });
  const isProd = process.env.NODE_ENV === "production";

  for (const name of getSessionCookieNames()) {
    res.cookies.set(name, "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    const nonHost = name.replace(/^__Host-/, "");
    if (nonHost !== name) {
      res.cookies.set(nonHost, "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
  }

  return res;
}
