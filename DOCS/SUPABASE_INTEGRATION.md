# Supabase Integration Guide for Industry Moves

## Overview

The industry-moves page is now ready for Supabase integration. The current implementation uses a placeholder API that you can easily replace with your Supabase queries.

## Current Architecture

### API Endpoint

- **File**: `app/api/curated-news/route.ts`
- **Purpose**: Placeholder API that returns curated news data
- **Ready for**: Direct replacement with Supabase queries

### Frontend Component

- **File**: `components/industry-moves.tsx`
- **Fetches from**: `/api/curated-news`
- **Handles**: Loading states, error fallbacks, and card animations

## Expected Data Structure

The component expects news items with this structure:

```typescript
interface NewsItem {
  id: string;
  text: string; // Article title
  link?: string; // Article URL
  category: "breaking" | "trending" | "update" | "insight";
  time: string; // Human-readable time (e.g., "2 hours ago")
  source: string; // Source publication
  isRSS?: boolean;
  image?: string; // Article image URL
  description?: string; // Article description/summary
}
```

## Supabase Implementation Steps

### 1. Database Schema

Create a table like this:

```sql
CREATE TABLE curated_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    category TEXT CHECK (category IN ('breaking', 'trending', 'update', 'insight')),
    source TEXT NOT NULL,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE
);
```

### 2. Replace API Endpoint

Update `app/api/curated-news/route.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("curated_news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(12);

    if (error) throw error;

    // Transform to expected format
    const items = data.map((item) => ({
      id: item.id,
      text: item.title,
      description: item.description,
      link: item.url,
      category: item.category,
      time: formatTimeAgo(item.published_at),
      source: item.source,
      image: item.image_url,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching curated news:", error);
    return NextResponse.json(
      { error: "Failed to fetch curated news" },
      { status: 500 }
    );
  }
}
```

### 3. Environment Variables

Add to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Current Features

### ✅ Fixed Issues

- **No more card flickering**: Cards now load smoothly without visibility issues
- **Consistent loading**: All cards appear at once when data is ready
- **Stable images**: Using local fallback images prevents loading delays
- **Optimized animations**: Faster, more consistent card animations

### ✅ Ready for Production

- **Error handling**: Graceful fallbacks if API fails
- **Loading states**: Proper skeleton loading while fetching data
- **Responsive design**: Works on all device sizes
- **Performance optimized**: Lazy loading and efficient animations

## Next Steps

1. **Set up Supabase database** with the suggested schema
2. **Create your curation workflow** to populate the database
3. **Replace the placeholder API** with actual Supabase queries
4. **Test the integration** to ensure smooth data flow

The frontend is completely ready and will work seamlessly once you connect your Supabase backend!
