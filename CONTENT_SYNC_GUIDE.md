# Content Sync Guide

## Why You're Only Getting 12 Industry Moves Cards

The industry moves cache is **hardcoded to display only 12 items** in the code. Here's why:

1. **Cache Limit**: In `lib/content/sync-service.ts` line 311, there's a condition that limits cache entries:
   ```typescript
   cacheEntries.length < 12
   ```

2. **Current Database State**: Your `industry_moves_cache` table has exactly 12 items, all set to expire on October 3, 2025.

3. **Cache Expiration**: The cache has a 1-hour TTL (Time To Live) by default, but your current cache has been manually set to expire in October 2025.

## How to Run Content Sync

### Option 1: Full Content Sync (Recommended)
This fetches new articles from RSS feeds AND updates the industry moves cache:

```bash
cd /Users/alphab/Dev/LLM/pers/alphab.io
source .env.local
pnpm content sync
```

**What this does:**
- Fetches latest articles from 8 active RSS sources (TechCrunch, VentureBeat, The Verge, etc.)
- Classifies content by relevance and category
- Stores articles in the database
- Updates the industry moves cache with the top 12 items
- Takes 1-2 minutes to complete

### Option 2: Cache Update Only
Updates only the industry moves cache from existing articles:

```bash
cd /Users/alphab/Dev/LLM/pers/alphab.io
source .env.local
pnpm content cache
```

**What this does:**
- Analyzes existing articles in the database
- Selects top 12 items based on classification
- Updates the industry moves cache
- Takes ~10 seconds

### Option 3: Test RSS Sources
Test all configured RSS sources without saving data:

```bash
pnpm content test
```

### Option 4: Check System Status
View configuration and last sync time:

```bash
pnpm content status
```

## How to Display More Than 12 Items

To display more than 12 industry moves cards, you need to modify the cache limit:

### Step 1: Increase the Cache Size Limit

Edit `lib/content/sync-service.ts` around line 311:

**Current code:**
```typescript
if (
  !breakingNews.find((b) => b.guid === item.guid) &&
  !trendingContent.find((t) => t.guid === item.guid) &&
  cacheEntries.length < 12  // ← This limits to 12 items
) {
```

**Change to (e.g., 50 items):**
```typescript
if (
  !breakingNews.find((b) => b.guid === item.guid) &&
  !trendingContent.find((t) => t.guid === item.guid) &&
  cacheEntries.length < 50  // ← Increase this number
) {
```

### Step 2: Increase the Articles Query Limit

Edit `lib/content/sync-service.ts` around line 237:

**Current code:**
```typescript
const { data: articles, error } = await this.supabase
  .from<ArticleRow>("articles")
  .select("*")
  .eq("status", "published")
  .order("published_at", { ascending: false })
  .limit(50);  // ← This limits articles to analyze
```

**Change to:**
```typescript
.limit(100);  // ← Increase for more variety
```

### Step 3: Run the Sync

After making changes:

```bash
source .env.local
pnpm content sync
```

## Current Configuration

- **Active RSS Sources**: 8
- **Articles in Database**: 138
- **Cached Industry Moves**: 12
- **Cache Expiration**: October 3, 2025
- **Database**: ✅ Connected
- **Last Sync**: Check with `pnpm content status`

## Automation

The content sync can be automated using:

1. **Vercel Cron Jobs** (recommended for production)
   - Configured in `vercel.json`
   - Requires `CRON_SECRET` environment variable
   - Runs automatically on schedule

2. **GitHub Actions** (for CI/CD)
   - Can trigger sync on schedule or manually

3. **Local Cron** (for development)
   - Set up a cron job to run `pnpm content sync` periodically

## Troubleshooting

### "Cache Miss: generating image"
This is normal - the system generates thumbnails for articles that don't have images cached yet.

### Rate Limiting
The API has rate limiting (60 requests per minute). If you hit this, wait a minute and try again.

### No New Articles
If sync reports 0 new articles ingested, it means all fetched articles already exist in the database.

### Database Connection Failed
Ensure your `.env.local` has both:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Quick Start

To immediately see more content:

```bash
# 1. Source environment variables
source .env.local

# 2. Run full sync to fetch latest articles
pnpm content sync

# This will:
# - Fetch ~50-100 new articles from RSS feeds
# - Update the cache with top 12 items
# - Take 1-2 minutes to complete
```

After sync completes, refresh your browser to see the new content!

## Notes

- The sync process respects rate limits and is polite to RSS sources
- Articles are deduplicated by URL
- Summaries are generated using AI (requires `OPENROUTER_API_KEY`)
- Images are fetched from Unsplash or generated as fallbacks
- Cache expires after 1 hour by default (can be customized)
