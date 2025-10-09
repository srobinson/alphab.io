#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const matter = require("gray-matter");

/**
 * Generate blog index by scanning all MDX files in content/blog/
 * Extracts metadata from frontmatter and .meta.json files
 * Generates complete index.json with all posts sorted by date
 */

const CONTENT_DIR = path.join(process.cwd(), "content/blog");
const INDEX_PATH = path.join(CONTENT_DIR, "index.json");
const PUBLIC_INDEX_PATH = path.join(process.cwd(), "public/content/blog/index.json");

async function generateBlogIndex() {
  console.log("🚀 Starting blog index generation...");

  try {
    // Read all files from content/blog directory
    const files = await fs.readdir(CONTENT_DIR);

    // Filter for .mdx files only
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log(`📂 Found ${mdxFiles.length} MDX files to process`);

    const posts = [];

    // Process each MDX file
    for (const file of mdxFiles) {
      try {
        const filePath = path.join(CONTENT_DIR, file);
        const slug = path.basename(file, ".mdx");

        console.log(`📄 Processing: ${slug}`);

        // Read and parse MDX content
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data: frontmatter, content } = matter(fileContent);

        // Try to read corresponding .meta.json file (optional)
        let metaData = {};
        const metaPath = path.join(CONTENT_DIR, `${slug}.meta.json`);

        try {
          const metaContent = await fs.readFile(metaPath, "utf-8");
          metaData = JSON.parse(metaContent);
        } catch (error) {
          if (error.code !== "ENOENT") {
            console.warn(`⚠️  Warning: Failed to read meta.json for ${slug}:`, error.message);
          }
          // Missing meta.json is not an error, just continue without it
        }

        // Merge metadata: frontmatter first, then meta.json overrides
        const mergedData = { ...frontmatter, ...metaData };

        // Calculate word count from content
        const wordCount = (content.match(/\w+/g) || []).length;

        // Calculate read time (200 wpm), prefer metadata if provided
        const computedMinutes = Math.max(1, Math.ceil(wordCount / 200));
        const readTime =
          typeof mergedData.readTime === "string" && mergedData.readTime.trim()
            ? mergedData.readTime
            : `${computedMinutes} min read`;

        // Handle tags/keywords arrays
        const rawTags = mergedData.tags ?? mergedData.seo?.keywords ?? [];
        const tags = Array.isArray(rawTags) ? rawTags.filter((t) => typeof t === "string") : [];
        const rawSeo = mergedData.seoKeywords ?? mergedData.seo?.keywords ?? [];
        const seoKeywords = Array.isArray(rawSeo)
          ? rawSeo.filter((k) => typeof k === "string")
          : [];

        // Normalize dates to ISO format
        const normalizeDate = (d) => (d ? new Date(d).toISOString() : null);
        const dateISO =
          normalizeDate(mergedData.date) ||
          normalizeDate(mergedData.publishedAt) ||
          new Date().toISOString();
        const publishedISO =
          normalizeDate(mergedData.publishedAt) || normalizeDate(mergedData.date) || dateISO;

        // Build post entry object
        const post = {
          slug,
          title: mergedData.title || "Untitled",
          description: mergedData.description || mergedData.excerpt || "",
          category: mergedData.category || "AI Insights",
          date: dateISO,
          publishedAt: publishedISO,
          readTime,
          tags,
          seoKeywords,
          generated: mergedData.generated || false,
          wordCount,
        };

        posts.push(post);
      } catch (error) {
        console.warn(`⚠️  Warning: Failed to process ${file}:`, error.message);
        // Continue processing other files
      }
    }

    // Sort posts by publishedAt/date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));

    // Create index object
    const index = {
      posts,
      lastUpdated: new Date().toISOString(),
      totalPosts: posts.length,
    };

    // Write index.json to content/blog/
    await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2));
    console.log(`✅ Generated ${INDEX_PATH} with ${posts.length} posts`);

    // Also write to public/content/blog/ for consistency with blog-publisher.js
    await fs.mkdir(path.dirname(PUBLIC_INDEX_PATH), { recursive: true });
    await fs.writeFile(PUBLIC_INDEX_PATH, JSON.stringify(index, null, 2));
    console.log(`✅ Generated ${PUBLIC_INDEX_PATH} with ${posts.length} posts`);

    console.log(`🎉 Blog index generation completed successfully! (${posts.length} posts)`);
  } catch (error) {
    console.error("❌ Error generating blog index:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateBlogIndex()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { generateBlogIndex };
