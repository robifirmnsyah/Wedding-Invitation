import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Also protect admin API routes (except /api/admin/login)
    const isAdminApi =
      pathname.startsWith("/api/admin") &&
      !pathname.startsWith("/api/admin/login");

    const isAdminPage =
      pathname.startsWith("/admin") && !pathname.startsWith("/api/");

    if (isAdminPage || isAdminApi) {
      // Check both cookie names for dev/prod compatibility
      const sessionCookie =
        request.cookies.get("__Host-admin_session") ??
        request.cookies.get("admin_session");

      if (!sessionCookie?.value) {
        if (isAdminApi) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
        }

        // Redirect to login page for admin pages
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
