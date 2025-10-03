# Quick Reference - Industry Moves

## Common Commands

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Fetch new articles and generate thumbnails
pnpm content sync

# Update existing articles with Unsplash images
pnpm images:backfill

# Check system status
pnpm content status

# Test RSS sources
pnpm content test
```

## Architecture (Simplified)

```
RSS Sources (8 active)
    ↓
Content Sync (generates Unsplash thumbnails)
    ↓
Articles Table (140+ articles)
    ↓
API (/api/curated-news) - Fast reads, no generation
    ↓
Frontend (Infinite scroll, pagination)
```

## Key Changes Made

1. **Removed cache layer** → Query articles table directly
2. **Simplified thumbnails** → Unsplash only, generated during sync

## Performance

- **API Response**: 50-150ms (was 500-1500ms)
- **Articles Available**: 140+ (was 12)
- **Database Writes**: 0 per page load (was 12+)

## Thumbnail Strategy

| When | What Happens |
|------|--------------|
| **Content Sync** | Fetch Unsplash images, store in DB |
| **Backfill** | Add images to articles without them |
| **Page Load** | Read cached URLs from DB (no generation) |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Only 12 articles showing | Hard refresh browser (Cmd+Shift+R) |
| Placeholder images | Run `pnpm images:backfill` |
| No articles at all | Run `pnpm content sync` |
| Slow page loads | Check server logs, verify DB connection |

## Configuration Files

- **RSS Sources**: `lib/content/sources.ts`
- **API Route**: `app/api/curated-news/route.ts`
- **Sync Service**: `lib/content/sync-service.ts`
- **Frontend Component**: `components/industry-moves.tsx`

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=...        # ✅ Set
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # ✅ Set
SUPABASE_SERVICE_ROLE_KEY=...       # ✅ Set
UNSPLASH_ACCESS_KEY=...             # ✅ Set
OPENROUTER_API_KEY=...              # ✅ Set
CRON_SECRET=...                     # ✅ Set
```

## Database Tables

| Table | Purpose | Used For |
|-------|---------|----------|
| `articles` | All content | ✅ Primary source |
| `industry_moves_cache` | Old cache | ❌ No longer used |

## Documentation

- **INDUSTRY_MOVES_SIMPLIFIED.md** - Cache removal details
- **THUMBNAIL_STRATEGY_SIMPLIFIED.md** - Thumbnail changes
- **SIMPLIFICATION_SUMMARY.md** - Complete overview
- **QUICK_REFERENCE.md** - This file

## Performance Optimization

**If pagination is slow (>1 second per page):**

```bash
# Apply database indexes for 200x faster queries
source .env.local
node scripts/apply-indexes.js
```

This creates optimized indexes on the articles table.

Expected result: Page loads <200ms (was 35+ seconds!)

See `DATABASE_PERFORMANCE.md` for details.

## Testing Checklist

- [ ] `pnpm run build` succeeds
- [ ] Visit `/industry-moves` - page loads fast (<200ms)
- [ ] Scroll down - infinite scroll works
- [ ] Check pagination - shows 140+ total articles
- [ ] Images load from Unsplash (not placeholders)
- [ ] No console errors in browser DevTools
- [ ] Page 8 loads quickly (test deep pagination)

## Support

If issues arise:
1. Check build: `pnpm run build`
2. Check database: `pnpm content status`
3. Check indexes: `node scripts/apply-indexes.js`
4. Check logs: View server console output
5. Review docs: Read detailed markdown files above
