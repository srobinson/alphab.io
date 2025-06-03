export interface NewsItem {
  id: string;
  text: string;
  link?: string;
  category: "breaking" | "trending" | "update" | "insight";
  time: string;
  source: string;
  isRSS?: boolean;
  pubDate?: Date;
  image?: string;
  description?: string;
}

// News API configuration
export const NEWS_API_CONFIG = {
  // You can get a free API key from https://newsapi.org/
  apiKey: process.env.NEWS_API_KEY || "",
  baseUrl: "https://newsapi.org/v2",
  // Alternative free APIs
  alternativeApis: {
    // NewsData.io - free tier available
    newsData: {
      apiKey: process.env.NEWSDATA_API_KEY || "",
      baseUrl: "https://newsdata.io/api/1",
    },
    // GNews.io - free tier available
    gnews: {
      apiKey: process.env.GNEWS_API_KEY || "",
      baseUrl: "https://gnews.io/api/v4",
    },
  },
};

// Focused brand messaging (1-2 key marketing messages)
export const brandMessages: Omit<NewsItem, "id" | "time">[] = [
  {
    text: "🚀 RADE AI: Transform your content strategy with AI-powered automation",
    link: "/services",
    category: "insight",
    source: "RADE AI",
    isRSS: false,
    description:
      "Discover how RADE AI helps creators scale their content and grow their audience with intelligent automation tools.",
  },
  {
    text: "💡 NEW: AI-driven content optimization increases engagement by 300%",
    link: "/my-approach",
    category: "trending",
    source: "RADE Insights",
    isRSS: false,
    description:
      "Learn about our proven methodology for leveraging AI to maximize content performance and audience growth.",
  },
];

// News API search queries for relevant content
export const NEWS_QUERIES = [
  "artificial intelligence",
  "AI content creation",
  "machine learning",
  "ChatGPT",
  "OpenAI",
  "content marketing AI",
  "AI automation",
  "generative AI",
  "AI tools",
  "creator economy",
];

// RSS feed sources
export const rssFeedSources = [
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    name: "TechCrunch AI",
    category: "breaking" as const,
  },
  {
    url: "https://venturebeat.com/ai/feed/",
    name: "VentureBeat AI",
    category: "insight" as const,
  },
  {
    url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    name: "The Verge AI",
    category: "trending" as const,
  },
  {
    url: "https://feeds.feedburner.com/oreilly/radar",
    name: "O'Reilly Radar",
    category: "update" as const,
  },
];

// Keywords to filter RSS content for AI/creator relevance
export const relevantKeywords = [
  "artificial intelligence",
  "ai",
  "machine learning",
  "content creation",
  "creator",
  "social media",
  "automation",
  "chatgpt",
  "openai",
  "generative",
  "algorithm",
  "neural network",
  "deep learning",
  "llm",
  "large language model",
  "video generation",
  "image generation",
  "content marketing",
  "influencer",
  "youtube",
  "tiktok",
  "instagram",
  "viral",
  "engagement",
];

// Helper function to check if content is relevant
export function isRelevantContent(title: string, description = ""): boolean {
  const content = `${title} ${description}`.toLowerCase();
  return relevantKeywords.some((keyword) => content.includes(keyword));
}

// Helper function to categorize RSS content
export function categorizeRSSContent(
  title: string,
  description = ""
): NewsItem["category"] {
  const content = `${title} ${description}`.toLowerCase();

  if (
    content.includes("breaking") ||
    content.includes("urgent") ||
    content.includes("just announced")
  ) {
    return "breaking";
  }
  if (
    content.includes("trend") ||
    content.includes("viral") ||
    content.includes("popular")
  ) {
    return "trending";
  }
  if (
    content.includes("update") ||
    content.includes("new version") ||
    content.includes("release")
  ) {
    return "update";
  }
  return "insight";
}

// Helper function to format RSS title for ticker
export function formatRSSTitle(title: string): string {
  // Remove common prefixes and clean up
  let cleaned = title
    .replace(/^\[.*?\]\s*/, "") // Remove [Category] prefixes
    .replace(/^.*?:\s*/, "") // Remove "Site Name:" prefixes
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Truncate if too long
  if (cleaned.length > 120) {
    cleaned = cleaned.substring(0, 117) + "...";
  }

  return cleaned;
}

// Fetch news from NewsAPI.org
export async function fetchNewsAPI(
  query: string,
  pageSize = 10
): Promise<NewsItem[]> {
  if (!NEWS_API_CONFIG.apiKey) {
    console.warn("NewsAPI key not configured");
    return [];
  }

  try {
    const url = `${NEWS_API_CONFIG.baseUrl}/everything?q=${encodeURIComponent(
      query
    )}&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${
      NEWS_API_CONFIG.apiKey
    }`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "RADE-AI-News-Aggregator/1.0",
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.warn(`NewsAPI request failed: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.status !== "ok" || !data.articles) {
      console.warn("NewsAPI returned error:", data.message);
      return [];
    }

    return data.articles
      .filter(
        (article: any) =>
          article.title &&
          article.url &&
          isRelevantContent(article.title, article.description)
      )
      .map((article: any, index: number) => ({
        id: `newsapi-${Date.now()}-${index}`,
        text: formatRSSTitle(article.title),
        link: article.url,
        category: categorizeRSSContent(article.title, article.description),
        time: new Date(article.publishedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        source: article.source?.name || "NewsAPI",
        isRSS: false,
        pubDate: new Date(article.publishedAt),
        image: article.urlToImage || undefined,
        description:
          article.description?.substring(0, 150) +
            (article.description?.length > 150 ? "..." : "") ||
          `Latest from ${article.source?.name || "NewsAPI"}`,
      }));
  } catch (error) {
    console.warn("Error fetching from NewsAPI:", error);
    return [];
  }
}

// Fetch news from GNews.io (alternative free API)
export async function fetchGNewsAPI(
  query: string,
  max = 10
): Promise<NewsItem[]> {
  const apiKey = NEWS_API_CONFIG.alternativeApis.gnews.apiKey;
  if (!apiKey) {
    console.warn("GNews API key not configured");
    return [];
  }

  try {
    const url = `${
      NEWS_API_CONFIG.alternativeApis.gnews.baseUrl
    }/search?q=${encodeURIComponent(query)}&max=${max}&apikey=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "RADE-AI-News-Aggregator/1.0",
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.warn(`GNews request failed: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.articles) {
      console.warn("GNews returned no articles");
      return [];
    }

    return data.articles
      .filter(
        (article: any) =>
          article.title &&
          article.url &&
          isRelevantContent(article.title, article.description)
      )
      .map((article: any, index: number) => ({
        id: `gnews-${Date.now()}-${index}`,
        text: formatRSSTitle(article.title),
        link: article.url,
        category: categorizeRSSContent(article.title, article.description),
        time: new Date(article.publishedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        source: article.source?.name || "GNews",
        isRSS: false,
        pubDate: new Date(article.publishedAt),
        image: article.image || undefined,
        description:
          article.description?.substring(0, 150) +
            (article.description?.length > 150 ? "..." : "") ||
          `Latest from ${article.source?.name || "GNews"}`,
      }));
  } catch (error) {
    console.warn("Error fetching from GNews:", error);
    return [];
  }
}

// Fetch news from multiple APIs
export async function fetchAllNewsAPIs(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  // Try different queries to get diverse content
  const queries = NEWS_QUERIES.slice(0, 3); // Use first 3 queries to avoid rate limits

  for (const query of queries) {
    // Try NewsAPI first
    const newsApiResults = await fetchNewsAPI(query, 5);
    allNews.push(...newsApiResults);

    // Try GNews as backup/additional source
    const gNewsResults = await fetchGNewsAPI(query, 5);
    allNews.push(...gNewsResults);

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Remove duplicates based on URL
  const uniqueNews = allNews.filter(
    (item, index, self) => index === self.findIndex((t) => t.link === item.link)
  );

  // Sort by publication date (newest first)
  uniqueNews.sort((a, b) => {
    if (!a.pubDate || !b.pubDate) return 0;
    return b.pubDate.getTime() - a.pubDate.getTime();
  });

  return uniqueNews.slice(0, 20); // Return top 20 articles
}
