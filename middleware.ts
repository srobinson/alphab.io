import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  console.log("Middleware - hostname:", hostname, "pathname:", pathname);

  // Check if this is a RADE subdomain request
  const isRadeSubdomain = hostname.includes("rade.");

  // For local development (localhost:3000)
  if (hostname.includes("localhost") || hostname.includes(":3000")) {
    if (!isRadeSubdomain) {
      // Main domain (localhost:3000) - serve landing page for all routes
      console.log("Local: rewriting to landing page for", pathname);
      return NextResponse.rewrite(new URL("/api/landing", request.url));
    }
    // This shouldn't happen with localhost, but continue to Next.js app
    console.log("Local: continuing to Next.js app");
    return NextResponse.next();
  }

  // For local testing with custom domains
  if (hostname.includes("alphab.local")) {
    if (!isRadeSubdomain) {
      // Main domain (alphab.local) - serve landing page for all routes
      console.log(
        "Local custom domain: rewriting to landing page for",
        pathname
      );
      return NextResponse.rewrite(new URL("/api/landing", request.url));
    }
    // Subdomain (rade.alphab.local) - continue to Next.js app
    console.log(
      "Local custom domain: continuing to Next.js app for rade subdomain"
    );
    return NextResponse.next();
  }

  // Production logic for alphab.io
  if (hostname.includes("alphab.io")) {
    if (isRadeSubdomain) {
      // rade.alphab.io - continue to Next.js app
      console.log("Production: continuing to Next.js app for rade subdomain");
      return NextResponse.next();
    } else {
      // alphab.io (main domain) - serve landing page for ALL routes
      console.log("Production: rewriting to landing page for", pathname);
      return NextResponse.rewrite(new URL("/api/landing", request.url));
    }
  }

  // For Vercel preview deployments (*.vercel.app)
  if (hostname.includes("vercel.app")) {
    // All Vercel preview deployments serve the landing page
    console.log("Vercel preview: rewriting to landing page for", pathname);
    return NextResponse.rewrite(new URL("/api/landing", request.url));
  }

  // Default - continue to Next.js app
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - api routes (to avoid infinite loops)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api).*)",
  ],
};
