export interface NewsItem {
  id: string
  text: string
  link?: string
  category: "breaking" | "trending" | "update" | "insight"
  time: string
  source: string
  isRSS?: boolean
  pubDate?: Date
}

// Curated content that always appears and represents your brand
export const curatedNews: Omit<NewsItem, "id" | "time">[] = [
  {
    text: "AI tools boost content engagement by 70%!",
    link: "#",
    category: "trending",
    source: "Creator Analytics",
    isRSS: false,
  },
  {
    text: "Creators using AI see 3x faster channel growth.",
    link: "#",
    category: "insight",
    source: "Growth Report",
    isRSS: false,
  },
  {
    text: "VIRAL: AI-generated scripts captivating millions.",
    link: "#",
    category: "breaking",
    source: "Content Pulse",
    isRSS: false,
  },
  {
    text: "Save 10+ hours/week on tedious tasks with AI.",
    link: "#",
    category: "update",
    source: "Workflow Weekly",
    isRSS: false,
  },
  {
    text: "AI-DRIVEN: Full-funnel optimization for creators, from views to revenue!",
    link: "#",
    category: "insight",
    source: "Revenue Insights",
    isRSS: false,
  },
  {
    text: "TRENDING: AI for unique video & image generation.",
    link: "#",
    category: "trending",
    source: "Visual Trends",
    isRSS: false,
  },
]

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
]

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
]

// Helper function to check if content is relevant
export function isRelevantContent(title: string, description = ""): boolean {
  const content = `${title} ${description}`.toLowerCase()
  return relevantKeywords.some((keyword) => content.includes(keyword))
}

// Helper function to categorize RSS content
export function categorizeRSSContent(title: string, description = ""): NewsItem["category"] {
  const content = `${title} ${description}`.toLowerCase()

  if (content.includes("breaking") || content.includes("urgent") || content.includes("just announced")) {
    return "breaking"
  }
  if (content.includes("trend") || content.includes("viral") || content.includes("popular")) {
    return "trending"
  }
  if (content.includes("update") || content.includes("new version") || content.includes("release")) {
    return "update"
  }
  return "insight"
}

// Helper function to format RSS title for ticker
export function formatRSSTitle(title: string): string {
  // Remove common prefixes and clean up
  let cleaned = title
    .replace(/^\[.*?\]\s*/, "") // Remove [Category] prefixes
    .replace(/^.*?:\s*/, "") // Remove "Site Name:" prefixes
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  // Truncate if too long
  if (cleaned.length > 120) {
    cleaned = cleaned.substring(0, 117) + "..."
  }

  return cleaned
}
