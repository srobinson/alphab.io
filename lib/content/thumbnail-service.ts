// Dynamic thumbnail generation service
export interface ThumbnailOptions {
	title: string;
	source: string;
	category: "breaking" | "trending" | "update" | "insight";
	tags?: string[];
	url?: string;
}

export class ThumbnailService {
	// OpenGraph/RSS image extraction patterns
	private static readonly OG_IMAGE_PATTERNS = [
		"og:image",
		"twitter:image",
		"article:image",
		"image",
	];

	// Category-based color schemes
	private static readonly CATEGORY_COLORS = {
		breaking: { bg: "#EF4444", accent: "#DC2626", text: "#FFFFFF" }, // Red
		trending: { bg: "#F59E0B", accent: "#D97706", text: "#FFFFFF" }, // Orange
		update: { bg: "#3B82F6", accent: "#2563EB", text: "#FFFFFF" }, // Blue
		insight: { bg: "#8B5CF6", accent: "#7C3AED", text: "#FFFFFF" }, // Purple
	};

	// Source-based brand colors
	private static readonly SOURCE_COLORS = {
		TechCrunch: { bg: "#0EA5E9", accent: "#0284C7" },
		"MIT Technology Review": { bg: "#DC2626", accent: "#B91C1C" },
		Wired: { bg: "#000000", accent: "#374151" },
		"The Verge": { bg: "#F59E0B", accent: "#D97706" },
		VentureBeat: { bg: "#1F2937", accent: "#111827" },
		"Ars Technica": { bg: "#059669", accent: "#047857" },
		"AI News": { bg: "#7C3AED", accent: "#6D28D9" },
		"Hacker News": { bg: "#FF6600", accent: "#E55A00" },
	};

	// Unsplash AI/Tech images collection
	private static readonly UNSPLASH_COLLECTION_ID = "1516642"; // AI/Technology collection
	private static readonly UNSPLASH_ACCESS_KEY = "your-unsplash-access-key"; // Optional

	/**
	 * Generate a thumbnail URL for an article
	 */
	static generateThumbnail(options: ThumbnailOptions): string {
		// 1. Try to extract image from RSS/OpenGraph
		const extractedImage = ThumbnailService.tryExtractImage(options.url);
		if (extractedImage) return extractedImage;

		// 2. Generate dynamic gradient thumbnail
		return ThumbnailService.generateGradientThumbnail(options);
	}

	/**
	 * Extract image from RSS content or URL
	 */
	private static tryExtractImage(url?: string): string | null {
		if (!url) return null;

		// This would typically be done server-side with URL fetching
		// For now, return null to use fallback generation
		return null;
	}

	/**
	 * Generate a dynamic gradient thumbnail with text overlay
	 */
	private static generateGradientThumbnail(options: ThumbnailOptions): string {
		const colors = ThumbnailService.getCategoryColors(options.category);
		const sourceColors = ThumbnailService.getSourceColors(options.source);

		// Use source colors if available, otherwise category colors
		const bgColor = sourceColors?.bg || colors.bg;
		const accentColor = sourceColors?.accent || colors.accent;

		// Create dynamic gradient based on content
		const gradient = ThumbnailService.createGradient(
			bgColor,
			accentColor,
			options.title,
		);

		// Return a data URL for the generated image
		return ThumbnailService.generateDataURL(gradient, options);
	}

	/**
	 * Get category-based colors
	 */
	private static getCategoryColors(category: ThumbnailOptions["category"]) {
		return ThumbnailService.CATEGORY_COLORS[category];
	}

	/**
	 * Get source-based brand colors
	 */
	private static getSourceColors(source: string) {
		return ThumbnailService.SOURCE_COLORS[
			source as keyof typeof this.SOURCE_COLORS
		];
	}

	/**
	 * Create gradient pattern based on title
	 */
	private static createGradient(
		bgColor: string,
		accentColor: string,
		title: string,
	): string {
		// Create deterministic gradient based on title hash
		const hash = ThumbnailService.hashString(title);
		const angle = hash % 360;

		return `linear-gradient(${angle}deg, ${bgColor}, ${accentColor})`;
	}

	/**
	 * Generate a simple hash from string for deterministic randomness
	 */
	private static hashString(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.abs(hash);
	}

	/**
	 * Generate data URL for the thumbnail
	 */
	private static generateDataURL(
		gradient: string,
		options: ThumbnailOptions,
	): string {
		// For production, this would generate an actual image
		// For now, return a CSS gradient as background
		return `data:image/svg+xml,${encodeURIComponent(ThumbnailService.generateSVG(gradient, options))}`;
	}

	/**
	 * Generate SVG thumbnail
	 */
	private static generateSVG(
		gradient: string,
		options: ThumbnailOptions,
	): string {
		const colors = ThumbnailService.getCategoryColors(options.category);
		const sourceColors = ThumbnailService.getSourceColors(options.source);
		const bgColor = sourceColors?.bg || colors.bg;
		const accentColor = sourceColors?.accent || colors.accent;

		// Create icon based on category
		const icon = ThumbnailService.getCategoryIcon(options.category);

		// Truncate title for display
		const displayTitle =
			options.title.length > 40
				? options.title.substring(0, 40) + "..."
				: options.title;

		return `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="400" height="200" fill="url(#bg)" />
        
        <!-- Pattern overlay -->
        <rect width="400" height="200" fill="url(#bg)" opacity="0.1" />
        
        <!-- Icon -->
        <g transform="translate(320, 30)">
          ${icon}
        </g>
        
        <!-- Category badge -->
        <rect x="20" y="20" width="80" height="24" fill="rgba(255,255,255,0.2)" rx="12"/>
        <text x="60" y="36" fill="white" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600">
          ${options.category.toUpperCase()}
        </text>
        
        <!-- Title -->
        <foreignObject x="20" y="60" width="280" height="80">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color: white; font-family: Inter, sans-serif; font-size: 16px; font-weight: 700; line-height: 1.2; word-wrap: break-word;">
            ${displayTitle}
          </div>
        </foreignObject>
        
        <!-- Source -->
        <text x="20" y="170" fill="rgba(255,255,255,0.8)" font-family="Inter, sans-serif" font-size="14" font-weight="500">
          ${options.source}
        </text>
      </svg>
    `;
	}

	/**
	 * Get category-specific icon SVG
	 */
	private static getCategoryIcon(
		category: ThumbnailOptions["category"],
	): string {
		const icons = {
			breaking: `<path d="M13 10V3L4 14h7v7l9-11h-7z" fill="white" stroke="white" stroke-width="2"/>`,
			trending: `<path d="M3 17l6-6 4 4 8-8" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
			update: `<path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98" fill="none" stroke="white" stroke-width="2"/>`,
			insight: `<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="white" stroke-width="2"/>`,
		};

		return `<svg width="40" height="40" viewBox="0 0 24 24">${icons[category]}</svg>`;
	}

	/**
	 * Get Unsplash image for tech/AI topics (optional)
	 */
	static getUnsplashImage(
		tags: string[] = [],
		width = 400,
		height = 200,
	): string {
		if (!ThumbnailService.UNSPLASH_ACCESS_KEY) {
			return ""; // Fallback to generated thumbnail
		}

		// Common AI/Tech keywords for Unsplash search
		const searchTerms = [
			"artificial-intelligence",
			"technology",
			"computer",
			"data",
			"digital",
		];
		const matchingTerms = tags.filter((tag) =>
			searchTerms.includes(tag.toLowerCase()),
		);
		const searchQuery =
			matchingTerms.length > 0 ? matchingTerms[0] : "technology";

		return `https://source.unsplash.com/collection/${ThumbnailService.UNSPLASH_COLLECTION_ID}/${width}x${height}/?${searchQuery}`;
	}

	/**
	 * Get placeholder image with better variety
	 */
	static getPlaceholderImage(options: ThumbnailOptions): string {
		// Use Picsum with deterministic seed based on title
		const seed = ThumbnailService.hashString(options.title);
		return `https://picsum.photos/seed/${seed}/400/200`;
	}

	/**
	 * Main method to get the best thumbnail
	 */
	static getBestThumbnail(options: ThumbnailOptions): string {
		// 1. Try RSS/OpenGraph image extraction
		const extractedImage = ThumbnailService.tryExtractImage(options.url);
		if (extractedImage) return extractedImage;

		// 2. Try Unsplash for high-quality images
		if (ThumbnailService.UNSPLASH_ACCESS_KEY && options.tags) {
			const unsplashImage = ThumbnailService.getUnsplashImage(options.tags);
			if (unsplashImage) return unsplashImage;
		}

		// 3. Use deterministic placeholder
		return ThumbnailService.getPlaceholderImage(options);
	}
}
