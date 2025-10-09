/**
 * Next.js Configuration - Hybrid Static/Dynamic Architecture
 *
 * This site uses a hybrid approach:
 * - Blog pages (/blog, /blog/[slug]) are fully static (pre-rendered at build time)
 * - API routes (/api/*) remain dynamic for server-side functionality
 * - Admin pages (/admin/*) remain dynamic for authentication and data access
 *
 * Blog Static Generation:
 * - All blog posts are pre-rendered during build via generateStaticParams()
 * - No ISR or revalidation - content is static until next deployment
 * - Pre-build script generates blog index from MDX files
 * - Post-build script validates all pages were generated
 *
 * Dynamic Features Preserved:
 * - Contact form API (/api/contacts)
 * - Newsletter subscription (/api/subscribe)
 * - Admin dashboard (/admin/contacts)
 * - Cron jobs for content sync (/api/cron/content-sync)
 *
 * Benefits:
 * - Faster blog page loads (served as static HTML)
 * - Better SEO (fully pre-rendered content)
 * - Lower server costs (less dynamic rendering)
 * - Preserved server functionality for forms and admin
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow development origins for both dev and prod
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "rade.alphab.local:3000",
    "rade.alphab.local",
    "alphab.io",
    "www.alphab.io",
    "rade.alphab.io",
  ],
  images: {
    // Image optimization works for both static blog pages and dynamic routes
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "alphab.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
    loader: "default",
  },
  // Compression applies to both static HTML and dynamic API responses
  compress: true,
  // No trailing slashes - keeps URLs clean for static blog pages
  trailingSlash: false,
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
