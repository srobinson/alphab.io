/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow development origins for both dev and prod
  experimental: {
    allowedDevOrigins: [
      "localhost:3000",
      "127.0.0.1:3000",
      "rade.alphab.local:3000",
      "alphab.io",
      "www.alphab.io",
    ],
  },
  images: {
    // Enable image optimization for better SEO and performance
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ["alphab.io", "localhost"],
    remotePatterns: [
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
    ],
    loader: "default",
  },
  // Enable compression for better performance
  compress: true,
  // Generate static exports for better SEO
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
