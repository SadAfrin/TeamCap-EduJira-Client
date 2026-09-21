import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an active user session
const protectedRoutes = [
  "/admin",
  "/teacher",
  "/student",
  "/parent",
  "/dashboard",
  "/attendance",
  "/timetable",
  "/calendar",
  "/select-role",
  "/pending-review",
];

// Routes only accessible to unauthenticated guests
const authRoutes = [
  "/login",
  "/register",
  "/signup",
  "/forget-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Better-Auth session token cookies (standard and secure HTTPS)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = Boolean(sessionToken);

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if current route is auth-only (login, signup, etc.)
  const isAuthRoute = authRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. If accessing a protected route without being authenticated -> redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If accessing auth pages (login, register) while already authenticated -> redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (images, svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
