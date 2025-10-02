# Infinity Scroll Investigation - Industry Moves

## Issue
Only 12 cards are displaying and infinity scroll is not loading more items.

## Root Cause Analysis

### Potential Issues:

#### 1. API Returning Fallback Data
If the `/api/curated-news` endpoint returns fallback data (lines 329-368 or 393-424), it doesn't include proper pagination:

```typescript
// Fallback responses DON'T set pagination.hasMore correctly!
return NextResponse.json({
  items: [...fallbackItems],
  error: true,  // ← This indicates fallback
  // pagination is MISSING!
});
```

**Fix**: Check if API is returning `error: true` in response.

#### 2. Cache/Articles Table Empty
- If `industry_moves_cache` has no valid entries (expired or missing)
- AND `articles` table has < 12 items or no published articles
- Then fallback data is returned

#### 3. IntersectionObserver Not Triggering
The observer target (`<div ref={observerTarget} />`) must be:
- Rendered in the DOM
- Visible/approachable by scrolling
- Not hidden by CSS

## Debug Steps

### Step 1: Check API Response
Open browser console and run:
```javascript
fetch('/api/curated-news?page=1&limit=12')
  .then(r => r.json())
  .then(data => {
    console.log('Total items:', data.items?.length);
    console.log('Has pagination?', !!data.pagination);
    console.log('Has more?', data.pagination?.hasMore);
    console.log('Total count:', data.pagination?.total);
    console.log('Is fallback?', data.error);
    console.log('Full response:', data);
  });
```

**Expected Output:**
```
Total items: 12
Has pagination?: true
Has more?: true
Total count: 69 (or whatever your total is)
Is fallback?: undefined (or false)
```

**If you see:**
- `error: true` → API is using fallback data
- `pagination: undefined` → API not returning pagination
- `hasMore: false` → Check total count calculation

### Step 2: Check Database
Check if articles exist:
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM articles WHERE status = 'published';
SELECT COUNT(*) FROM industry_moves_cache WHERE expires_at > NOW();
```

### Step 3: Check React State
Add console.logs in `components/industry-moves.tsx`:

```typescript
// After line 98
setHasMore(data.pagination?.hasMore ?? false);
console.log('🔍 Initial load:', {
  itemsLoaded: data.items.length,
  hasMore: data.pagination?.hasMore,
  total: data.pagination?.total
});

// In loadMore function (line 245)
console.log('📥 Loading more...', {
  currentPage: page,
  nextPage: page + 1,
  currentItems: displayedMoves.length
});
```

## Quick Fixes

### Fix 1: Ensure Proper Pagination in Fallback
Edit `/app/api/curated-news/route.ts` line 393-424:

```typescript
return NextResponse.json(
  {
    items: [...],
    error: true,
    message: "Using fallback data...",
    pagination: {  // ← ADD THIS
      page: 1,
      limit: 12,
      total: 2,  // Number of fallback items
      hasMore: false
    },
    timestamp: new Date().toISOString(),
  },
  // ...
);
```

### Fix 2: Add Debug Logging
Add logging to track what's happening:

In `components/industry-moves.tsx` line 247-271:

```typescript
useEffect(() => {
  console.log('🔭 Observer setup:', { hasMore, loadingMore, page });
  
  const observer = new IntersectionObserver(
    (entries) => {
      console.log('👀 Observer triggered:', {
        isIntersecting: entries[0].isIntersecting,
        hasMore,
        loadingMore
      });
      
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        console.log('✅ Calling loadMore()');
        loadMore();
      }
    },
    {
      threshold: 0.1,
      rootMargin: "400px",
    },
  );
  // ...
}, [loadMore, hasMore, loadingMore, page]);
```

### Fix 3: Force Debug Info Display
Add this temporarily to see state:

```typescript
{/* Debug info - remove after fixing */}
<div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs">
  <div>Items: {displayedMoves.length}</div>
  <div>Page: {page}</div>
  <div>Has More: {hasMore ? 'Yes' : 'No'}</div>
  <div>Loading More: {loadingMore ? 'Yes' : 'No'}</div>
</div>
```

## Most Likely Cause

Based on the setup, the most likely issue is:

**The API is returning fallback data without proper pagination**, causing `hasMore` to be `false` or `undefined` from the start.

Check the API response first - if you see `error: true`, then you need to:
1. Run the content sync to populate articles
2. Or fix the fallback response to include pagination
3. Or check Supabase credentials/permissions

