# Google Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) tracking for both https://alphab.io/ and https://rade.alphab.io/.

## Prerequisites

1. Google Analytics account
2. Access to both website codebases
3. Admin access to deploy environment variables

## Step 1: Create Google Analytics Properties

### For alphab.io:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Enter property details:
   - Property name: "alphab.io"
   - Reporting time zone: Your timezone
   - Currency: Your preferred currency
5. Click "Next" and complete the setup
6. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

### For rade.alphab.io:

1. Repeat the same process
2. Property name: "rade.alphab.io"
3. Copy the **Measurement ID** for this property

## Step 2: Configure Environment Variables

### For this project (alphab.io):

1. Create a `.env.local` file in the root directory
2. Add your Measurement ID:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### For rade.alphab.io project:

1. In that project's root directory, create/update `.env.local`
2. Add the rade.alphab.io Measurement ID:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YYYYYYYYYY
```

## Step 3: Implementation Details

### What's Already Implemented:

- ✅ Google Analytics component with proper Next.js Script optimization
- ✅ Automatic page view tracking
- ✅ Event tracking helpers
- ✅ TypeScript support
- ✅ Environment variable configuration

### Files Added/Modified:

- `components/analytics/google-analytics.tsx` - Main GA component
- `hooks/use-analytics.tsx` - Page view tracking hook
- `app/layout.tsx` - Integration into app layout
- `.env.local.example` - Environment variable template

## Step 4: Deployment

### For alphab.io:

1. Add the environment variable to your hosting platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - **Other**: Follow your platform's documentation

### For rade.alphab.io:

1. Copy the Google Analytics files to that project:
   ```bash
   cp components/analytics/google-analytics.tsx /path/to/rade-project/components/analytics/
   cp hooks/use-analytics.tsx /path/to/rade-project/hooks/
   ```
2. Update that project's layout to include the GoogleAnalytics component
3. Add the environment variable to that project's hosting platform

## Step 5: Verification

### Test Locally:

1. Set your `.env.local` file with the Measurement ID
2. Run `npm run dev` or `pnpm run dev`
3. Open browser developer tools → Network tab
4. Navigate your site and look for requests to `googletagmanager.com`

### Test in Production:

1. Deploy your changes
2. Visit your live site
3. Check Google Analytics Real-Time reports (may take a few minutes)

## Step 6: Advanced Tracking (Optional)

### Custom Event Tracking:

Use the provided helper functions to track specific actions:

```typescript
import { trackEvent } from "@/components/analytics/google-analytics";

// Track button clicks
trackEvent("click", "button", "cta-button");

// Track form submissions
trackEvent("submit", "form", "contact-form");

// Track downloads
trackEvent("download", "file", "whitepaper.pdf");
```

### Page View Tracking:

The `useAnalytics` hook automatically tracks page views, but you can also manually track:

```typescript
import { trackPageView } from "@/components/analytics/google-analytics";

trackPageView("/custom-page", "Custom Page Title");
```

## Troubleshooting

### Common Issues:

1. **No data in GA4**:

   - Check that the Measurement ID is correct
   - Verify environment variables are set in production
   - Wait 24-48 hours for data to appear in standard reports

2. **Local development not tracking**:

   - Ensure `.env.local` file exists and has the correct variable name
   - Restart your development server after adding environment variables

3. **TypeScript errors**:
   - Make sure the global Window interface extension is included
   - Check that all imports are correct

### Debug Mode:

Add this to your environment variables for debugging:

```bash
NEXT_PUBLIC_GA_DEBUG=true
```

## Security Notes

- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` files to version control
- Use different Measurement IDs for development, staging, and production environments

## Next Steps

1. Set up conversion goals in Google Analytics
2. Configure enhanced ecommerce tracking (if applicable)
3. Set up custom dimensions for user segmentation
4. Create custom dashboards and reports
