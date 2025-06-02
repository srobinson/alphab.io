import { NextResponse } from "next/server"
import {
  curatedNews,
  rssFeedSources,
  isRelevantContent,
  categorizeRSSContent,
  formatRSSTitle,
  type NewsItem,
} from "@/lib/news-feeds"

// Simple RSS parser function
async function parseRSSFeed(url: string, sourceName: string, defaultCategory: NewsItem["category"]) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "RADE-AI-News-Aggregator/1.0",
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    })

    if (!response.ok) {
      console.warn(`Failed to fetch RSS from ${sourceName}: ${response.status}`)
      return []
    }

    const xmlText = await response.text()

    // Simple XML parsing for RSS items
    const items: NewsItem[] = []
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []

    for (const itemXml of itemMatches.slice(0, 5)) {
      // Limit to 5 items per feed
      try {
        const titleMatch = itemXml.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i)
        const linkMatch = itemXml.match(/<link[^>]*>(.*?)<\/link>/i)
        const descMatch = itemXml.match(
          /<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i,
        )
        const pubDateMatch = itemXml.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i)

        const title = titleMatch?.[1] || titleMatch?.[2] || ""
        const link = linkMatch?.[1] || ""
        const description = descMatch?.[1] || descMatch?.[2] || ""
        const pubDate = pubDateMatch?.[1] || ""

        if (title && isRelevantContent(title, description)) {
          const formattedTitle = formatRSSTitle(title)
          const category = categorizeRSSContent(title, description) || defaultCategory
          const parsedDate = pubDate ? new Date(pubDate) : new Date()

          items.push({
            id: `rss-${sourceName}-${Date.now()}-${Math.random()}`,
            text: formattedTitle,
            link: link || undefined,
            category,
            time: parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            source: sourceName,
            isRSS: true,
            pubDate: parsedDate,
          })
        }
      } catch (itemError) {
        console.warn(`Error parsing RSS item from ${sourceName}:`, itemError)
      }
    }

    return items
  } catch (error) {
    console.warn(`Error fetching RSS from ${sourceName}:`, error)
    return []
  }
}

export async function GET() {
  try {
    // Fetch RSS feeds in parallel
    const rssPromises = rssFeedSources.map((source) => parseRSSFeed(source.url, source.name, source.category))

    const rssResults = await Promise.allSettled(rssPromises)
    const rssItems: NewsItem[] = []

    // Collect successful RSS results
    rssResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        rssItems.push(...result.value)
      } else {
        console.warn(`RSS feed ${rssFeedSources[index].name} failed:`, result.reason)
      }
    })

    // Sort RSS items by publication date (newest first)
    rssItems.sort((a, b) => {
      if (!a.pubDate || !b.pubDate) return 0
      return b.pubDate.getTime() - a.pubDate.getTime()
    })

    // Take top 8 RSS items
    const topRSSItems = rssItems.slice(0, 8)

    // Create curated items with current timestamps
    const curatedItems: NewsItem[] = curatedNews.map((item, index) => ({
      ...item,
      id: `curated-${index}`,
      time: new Date(Date.now() - index * 60000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }))

    // Mix curated and RSS content (always include some curated content)
    const mixedItems: NewsItem[] = []

    // Add curated items first (ensure brand messaging is always present)
    mixedItems.push(...curatedItems.slice(0, 4))

    // Add RSS items
    mixedItems.push(...topRSSItems)

    // Add remaining curated items
    mixedItems.push(...curatedItems.slice(4))

    // Shuffle the mixed items while keeping some curated items at the start
    const finalItems = [
      ...mixedItems.slice(0, 2), // Keep first 2 curated items at start
      ...mixedItems.slice(2).sort(() => Math.random() - 0.5), // Shuffle the rest
    ]

    return NextResponse.json({
      items: finalItems,
      lastUpdated: new Date().toISOString(),
      rssItemsCount: topRSSItems.length,
      curatedItemsCount: curatedItems.length,
    })
  } catch (error) {
    console.error("Error in news API:", error)

    // Fallback to curated content only
    const fallbackItems: NewsItem[] = curatedNews.map((item, index) => ({
      ...item,
      id: `fallback-${index}`,
      time: new Date(Date.now() - index * 60000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }))

    return NextResponse.json({
      items: fallbackItems,
      lastUpdated: new Date().toISOString(),
      rssItemsCount: 0,
      curatedItemsCount: fallbackItems.length,
      error: "Using fallback content",
    })
  }
}
