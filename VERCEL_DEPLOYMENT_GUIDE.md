# Vercel Deployment Configuration Guide

## Overview

This repository is configured to serve two different experiences based on the domain:

- **alphab.io** → Landing page (`public/alphab-landing.html`)
- **rade.alphab.io** → Full Next.js application

## Deployment Setup

### 1. Domain Configuration in Vercel Dashboard

#### Main Project (alphab.io)

1. Deploy this repository to Vercel
2. In Vercel Dashboard → Project Settings → Domains
3. Add domain: `alphab.io`
4. Add domain: `rade.alphab.io`

#### DNS Configuration

Point both domains to Vercel:

```
alphab.io        CNAME  cname.vercel-dns.com
rade.alphab.io   CNAME  cname.vercel-dns.com
```

### 2. How the Routing Works

#### Middleware Logic (`middleware.ts`)

```typescript
// alphab.io (any path) → serves public/alphab-landing.html
// rade.alphab.io (any path) → continues to Next.js app
```

#### URL Examples

- `https://alphab.io` → Landing page
- `https://alphab.io/anything` → Landing page (catch-all)
- `https://rade.alphab.io` → Next.js home page
- `https://rade.alphab.io/services` → Next.js services page
- `https://rade.alphab.io/blog` → Next.js blog

### 3. Local Development

#### Using Custom Domains (Optional)

Add to `/etc/hosts`:

```
127.0.0.1 alphab.local
127.0.0.1 rade.alphab.local
```

Then access:

- `http://alphab.local:3000` → Landing page
- `http://rade.alphab.local:3000` → Next.js app

#### Using Localhost

- `http://localhost:3000` → Landing page (default)

### 4. Environment Variables

No special environment variables needed for domain routing.

### 5. Build Configuration

The `vercel.json` file is configured to:

- Use Next.js build system
- Handle all routes through middleware
- Set security headers
- Support both domains

### 6. Deployment Commands

```bash
# Deploy to Vercel
vercel --prod

# Or using Vercel CLI with specific domains
vercel --prod --domains alphab.io,rade.alphab.io
```

### 7. Testing Deployment

After deployment, test:

1. **Landing Page Routes:**

   - `https://alphab.io` ✓
   - `https://alphab.io/test` ✓
   - `https://alphab.io/any/path` ✓

2. **Next.js App Routes:**
   - `https://rade.alphab.io` ✓
   - `https://rade.alphab.io/services` ✓
   - `https://rade.alphab.io/blog` ✓

### 8. Troubleshooting

#### Landing Page Not Showing

- Check middleware logs in Vercel Functions tab
- Verify `public/alphab-landing.html` exists
- Check domain configuration in Vercel

#### Next.js App Not Working on Subdomain

- Verify `rade.alphab.io` is added as domain in Vercel
- Check middleware logic for subdomain detection
- Review build logs for errors

#### DNS Issues

- Verify CNAME records point to `cname.vercel-dns.com`
- Allow 24-48 hours for DNS propagation
- Use DNS checker tools to verify propagation

## File Structure

```
/
├── middleware.ts           # Domain routing logic
├── vercel.json            # Vercel configuration
├── public/
│   └── alphab-landing.html # Landing page content
├── app/                   # Next.js application
└── components/            # React components
```

## Security

The configuration includes:

- Content Security headers
- XSS protection
- Frame options
- Content type sniffing protection

All handled automatically through `vercel.json` headers configuration.
