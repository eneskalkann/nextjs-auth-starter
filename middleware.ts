import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protect /dashboard and all its subpages
export async function middleware(request: NextRequest) {
  // Only run for dashboard and its subroutes
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  if (!isDashboard) return NextResponse.next();

  // Try to get session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no session, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Eğer kullanıcı admin değilse yönlendir
  if (token.role !== "ADMIN" && token.role !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    loginUrl.searchParams.set("reason", "not_admin");
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
