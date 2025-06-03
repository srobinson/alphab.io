import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define special routes that should use the Next.js app instead of landing page
const SPECIAL_ROUTES = [
  "/accelerator",
  "/admin",
  "/blog",
  "/contact",
  "/industry-moves",
  "/my-approach",
  "/pricing",
  "/services"
];

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  console.log("Middleware - hostname:", hostname, "pathname:", pathname);

  // Check if this is a RADE subdomain request
  const isRadeSubdomain = hostname.includes("rade.");

  // For local development (localhost:3000)
  if (hostname.includes("localhost") || hostname.includes(":3000")) {
    if (!isRadeSubdomain) {
      // Check if this is a special route that should use the Next.js app
      if (SPECIAL_ROUTES.some((route) => pathname.startsWith(route))) {
        console.log(
          "Local: continuing to Next.js app for special route",
          pathname
        );
        return NextResponse.next();
      }

      // Main domain (localhost:3000) - serve landing page for other routes
      console.log("Local: rewriting to landing page for", pathname);
      return NextResponse.rewrite(new URL("/landing", request.url));
    }
    // This shouldn't happen with localhost, but continue to Next.js app
    console.log("Local: continuing to Next.js app");
    return NextResponse.next();
  }

  // For local testing with custom domains
  if (hostname.includes("alphab.local")) {
    if (!isRadeSubdomain) {
      // Check if this is a special route that should use the Next.js app
      if (SPECIAL_ROUTES.some((route) => pathname.startsWith(route))) {
        console.log(
          "Local custom domain: continuing to Next.js app for special route",
          pathname
        );
        return NextResponse.next();
      }

      // Main domain (alphab.local) - serve landing page for other routes
      console.log(
        "Local custom domain: rewriting to landing page for",
        pathname
      );
      return NextResponse.rewrite(new URL("/landing", request.url));
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
      // alphab.io (main domain) - check for special routes first
      if (SPECIAL_ROUTES.some((route) => pathname.startsWith(route))) {
        console.log(
          "Production: continuing to Next.js app for special route",
          pathname
        );
        return NextResponse.next();
      }
      
      // For all other routes, serve landing page
      console.log("Production: rewriting to landing page for", pathname);
      return NextResponse.rewrite(new URL("/landing", request.url));
    }
  }

  // For Vercel preview deployments (*.vercel.app)
  if (hostname.includes("vercel.app")) {
    // All Vercel preview deployments serve the landing page
    console.log("Vercel preview: rewriting to landing page for", pathname);
    return NextResponse.rewrite(new URL("/landing", request.url));
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
