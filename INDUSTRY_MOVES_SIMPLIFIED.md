# Industry Moves - Simplified Architecture

## What Changed

**Removed the `industry_moves_cache` table layer** and now query directly from the `articles` table. This simplifies the architecture and removes unnecessary constraints.

## Before (Cache-based)

```
RSS Sources → Sync Service → Articles Table → Industry Moves Cache (12 items) → API → Frontend
                                                     ↑
                                              Limited to 12 items
                                              Duplicate key errors
                                              Cache expiration complexity
```

## After (Direct Query)

```
RSS Sources → Sync Service → Articles Table → API → Frontend
                                 ↑
                            140+ articles
                            Dynamic pagination
                            No artificial limits
```

## Benefits

✅ **No more 12-item limit** - Display as many articles as you have  
✅ **No duplicate key errors** - No cache layer to manage  
✅ **Simpler architecture** - One less table to maintain  
✅ **Better pagination** - Directly paginate through all 140+ articles  
✅ **Easier to understand** - Query articles directly  

## Current Status

- **Total Articles**: 140+ published articles
- **Pagination**: 12 items per page (configurable in `components/industry-moves.tsx`)
- **Infinite Scroll**: Works automatically with all articles
- **Categorization**: Done on-the-fly based on keywords and recency

## How It Works Now

1. **Frontend** requests articles via `/api/curated-news?page=1&limit=12`
2. **API** queries `articles` table directly with pagination
3. **Categorization** happens in real-time based on:
   - Article age (breaking news < 6 hours old)
   - Keywords (trend, analysis, insight, etc.)
   - Source metadata
4. **Images** are generated/cached per article
5. **Response** includes pagination info for infinite scroll

## Content Sync

The content sync process is now simpler:

```bash
# Fetch new articles from RSS sources
pnpm content sync

# No need for separate cache update!
```

The `updateIndustryMovesCache()` function in `sync-service.ts` is now **optional** and can be removed or left as a no-op since we query directly from articles.

## Configuration

### Change Items Per Page

Edit `components/industry-moves.tsx`:

```typescript
const ITEMS_PER_PAGE = 12;  // Change this to 20, 50, etc.
```

### Change Categorization Rules

Edit `app/api/curated-news/route.ts` around line 200-230 to adjust how articles are categorized as "breaking", "trending", "insight", etc.

## Database

The `industry_moves_cache` table is now **unused** and can be:
- Left as-is (ignored)
- Dropped if you want to clean up
- Repurposed for other caching needs

## Performance

- **Initial Load**: Same as before (12 items)
- **Pagination**: Efficient with indexed queries
- **Total Available**: 140+ articles (vs 12 before)
- **Cache**: Server-side caching still active (5 minutes)

## Testing

Test the API directly:

```bash
curl "http://localhost:3000/api/curated-news?page=1&limit=12"
```

You should see:
- `items`: Array of 12 articles
- `pagination.total`: 140+
- `pagination.hasMore`: true
- `source`: "articles"

## Migration Notes

No database migration needed! The change is purely in the application layer. The old cache table remains but is no longer queried.

## Future Improvements

Possible enhancements now that we have simplified:

1. **Smart Ordering**: Order by relevance score, engagement, or custom ranking
2. **Better Filtering**: Filter by source, tags, or category
3. **Search**: Add full-text search across all articles
4. **Bookmarks**: Let users save favorite articles
5. **Reading History**: Track which articles users have seen

## Rollback

If you need to rollback to the cache-based approach, restore from git:

```bash
git checkout HEAD -- app/api/curated-news/route.ts
```

But you shouldn't need to - this is a cleaner approach! 🎉
