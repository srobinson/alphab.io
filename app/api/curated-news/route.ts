import { checkRateLimit } from "@/lib/rate-limit";
import { decodeHtmlEntities } from "@/lib/utils/html-entities";
import { createClient } from "@supabase/supabase-js";
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
	updated_at?: string | null;
	tags: string[] | null;
	image_url: string | null;
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

// Use cached image_url from database only - no generation at API level
function getArticleImage(
	article: ArticleRecord,
	hideImages: boolean = true,
): string {
	// If images are hidden, return empty string
	if (hideImages) {
		return "";
	}

	// Return cached image if available, otherwise return a placeholder
	// Thumbnails should only be generated during sync/backfill operations
	if (article.image_url && article.image_url.trim().length > 0) {
		return article.image_url;
	}

	// Default placeholder for articles without images
	// This should rarely happen if sync/backfill is working correctly
	return "/images/ai-head-design.webp";
}

export async function GET(request: Request) {
	console.log("🚀 CURATED NEWS API CALLED - " + new Date().toISOString());

	// Parse query parameters for pagination
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const limit = parseInt(searchParams.get("limit") || "12", 10);
	const sortBy = parseInt(searchParams.get("sortBy") || "updated_at");
	const hideImages = searchParams.get("hideImages") === "true";
	const offset = (page - 1) * limit;

	try {
		console.log(
			`📊 Request params: page=${page}, limit=${limit}, offset=${offset}, sortBy=${sortBy}`,
		);

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

		// Query directly from articles table
		console.log("Fetching articles from database");

		const {
			data: articles,
			error: articlesError,
			count: articlesCount,
		} = await supabase
			.from<ArticleRecord>("articles")
			.select(
				"id, title, url, source, summary, published_at, tags, image_url, created_at, updated_at",
				{ count: "exact" },
			)
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (articlesError) {
			throw articlesError;
		}

		const totalCount = articlesCount || 0;
		let items: CuratedNewsItem[] = [];

		if (articles && articles.length > 0) {
			console.log(`Processing ${articles.length} articles from database`);

			// Simple categorization based on recency and keywords
			items = articles.map((article) => {
				const publishedDate = article.published_at || article.created_at;
				const hoursOld = publishedDate
					? (Date.now() - new Date(publishedDate).getTime()) / (1000 * 60 * 60)
					: 999;
				const title = article.title.toLowerCase();

				let category = "update";
				let trending = false;

				// Simple keyword-based categorization
				if (
					hoursOld < 6 &&
					(title.includes("announces") ||
						title.includes("launches") ||
						title.includes("releases") ||
						title.includes("breaking"))
				) {
					category = "breaking";
					trending = true;
				} else if (
					title.includes("trend") ||
					title.includes("popular") ||
					title.includes("surge") ||
					hoursOld < 12
				) {
					category = "trending";
					trending = hoursOld < 24;
				} else if (
					title.includes("analysis") ||
					title.includes("insight") ||
					title.includes("opinion") ||
					title.includes("understanding")
				) {
					category = "insight";
				}

				return {
					id: article.id,
					category,
					text: decodeHtmlEntities(article.title),
					description: decodeHtmlEntities(
						article.summary || `Latest from ${article.source}`,
					),
					time: formatTimeAgo(article.published_at),
					source: article.source,
					link: article.url,
					image: getArticleImage(article, hideImages),
					isRSS: true,
					trending,
				};
			});
		}

		// If no real data available, use fallback
		if (items.length === 0) {
			console.log("No articles found, using fallback data");

			const fallbackImage = hideImages ? "" : "/images/ai-head-design.webp";

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
					image: fallbackImage,
					isRSS: false,
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
					image: fallbackImage,
					isRSS: false,
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
				source: "articles", // Direct from articles table
				timestamp: new Date().toISOString(),
			},
			{
				headers,
			},
		);
	} catch (error) {
		console.error("Error fetching curated news:", error);

		// Return fallback data on error
		const errorImage = hideImages ? "" : "/images/ai-head-design.webp";

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
						image: errorImage,
						isRSS: false,
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
