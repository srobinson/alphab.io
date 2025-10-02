import {
  brandMessages,
  categorizeRSSContent,
  fetchAllNewsAPIs,
  formatRSSTitle,
  isRelevantContent,
  type NewsItem,
  rssFeedSources,
} from "@/lib/news-feeds";
import { NextResponse } from "next/server";
import { checkRateLimit } from '@/lib/rate-limit';

// Required for rate limiting
export const dynamic = 'force-dynamic'
export const revalidate = 1800 // Cache for 30 minutes

// Simple RSS parser function
async function parseRSSFeed(
  url: string,
  sourceName: string,
  defaultCategory: NewsItem["category"],
) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "RADE-AI-News-Aggregator/1.0",
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch RSS from ${sourceName}: ${response.status}`,
      );
      return [];
    }

    const xmlText = await response.text();

    // Simple XML parsing for RSS items
    const items: NewsItem[] = [];
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];

    for (const itemXml of itemMatches.slice(0, 8)) {
      // Limit to 8 items per feed
      try {
        const titleMatch = itemXml.match(
          /<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i,
        );
        const linkMatch = itemXml.match(/<link[^>]*>(.*?)<\/link>/i);
        const descMatch = itemXml.match(
          /<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i,
        );
        const pubDateMatch = itemXml.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i);

        // Extract images from various RSS formats - more comprehensive
        let imageUrl = "";

        // Try multiple image extraction methods
        const imagePatterns = [
          // Media RSS namespace
          /<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*/i,
          /<media:content[^>]*url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["'][^>]*/i,
          // Enclosure tags
          /<enclosure[^>]*type=["']image\/[^"']*["'][^>]*url=["']([^"']+)["'][^>]*/i,
          /<enclosure[^>]*url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["'][^>]*type=["']image/i,
          // Content and description embedded images
          /<img[^>]*src=["']([^"']+)["'][^>]*>/i,
          // iTunes image
          /<itunes:image[^>]*href=["']([^"']+)["'][^>]*/i,
          // Standard image tag
          /<image[^>]*><url[^>]*>([^<]+)<\/url>/i,
          // Look for image URLs in content
          /https?:\/\/[^\s<>"]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s<>"]*)?/i,
        ];

        for (const pattern of imagePatterns) {
          const match = itemXml.match(pattern);
          if (match && match[1]) {
            imageUrl = match[1];
            break;
          }
        }

        const title = titleMatch?.[1] || titleMatch?.[2] || "";
        const link = linkMatch?.[1] || "";
        const description = descMatch?.[1] || descMatch?.[2] || "";
        const pubDate = pubDateMatch?.[1] || "";

        // Clean and validate image URL
        let cleanImageUrl = imageUrl.trim();
        if (cleanImageUrl && !cleanImageUrl.startsWith("http")) {
          cleanImageUrl = ""; // Invalid URL
        }

        if (title && isRelevantContent(title, description)) {
          const formattedTitle = formatRSSTitle(title);
          const category = categorizeRSSContent(title, description) ||
            defaultCategory;
          const parsedDate = pubDate ? new Date(pubDate) : new Date();

          // Clean description for display
          const cleanDescription = description
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .replace(/&[^;]+;/g, " ") // Remove HTML entities
            .trim()
            .substring(0, 150) + (description.length > 150 ? "..." : "");

          items.push({
            id: `rss-${sourceName}-${Date.now()}-${Math.random()}`,
            text: formattedTitle,
            link: link || undefined,
            category,
            time: parsedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            source: sourceName,
            isRSS: true,
            pubDate: parsedDate,
            image: cleanImageUrl || undefined,
            description: cleanDescription || `Latest from ${sourceName}`,
          });
        }
      } catch (itemError) {
        console.warn(`Error parsing RSS item from ${sourceName}:`, itemError);
      }
    }

    return items;
  } catch (error) {
    console.warn(`Error fetching RSS from ${sourceName}:`, error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    // Rate limiting - 30 requests per minute per IP (more restrictive due to RSS fetching)
    const rateLimitCheck = checkRateLimit(request, {
      limit: 30,
      windowMs: 60 * 1000
    })
    
    if (!rateLimitCheck.allowed) {
      console.warn('Rate limit exceeded for news API')
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimitCheck.headers['Retry-After']
        },
        { 
          status: 429,
          headers: rateLimitCheck.headers
        }
      )
    }

    // Fetch from multiple sources in parallel
    const [rssResults, newsApiResults] = await Promise.allSettled([
      // Fetch RSS feeds
      Promise.allSettled(
        rssFeedSources.map((source) =>
          parseRSSFeed(source.url, source.name, source.category)
        ),
      ),
      // Fetch from news APIs
      fetchAllNewsAPIs(),
    ]);

    const allItems: NewsItem[] = [];

    // Collect RSS results
    if (rssResults.status === "fulfilled") {
      rssResults.value.forEach((result, index) => {
        if (result.status === "fulfilled") {
          allItems.push(...result.value);
        } else {
          console.warn(
            `RSS feed ${rssFeedSources[index].name} failed:`,
            result.reason,
          );
        }
      });
    }

    // Collect News API results
    if (newsApiResults.status === "fulfilled") {
      allItems.push(...newsApiResults.value);
    } else {
      console.warn("News APIs failed:", newsApiResults.reason);
    }

    // Remove duplicates based on URL and title similarity
    const uniqueItems = allItems.filter((item, index, self) => {
      return (
        index ===
          self.findIndex(
            (t) =>
              t.link === item.link ||
              (t.text
                .toLowerCase()
                .includes(item.text.toLowerCase().substring(0, 30)) &&
                item.text
                  .toLowerCase()
                  .includes(t.text.toLowerCase().substring(0, 30))),
          )
      );
    });

    // Sort by publication date (newest first)
    uniqueItems.sort((a, b) => {
      if (!a.pubDate || !b.pubDate) return 0;
      return b.pubDate.getTime() - a.pubDate.getTime();
    });

    // Create brand message items with current timestamps
    const brandItems: NewsItem[] = brandMessages.map((item, index) => ({
      ...item,
      id: `brand-${index}`,
      time: new Date(Date.now() - index * 30000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    // Take top 18 news items to make room for 2 brand messages
    const topNewsItems = uniqueItems.slice(0, 18);

    // Mix brand messages strategically into the news feed
    const finalItems: NewsItem[] = [];

    // Add first brand message at position 2 (after first real news item)
    finalItems.push(...topNewsItems.slice(0, 2));
    if (brandItems[0]) finalItems.push(brandItems[0]);

    // Add more news items
    finalItems.push(...topNewsItems.slice(2, 10));

    // Add second brand message in the middle
    if (brandItems[1]) finalItems.push(brandItems[1]);

    // Add remaining news items
    finalItems.push(...topNewsItems.slice(10));

    // Count items by source type
    const rssItemsCount = finalItems.filter((item) => item.isRSS).length;
    const apiItemsCount = finalItems.filter(
      (item) => !item.isRSS && !item.source.includes("RADE"),
    ).length;
    const brandItemsCount = finalItems.filter((item) =>
      item.source.includes("RADE")
    ).length;

    return NextResponse.json({
      items: finalItems,
      lastUpdated: new Date().toISOString(),
      rssItemsCount,
      apiItemsCount,
      brandItemsCount,
      totalItems: finalItems.length,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30 min cache
        ...rateLimitCheck.headers
      }
    });
  } catch (error) {
    console.error("Error in news API:", error);

    // Fallback to RSS feeds only
    try {
      const rssPromises = rssFeedSources.map((source) =>
        parseRSSFeed(source.url, source.name, source.category)
      );

      const rssResults = await Promise.allSettled(rssPromises);
      const fallbackItems: NewsItem[] = [];

      rssResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          fallbackItems.push(...result.value);
        } else {
          console.warn(
            `Fallback RSS feed ${rssFeedSources[index].name} failed:`,
            result.reason,
          );
        }
      });

      // Sort and limit fallback items
      fallbackItems.sort((a, b) => {
        if (!a.pubDate || !b.pubDate) return 0;
        return b.pubDate.getTime() - a.pubDate.getTime();
      });

      return NextResponse.json({
        items: fallbackItems.slice(0, 15),
        lastUpdated: new Date().toISOString(),
        rssItemsCount: fallbackItems.length,
        apiItemsCount: 0,
        error: "Using RSS fallback content",
      });
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);

      return NextResponse.json({
        items: [],
        lastUpdated: new Date().toISOString(),
        rssItemsCount: 0,
        apiItemsCount: 0,
        error: "All news sources failed",
      });
    }
  }
}
