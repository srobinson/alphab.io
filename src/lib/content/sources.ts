// Content source definitions and management
export interface ContentSource {
  id: string;
  name: string;
  rssUrl?: string;
  apiUrl?: string;
  category: "ai" | "tech" | "business" | "research";
  priority: "high" | "medium" | "low";
  isActive: boolean;
  maxItems?: number;
  userAgent?: string;
}

export const CONTENT_SOURCES: ContentSource[] = [
  {
    id: "techcrunch-ai",
    name: "TechCrunch AI",
    rssUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "ai",
    priority: "high",
    isActive: true,
    maxItems: 15,
  },
  {
    id: "bdtechtalks",
    name: "BD Tech Talks",
    rssUrl: "https://bdtechtalks.com/feed/",
    category: "ai",
    priority: "high",
    isActive: true,
    maxItems: 15,
  },
  {
    id: "the-verge-ai",
    name: "The Verge",
    rssUrl: "https://www.theverge.com/rss/index.xml",
    category: "tech",
    priority: "high",
    isActive: true,
    maxItems: 10,
  },
  {
    id: "wired-tech",
    name: "Wired Tech",
    rssUrl: "https://www.wired.com/feed/category/gear/rss",
    category: "tech",
    priority: "high",
    isActive: true,
    maxItems: 10,
  },
  {
    id: "ars-technica-ai",
    name: "Ars Technica AI",
    rssUrl: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    category: "tech",
    priority: "medium",
    isActive: true,
    maxItems: 8,
  },
  {
    id: "techspot",
    name: "TechSpot",
    rssUrl: "https://www.techspot.com/backend.xml",
    category: "tech",
    priority: "high",
    isActive: true,
    maxItems: 15,
  },
  {
    id: "mit-tech-review",
    name: "MIT Technology Review",
    rssUrl: "https://www.technologyreview.com/feed/",
    category: "research",
    priority: "high",
    isActive: true,
    maxItems: 8,
  },
  {
    id: "hackernews-ai",
    name: "Hacker News AI",
    rssUrl: "https://hnrss.org/newest?q=AI+OR+artificial+intelligence",
    category: "ai",
    priority: "medium",
    isActive: true,
    maxItems: 10,
  },
  {
    id: "openai-blog",
    name: "OpenAI Blog",
    rssUrl: "https://openai.com/blog/rss.xml",
    category: "research",
    priority: "high",
    isActive: false, // May not have RSS
    maxItems: 5,
  },
];

export function getActiveSourcesByPriority(): ContentSource[] {
  return CONTENT_SOURCES.filter((source) => source.isActive).sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function getSourceById(id: string): ContentSource | undefined {
  return CONTENT_SOURCES.find((source) => source.id === id);
}

export function getSourcesByCategory(category: ContentSource["category"]): ContentSource[] {
  return CONTENT_SOURCES.filter((source) => source.category === category && source.isActive);
}
