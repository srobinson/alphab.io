import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const revalidate = 300; // 5 minutes
export const dynamic = "force-dynamic"; // Required for dynamic content

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const { data: articles, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching articles:", error);
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
