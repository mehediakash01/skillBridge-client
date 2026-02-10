import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
 
  const sessionCookie = request.cookies.get("better-auth.session_token")?.value;

  const protectedPaths = [
    "/dashboard",
    "/tutor",
    "/admin",
    
  ];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !sessionCookie) {
    // Redirect to login, with callback URL so they return after login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tutor/:path*",
    "/admin/:path*",
    
  ],
};