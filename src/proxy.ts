import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Renamed from the deprecated `middleware` convention (Next.js 16).
// `proxy` always runs on the Node.js runtime, so importing the full auth
// config here no longer drags Prisma into an Edge bundle.
export default auth(function proxy(req) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoggedIn = Boolean(req.auth?.user);

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dang-nhap", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Match /admin/* but skip static files and Next.js internals
  matcher: ["/admin/:path*"],
};
