#!/usr/bin/env tsx

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Path constants
const ROOT = process.cwd();
const BLOG_INDEX_PATH = join(ROOT, "content/blog/index.json");
const NEXT_DIR = join(ROOT, ".next");
const PRERENDER_MANIFEST_PATH = join(NEXT_DIR, "prerender-manifest.json");
const BLOG_STATIC_PATHS_PATH = join(NEXT_DIR, "server/app/blog/[slug]/static-paths.json");
const BLOG_SERVER_DIR = join(NEXT_DIR, "server/app/blog/[slug]");

// Types
interface BlogIndexPost {
  readonly slug: string;
  readonly title: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly excerpt?: string;
  readonly tags?: readonly string[];
  readonly readTime?: number;
  readonly featured?: boolean;
}

interface BlogIndex {
  readonly posts: readonly BlogIndexPost[];
  readonly lastUpdated: string;
  readonly totalPosts: number;
}

interface PrerenderManifest {
  readonly version: number;
  readonly routes: Readonly<Record<string, unknown>>;
  readonly dynamicRoutes: Readonly<Record<string, unknown>>;
  readonly preview: {
    readonly previewModeId: string;
    readonly previewModeSigningKey: string;
    readonly previewModeEncryptionKey: string;
  };
  readonly notFoundRoutes: readonly string[];
  readonly fallbackRoutes: Readonly<Record<string, unknown>>;
}

interface ValidationResult {
  readonly verified: boolean;
  readonly source: string;
  readonly verifiedCount: number;
}

// Utility functions
function log(message: string, emoji: string = "") {
  console.log(`${emoji} ${message}`);
}

function loadStaticPathsForBlog(): readonly string[] | null {
  try {
    if (!existsSync(BLOG_STATIC_PATHS_PATH)) {
      log(`Static paths file not found at ${BLOG_STATIC_PATHS_PATH}`, "⚠️");
      return null;
    }

    const staticPathsContent = readFileSync(BLOG_STATIC_PATHS_PATH, "utf-8");
    const staticPathsData = JSON.parse(staticPathsContent);

    // Comment 2: Support multiple known static-paths.json shapes
    const slugs = normalizeStaticPathsToSlugs(staticPathsData);

    if (slugs === null) {
      log(
        `Warning: Unknown static-paths.json shape. Expected array of strings, objects with { slug }, or arrays like [slug]. ` +
          `Falling back to manifest-based verification.`,
        "⚠️"
      );
      return null;
    }

    log(`Loaded ${slugs.length} static paths from ${BLOG_STATIC_PATHS_PATH}`, "📋");
    return slugs;
  } catch (error) {
    log(
      `Failed to load static paths: ${error instanceof Error ? error.message : "Unknown error"}`,
      "❌"
    );
    return null;
  }
}

function normalizeStaticPathsToSlugs(data: unknown): readonly string[] | null {
  try {
    // Handle different possible shapes of static-paths.json

    // Shape 1: Array of strings, objects, or tuples (e.g., ["post1", "post2"], [["post-a"], ["post-b"]])
    if (Array.isArray(data)) {
      if (data.length === 0) return [];

      const slugs: string[] = [];
      let discardedCount = 0;

      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        // Handle string entries
        if (typeof item === "string") {
          slugs.push(item);
        }
        // Handle tuple-shaped entries like ["post-a"]
        else if (Array.isArray(item) && item.length > 0 && typeof item[0] === "string") {
          log(`Detected tuple-shaped entry at index ${i}, normalizing "${item[0]}"`, "🔄");
          slugs.push(item[0]);
        }
        // Handle objects with { slug } property
        else if (typeof item === "object" && item !== null && "slug" in item) {
          slugs.push((item as { slug: string }).slug);
        }
        // Invalid entry - log warning and skip
        else {
          log(
            `Discarding invalid entry at index ${i}: ${typeof item === "object" ? JSON.stringify(item) : String(item)}`,
            "⚠️"
          );
          discardedCount++;
        }
      }

      if (discardedCount > 0) {
        log(`Warning: Discarded ${discardedCount} invalid entries from static paths array`, "⚠️");
      }

      return slugs;
    }

    // Shape 2: Object with params array (current expected shape)
    if (typeof data === "object" && data !== null && "params" in data) {
      const params = (data as { params: Array<string | string[] | { slug: string }> }).params;
      if (Array.isArray(params)) {
        const slugs: string[] = [];
        let discardedCount = 0;

        for (let i = 0; i < params.length; i++) {
          const param = params[i];

          // Handle string entries
          if (typeof param === "string") {
            slugs.push(param);
          }
          // Handle tuple-shaped entries like ["post-a"]
          else if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
            log(`Detected tuple-shaped param at index ${i}, normalizing "${param[0]}"`, "🔄");
            slugs.push(param[0]);
          }
          // Handle objects with { slug } property
          else if (typeof param === "object" && param !== null && "slug" in param) {
            slugs.push((param as { slug: string }).slug);
          }
          // Invalid entry - log warning and skip
          else {
            log(
              `Discarding invalid param at index ${i}: ${typeof param === "object" ? JSON.stringify(param) : String(param)}`,
              "⚠️"
            );
            discardedCount++;
          }
        }

        if (discardedCount > 0) {
          log(`Warning: Discarded ${discardedCount} invalid params from static paths`, "⚠️");
        }

        return slugs;
      }
    }

    // Unknown shape
    return null;
  } catch (error) {
    log(
      `Error normalizing static paths data: ${error instanceof Error ? error.message : "Unknown error"}`,
      "⚠️"
    );
    return null;
  }
}

function loadBlogIndex(): readonly string[] {
  try {
    log("Loading blog index from content/blog/index.json", "📂");

    if (!existsSync(BLOG_INDEX_PATH)) {
      throw new Error("Blog index file not found. Run the pre-build script first.");
    }

    const indexContent = readFileSync(BLOG_INDEX_PATH, "utf-8");
    const blogIndex: BlogIndex = JSON.parse(indexContent);

    const slugs = blogIndex.posts.map((post) => post.slug);
    log(`Found ${slugs.length} blog posts in index`, "📋");

    return slugs;
  } catch (error) {
    log(
      `Failed to load blog index: ${error instanceof Error ? error.message : "Unknown error"}`,
      "❌"
    );
    throw error;
  }
}

function checkBuildArtifacts(): void {
  log("Checking build artifacts", "🔍");

  if (!existsSync(NEXT_DIR)) {
    throw new Error("Build artifacts not found. The build may have failed.");
  }

  if (!existsSync(PRERENDER_MANIFEST_PATH)) {
    log(
      "Warning: prerender-manifest.json not found. This may be normal for App Router projects.",
      "⚠️"
    );
  }

  // Comment 1: Check for per-slug artifacts and add clear messaging
  checkStaticHtmlFiles();

  log("Build artifacts verified", "✅");
}

function checkStaticHtmlFiles(): void {
  log("Checking for static HTML files under .next/server/app/blog/[slug]/", "🔍");

  if (!existsSync(BLOG_SERVER_DIR)) {
    log("Blog server directory not found - this may be normal for App Router", "⚠️");
    return;
  }

  // List contents of the blog server directory to see what's there
  const fs = require("node:fs");

  try {
    const entries = fs.readdirSync(BLOG_SERVER_DIR);

    log(`Found ${entries.length} entries in blog server directory:`, "📋");
    entries.forEach((entry: string) => {
      log(`  - ${entry}`, "  📄");
    });

    log(
      "Note: App Router typically does not emit per-slug .html files in .next/server/app/blog/[slug]/. " +
        "Static generation evidence should come from static-paths.json or prerender-manifest.json instead.",
      "ℹ️"
    );
  } catch (error) {
    log(
      `Could not read blog server directory: ${error instanceof Error ? error.message : "Unknown error"}`,
      "⚠️"
    );
  }
}

function loadPrerenderManifest(): PrerenderManifest | null {
  try {
    if (!existsSync(PRERENDER_MANIFEST_PATH)) {
      log("Prerender manifest not found - this may be normal for App Router", "⚠️");
      return null;
    }

    const manifestContent = readFileSync(PRERENDER_MANIFEST_PATH, "utf-8");
    return JSON.parse(manifestContent);
  } catch (error) {
    log(
      `Failed to load prerender manifest: ${error instanceof Error ? error.message : "Unknown error"}`,
      "⚠️"
    );
    return null;
  }
}

function validateBlogRoutes(
  expectedSlugs: readonly string[],
  manifest: PrerenderManifest | null
): ValidationResult {
  log("Validating blog routes", "🔍");

  // Dedupe expected slugs and warn if duplicates were removed
  const uniqueExpectedSlugs = Array.from(new Set(expectedSlugs));
  if (uniqueExpectedSlugs.length !== expectedSlugs.length) {
    log(
      `Warning: Removed ${expectedSlugs.length - uniqueExpectedSlugs.length} duplicate slugs from expected list`,
      "⚠️"
    );
  }

  // Step 1: Try static-paths.json first (Comment 1)
  const staticPathsSlugs = loadStaticPathsForBlog();

  if (staticPathsSlugs !== null) {
    log("Using static-paths.json for validation", "📋");

    // Compare sets with expectedSlugs
    const missingSlugs = uniqueExpectedSlugs.filter((slug) => !staticPathsSlugs.includes(slug));
    const extraSlugs = staticPathsSlugs.filter((slug) => !uniqueExpectedSlugs.includes(slug));

    if (missingSlugs.length > 0) {
      log(`Missing ${missingSlugs.length} blog posts from static-paths.json:`, "❌");
      missingSlugs.forEach((slug) => {
        log(`  - /blog/${slug}`, "  ❌");
      });
      throw new Error(`Missing ${missingSlugs.length} blog posts in static-paths.json`);
    }

    if (extraSlugs.length > 0) {
      log(`Found ${extraSlugs.length} extra blog routes in static-paths.json:`, "⚠️");
      extraSlugs.forEach((slug) => {
        log(`  - /blog/${slug}`, "  ⚠️");
      });
    }

    log(`Expected ${uniqueExpectedSlugs.length}, found ${staticPathsSlugs.length}`, "📊");
    return { verified: true, source: "static-paths.json", verifiedCount: staticPathsSlugs.length };
  }

  // Step 2: Fall back to prerender-manifest logic (Comments 2 & 5)
  if (!manifest) {
    if (uniqueExpectedSlugs.length > 0) {
      throw new Error(
        "Cannot verify static blog pages. Ensure `generateStaticParams()` is implemented for `/app/blog/[slug]` and `export const dynamicParams = false` to enable static path generation."
      );
    }
    return { verified: false, source: "heuristic", verifiedCount: 0 };
  }

  // Fix manifest filtering (Comment 2)
  const blogRoutes = Object.keys(manifest.routes).filter((route) => route.startsWith("/blog/"));

  log(`Found ${blogRoutes.length} blog-related routes in manifest`, "📋");

  if (blogRoutes.length === 0) {
    log("No blog routes found in prerender manifest", "⚠️");
    if (uniqueExpectedSlugs.length > 0) {
      throw new Error(
        "Cannot verify static blog pages. Ensure `generateStaticParams()` is implemented for `/app/blog/[slug]` and `export const dynamicParams = false` to enable static path generation."
      );
    }
    return { verified: false, source: "heuristic", verifiedCount: 0 };
  }

  // Comment 4: Extract slugs from routes, only accepting direct blog post paths
  const generatedSlugs = blogRoutes
    .map((route) => {
      // Use regex ^/blog/([^/]+) to only match direct blog post paths
      const match = route.match(/^\/blog\/([^/]+)$/);
      return match ? match[1] : null;
    })
    .filter((slug): slug is string => slug !== null)
    .filter((slug) => {
      // Exclude known non-post subroutes
      const nonPostSubroutes = ["opengraph-image", "twitter-image", "sitemap", "rss"];
      return !nonPostSubroutes.includes(slug);
    });

  // Compare expected vs actual (Comment 4)
  const missingSlugs = uniqueExpectedSlugs.filter((slug) => !generatedSlugs.includes(slug));
  const extraSlugs = generatedSlugs.filter((slug) => !uniqueExpectedSlugs.includes(slug));

  if (missingSlugs.length > 0) {
    log(`Missing ${missingSlugs.length} blog posts:`, "❌");
    missingSlugs.forEach((slug) => {
      log(`  - /blog/${slug}`, "  ❌");
    });
    throw new Error(`Missing ${missingSlugs.length} blog posts in build output`);
  }

  if (extraSlugs.length > 0) {
    log(`Found ${extraSlugs.length} unexpected blog routes:`, "⚠️");
    extraSlugs.forEach((slug) => {
      log(`  - /blog/${slug}`, "  ⚠️");
    });
  }

  log(`Expected ${uniqueExpectedSlugs.length}, found ${generatedSlugs.length}`, "📊");
  return {
    verified: true,
    source: "prerender-manifest.json",
    verifiedCount: generatedSlugs.length,
  };
}

// Main validation function
function validateBlogBuild(): void {
  try {
    log("Starting blog build validation", "🚀");

    // Step 1: Load expected blog slugs
    const expectedSlugs = loadBlogIndex();

    // Step 2: Check build artifacts exist
    checkBuildArtifacts();

    // Step 3: Load prerender manifest
    const manifest = loadPrerenderManifest();

    // Step 4: Validate routes (now returns detailed result)
    const validationResult = validateBlogRoutes(expectedSlugs, manifest);

    // Step 5: Handle results based on Comment 3
    if (validationResult.verified && validationResult.source !== "heuristic") {
      log("Blog build validation completed successfully!", "🎉");
      log(
        `✅ Verified ${validationResult.verifiedCount} blog posts were statically generated via ${validationResult.source}`,
        "✅"
      );
    } else if (expectedSlugs.length > 0) {
      // Comment 3: Default behavior exits with code 1 when verification is inconclusive
      const allowInconclusive = process.env.ALLOW_INCONCLUSIVE_BLOG_VALIDATION === "true";

      if (allowInconclusive) {
        log(
          "⚠️ Warning: Blog build validation could not be proven but continuing due to ALLOW_INCONCLUSIVE_BLOG_VALIDATION=true",
          "⚠️"
        );
        log(
          "Remove ALLOW_INCONCLUSIVE_BLOG_VALIDATION=true to fail builds when verification cannot be proven",
          "ℹ️"
        );
      } else {
        log("Blog build validation failed: verification could not be proven", "❌");
        log(
          "Set ALLOW_INCONCLUSIVE_BLOG_VALIDATION=true to allow builds when verification cannot be proven",
          "ℹ️"
        );
        process.exit(1);
      }
    } else {
      log("No blog posts to validate - empty index", "ℹ️");
    }
  } catch (error) {
    log(
      `Blog build validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      "❌"
    );
    process.exit(1);
  }
}

// Run validation if called directly
if (require.main === module) {
  validateBlogBuild();
}
