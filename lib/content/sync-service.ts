// Content synchronization service
import { createClient } from "@supabase/supabase-js";
import { monitor } from "../monitoring";
import { ingestUrl } from "../server/ingest";
import { ContentClassifier } from "./classifier";
import { type FetchResult, type RSSItem, RSSParser } from "./rss-parser";
import { type ContentSource, getActiveSourcesByPriority } from "./sources";

export interface SyncResult {
	sourceId: string;
	sourceName: string;
	success: boolean;
	itemsFetched: number;
	itemsProcessed: number;
	itemsIngested: number;
	duration: number;
	error?: string;
}

export interface SyncOptions {
	maxItemsPerSource?: number;
	minRelevanceScore?: number;
	enableSummarization?: boolean;
	saveContent?: boolean;
	updateIndustryMoves?: boolean;
}

export class ContentSyncService {
	private rssParser: RSSParser;
	private classifier: ContentClassifier;
	private supabase: any;

	constructor() {
		this.rssParser = new RSSParser();
		this.classifier = new ContentClassifier();

		// Initialize Supabase client with service role key
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !supabaseServiceKey) {
			throw new Error("Missing Supabase configuration");
		}

		this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
			auth: { persistSession: false },
			global: { headers: { "X-Client-Info": "aplab-content-sync/1.0" } },
		});
	}

	async syncAllSources(options: SyncOptions = {}): Promise<SyncResult[]> {
		const sources = getActiveSourcesByPriority();
		const results: SyncResult[] = [];

		monitor.info(`Starting sync for ${sources.length} sources`, {
			source_count: sources.length,
			options,
		});

		// Fetch RSS feeds in parallel (but limit concurrency)
		const batchSize = 3;
		for (let i = 0; i < sources.length; i += batchSize) {
			const batch = sources.slice(i, i + batchSize);
			const batchResults = await Promise.allSettled(
				batch.map((source) => this.syncSource(source, options)),
			);

			batchResults.forEach((result, index) => {
				if (result.status === "fulfilled") {
					results.push(result.value);
				} else {
					results.push({
						sourceId: batch[index].id,
						sourceName: batch[index].name,
						success: false,
						itemsFetched: 0,
						itemsProcessed: 0,
						itemsIngested: 0,
						duration: 0,
						error: result.reason?.message || "Unknown error",
					});
				}
			});

			// Small delay between batches to be respectful
			if (i + batchSize < sources.length) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}

		// Update industry moves cache if requested
		if (options.updateIndustryMoves !== false) {
			await this.updateIndustryMovesCache();
		}

		// Log overall sync statistics
		const totalFetched = results.reduce((sum, r) => sum + r.itemsFetched, 0);
		const totalIngested = results.reduce((sum, r) => sum + r.itemsIngested, 0);
		const successCount = results.filter((r) => r.success).length;

		monitor.info("Sync batch completed", {
			total_sources: results.length,
			successful: successCount,
			failed: results.length - successCount,
			items_fetched: totalFetched,
			items_ingested: totalIngested,
		});

		return results;
	}

	private async syncSource(
		source: ContentSource,
		options: SyncOptions,
	): Promise<SyncResult> {
		const startTime = Date.now();

		try {
			monitor.debug(`Syncing source: ${source.name}`, {
				source_id: source.id,
				priority: source.priority,
			});

			// Fetch RSS feed
			const fetchResult: FetchResult =
				await this.rssParser.fetchFromSource(source);

			if (!fetchResult.success) {
				return {
					sourceId: source.id,
					sourceName: source.name,
					success: false,
					itemsFetched: 0,
					itemsProcessed: 0,
					itemsIngested: 0,
					duration: Date.now() - startTime,
					error: fetchResult.error,
				};
			}

			// Classify and filter content
			const relevantItems = await this.classifier.filterRelevant(
				fetchResult.items,
				options.minRelevanceScore || 40,
			);

			// Limit items per source
			const maxItems = options.maxItemsPerSource || source.maxItems || 10;
			const itemsToProcess = relevantItems.slice(0, maxItems);

			monitor.info(`Processing items from ${source.name}`, {
				source_id: source.id,
				total_items: fetchResult.items.length,
				relevant_items: itemsToProcess.length,
				filtered_out: fetchResult.items.length - itemsToProcess.length,
			});

			// Ingest items into database
			let ingestedCount = 0;
			for (const item of itemsToProcess) {
				try {
					const ingestResult = await ingestUrl(
						{
							url: item.link,
							source: item.source,
							tags: item.classification.tags,
							doSummarize: options.enableSummarization !== false,
							doSaveContent: options.saveContent || false,
						},
						this.supabase,
					);

					if (ingestResult.upserted) {
						ingestedCount++;
					}
				} catch (error) {
					monitor.warn(`Failed to ingest item from ${source.name}`, {
						title: item.title.substring(0, 100),
						error: error instanceof Error ? error.message : String(error),
					});
				}
			}

			return {
				sourceId: source.id,
				sourceName: source.name,
				success: true,
				itemsFetched: fetchResult.items.length,
				itemsProcessed: itemsToProcess.length,
				itemsIngested: ingestedCount,
				duration: Date.now() - startTime,
			};
		} catch (error) {
			monitor.error(`Error syncing source ${source.name}`, error, {
				source_id: source.id,
				duration_ms: Date.now() - startTime,
			});

			return {
				sourceId: source.id,
				sourceName: source.name,
				success: false,
				itemsFetched: 0,
				itemsProcessed: 0,
				itemsIngested: 0,
				duration: Date.now() - startTime,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	private async updateIndustryMovesCache(): Promise<void> {
		try {
			console.log("Updating industry moves cache...");

			// Get latest articles from database
			const { data: articles, error } = await this.supabase
				.from("articles")
				.select("*")
				.eq("status", "published")
				.order("published_at", { ascending: false })
				.limit(50);

			if (error) {
				throw error;
			}

			if (!articles || articles.length === 0) {
				console.log("No articles found for industry moves cache");
				return;
			}

			// Convert to RSSItem format for classification
			const rssItems: RSSItem[] = articles.map((article: any) => ({
				guid: article.id,
				title: article.title,
				link: article.url,
				pubDate: new Date(article.published_at || article.created_at),
				description: article.summary || "",
				source: article.source,
				sourceId: article.source.toLowerCase().replace(/\s+/g, "-"),
				category: "ai", // Default category
				priority: "medium",
				tags: article.tags || [],
			}));

			// Classify content
			const topContent = await this.classifier.getTopContent(rssItems, 20);
			const breakingNews = await this.classifier.getBreakingNews(rssItems, 5);
			const trendingContent = await this.classifier.getTrendingContent(
				rssItems,
				8,
			);

			// Clear existing cache
			await this.supabase
				.from("industry_moves_cache")
				.delete()
				.lt("expires_at", new Date().toISOString());

			// Insert new cache entries
			const cacheEntries = [];
			let displayOrder = 0;

			// Add breaking news first (highest priority)
			for (const item of breakingNews) {
				cacheEntries.push({
					article_id: item.guid,
					category: "breaking",
					is_trending: true,
					display_order: displayOrder++,
					cached_at: new Date().toISOString(),
					expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
				});
			}

			// Add trending content
			for (const item of trendingContent) {
				if (!breakingNews.find((b) => b.guid === item.guid)) {
					cacheEntries.push({
						article_id: item.guid,
						category: "trending",
						is_trending: true,
						display_order: displayOrder++,
						cached_at: new Date().toISOString(),
						expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
					});
				}
			}

			// Add other top content
			for (const item of topContent) {
				if (
					!breakingNews.find((b) => b.guid === item.guid) &&
					!trendingContent.find((t) => t.guid === item.guid) &&
					cacheEntries.length < 12
				) {
					cacheEntries.push({
						article_id: item.guid,
						category: item.classification.category,
						is_trending: false,
						display_order: displayOrder++,
						cached_at: new Date().toISOString(),
						expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
					});
				}
			}

			if (cacheEntries.length > 0) {
				const { error: insertError } = await this.supabase
					.from("industry_moves_cache")
					.insert(cacheEntries);

				if (insertError) {
					throw insertError;
				}

				console.log(
					`Updated industry moves cache with ${cacheEntries.length} items`,
				);
			}
		} catch (error) {
			console.error("Error updating industry moves cache:", error);
		}
	}

	async testConnection(): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("articles")
				.select("id")
				.limit(1);

			return !error;
		} catch {
			return false;
		}
	}

	async getLastSyncTime(): Promise<Date | null> {
		try {
			const { data, error } = await this.supabase
				.from("articles")
				.select("created_at")
				.order("created_at", { ascending: false })
				.limit(1)
				.single();

			if (error || !data) return null;

			return new Date(data.created_at);
		} catch {
			return null;
		}
	}
}
