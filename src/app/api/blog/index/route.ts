import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getApiCacheHeaders, REVALIDATE_TIMES } from "@/lib/cache";

const BLOG_INDEX_PATH = path.join(process.cwd(), "content/blog/index.json");

interface BlogPost {
  slug: string;
  author: string;
  title: string;
  description: string;
  date: string;
  publishedAt?: string;
  category: string;
  tags: string[];
  seoKeywords: string[];
  wordCount: number;
  readTime?: string;
  generated?: boolean;
}

interface BlogIndexResponse {
  posts: BlogPost[];
  lastUpdated: string | null;
  totalPosts: number;
}

/**
 * GET /api/blog/index
 *
 * Returns the blog index with all posts and metadata.
 * Uses ISR with 5-minute revalidation for optimal performance.
 *
 * @returns Blog index data with posts array
 */
export async function GET(): Promise<NextResponse<BlogIndexResponse | { error: string }>> {
  try {
    const raw = await fs.readFile(BLOG_INDEX_PATH, "utf8");
    const data = JSON.parse(raw);

    // Validate the structure of the loaded data
    if (!data || typeof data !== "object") {
      throw new Error("Invalid blog index data structure");
    }

    if (!Array.isArray(data.posts)) {
      console.warn("Blog index missing posts array, using empty array");
      data.posts = [];
    }

    // Ensure all posts have required fields
    const validatedPosts = data.posts.map((post: BlogPost) => ({
      slug: post?.slug || "",
      title: post?.title || "",
      description: post?.description || "",
      category: post?.category || "AI Insights",
      date: post?.date || new Date().toISOString(),
      publishedAt: post?.publishedAt || post?.date,
      readTime: post?.readTime || "5 min read",
      author: post?.author || "AlphaB",
      tags: Array.isArray(post?.tags) ? post.tags : [],
      seoKeywords: Array.isArray(post?.seoKeywords) ? post.seoKeywords : [],
      generated: Boolean(post?.generated),
      contentHtml: "", // Not needed for index
      wordCount: post?.wordCount || 0,
    }));

    const responseData: BlogIndexResponse = {
      posts: validatedPosts,
      lastUpdated: data.lastUpdated || null,
      totalPosts: validatedPosts.length,
    };

    return NextResponse.json(responseData, {
      headers: getApiCacheHeaders(REVALIDATE_TIMES.API_BLOG, 900),
    });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    if (err?.code === "ENOENT") {
      // File doesn't exist yet, return empty data
      console.log("Blog index file not found, returning empty data");
      return NextResponse.json({ posts: [], lastUpdated: null, totalPosts: 0 }, { status: 200 });
    }

    if (err instanceof SyntaxError) {
      // JSON parsing error
      console.error("Invalid JSON in blog index file:", err.message);
      return NextResponse.json({ error: "Blog index file contains invalid JSON" }, { status: 500 });
    }

    // Other errors (permissions, disk space, etc.)
    console.error("Failed to read blog index:", {
      error: err.message,
      code: err.code,
      path: BLOG_INDEX_PATH,
    });

    return NextResponse.json(
      { error: "Failed to load blog index. Please try again later." },
      { status: 500 }
    );
  }
}
