import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BLOG_INDEX_PATH = path.join(process.cwd(), "content/blog/index.json");

type IndexPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  publishedAt?: string;
};

const escapeXml = (value: string) =>
  String(value ?? "").replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });

async function loadPosts(): Promise<IndexPost[]> {
  try {
    const raw = await fs.readFile(BLOG_INDEX_PATH, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function GET() {
  try {
    const posts = await loadPosts();
    const baseUrl = "https://alphab.io";

    const items = posts
      .slice(0, 20)
      .map((post) => {
        const published = post.publishedAt || post.date;
        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(published).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <category>${escapeXml(post.category || "AI Insights")}</category>
    </item>`;
      })
      .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RADE AI Blog</title>
    <link>${baseUrl}/blog</link>
    <description>AI insights and analysis from RADE AI Solutions</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to build RSS feed:", error);
    return new NextResponse("Service unavailable", { status: 503 });
  }
}
