# HTML Entity Decoding Fix

## Bug Report

**Issue**: HTML entities like `&#039;` (apostrophe) were being displayed literally instead of being decoded to their character equivalents.

**Example**:
- ❌ **Before**: `OpenAI&#039;s Sora soars to No. 3`
- ✅ **After**: `OpenAI's Sora soars to No. 3`

## Root Cause

HTML entities were being stored in the database from two sources:
1. **RSS Feeds**: TechCrunch and other sources include HTML entities in their feed titles
2. **Web Scraping**: Metadata extraction from web pages includes encoded entities

These entities were stored as-is in the database and displayed without decoding.

## Solution

### Created HTML Entity Decoder Utility

**File**: `lib/utils/html-entities.ts`

A comprehensive decoder that handles:
- Named entities: `&apos;`, `&quot;`, `&amp;`, `&lt;`, `&gt;`, `&nbsp;`
- Numeric entities: `&#39;`, `&#34;`, `&#38;`
- Hex entities: `&#x27;`, `&#x22;`
- Special case: `&#039;` (common in RSS feeds)

**Features**:
- Client-side: Uses browser's native `textarea.innerHTML` decoding
- Server-side: Manual decoding with regex patterns
- Handles all common HTML entities
- Safe and efficient

### Applied Decoding in 3 Places

#### 1. **API Response** (`app/api/curated-news/route.ts`)
Decodes titles and descriptions when returning data to frontend:

```typescript
text: decodeHtmlEntities(article.title),
description: decodeHtmlEntities(article.summary || `Latest from ${article.source}`)
```

**Effect**: Existing articles in database display correctly immediately

#### 2. **RSS Parsing** (`lib/content/rss-parser.ts`)
Decodes titles and descriptions from RSS feeds:

```typescript
private cleanTitle(title: string): string {
  return decodeHtmlEntities(title.trim().substring(0, 200))
}

private cleanDescription(description: string): string {
  return decodeHtmlEntities(description.trim().substring(0, 500))
}
```

**Effect**: New articles from RSS feeds are stored with decoded text

#### 3. **Web Scraping** (`lib/server/ingest.ts`)
Decodes metadata extracted from web pages:

```typescript
const title = decodeHtmlEntities(ogTitle || metaTitle || '')
const description = decodeHtmlEntities(ogDesc || metaDesc || '')
```

**Effect**: Articles ingested from URLs have decoded text

## Testing

### Test Cases Verified

```
Input:  OpenAI&#039;s Sora soars to No. 3
Output: OpenAI's Sora soars to No. 3 ✅

Input:  Everyone&#039;s still throwing billions
Output: Everyone's still throwing billions ✅

Input:  Perplexity&#039;s Comet AI browser  
Output: Perplexity's Comet AI browser ✅

Input:  &quot;Hello&quot; &amp; &lt;World&gt;
Output: "Hello" & <World> ✅

Input:  Normal text without entities
Output: Normal text without entities ✅
```

## Common HTML Entities Handled

| Entity | Character | Example |
|--------|-----------|---------|
| `&#039;` or `&apos;` | `'` | it's |
| `&#34;` or `&quot;` | `"` | "hello" |
| `&#38;` or `&amp;` | `&` | R&D |
| `&#60;` or `&lt;` | `<` | 1 < 2 |
| `&#62;` or `&gt;` | `>` | 2 > 1 |
| `&#160;` or `&nbsp;` | ` ` | non-breaking space |
| `&#x27;` | `'` | it's (hex) |
| `&#x2F;` | `/` | and/or (hex) |

## Benefits

### User Experience
- ✅ Proper apostrophes in titles (it's, don't, won't)
- ✅ Correct quotation marks
- ✅ Readable ampersands
- ✅ Professional appearance

### Data Quality
- ✅ Clean text in database (future articles)
- ✅ Existing articles fixed via API decoding
- ✅ Consistent formatting across all sources

### Performance
- ✅ Zero performance impact (simple string operations)
- ✅ Client-side uses native browser decoding
- ✅ Server-side uses efficient regex

## Migration Strategy

### No Database Migration Needed! ✨

The fix works on **two levels**:

1. **Immediate Fix** (API Layer)
   - Existing articles with entities in DB → decoded on API response
   - Users see correct text immediately
   - No database changes required

2. **Future Prevention** (Ingestion Layer)
   - New articles from RSS → decoded before storage
   - New articles from URLs → decoded before storage
   - Database stays clean going forward

### Optional: Clean Existing Data

If you want to clean the database (optional):

```sql
-- Update articles with HTML entities
UPDATE articles 
SET title = REPLACE(title, '&#039;', '''')
WHERE title LIKE '%&#039;%';

UPDATE articles 
SET title = REPLACE(title, '&apos;', '''')
WHERE title LIKE '%&apos;%';

UPDATE articles 
SET title = REPLACE(title, '&quot;', '"')
WHERE title LIKE '%&quot;%';

UPDATE articles 
SET title = REPLACE(title, '&amp;', '&')
WHERE title LIKE '%&amp;%';

-- Same for descriptions
UPDATE articles 
SET summary = REPLACE(summary, '&#039;', '''')
WHERE summary LIKE '%&#039;%';
```

But this is **not required** - the API layer fix handles it!

## Files Changed

1. **`lib/utils/html-entities.ts`** (new)
   - HTML entity decoder utility
   - Handles client and server environments

2. **`app/api/curated-news/route.ts`**
   - Import and use decoder for API responses
   - Fixes display immediately

3. **`lib/content/rss-parser.ts`**
   - Decode RSS feed titles and descriptions
   - Prevents entities in future articles

4. **`lib/server/ingest.ts`**
   - Decode web scraped metadata
   - Clean data from ingestion

5. **`HTML_ENTITY_FIX.md`** (this file)
   - Complete documentation

## Verification

### Check Current Articles

```bash
# See articles with entities in database
curl "http://localhost:3000/api/curated-news?page=1&limit=5" | jq '.items[] | .text'
```

Expected: All apostrophes and entities properly decoded

### Test New Ingestion

```bash
# Run content sync
pnpm content sync

# Check latest articles
curl "http://localhost:3000/api/curated-news?page=1&limit=3" | jq '.items[0].text'
```

Expected: No HTML entities in titles

## Edge Cases Handled

- Multiple entities in one string ✅
- Nested or chained entities ✅
- Mixed numeric and named entities ✅
- Malformed entities (ignored safely) ✅
- Empty or null strings ✅
- Already-decoded text (no double-decoding) ✅

## Troubleshooting

### Still seeing `&#039;` in titles?

1. **Hard refresh**: Browser cache may show old data (Cmd+Shift+R)
2. **Check API directly**: `curl localhost:3000/api/curated-news?page=1&limit=1`
3. **Verify build**: `pnpm run build` should succeed
4. **Check imports**: Ensure `decodeHtmlEntities` is imported correctly

### New articles still have entities?

1. **Clear old jobs**: Stop any running sync processes
2. **Rebuild**: `pnpm run build`
3. **Fresh sync**: `pnpm content sync`
4. **Verify**: Check newest articles in database

## Summary

✅ **Fixed**: HTML entities now properly decoded  
✅ **Scope**: All article titles and descriptions  
✅ **Impact**: Immediate (via API) + Future (via ingestion)  
✅ **Migration**: Not required (works on both old and new data)  
✅ **Performance**: Zero overhead  

The fix ensures all text displays correctly with proper apostrophes, quotes, and special characters! 🎉
