// Revalidation times (in seconds)
export const REVALIDATE_TIMES = {
  BLOG_INDEX: 300, // 5 minutes
  BLOG_POST: 3600, // 1 hour
  SERVICES: 86400, // 24 hours (static content)
  API_BLOG: 300, // 5 minutes
} as const;

// Cache tags for on-demand revalidation
export const CACHE_TAGS = {
  BLOG_POSTS: "blog-posts",
  BLOG_INDEX: "blog-index",
  SERVICES: "services",
} as const;

// Helper to create consistent cache configurations
export function getCacheConfig(revalidate: number) {
  return {
    next: { revalidate },
  };
}

// Helper for API route cache headers
export function getApiCacheHeaders(maxAge: number, staleWhileRevalidate: number) {
  return {
    "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}
