import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'
import { SimpleThumbnailService } from '@/lib/content/simple-thumbnails'
import { checkRateLimit } from '@/lib/rate-limit'

// Enable edge caching - cache responses for 5 minutes
export const revalidate = 300; // 5 minutes
export const runtime = 'nodejs' // Ensure we can use all Node.js features
export const dynamic = 'force-dynamic' // Required for rate limiting

// Helper function to format time ago
function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return 'Recently'
  
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Less than an hour ago'
  if (diffInHours === 1) return '1 hour ago'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return '1 day ago'
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  return date.toLocaleDateString()
}

// Helper function to generate dynamic thumbnail
function generateThumbnail(article: any, category: string, trending: boolean): string {
  // Use SimpleThumbnailService for immediate results
  return SimpleThumbnailService.getBestThumbnail({
    title: article.title,
    source: article.source,
    category: category,
    tags: article.tags || [],
    url: article.url
  })
}

export async function GET(request: Request) {
  try {
    // Rate limiting - 60 requests per minute per IP
    const rateLimitCheck = checkRateLimit(request, {
      limit: 60,
      windowMs: 60 * 1000
    })
    
    // Add cache headers for CDN/browser caching
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'CDN-Cache-Control': 'public, s-maxage=300',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
      ...rateLimitCheck.headers
    }
    
    // Check if rate limit exceeded
    if (!rateLimitCheck.allowed) {
      console.warn('Rate limit exceeded for curated-news API')
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimitCheck.headers['Retry-After']
        },
        { 
          status: 429,
          headers: {
            ...headers,
            'Retry-After': rateLimitCheck.headers['Retry-After']
          }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration')
      throw new Error('Database configuration error')
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Try to get data from industry moves cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('industry_moves_cache')
      .select(`
        id,
        category,
        is_trending,
        is_breaking,
        priority_score,
        display_order,
        articles (
          id, title, url, source, summary, published_at, tags
        )
      `)
      .not('articles', 'is', null)
      .gte('expires_at', new Date().toISOString())
      .order('display_order', { ascending: true })
      .limit(12)
    
    let items: any[] = []
    
    if (cachedData && cachedData.length > 0) {
      // Use cached data
      console.log(`Using cached industry moves data (${cachedData.length} items)`)
      
      items = cachedData.map((item: any) => ({
        id: item.articles.id,
        category: item.category,
        text: item.articles.title,
        description: item.articles.summary || `Latest from ${item.articles.source}`,
        time: formatTimeAgo(item.articles.published_at),
        source: item.articles.source,
        link: item.articles.url,
        image: generateThumbnail(item.articles, item.category, item.is_trending),
        isRSS: true,
        trending: item.is_trending || item.category === 'trending'
      }))
    } else {
      // Fallback to direct articles query
      console.log('No cached data found, fetching from articles table')
      
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, url, source, summary, published_at, tags')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(16)
      
      if (articlesError) {
        throw articlesError
      }
      
      if (articles && articles.length > 0) {
        // Simple categorization based on recency and keywords
        items = articles.slice(0, 12).map((article: any, index: number) => {
          const hoursOld = (Date.now() - new Date(article.published_at || article.created_at).getTime()) / (1000 * 60 * 60)
          const title = article.title.toLowerCase()
          
          let category = 'update'
          let trending = false
          
          // Simple keyword-based categorization
          if (hoursOld < 6 && (title.includes('announces') || title.includes('launches') || title.includes('releases'))) {
            category = 'breaking'
            trending = true
          } else if (title.includes('trend') || title.includes('popular') || title.includes('surge')) {
            category = 'trending'
            trending = true
          } else if (title.includes('analysis') || title.includes('insight') || title.includes('opinion')) {
            category = 'insight'
          }
          
          return {
            id: article.id,
            category,
            text: article.title,
            description: article.summary || `Latest from ${article.source}`,
            time: formatTimeAgo(article.published_at),
            source: article.source,
            link: article.url,
            image: generateThumbnail(article, category, trending),
            isRSS: true,
            trending
          }
        })
      }
    }
    
    // If no real data available, use fallback
    if (items.length === 0) {
      console.log('No articles found, using fallback data')
      
      items = [
        {
          id: "fallback-1",
          category: "update",
          text: "AI Industry Updates Available Soon",
          description: "Real-time industry updates will appear here once content sync is configured",
          time: "Recently",
          source: "System",
          link: "#",
          image: SimpleThumbnailService.getBestThumbnail({
            title: "AI Industry Updates Available Soon",
            source: "System",
            category: "update",
            tags: ['ai', 'system']
          }),
          trending: false
        },
        {
          id: "fallback-2", 
          category: "insight",
          text: "Content Automation System Ready",
          description: "The automated content pipeline is ready to fetch and display the latest AI industry news",
          time: "System Status",
          source: "RADE",
          link: "#",
          image: SimpleThumbnailService.getBestThumbnail({
            title: "Content Automation System Ready",
            source: "RADE",
            category: "insight",
            tags: ['automation', 'ready']
          }),
          trending: false
        }
      ]
    }
    
    console.log(`Returning ${items.length} industry moves items`)
    
    return NextResponse.json({ 
      items,
      cached: cachedData && cachedData.length > 0,
      timestamp: new Date().toISOString()
    }, {
      headers
    });
    
  } catch (error) {
    console.error("Error fetching curated news:", error);
    
    // Return fallback data on error
    return NextResponse.json({
      items: [
        {
          id: "error-fallback",
          category: "update",
          text: "Content System Initializing",
          description: "The content automation system is being set up. Real industry updates coming soon.",
          time: "System Status",
          source: "RADE",
          link: "#",
          image: SimpleThumbnailService.getBestThumbnail({
            title: "Content System Initializing",
            source: "RADE",
            category: "update",
            tags: ['system', 'initializing']
          }),
          trending: false
        }
      ],
      error: true,
      message: "Using fallback data due to system initialization",
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' // Shorter cache for errors
      }
    });
  }
}
