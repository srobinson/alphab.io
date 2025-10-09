import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { cache } from "react";

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Type definitions for blog content metadata
export interface BlogPostMetadata {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  publishedAt?: string;
  readTime?: string;
  author?: string;
  tags?: string[];
  seo?: {
    keywords?: string[];
  };
  generated?: boolean;
}

export interface BlogPostJson {
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  publishedAt?: string;
  readTime?: string;
  author?: string;
  tags?: string[];
  seoKeywords?: string[];
  generated?: boolean;
  wordCount?: number;
}

export interface BlogIndexJson {
  posts?: BlogPostJson[];
  lastUpdated?: string | null;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  publishedAt?: string;
  readTime: string;
  author: string;
  tags: string[];
  seoKeywords: string[];
  generated: boolean;
  contentHtml: string;
  wordCount: number;
}

export interface BlogIndex {
  posts: BlogPost[];
  lastUpdated: string | null;
  totalPosts: number;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

/**
 * Fetches the blog index from the index.json file.
 * This function is cached using React's cache() wrapper for build-time deduplication.
 * Used by generateStaticParams() to pre-render all blog pages at build time.
 */
export const getBlogIndex = cache(async (): Promise<BlogIndex> => {
  try {
    const indexPath = path.join(CONTENT_DIR, "index.json");
    const rawIndex = await fs.readFile(indexPath, "utf8");
    const indexData = JSON.parse(rawIndex);

    if (!indexData.posts || !Array.isArray(indexData.posts)) {
      console.warn("Blog index missing posts array");
      return { posts: [], lastUpdated: null, totalPosts: 0 };
    }

    const posts: BlogPost[] = indexData.posts.map((post: BlogPostJson) => ({
      slug: post.slug || "",
      title: post.title || "",
      description: post.description || "",
      category: post.category || "AI Insights",
      date: post.date || new Date().toISOString(),
      publishedAt: post.publishedAt || post.date,
      readTime: post.readTime || "5 min read",
      author: post.author || "AlphaB",
      tags: Array.isArray(post.tags) ? post.tags : [],
      seoKeywords: Array.isArray(post.seoKeywords) ? post.seoKeywords : [],
      generated: Boolean(post.generated),
      contentHtml: "", // Not needed for index
      wordCount: post.wordCount || 0,
    }));

    return {
      posts,
      lastUpdated: indexData.lastUpdated || null,
      totalPosts: posts.length,
    };
  } catch (error) {
    console.error("Failed to load blog index:", error);
    return { posts: [], lastUpdated: null, totalPosts: 0 };
  }
});

/**
 * Fetches a single blog post by slug from MDX and meta.json files.
 * This function is cached using React's cache() wrapper for build-time deduplication.
 * Called during static generation to render blog detail pages.
 *
 * @param slug - The blog post slug (filename without extension)
 * @returns The blog post data with rendered HTML content, or null if not found
 */
export const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const metaPath = path.join(CONTENT_DIR, `${slug}.meta.json`);

  let rawMdx: string;
  try {
    rawMdx = await fs.readFile(mdxPath, "utf8");
  } catch {
    return null;
  }

  const parsed = matter(rawMdx);
  let metadata = {};

  if (typeof parsed.data === "object" && parsed.data !== null) {
    metadata = { ...metadata, ...parsed.data };
  }

  try {
    const rawMeta = await fs.readFile(metaPath, "utf8");
    const parsedMeta = JSON.parse(rawMeta);
    if (typeof parsedMeta === "object" && parsedMeta !== null) {
      metadata = { ...metadata, ...parsedMeta };
    }
  } catch {
    // Optional metadata file
  }

  const contentHtml = markdown.render(parsed.content);
  const wordCount = (parsed.content.match(/\w+/g) || []).length;
  const metadataTyped = metadata as BlogPostMetadata;

  const readTime = metadataTyped.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const tags = Array.isArray(metadataTyped.tags)
    ? metadataTyped.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  const seoKeywords = Array.isArray(metadataTyped.seo?.keywords)
    ? metadataTyped.seo.keywords.filter((keyword): keyword is string => typeof keyword === "string")
    : [];

  const author = typeof metadataTyped.author === "string" ? metadataTyped.author : "AlphaB";

  const category =
    typeof metadataTyped.category === "string" ? metadataTyped.category : "AI Insights";

  const title = typeof metadataTyped.title === "string" ? metadataTyped.title : slug;

  const description =
    typeof metadataTyped.description === "string" ? metadataTyped.description : "";

  const date =
    typeof metadataTyped.date === "string" ? metadataTyped.date : new Date().toISOString();

  const publishedAt =
    typeof metadataTyped.publishedAt === "string" ? metadataTyped.publishedAt : metadataTyped.date;

  return {
    slug,
    title,
    description,
    category,
    date,
    publishedAt: publishedAt || date,
    readTime,
    author,
    tags,
    seoKeywords,
    generated: Boolean(metadataTyped.generated),
    contentHtml,
    wordCount,
  };
});

/**
 * Returns all blog post slugs from the index.json file.
 * Used by generateStaticParams() in /src/app/blog/[slug]/page.tsx to determine
 * which blog pages to pre-render at build time.
 */
export const getAllBlogSlugs = cache(async (): Promise<string[]> => {
  try {
    const { posts } = await getBlogIndex();
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error("Failed to get blog slugs:", error);
    return [];
  }
});
