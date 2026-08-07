import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth(function middleware(req: NextRequest & { auth: unknown }) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoggedIn = !!(req as { auth?: { user?: unknown } }).auth?.user;

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dang-nhap", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Match /admin/* but skip static files and Next.js internals
  matcher: ["/admin/:path*"],
};
