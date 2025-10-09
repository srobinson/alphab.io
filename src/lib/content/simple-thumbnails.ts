// Simple thumbnail utilities for immediate use

export interface ThumbnailOptions {
  title: string;
  source: string;
  category: string;
  tags?: string[];
  url?: string;
  imageUrl?: string;
}

/**
 * Generate a deterministic Picsum image based on article title
 */
export function getPicsumImage(title: string, width = 400, height = 200): string {
  // Create deterministic seed from title
  const seed = hashString(title);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * Generate Unsplash image URL using the API
 * Returns a placeholder that will be replaced by the API call
 */
export function getUnsplashImagePlaceholder(title: string, tags: string[] = []): string {
  // Extract keywords for the API call
  const keywords = extractRelevantKeywords(title, tags);

  // Return a marker that the API will use to fetch the actual image
  // This will be handled server-side in the curated-news API
  return `unsplash:${keywords.join(",")}`;
}

/**
 * Generate Unsplash search query from title and tags
 */
export function getUnsplashSearchQuery(title: string, tags: string[] = []): string {
  const keywords = extractRelevantKeywords(title, tags);
  console.log(`🔍 Extracted keywords for "${title}": [${keywords.join(", ")}]`);
  return keywords.join(" ");
}

/**
 * Extract relevant keywords from title for better image matching
 */
function extractRelevantKeywords(title: string, tags: string[] = []): string[] {
  // Common words to exclude
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
  ]);

  // Extract meaningful words from title
  const titleWords = title
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Prioritize tech/AI related terms
  const techTerms = [
    "ai",
    "artificial",
    "intelligence",
    "drone",
    "robot",
    "technology",
    "tech",
    "digital",
    "machine",
    "learning",
    "data",
    "computer",
    "automation",
    "neural",
    "quantum",
    "cloud",
    "cyber",
    "crypto",
  ];

  const techKeywords = titleWords.filter((word) =>
    techTerms.some((term) => word.includes(term) || term.includes(word))
  );

  // Get other important nouns/verbs (longer words tend to be more descriptive)
  const descriptiveWords = titleWords
    .filter((word) => !techKeywords.includes(word))
    .sort((a, b) => b.length - a.length)
    .slice(0, 3);

  // Combine: tech terms first, then descriptive words, then tags
  const keywords = [
    ...techKeywords.slice(0, 2),
    ...descriptiveWords.slice(0, 2),
    ...tags.slice(0, 1),
  ];

  // Return top 3-4 keywords for better matching
  const finalKeywords = keywords.slice(0, 4).filter(Boolean);

  // Fallback: if no keywords found, use first 2 words from title (minimum for Unsplash)
  if (finalKeywords.length === 0) {
    const fallbackWords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .slice(0, 2);
    return fallbackWords.length > 0 ? fallbackWords : ["technology", "business"];
  }

  return finalKeywords;
}

/**
 * Generate Lorem Picsum with category-based filters
 */
export function getCategoryImage(category: string, title: string): string {
  const seed = hashString(title);
  const categoryMap = {
    breaking: `https://picsum.photos/seed/${seed}/400/200?grayscale&blur=1`,
    trending: `https://picsum.photos/seed/${seed}/400/200`,
    update: `https://picsum.photos/seed/${seed}/400/200?grayscale`,
    insight: `https://picsum.photos/seed/${seed}/400/200?blur=1`,
  };

  return (
    categoryMap[category as keyof typeof categoryMap] ||
    `https://picsum.photos/seed/${seed}/400/200`
  );
}

/**
 * Generate gradient placeholder with category colors
 */
export function getGradientPlaceholder(category: string, source: string): string {
  const colors = getCategoryColors(category);

  // Create SVG with gradient and text
  const svg = `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#grad)" />
      <text x="20" y="30" fill="white" font-family="Arial" font-size="12" font-weight="bold">${category.toUpperCase()}</text>
      <text x="20" y="180" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="11">${source}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Main method - returns the best available thumbnail
 * Note: For Unsplash images, this returns a search query that will be
 * resolved server-side in the curated-news API
 */
export function getBestThumbnail(options: ThumbnailOptions): string {
  // Priority order for best thumbnails:

  // 1. Use RSS extracted image if available (BEST - actual article image)
  if (options.imageUrl && isValidImageUrl(options.imageUrl)) {
    return options.imageUrl;
  }

  // 2. Return Unsplash search query to be resolved server-side
  // This allows the API to fetch actual Unsplash images with proper keys
  const searchQuery = getUnsplashSearchQuery(options.title, options.tags);
  if (searchQuery) {
    return `unsplash:${searchQuery}`;
  }

  // 3. Generate rich SVG thumbnail with article info (for branded content)
  if (shouldGenerateSVG(options)) {
    return generateRichSVG(options);
  }

  // 4. Fallback to deterministic Picsum for variety (not random!)
  return getPicsumImage(options.title);
}

/**
 * Check if image URL is valid and accessible
 */
function isValidImageUrl(url: string): boolean {
  if (!url || url.trim().length === 0) return false;

  try {
    const parsed = new URL(url);
    // Check for valid protocols
    if (!["http:", "https:"].includes(parsed.protocol)) return false;

    // Check for image extensions or known image hosts
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const imageHosts = ["picsum.photos", "unsplash.com", "images.", "img.", "cdn."];

    const urlLower = url.toLowerCase();
    const hasImageExtension = imageExtensions.some((ext) => urlLower.includes(ext));
    const isImageHost = imageHosts.some((host) => urlLower.includes(host));

    return hasImageExtension || isImageHost;
  } catch {
    return false;
  }
}

/**
 * Decide if we should generate SVG (for better branding)
 */
function shouldGenerateSVG(options: ThumbnailOptions): boolean {
  // Generate SVG for brand sources with specific styling
  const brandSources = ["RADE", "System"];
  return brandSources.includes(options.source);
}

/**
 * Generate rich, branded SVG thumbnail
 */
function generateRichSVG(options: ThumbnailOptions): string {
  const colors = getCategoryColors(options.category);
  const seed = hashString(options.title);

  // Truncate title for display
  const displayTitle =
    options.title.length > 60 ? `${options.title.substring(0, 60)}...` : options.title;

  // Escape special characters for SVG
  const safeTitle = escapeXml(displayTitle);
  const safeSource = escapeXml(options.source);
  const safeCategory = escapeXml(options.category.toUpperCase());

  const svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${colors.primary};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
      <pattern id="pattern-${seed}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/>
      </pattern>
    </defs>

    <!-- Background gradient -->
    <rect width="400" height="200" fill="url(#grad-${seed})"/>

    <!-- Pattern overlay -->
    <rect width="400" height="200" fill="url(#pattern-${seed})"/>

    <!-- Category badge -->
    <rect x="20" y="20" width="auto" height="24" fill="rgba(255,255,255,0.25)" rx="12"/>
    <text x="30" y="36" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="1">${safeCategory}</text>

    <!-- Icon based on category -->
    <g transform="translate(340, 25)">
      ${getCategoryIconSVG(options.category)}
    </g>

    <!-- Title with better typography -->
    <text x="20" y="80" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="700" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3)">
      ${wrapText(safeTitle, 35)
        .map((line, i) => `<tspan x="20" dy="${i === 0 ? 0 : 22}">${line}</tspan>`)
        .join("")}
    </text>

    <!-- Source -->
    <text x="20" y="175" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="13" font-weight="600">${safeSource}</text>

    <!-- Decorative element -->
    <circle cx="380" cy="180" r="15" fill="rgba(255,255,255,0.15)"/>
    <circle cx="380" cy="180" r="10" fill="rgba(255,255,255,0.1)"/>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Get category-specific icon as SVG path
 */
function getCategoryIconSVG(category: string): string {
  const icons: Record<string, string> = {
    breaking: '<path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" fill="white" opacity="0.9"/>',
    trending:
      '<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="white" opacity="0.9"/>',
    update:
      '<circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2" opacity="0.9"/><path d="M12 6v6l4 2" stroke="white" stroke-width="2" fill="none" opacity="0.9"/>',
    insight:
      '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" opacity="0.9"/>',
  };

  return `<svg width="30" height="30" viewBox="0 0 24 24">${icons[category] || icons.update}</svg>`;
}

/**
 * Wrap text to fit within width
 */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length <= maxChars) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= 2) break; // Max 3 lines
    }
  }

  if (currentLine && lines.length < 3) lines.push(currentLine);
  return lines.slice(0, 3);
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "'");
}

/**
 * Get category-specific color schemes
 */
function getCategoryColors(category: string): { primary: string; secondary: string } {
  const colorSchemes = {
    breaking: { primary: "#EF4444", secondary: "#DC2626" }, // Red
    trending: { primary: "#F59E0B", secondary: "#D97706" }, // Orange
    update: { primary: "#3B82F6", secondary: "#2563EB" }, // Blue
    insight: { primary: "#8B5CF6", secondary: "#7C3AED" }, // Purple
  };

  return colorSchemes[category as keyof typeof colorSchemes] || colorSchemes.update;
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get multiple thumbnail options for testing
 */
export function getThumbnailOptions(options: ThumbnailOptions) {
  return {
    picsum: getPicsumImage(options.title),
    unsplash: getUnsplashImagePlaceholder(options.title, options.tags),
    category: getCategoryImage(options.category, options.title),
    gradient: getGradientPlaceholder(options.category, options.source),
  };
}
