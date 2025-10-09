// Reusable ingest helpers (server-only) - TypeScript
// Depends on fetch (Node 18+), and a Supabase client passed by caller (service role for writes)

import type { SupabaseClient } from "@supabase/supabase-js";
import { decodeHtmlEntities } from "../utils/html-entities";
import { summarizeInfo } from "./summarize";

// Strip common tracking params and normalize
export function normalizeUrl(input: string): string {
  try {
    const u = new URL(input);
    // remove tracking params
    const paramsToDrop = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "utm_id",
      "gclid",
      "fbclid",
      "mc_cid",
      "mc_eid",
    ];
    paramsToDrop.forEach((p) => {
      u.searchParams.delete(p);
    });
    // remove trailing slash if path not root
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.slice(0, -1);
    }
    u.hash = "";
    return u.toString();
  } catch {
    return input;
  }
}

// Naive HTML meta extraction (no external deps)
function extractBetween(html: string, re: RegExp): string | null {
  const m = re.exec(html);
  return m?.[1]?.trim() ?? null;
}

function extractContentHtml(html: string): string | null {
  // Prefer content inside <article> or <main>, fallback to first few <p> blocks
  const articleMatch = /<article[\s\S]*?>[\s\S]*?<\/article>/i.exec(html);
  if (articleMatch) {
    return articleMatch[0];
  }
  const mainMatch = /<main[\s\S]*?>[\s\S]*?<\/main>/i.exec(html);
  if (mainMatch) {
    return mainMatch[0];
  }
  // Collect first 5 paragraphs as a minimal excerpt
  const paragraphs: string[] = [];
  const pRegex = /<p[\s\S]*?>[\s\S]*?<\/p>/gi;
  let m: RegExpExecArray | null;
  do {
    m = pRegex.exec(html);
    if (m && paragraphs.length < 5) {
      paragraphs.push(m[0]);
    }
  } while (m !== null && paragraphs.length < 5);
  if (paragraphs.length) {
    return paragraphs.join("\n");
  }
  return null;
}

export type PageMeta = {
  title: string | null;
  description: string | null;
  publishedAt: Date | null;
  contentHtml?: string | null;
};

export async function fetchMetadata(url: string): Promise<PageMeta> {
  let html = "";
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "alphab-ingest/1.0" },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    html = await res.text();
  } catch (e: unknown) {
    console.warn("[ingest] fetchMetadata failed:", url, e);
    return { title: null, description: null, publishedAt: null, contentHtml: null };
  }

  const ogTitle = extractBetween(
    html,
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  const ogDesc = extractBetween(
    html,
    /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  const metaTitle = extractBetween(html, /<title[^>]*>([^<]+)<\/title>/i);
  const metaDesc = extractBetween(
    html,
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  const articlePublished = extractBetween(
    html,
    /<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );

  // Decode HTML entities from extracted metadata
  const title = decodeHtmlEntities(ogTitle || metaTitle || "");
  const description = decodeHtmlEntities(ogDesc || metaDesc || "");
  const publishedAt = articlePublished ? new Date(articlePublished) : null;
  const contentHtml = extractContentHtml(html);

  return {
    title: title || null,
    description: description || null,
    publishedAt,
    contentHtml,
  };
}

export type IngestInput = {
  url: string;
  source?: string;
  tags?: string[];
  doSummarize?: boolean;
  doSaveContent?: boolean;
  imageUrl?: string; // Add support for RSS extracted images
};

export type IngestResult = {
  id: string | null;
  upserted: boolean;
  reason?: string;
};

/**
 * Ingest a single URL into Supabase `articles` table.
 */
export async function ingestUrl(input: IngestInput, sb: SupabaseClient): Promise<IngestResult> {
  const rawUrl = input.url;
  if (!rawUrl) return { id: null, upserted: false, reason: "missing url" };

  const url = normalizeUrl(rawUrl);
  const source = input.source || new URL(url).hostname;

  // Check if already exists by URL
  const { data: existing, error: findErr } = await sb
    .from("articles")
    .select("id, tags, summary, source, content_html, published_at")
    .eq("url", url)
    .maybeSingle();
  if (findErr) {
    console.warn("[ingest] find existing error:", findErr);
  }
  const exists = Boolean(existing?.id);

  const meta = await fetchMetadata(url);
  // Basic quality gate
  if (!meta.title || meta.title.length < 5) {
    return { id: null, upserted: false, reason: "low_quality_title" };
  }

  let summary: string | null = null;
  let inferredTags: string[] = [];
  let inferredSourceLabel: string | undefined;
  if (input.doSummarize) {
    try {
      const info = await summarizeInfo({
        url,
        title: meta.title!,
        description: meta.description,
        contentHtml: meta.contentHtml ?? null,
      });
      summary = info.summary || null;
      inferredTags = Array.isArray(info.tags) ? info.tags : [];
      inferredSourceLabel = info.sourceLabel;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.warn("[ingest] summarizeInfo failed:", message);
    }
  }

  const finalTags =
    Array.isArray(input.tags) && input.tags.length
      ? input.tags
      : inferredTags.length
        ? inferredTags
        : (existing?.tags ?? []);
  const finalSource = input.source || inferredSourceLabel || existing?.source || source;
  const finalSummary = input.doSummarize
    ? (summary ?? existing?.summary ?? null)
    : (existing?.summary ?? null);
  const finalPublishedAt = meta.publishedAt
    ? new Date(meta.publishedAt).toISOString()
    : (existing?.published_at ?? null);
  const finalContentHtml =
    input.doSaveContent && meta.contentHtml ? meta.contentHtml : (existing?.content_html ?? null);

  const payload: {
    title: string | null;
    url: string;
    source: string | null;
    published_at: string | null;
    summary: string | null;
    tags: string[];
    status: "published";
    content_html?: string;
    image_url?: string;
  } = {
    title: meta.title,
    url,
    source: finalSource,
    published_at: finalPublishedAt,
    summary: finalSummary,
    tags: finalTags,
    status: "published" as const,
  };
  if (finalContentHtml) payload.content_html = finalContentHtml;

  // Add image URL if provided (from RSS feed)
  if (input.imageUrl) {
    payload.image_url = input.imageUrl;
  }

  const { data, error } = await sb
    .from("articles")
    .upsert(payload, { onConflict: "url" })
    .select("id")
    .single();

  if (error) {
    console.error("[ingest] upsert error:", error);
    return { id: null, upserted: false, reason: "db_error" };
  }

  return { id: data.id, upserted: true, reason: exists ? "updated" : "inserted" };
}
