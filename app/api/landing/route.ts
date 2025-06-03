import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    // Get the hostname to determine the correct RADE link
    const hostname = request.headers.get("host") || "";

    // Determine the correct RADE URL based on environment
    let radeUrl = "https://rade.alphab.io"; // Production default

    if (hostname.includes("localhost") || hostname.includes(":3000")) {
      radeUrl = "http://rade.alphab.local:3000";
    } else if (hostname.includes("alphab.local")) {
      radeUrl = "http://rade.alphab.local:3000";
    } else if (hostname.includes("alphab.io")) {
      radeUrl = "https://rade.alphab.io";
    } else if (hostname.includes("vercel.app")) {
      // For Vercel preview deployments, the React app is not available
      // So we'll link to the production RADE site
      radeUrl = "https://rade.alphab.io";
    }

    // Read the landing page HTML file
    let htmlContent = readFileSync(
      join(process.cwd(), "public", "alphab-landing.html"),
      "utf-8"
    );

    // Replace the RADE links with the environment-appropriate URL
    htmlContent = htmlContent.replace(
      /href="https:\/\/rade\.alphab\.io(\/[^"]*)?"/g,
      `href="${radeUrl}$1"`
    );

    // Return the HTML content with proper headers
    return new NextResponse(htmlContent, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error reading alphab-landing.html:", error);

    // Get the hostname for fallback as well
    const hostname = request.headers.get("host") || "";

    // Determine the correct RADE URL for fallback
    let radeUrl = "https://rade.alphab.io"; // Production default

    if (hostname.includes("localhost") || hostname.includes(":3000")) {
      radeUrl = "http://rade.alphab.local:3000";
    } else if (hostname.includes("alphab.local")) {
      radeUrl = "http://rade.alphab.local:3000";
    } else if (hostname.includes("alphab.io")) {
      radeUrl = "https://rade.alphab.io";
    } else if (hostname.includes("vercel.app")) {
      // For Vercel preview deployments, link to production RADE
      radeUrl = "https://rade.alphab.io";
    }

    // Fallback response with environment-aware link
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AlphaB - Coming Soon</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
              <h1 style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 3rem; margin-bottom: 1rem;">
                AlphaB
              </h1>
              <p style="color: #666; font-size: 1.2rem;">Coming Soon</p>
              <p style="color: #999; margin-top: 2rem;">
                <a href="${radeUrl}/services" style="color: #3b82f6; text-decoration: none;">Visit RADE AI Solutions →</a>
              </p>
            </div>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }
    );
  }
}

// Handle all HTTP methods by redirecting to GET
export const POST = GET;
export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;
export const HEAD = GET;
export const OPTIONS = GET;
