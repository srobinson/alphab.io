import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const BLOG_INDEX_PATH = path.join(process.cwd(), "content/blog/index.json");

export async function GET() {
  try {
    const raw = await fs.readFile(BLOG_INDEX_PATH, "utf8");
    const data = JSON.parse(raw);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "ENOENT") {
      return NextResponse.json({ posts: [], lastUpdated: null, totalPosts: 0 }, { status: 200 });
    }

    console.error("Failed to read blog index:", error);
    return NextResponse.json({ error: "Failed to load blog index" }, { status: 500 });
  }
}
