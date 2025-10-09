#!/usr/bin/env tsx

/**
 * One-off utility to populate articles.image_url for existing rows.
 *
 * Usage:
 *   source .env.local && pnpm tsx scripts/backfill-article-images.ts [batchSize]
 *
 * The script mirrors the logic used by the curated-news API: it generates a
 * thumbnail (Unsplash first, deterministic Picsum fallback) and stores the
 * resolved URL back into Supabase. It processes records in batches until every
 * article missing an image_url has been populated.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import { SimpleThumbnailService } from "../lib/content/simple-thumbnails";
import { searchUnsplashImages } from "../lib/unsplash";

type ArticleRow = {
  id: string;
  title: string;
  url: string;
  source: string;
  tags: string[] | null;
  image_url: string | null;
  status: string | null;
  published_at: string | null;
  created_at: string | null;
};

const CATEGORY_BREAKING_KEYWORDS = ["announces", "launches", "releases"];
const CATEGORY_TRENDING_KEYWORDS = ["trend", "popular", "surge"];
const CATEGORY_INSIGHT_KEYWORDS = ["analysis", "insight", "opinion"];

const BATCH_SIZE = parseInt(process.argv[2] || "25", 10);

function loadEnvExports(file = ".env.local") {
  const envPath = resolve(process.cwd(), file);
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^export\s+([A-Z0-9_]+)=(.*)$/i) || line.match(/^([A-Z0-9_]+)=(.*)$/i);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (!key) continue;

    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvExports();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (hint: source .env.local)."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function determineCategory(article: ArticleRow): "breaking" | "trending" | "update" | "insight" {
  const title = (article.title || "").toLowerCase();
  const publishedAt = article.published_at || article.created_at;
  const now = Date.now();
  let hoursOld = Number.POSITIVE_INFINITY;
  if (publishedAt) {
    hoursOld = (now - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  }

  if (hoursOld < 6 && CATEGORY_BREAKING_KEYWORDS.some((keyword) => title.includes(keyword))) {
    return "breaking";
  }

  if (CATEGORY_TRENDING_KEYWORDS.some((keyword) => title.includes(keyword))) {
    return "trending";
  }

  if (CATEGORY_INSIGHT_KEYWORDS.some((keyword) => title.includes(keyword))) {
    return "insight";
  }

  return "update";
}

async function resolveImageUrl(article: ArticleRow): Promise<string> {
  const category = determineCategory(article);
  const baseThumbnail = SimpleThumbnailService.getBestThumbnail({
    title: article.title,
    source: article.source,
    category,
    tags: article.tags || [],
    url: article.url,
    imageUrl: article.image_url || undefined,
  });

  if (!baseThumbnail) {
    return SimpleThumbnailService.getPicsumImage(article.title);
  }

  if (!baseThumbnail.startsWith("unsplash:")) {
    return baseThumbnail;
  }

  const query = baseThumbnail.replace(/^unsplash:/, "");
  const unsplashImage = await searchUnsplashImages(query, 1);

  if (unsplashImage) {
    return unsplashImage;
  }

  return SimpleThumbnailService.getPicsumImage(article.title);
}

async function fetchNextBatch(): Promise<ArticleRow[]> {
  const { data, error } = await supabase
    .from<ArticleRow>("articles")
    .select("id,title,url,source,tags,image_url,status,published_at,created_at")
    .is("image_url", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(BATCH_SIZE);

  if (error) {
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }

  return data ?? [];
}

async function backfill(): Promise<void> {
  let processed = 0;
  let updated = 0;

  while (true) {
    const batch = await fetchNextBatch();
    if (batch.length === 0) {
      break;
    }

    console.log(`Processing ${batch.length} article(s) missing image_url...`);

    for (const article of batch) {
      processed += 1;

      try {
        const imageUrl = await resolveImageUrl(article);
        const { error: updateError } = await supabase
          .from("articles")
          .update({ image_url: imageUrl })
          .eq("id", article.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        updated += 1;
        console.log(
          ` ✔ Updated ${article.id} → ${imageUrl.slice(0, 80)}${imageUrl.length > 80 ? "…" : ""}`
        );
      } catch (error) {
        console.error(` ✖ Failed to update article ${article.id}:`, error);
      }
    }

    // Small delay to avoid hammering external APIs in tight loops.
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));

    if (batch.length < BATCH_SIZE) {
      break;
    }
  }

  console.log(
    `Backfill complete. Processed ${processed} article(s); successfully updated ${updated}.`
  );
}

backfill().catch((error) => {
  console.error("Unexpected failure during backfill:", error);
  process.exit(1);
});
