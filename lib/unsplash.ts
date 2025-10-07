// Unsplash API integration
interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

const UNSPLASH_CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours
const unsplashCache = new Map<
  string,
  { value: string | null; expiresAt: number }
>();
const unsplashInFlight = new Map<string, Promise<string | null>>();

const normalizeQuery = (query: string) => query.trim().toLowerCase();

/**
 * Search for images on Unsplash
 */
export async function searchUnsplashImages(
  query: string,
  perPage: number = 1,
): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const normalizedQuery = normalizeQuery(query);
  const cacheKey = `${normalizedQuery}:${perPage}`;

  if (!normalizedQuery) {
    return null;
  }

  if (!accessKey) {
    console.warn("Unsplash API key not configured");
    return null;
  }

  try {
    const now = Date.now();
    const cached = unsplashCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      if (cached.value) {
        console.log(
          `♻️  Unsplash cache hit for "${normalizedQuery}" (expires ${
            new Date(
              cached.expiresAt,
            ).toISOString()
          })`,
        );
      }
      return cached.value;
    }

    if (unsplashInFlight.has(cacheKey)) {
      return unsplashInFlight.get(cacheKey) ?? null;
    }

    const requestPromise = (async () => {
      console.log(`🖼️  Unsplash API call: searching for "${query}"`);
      const url = new URL("https://api.unsplash.com/search/photos");
      url.searchParams.set("query", normalizedQuery);
      url.searchParams.set("per_page", perPage.toString());
      url.searchParams.set("orientation", "landscape");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(`Unsplash API error: ${response.status}`);
        return null;
      }

      const data: UnsplashSearchResponse = await response.json();

      if (data.results && data.results.length > 0) {
        const resolvedUrl = new URL(data.results[0].urls.small);
        resolvedUrl.searchParams.set("w", "400");
        resolvedUrl.searchParams.set("h", "200");
        resolvedUrl.searchParams.set("fit", "crop");
        const imageUrl = resolvedUrl.toString();
        console.log(`✅ Unsplash API success: found image for "${query}"`);
        unsplashCache.set(cacheKey, {
          value: imageUrl,
          expiresAt: Date.now() + UNSPLASH_CACHE_TTL_MS,
        });
        return imageUrl;
      }

      console.log(`❌ Unsplash API: no results for "${query}"`);
      unsplashCache.set(cacheKey, {
        value: null,
        expiresAt: Date.now() + UNSPLASH_CACHE_TTL_MS,
      });
      return null;
    })();

    unsplashInFlight.set(cacheKey, requestPromise);
    try {
      return await requestPromise;
    } finally {
      unsplashInFlight.delete(cacheKey);
    }
  } catch (error) {
    console.error("Failed to fetch Unsplash image:", error);
    unsplashCache.set(cacheKey, {
      value: null,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    return null;
  }
}

/**
 * Get a random photo from Unsplash
 */
export async function getRandomUnsplashImage(
  query?: string,
): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return null;
  }

  try {
    const url = new URL("https://api.unsplash.com/photos/random");
    if (query) {
      url.searchParams.set("query", query);
    }
    url.searchParams.set("orientation", "landscape");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data: UnsplashImage = await response.json();
    const imageUrl = data.urls.small;
    return `${imageUrl}&w=400&h=200&fit=crop`;
  } catch (error) {
    console.error("Failed to fetch random Unsplash image:", error);
    return null;
  }
}
