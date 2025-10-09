#!/usr/bin/env tsx

// Content automation management CLI
// Usage examples:
//   pnpm content sync - Run full content sync
//   pnpm content test - Test RSS sources
//   pnpm content status - Show system status
//   pnpm content cache - Update industry moves cache

import { RSSParser } from "../lib/content/rss-parser";
import { CONTENT_SOURCES, getActiveSourcesByPriority } from "../lib/content/sources";
import { ContentSyncService } from "../lib/content/sync-service";

type Command = "sync" | "test" | "status" | "cache" | "help";

async function runSync(
  options: { sources?: string[]; summarize?: boolean; disableImages?: boolean } = {}
) {
  console.log("🔄 Starting content sync...");

  try {
    const syncService = new ContentSyncService();

    const syncOptions = {
      enableSummarization: options.summarize !== false,
      saveContent: false,
      disableImages: options.disableImages || true,
      minRelevanceScore: 40,
      maxItemsPerSource: 12,
      updateIndustryMoves: true,
    };

    const results = await syncService.syncAllSources(syncOptions);

    // Display results
    console.log("\n📊 Sync Results:");
    console.log("=".repeat(50));

    let totalFetched = 0;
    let totalIngested = 0;
    let successCount = 0;

    for (const result of results) {
      const status = result.success ? "✅" : "❌";
      console.log(`${status} ${result.sourceName}`);
      console.log(`   Items: ${result.itemsFetched} fetched, ${result.itemsIngested} ingested`);
      console.log(`   Duration: ${result.duration}ms`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log("");

      totalFetched += result.itemsFetched;
      totalIngested += result.itemsIngested;
      if (result.success) successCount++;
    }

    console.log("📈 Summary:");
    console.log(`   Sources: ${successCount}/${results.length} successful`);
    console.log(`   Content: ${totalFetched} fetched, ${totalIngested} ingested`);
    console.log(`   Success Rate: ${Math.round((successCount / results.length) * 100)}%`);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

async function testSources() {
  console.log("🧪 Testing RSS sources...");

  const parser = new RSSParser();
  const sources = getActiveSourcesByPriority();

  console.log(`\nTesting ${sources.length} active sources:\n`);

  for (const source of sources) {
    process.stdout.write(`📡 ${source.name.padEnd(25)} `);

    try {
      const result = await parser.fetchFromSource(source);

      if (result.success && result.items.length > 0) {
        console.log(`✅ ${result.items.length} items (${result.duration}ms)`);
      } else if (result.success && result.items.length === 0) {
        console.log("⚠️  No items found");
      } else {
        console.log(`❌ ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  console.log("\n✨ Source testing completed!");
}

async function showStatus() {
  console.log("📊 System Status");
  console.log("=".repeat(30));

  try {
    const syncService = new ContentSyncService();

    // Test database connection
    const dbConnected = await syncService.testConnection();
    console.log(`Database: ${dbConnected ? "✅ Connected" : "❌ Failed"}`);

    // Get last sync time
    const lastSync = await syncService.getLastSyncTime();
    console.log(`Last Sync: ${lastSync ? lastSync.toLocaleString() : "Never"}`);

    // Show active sources
    const activeSources = getActiveSourcesByPriority();
    console.log(`Active Sources: ${activeSources.length}`);

    // Show all sources by status
    console.log("\nSource Configuration:");
    for (const source of CONTENT_SOURCES) {
      const status = source.isActive ? "✅" : "❌";
      const priority = source.priority.toUpperCase().padEnd(6);
      console.log(`  ${status} ${source.name.padEnd(25)} ${priority} ${source.category}`);
    }

    // Environment check
    console.log("\nEnvironment:");
    console.log(
      `  SUPABASE_SERVICE_ROLE_KEY: ${
        process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing"
      }`
    );
    console.log(
      `  OPENROUTER_API_KEY: ${process.env.OPENROUTER_API_KEY ? "✅ Set" : "⚠️  Optional"}`
    );
    console.log(`  CRON_SECRET: ${process.env.CRON_SECRET ? "✅ Set" : "❌ Missing"}`);
  } catch (error) {
    console.error("❌ Status check failed:", error);
  }
}

async function updateCache() {
  console.log("🗄️  Updating industry moves cache...");

  try {
    const syncService = new ContentSyncService();

    // This will trigger cache update as part of sync options
    await syncService.syncAllSources({
      updateIndustryMoves: true,
      maxItemsPerSource: 0, // Skip RSS fetching, just update cache
    });

    console.log("✅ Industry moves cache updated!");
  } catch (error) {
    console.error("❌ Cache update failed:", error);
  }
}

function showHelp() {
  console.log("🤖 Content Automation CLI");
  console.log("=".repeat(30));
  console.log("");
  console.log("Commands:");
  console.log("  sync     Run full content synchronization");
  console.log("  test     Test all RSS sources");
  console.log("  status   Show system status");
  console.log("  cache    Update industry moves cache");
  console.log("  help     Show this help message");
  console.log("");
  console.log("Sync Options:");
  console.log("  --disable-images    Disable image generation (no Unsplash)");
  console.log("  --no-images         Alias for --disable-images");
  console.log("");
  console.log("Examples:");
  console.log("  pnpm content sync");
  console.log("  pnpm content sync --disable-images");
  console.log("  pnpm content test");
  console.log("  pnpm content status");
  console.log("");
  console.log("Environment Variables:");
  console.log("  NEXT_PUBLIC_SUPABASE_URL");
  console.log("  SUPABASE_SERVICE_ROLE_KEY");
  console.log("  OPENROUTER_API_KEY (optional)");
  console.log("  CRON_SECRET");
}

async function main() {
  const args = process.argv.slice(2);
  const command = (args[0] || "help") as Command;

  console.log("");

  switch (command) {
    case "sync": {
      // Parse additional flags for sync command
      const disableImages = args.includes("--disable-images") || args.includes("--no-images");
      await runSync({ disableImages });
      break;
    }

    case "test":
      await testSources();
      break;

    case "status":
      await showStatus();
      break;

    case "cache":
      await updateCache();
      break;
    default:
      showHelp();
      break;
  }

  console.log("");
}

main().catch(console.error);
