# Local Testing Guide for Content Automation

## 🧪 Testing Options (No Database Required)

### 1. Test RSS Sources Only
```bash
# Test all RSS feeds (works without any setup)
pnpm content test

# Expected output: ✅ for working feeds, shows item counts and response times
```

### 2. Test Content Classification
```bash
# Test AI classification with sample data
pnpm test-automation

# Expected output: Shows classification results for sample articles
```

### 3. Test Individual Components
```bash
# Test just the RSS parser
node -e "
import('./lib/content/rss-parser.js').then(async ({ RSSParser }) => {
  const parser = new RSSParser()
  const result = await parser.fetchFromSource({
    id: 'techcrunch-ai',
    name: 'TechCrunch AI',
    rssUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'ai',
    priority: 'high',
    isActive: true,
    maxItems: 5
  })
  console.log('Success:', result.success)
  console.log('Items:', result.items.length)
  if (result.items.length > 0) {
    console.log('First item:', result.items[0].title)
  }
})
"
```

## 🗄️ Testing With Database (Full Functionality)

### Prerequisites Setup

1. **Create `.env.local`** (copy from example):
```bash
cp .env.local.example .env.local
```

2. **Required Environment Variables**:
```bash
# Supabase (Required for database testing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Content Automation (Required for full sync)
CRON_SECRET=any_random_string_for_testing

# Optional (for AI summarization)
OPENROUTER_API_KEY=your_openrouter_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Run Database Migration**:
```bash
# In Supabase dashboard, run the SQL file:
# supabase/migrations/20250130_content_automation.sql
```

### Full Testing Commands

```bash
# 1. Check system status (requires database)
pnpm content status

# 2. Run full content sync (requires database + service role key)
pnpm content sync

# 3. Update industry moves cache (requires database)
pnpm content cache

# 4. Test the web interface
pnpm dev
# Then visit: http://localhost:3000/industry-moves
```

## 🌐 Testing API Endpoints

### Start Development Server
```bash
pnpm dev
```

### Test APIs with curl
```bash
# 1. Test industry moves API (works with/without database)
curl http://localhost:3000/api/curated-news

# 2. Test blog API 
curl http://localhost:3000/api/blog

# 3. Test cron endpoint (requires CRON_SECRET)
curl -H "Authorization: Bearer your_cron_secret" http://localhost:3000/api/cron/content-sync

# 4. Health check
curl -X POST -H "Authorization: Bearer your_cron_secret" http://localhost:3000/api/cron/content-sync
```

### Expected API Responses

**Without Database** (fallback mode):
```json
{
  "items": [
    {
      "id": "fallback-1",
      "category": "update", 
      "text": "Content Automation System Ready",
      "description": "The automated content pipeline is ready...",
      "time": "System Status",
      "source": "RADE",
      "trending": false
    }
  ],
  "error": true,
  "message": "Using fallback data due to system initialization"
}
```

**With Database** (real data):
```json
{
  "items": [
    {
      "id": "article-uuid",
      "category": "breaking",
      "text": "OpenAI Announces Major Update...",
      "description": "Latest developments in AI...",
      "time": "2 hours ago", 
      "source": "TechCrunch",
      "trending": true
    }
  ],
  "cached": true,
  "timestamp": "2024-01-30T..."
}
```

## 🖥️ Testing the UI

### 1. Industry Moves Page
```bash
# Start dev server
pnpm dev

# Visit: http://localhost:3000/industry-moves
# Should show real content if database is connected, fallback otherwise
```

### 2. Blog Pages
```bash
# Visit: http://localhost:3000/blog
# Visit: http://localhost:3000/blog_new
# Should show articles from database or "No articles found"
```

## 🔍 Debugging & Troubleshooting

### Check Logs
```bash
# RSS parsing errors
pnpm content test

# Database connection
pnpm content status

# Full sync with verbose output
pnpm content sync
```

### Common Issues & Solutions

**"Missing Supabase configuration"**
- Add SUPABASE_SERVICE_ROLE_KEY to .env.local
- Ensure Supabase project is created and migration is run

**"Status code 429" (Rate limiting)**
- Normal for some RSS feeds during testing
- Wait a few minutes and try again
- VentureBeat has alternative feed URL configured

**"No articles found"**
- Database is empty - run `pnpm content sync` first
- Or test without database using `pnpm content test`

**"Cron endpoint unauthorized"**
- Add CRON_SECRET to .env.local
- Use correct secret in Authorization header

## 🎯 Step-by-Step Local Testing

### Minimal Test (No Setup Required)
```bash
# 1. Test RSS sources
pnpm content test
# ✅ Should show 8 sources with item counts

# 2. Test classification
pnpm test-automation  
# ✅ Should show AI classification results
```

### Full Test (With Database)
```bash
# 1. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 2. Run migration in Supabase dashboard
# Copy/paste: supabase/migrations/20250130_content_automation.sql

# 3. Test database connection
pnpm content status
# ✅ Should show "Database: ✅ Connected"

# 4. Sync content
pnpm content sync
# ✅ Should fetch and process 50+ articles

# 5. Test UI
pnpm dev
# Visit: http://localhost:3000/industry-moves
# ✅ Should show real industry updates
```

### API Testing
```bash
# 1. Start server
pnpm dev

# 2. Test endpoints
curl http://localhost:3000/api/curated-news
curl http://localhost:3000/api/blog

# 3. Test cron (with your secret)
curl -H "Authorization: Bearer test123" http://localhost:3000/api/cron/content-sync
```

## 📊 What to Expect

### RSS Test Results
```
📡 TechCrunch AI             ✅ 15 items (179ms)
📡 VentureBeat AI            ✅ 15 items (868ms) 
📡 The Verge                 ✅ 10 items (90ms)
📡 Wired Tech                ✅ 10 items (7015ms)
📡 MIT Technology Review     ✅ 8 items (263ms)
📡 Ars Technica AI           ✅ 8 items (927ms)
📡 AI News                   ✅ 12 items (1595ms)
📡 Hacker News AI            ✅ 10 items (1625ms)
```

### Content Sync Results
```
📊 Sync Results:
✅ TechCrunch AI
   Items: 15 fetched, 12 ingested
   Duration: 2345ms

✅ MIT Technology Review  
   Items: 8 fetched, 6 ingested
   Duration: 1234ms

📈 Summary:
   Sources: 7/8 successful
   Content: 89 fetched, 67 ingested  
   Success Rate: 88%
```

You can start testing immediately with `pnpm content test` - no setup required! For full functionality, you'll need the Supabase database configured.