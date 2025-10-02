import { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";

const baseUrl = "https://alphab.io";
const BLOG_INDEX_PATH = path.join(process.cwd(), "content/blog/index.json");

type SitemapEntry = MetadataRoute.Sitemap[number];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const staticPages: SitemapEntry[] = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${baseUrl}/my-approach`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/services`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/industry-moves`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/pricing`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
];

async function loadBlogSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const raw = await fs.readFile(BLOG_INDEX_PATH, "utf8");
    const data = JSON.parse(raw) as unknown;

    if (!isObject(data) || !Array.isArray((data as { posts?: unknown }).posts)) {
      return [];
    }

    const posts = (data as { posts: unknown[] }).posts;

    return posts
      .map((post) => {
        if (!isObject(post) || typeof post.slug !== "string") {
          return null;
        }

        const publishedValue =
          typeof post.publishedAt === "string"
            ? post.publishedAt
            : typeof post.date === "string"
            ? post.date
            : undefined;

        const lastModified = publishedValue ? new Date(publishedValue) : new Date();

        return {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        } satisfies SitemapEntry;
      })
      .filter((entry): entry is SitemapEntry => entry !== null);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "ENOENT") {
      return [];
    }

    console.error("Failed to load blog index for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPages = await loadBlogSitemapEntries();
  return [...staticPages, ...blogPages];
}
