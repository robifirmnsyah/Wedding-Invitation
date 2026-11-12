import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionCookie, validAdminSession } from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname === "/api/admin/login"
  )
    return NextResponse.next();
  if (!(await validAdminSession(request.cookies.get(sessionCookie)?.value))) {
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
