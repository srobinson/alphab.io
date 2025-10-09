# Vercel Configuration - Hybrid Static/Dynamic Architecture

## Overview

This configuration supports our hybrid architecture where blog pages are fully static while API routes and admin pages remain dynamic.

## Cron Jobs

- **Path**: `/api/cron/content-sync`
- **Schedule**: Daily at 6 AM UTC (`"0 6 * * *"`)
- **Purpose**: Syncs content from external sources to database
- **Important**: Does NOT trigger blog page regeneration (requires new deployment)

## Deployment Architecture

### Static Pages (Pre-rendered at Build Time)
- **Blog pages** (`/blog/*`) - Served as static HTML from CDN
- **Benefits**: Faster loads, better SEO, lower server costs

### Dynamic Routes (Serverless Functions)
- **API routes** (`/api/*`) - Contact forms, newsletter subscriptions
- **Admin pages** (`/admin/*`) - Authentication and data management
- **Runtime**: Node.js serverless functions

### Headers
- **Security headers** applied to all routes:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`

## Build Process Integration

1. **Pre-build**: `generate-blog-index.js` creates blog index from MDX files
2. **Build**: Next.js generates static blog pages via `generateStaticParams()`
3. **Post-build**: `validate-blog-build.ts` ensures all pages generated correctly
4. **Deploy**: Static pages served from CDN, dynamic routes as serverless functions

## Benefits

- **Performance**: Static blog pages load instantly from CDN
- **Cost**: Reduced server costs (less dynamic rendering)
- **SEO**: Fully pre-rendered content available to search engines
- **Functionality**: Preserved server-side features for forms and admin