import { SimpleThumbnailService } from "@/lib/content/simple-thumbnails";
import { checkRateLimit } from "@/lib/rate-limit";
import { searchUnsplashImages } from "@/lib/unsplash";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Enable edge caching - cache responses for 5 minutes
export const revalidate = 300; // 5 minutes
export const runtime = "nodejs"; // Ensure we can use all Node.js features
export const dynamic = "force-dynamic"; // Required for rate limiting

// Helper function to format time ago
function formatTimeAgo(dateString: string | null): string {
	if (!dateString) return "Recently";

	const now = new Date();
	const date = new Date(dateString);
	const diffInHours = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60 * 60),
	);

	if (diffInHours < 1) return "Less than an hour ago";
	if (diffInHours === 1) return "1 hour ago";
	if (diffInHours < 24) return `${diffInHours} hours ago`;

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays === 1) return "1 day ago";
	if (diffInDays < 7) return `${diffInDays} days ago`;

	return date.toLocaleDateString();
}

type ArticleRecord = {
	id: string;
	title: string;
	url: string;
	source: string;
	summary: string | null;
	published_at: string | null;
	created_at?: string | null;
	tags: string[] | null;
	image_url: string | null;
};

type IndustryMoveCacheRow = {
	id: string;
	category: string;
	is_trending: boolean | null;
	is_breaking: boolean | null;
	priority_score: number | null;
	display_order: number | null;
	articles: ArticleRecord;
};

type CuratedNewsItem = {
	id: string;
	category: string;
	text: string;
	description: string;
	time: string;
	source: string;
	link: string;
	image: string;
	isRSS: boolean;
	trending: boolean;
};

// Helper function to generate dynamic thumbnail
async function generateThumbnail(
	article: ArticleRecord,
	category: string,
	supabase: SupabaseClient,
): Promise<string> {
	// 1. Check if article already has a cached image_url
	if (article.image_url && article.image_url.trim().length > 0) {
		console.log(
			`📦 Cache HIT: using cached image for article "${article.title}"`,
		);
		return article.image_url;
	}

	console.log(`🔄 Cache MISS: generating image for article "${article.title}"`);

	// 2. Generate thumbnail URL using SimpleThumbnailService
	const thumbnailUrl = SimpleThumbnailService.getBestThumbnail({
		title: article.title,
		source: article.source,
		category: category,
		tags: article.tags || [],
		url: article.url,
		imageUrl: article.image_url || undefined,
	});

	console.log(
		`🎨 Generated thumbnail URL for "${article.title}": ${thumbnailUrl}`,
	);

	// 3. If it's an Unsplash query, resolve it to an actual image
	let finalImageUrl = thumbnailUrl;
	if (thumbnailUrl.startsWith("unsplash:")) {
		const query = thumbnailUrl.replace("unsplash:", "");
		const unsplashImage = await searchUnsplashImages(query, 1);
		if (unsplashImage) {
			finalImageUrl = unsplashImage;
		} else {
			// Fallback to Picsum if Unsplash fails
			finalImageUrl = SimpleThumbnailService.getPicsumImage(article.title);
		}
	}

	// 4. Cache the image URL in the database for future requests
	if (article.id && (!article.image_url || article.image_url !== finalImageUrl)) {
		try {
			await supabase
				.from("articles")
				.update({ image_url: finalImageUrl })
				.eq("id", article.id);
			console.log(`💾 Cached image URL for article "${article.title}"`);
		} catch (error) {
			console.error(
				`Failed to cache image URL for article ${article.id}:`,
				error,
			);
		}
	}

	return finalImageUrl;
}

export async function GET(request: Request) {
	console.log("🚀 CURATED NEWS API CALLED - " + new Date().toISOString());
	try {
		// Parse query parameters for pagination
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "12", 10);
		const offset = (page - 1) * limit;

		console.log(`📊 Request params: page=${page}, limit=${limit}, offset=${offset}`);

		// Rate limiting - 60 requests per minute per IP
		const rateLimitCheck = checkRateLimit(request, {
			limit: 60,
			windowMs: 60 * 1000,
		});

		// Add cache headers for CDN/browser caching
		const headers = {
			"Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
			"CDN-Cache-Control": "public, s-maxage=300",
			"Vercel-CDN-Cache-Control": "public, s-maxage=300",
			...rateLimitCheck.headers,
		};

		// Check if rate limit exceeded
		if (!rateLimitCheck.allowed) {
			console.warn("Rate limit exceeded for curated-news API");
			return NextResponse.json(
				{
					error: "Rate limit exceeded. Please try again later.",
					retryAfter: rateLimitCheck.headers["Retry-After"],
				},
				{
					status: 429,
					headers: {
						...headers,
						"Retry-After": rateLimitCheck.headers["Retry-After"],
					},
				},
			);
		}

		// Initialize Supabase client
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseAnonKey) {
			console.error("Missing Supabase configuration");
			throw new Error("Database configuration error");
		}

		const supabase = createClient(supabaseUrl, supabaseAnonKey);

		// Try to get data from industry moves cache first
		const {
			data: cachedData,
			error: cacheError,
			count: cachedCount,
		} = await supabase
			.from<IndustryMoveCacheRow>("industry_moves_cache")
			.select(
				`
        id,
        category,
        is_trending,
        is_breaking,
        priority_score,
        display_order,
        articles (
          id, title, url, source, summary, published_at, tags, image_url
        )
      `,
				{ count: "exact" },
			)
			.not("articles", "is", null)
			.gte("expires_at", new Date().toISOString())
			.order("display_order", { ascending: true })
			.range(offset, offset + limit - 1);

		if (cacheError) {
			console.warn("Failed to fetch cached industry moves:", cacheError);
		}

		let items: CuratedNewsItem[] = [];
		let totalCount = 0;

		if (cachedData && cachedData.length > 0) {
			// Use cached data
			console.log(
				`Using cached industry moves data (${cachedData.length} items)`,
			);
			totalCount = cachedCount || 0;

			// Process items with async thumbnail generation
			items = await Promise.all(
				cachedData.map(async (item) => ({
					id: item.articles.id,
					category: item.category,
					text: item.articles.title,
					description:
						item.articles.summary || `Latest from ${item.articles.source}`,
					time: formatTimeAgo(item.articles.published_at),
					source: item.articles.source,
					link: item.articles.url,
					image: await generateThumbnail(
						item.articles,
						item.category,
						supabase,
					),
					isRSS: true,
					trending: Boolean(item.is_trending) || item.category === "trending",
				})),
			);
		} else {
			// Fallback to direct articles query
			console.log("No cached data found, fetching from articles table");

			const {
				data: articles,
				error: articlesError,
				count: articlesCount,
			} = await supabase
				.from<ArticleRecord>("articles")
				.select(
					"id, title, url, source, summary, published_at, tags, image_url",
					{ count: "exact" },
				)
				.eq("status", "published")
				.order("published_at", { ascending: false })
				.range(offset, offset + limit - 1);

			if (articlesError) {
				throw articlesError;
			}

			totalCount = articlesCount || 0;

			if (articles && articles.length > 0) {
				// Simple categorization based on recency and keywords
				items = await Promise.all(
					articles.map(async (article) => {
						const hoursOld =
							(Date.now() -
								new Date(
									article.published_at || article.created_at,
								).getTime()) /
							(1000 * 60 * 60);
						const title = article.title.toLowerCase();

						let category = "update";
						let trending = false;

						// Simple keyword-based categorization
						if (
							hoursOld < 6 &&
							(title.includes("announces") ||
								title.includes("launches") ||
								title.includes("releases"))
						) {
							category = "breaking";
							trending = true;
						} else if (
							title.includes("trend") ||
							title.includes("popular") ||
							title.includes("surge")
						) {
							category = "trending";
							trending = true;
						} else if (
							title.includes("analysis") ||
							title.includes("insight") ||
							title.includes("opinion")
						) {
							category = "insight";
						}

						return {
							id: article.id,
							category,
							text: article.title,
							description: article.summary || `Latest from ${article.source}`,
							time: formatTimeAgo(article.published_at),
							source: article.source,
							link: article.url,
							image: await generateThumbnail(
								article,
								category,
								supabase,
							),
							isRSS: true,
							trending,
						};
					}),
				);
			}
		}

		// If no real data available, use fallback
		if (items.length === 0) {
			console.log("No articles found, using fallback data");

			items = [
				{
					id: "fallback-1",
					category: "update",
					text: "AI Industry Updates Available Soon",
					description:
						"Real-time industry updates will appear here once content sync is configured",
					time: "Recently",
					source: "System",
					link: "#",
					image: SimpleThumbnailService.getBestThumbnail({
						title: "AI Industry Updates Available Soon",
						source: "System",
						category: "update",
						tags: ["ai", "system"],
					}),
					trending: false,
				},
				{
					id: "fallback-2",
					category: "insight",
					text: "Content Automation System Ready",
					description:
						"The automated content pipeline is ready to fetch and display the latest AI industry news",
					time: "System Status",
					source: "RADE",
					link: "#",
					image: SimpleThumbnailService.getBestThumbnail({
						title: "Content Automation System Ready",
						source: "RADE",
						category: "insight",
						tags: ["automation", "ready"],
					}),
					trending: false,
				},
			];
		}

		console.log(
			`Returning ${items.length} industry moves items (page ${page}, total: ${totalCount})`,
		);

		return NextResponse.json(
			{
				items,
				pagination: {
					page,
					limit,
					total: totalCount,
					hasMore: offset + items.length < totalCount,
				},
				cached: cachedData && cachedData.length > 0,
				timestamp: new Date().toISOString(),
			},
			{
				headers,
			},
		);
	} catch (error) {
		console.error("Error fetching curated news:", error);

		// Return fallback data on error
		return NextResponse.json(
			{
				items: [
					{
						id: "error-fallback",
						category: "update",
						text: "Content System Initializing",
						description:
							"The content automation system is being set up. Real industry updates coming soon.",
						time: "System Status",
						source: "RADE",
						link: "#",
						image: SimpleThumbnailService.getBestThumbnail({
							title: "Content System Initializing",
							source: "RADE",
							category: "update",
							tags: ["system", "initializing"],
						}),
						trending: false,
					},
				],
				pagination: {
					page: 1,
					limit: 12,
					total: 1,
					hasMore: false,
				},
				error: true,
				message: "Using fallback data due to system initialization",
				timestamp: new Date().toISOString(),
			},
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=120", // Shorter cache for errors
				},
			},
		);
	}
}
