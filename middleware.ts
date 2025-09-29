import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routing by hostnames only; no per-path exceptions

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  console.log("Middleware - hostname:", hostname, "pathname:", pathname);

  // Check if this is a RADE subdomain request (e.g., rade.alphab.local, rade.alphab.io)
  const isRadeSubdomain = hostname.includes("rade.");

  // Local development (localhost:3000)
  if (hostname.includes("localhost") || hostname.includes(":3000")) {
    if (!isRadeSubdomain) {
      if (pathname === "/") {
        console.log("Local: rewriting root to landing page");
        return NextResponse.rewrite(new URL("/landing", request.url));
      }
      console.log("Local: non-root path on main host -> continue to app (allows 404)");
      return NextResponse.next();
    }
    console.log("Local: continuing to RADE app");
    return NextResponse.next();
  }

  // Local testing with custom domains (alphab.local, rade.alphab.local)
  if (hostname.includes("alphab.local")) {
    if (!isRadeSubdomain) {
      if (pathname === "/") {
        console.log("Local custom domain: rewriting root to landing page");
        return NextResponse.rewrite(new URL("/landing", request.url));
      }
      console.log("Local custom domain: non-root path on main host -> continue to app (allows 404)");
      return NextResponse.next();
    }
    console.log("Local custom domain: continuing to RADE app");
    return NextResponse.next();
  }

  // Production logic
  if (hostname.includes("alphab.io")) {
    if (isRadeSubdomain) {
      // rade.alphab.io -> RADE app
      console.log("Production: continuing to RADE app for rade subdomain");
      return NextResponse.next();
    } else {
      // alphab.io -> only rewrite root path to landing page, allow other paths
      if (pathname === "/") {
        console.log("Production: rewriting root to landing page");
        return NextResponse.rewrite(new URL("/landing", request.url));
      }
      console.log("Production: non-root path on main host -> continue to app (allows 404)");
      return NextResponse.next();
    }
  }

  // Vercel preview deployments (*.vercel.app) -> landing
  if (hostname.includes("vercel.app")) {
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
     * - landing (rewrite target)
     * - any file with an extension (e.g., .png, .jpg, .css, .js)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api|landing|.*\\..*).*)",
  ],
};
