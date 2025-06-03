# News API Integration Setup

## Overview

The news system has been updated to fetch real news from external APIs instead of using hardcoded content. The system now combines:

1. **RSS Feeds** - Free, no API key required
2. **News APIs** - Require API keys but provide better content
3. **Focused Brand Messages** - 1-2 strategic marketing messages mixed into the feed

## Current Status

✅ **Working without API keys**: RSS feeds provide real news content
⚠️ **Enhanced with API keys**: News APIs provide additional high-quality content

## API Keys Setup (Optional but Recommended)

### 1. NewsAPI.org (Free tier: 1000 requests/day)

- Visit: https://newsapi.org/
- Sign up for free account
- Get your API key
- Add to `.env.local`: `NEWS_API_KEY=your_key_here`

### 2. GNews.io (Free tier: 100 requests/day)

- Visit: https://gnews.io/
- Sign up for free account
- Get your API key
- Add to `.env.local`: `GNEWS_API_KEY=your_key_here`

### 3. NewsData.io (Optional - Free tier: 200 requests/day)

- Visit: https://newsdata.io/
- Sign up for free account
- Get your API key
- Add to `.env.local`: `NEWSDATA_API_KEY=your_key_here`

## Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit .env.local with your API keys
NEWS_API_KEY=your_newsapi_key_here
GNEWS_API_KEY=your_gnews_key_here
NEWSDATA_API_KEY=your_newsdata_key_here
```

## How It Works

### Without API Keys

- System falls back to RSS feeds only
- Still provides real, up-to-date news content
- Includes 2 focused brand messages strategically placed

### With API Keys

- Fetches from multiple news sources
- Better content variety and quality
- Automatic deduplication
- Smart categorization
- Enhanced filtering for AI/creator relevance

## Content Strategy

### Brand Messages (Always Included)

- 🚀 RADE AI: Transform your content strategy with AI-powered automation
- 💡 NEW: AI-driven content optimization increases engagement by 300%

### News Sources

1. **RSS Feeds** (Always active):

   - TechCrunch AI
   - VentureBeat AI
   - The Verge AI
   - O'Reilly Radar

2. **News APIs** (When configured):
   - NewsAPI.org - Comprehensive news coverage
   - GNews.io - Global news with good filtering
   - NewsData.io - Additional news source

### Content Filtering

- Automatically filters for AI/creator relevance
- Keywords: artificial intelligence, content creation, automation, etc.
- Smart categorization: breaking, trending, update, insight
- Duplicate removal based on URL and content similarity

## API Endpoint

`GET /api/news` returns:

```json
{
  "items": [...],
  "lastUpdated": "2024-01-01T12:00:00.000Z",
  "rssItemsCount": 15,
  "apiItemsCount": 10,
  "brandItemsCount": 2,
  "totalItems": 27
}
```

## Performance

- **Caching**: 30-minute cache on all external requests
- **Fallback**: RSS feeds if APIs fail
- **Rate Limiting**: Built-in delays to respect API limits
- **Error Handling**: Graceful degradation

## Testing

1. **Without API keys**: Should show RSS content + brand messages
2. **With API keys**: Should show mixed content from all sources
3. **API failure**: Should fallback to RSS feeds

## Deployment Notes

- Add environment variables to your hosting platform (Vercel, Netlify, etc.)
- API keys are optional - system works without them
- Consider upgrading to paid API plans for production use
