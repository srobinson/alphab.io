# Content Automation Setup Guide

## Quick Start

The content automation system has been implemented and is ready for deployment. Here's how to get it running:

### 1. Database Migration

Run the database migration to create the required tables:

```bash
# If using Supabase CLI
supabase migration up

# Or execute the SQL file manually in Supabase dashboard
# File: supabase/migrations/20250130_content_automation.sql
```

### 2. Environment Variables

Add these environment variables to your `.env.local` and production environment:

```bash
# Content Automation
CRON_SECRET=your-secure-random-secret-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: AI-powered summarization (already configured)
OPENROUTER_API_KEY=your-openrouter-api-key

# Content sync settings
RSS_SYNC_ENABLED=true
CONTENT_SYNC_INTERVAL_MINUTES=60
```

### 3. Test the System

```bash
# Test RSS parsing and classification
pnpm test-automation

# Test the cron endpoint locally
curl -H "Authorization: Bearer your-cron-secret" http://localhost:3000/api/cron/content-sync

# Test the updated industry moves API
curl http://localhost:3000/api/curated-news
```

### 4. Deploy to Vercel

The system is configured for automatic deployment:

1. Push to your main branch
2. Vercel will deploy with the cron job configured (runs every hour)
3. The industry moves page will start showing real content

## What's Automated

### Content Sources (9 active sources)
- **TechCrunch AI**: Latest AI industry news
- **MIT Technology Review**: Research and analysis
- **Ars Technica**: Technical deep-dives
- **AI News**: Specialized AI content
- **Hacker News AI**: Community-driven content
- **Wired Tech**: Mainstream tech coverage
- **The Verge**: Consumer tech focus

### Content Processing Pipeline
1. **RSS Parsing**: Fetches content from all active sources
2. **Quality Filtering**: Removes spam, validates content quality
3. **AI Classification**: Categorizes as breaking/trending/update/insight
4. **Relevance Scoring**: Ranks content by AI/tech relevance (0-100)
5. **Database Storage**: Saves articles with metadata, summaries, tags
6. **Industry Moves Cache**: Creates fast-loading curated feed

### Automated Features
- **Hourly Sync**: New content fetched automatically
- **Smart Deduplication**: Prevents duplicate articles
- **Breaking News Detection**: Identifies urgent/important content
- **Trending Analysis**: Flags popular/viral content
- **Real-time Updates**: Industry moves page shows latest content
- **Performance Optimization**: Cached results for fast loading

## Manual Operations

### Add Content Sources
Edit `/lib/content/sources.ts` to add new RSS feeds:

```typescript
{
  id: 'new-source',
  name: 'New Tech Blog',
  rssUrl: 'https://example.com/feed.xml',
  category: 'ai', // 'ai' | 'tech' | 'business' | 'research'
  priority: 'medium', // 'high' | 'medium' | 'low'
  isActive: true,
  maxItems: 10
}
```

### Manual Content Ingestion
Use the existing ingest script for one-off articles:

```bash
pnpm ingest "https://example.com/article" --source "Custom Source" --tags "ai,breaking"
```

### Monitor System Health
Check sync logs and performance:

```bash
# Health check
curl -X POST -H "Authorization: Bearer your-cron-secret" /api/cron/content-sync

# View logs in Vercel dashboard under Functions tab
```

## Content Quality & Filtering

### Relevance Scoring Algorithm
- **Source Priority**: High priority sources get +30 points
- **AI Keywords**: Each AI term adds +15 points  
- **Tech Keywords**: Each tech term adds +10 points
- **Recency Boost**: Recent content gets up to +20 points
- **Content Quality**: Good title/description adds +5-10 points
- **Minimum Threshold**: Only content scoring 40+ is included

### Breaking News Detection
Content is marked as "breaking" if:
- Contains breaking keywords (announces, launches, releases)
- Published within 6 hours
- Mentions major companies (OpenAI, Google, Microsoft, etc.)

### Content Categories
- **Breaking**: Urgent industry announcements
- **Trending**: Popular/viral content with high engagement
- **Update**: Product updates, releases, patches
- **Insight**: Analysis, opinion pieces, research findings

## System Architecture

### Core Components
- **RSSParser**: Fetches and normalizes RSS feeds
- **ContentClassifier**: AI-powered content analysis
- **ContentSyncService**: Orchestrates the entire pipeline
- **Industry Moves Cache**: Fast-loading content display

### Database Tables
- **articles**: Main content storage (existing)
- **content_sources**: RSS feed configuration
- **content_sync_logs**: Operation monitoring
- **industry_moves_cache**: Curated display content
- **content_classifications**: AI analysis results

### API Endpoints
- **GET /api/cron/content-sync**: Automated sync (Vercel Cron)
- **GET /api/curated-news**: Industry moves content
- **GET /api/blog**: Blog articles list
- **POST /api/cron/content-sync**: Health check

## Performance & Scaling

### Current Capacity
- **50-100 articles/day**: Expected content volume
- **9 active sources**: RSS feeds monitored
- **Sub-second response**: Industry moves API
- **1-hour cache**: Content refresh frequency

### Optimization Features
- **Parallel Processing**: Multiple RSS feeds fetched simultaneously
- **Rate Limiting**: Respectful crawling with delays
- **Error Handling**: Graceful failure recovery
- **Caching**: Multiple layers for performance
- **Deduplication**: URL-based duplicate prevention

## Monitoring & Maintenance

### Success Metrics
- **Content Volume**: 50+ articles/day target
- **System Uptime**: 99.9% availability goal
- **Processing Speed**: <5 minutes for full sync
- **Quality Score**: 80%+ relevance rating
- **Error Rate**: <1% RSS parsing failures

### Regular Maintenance
- **Weekly**: Review content quality and relevance scores
- **Monthly**: Evaluate and update RSS source list
- **Quarterly**: Analyze content performance metrics
- **As needed**: Adjust classification algorithms

### Troubleshooting
Common issues and solutions:
- **RSS Feed Failures**: Check source status, update URLs
- **Low Content Volume**: Add more sources or lower quality threshold
- **Classification Issues**: Adjust keyword lists and scoring weights
- **Performance Problems**: Optimize database queries, increase cache TTL

## Next Steps

1. **Deploy**: Push to production and verify cron jobs are running
2. **Monitor**: Watch content quality and system performance for first week
3. **Optimize**: Adjust relevance scoring based on content quality
4. **Expand**: Add more RSS sources as the system stabilizes
5. **Enhance**: Consider adding email notifications for breaking news

The automation system is production-ready and will significantly reduce manual content curation work while providing high-quality, relevant AI industry updates to your audience.