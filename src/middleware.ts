import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieNames, validAdminSession } from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname === "/api/admin/login"
  )
    return NextResponse.next();

  let authenticated = false;
  for (const name of getSessionCookieNames()) {
    const val = request.cookies.get(name)?.value;
    if (val && (await validAdminSession(val))) {
      authenticated = true;
      break;
    }
  }

  if (!authenticated) {
    if (pathname.startsWith("/api/"))
      return NextResponse.json(
        { error: "Silakan masuk sebagai admin." },
        { status: 401 },
      );
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
