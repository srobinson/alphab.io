import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "@/components/ui/external-link";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

// Revalidate the page every 5 minutes
export const revalidate = 300;

async function getArticles() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?limit=50`,
      {
        next: { revalidate: 300 }, // 5 minutes
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    }

    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getArticles();

  // Calculate read time based on word count (200 words per minute)
  const calculateReadTime = (content: string | null) => {
    if (!content) return "2 min read";
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  // Get hostname from URL for fallback source display
  const getSourceName = (url: string, source?: string | null) => {
    if (source) return source;
    try {
      const { hostname } = new URL(url);
      return hostname.replace("www.", "");
    } catch {
      return "Source";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tech Insights
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Curated articles on AI, technology, and business insights
        </p>
      </div>

      <div className="space-y-8">
        {articles.length === 0
          ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground mt-2">
                Check back later for new content.
              </p>
            </div>
          )
          : (
            articles.map((article: any) => (
              <article
                key={article.id}
                className="group relative p-6 rounded-xl border hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                          : "Recent"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {calculateReadTime(article.content_html || "")}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      <Link
                        href={`/blog/${article.slug || article.id}`}
                        className="before:absolute before:inset-0"
                      >
                        {article.title}
                      </Link>
                    </h2>

                    {article.summary && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {article.summary}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags?.slice(0, 3).map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center md:items-start gap-3">
                    <div className="text-sm text-muted-foreground">
                      <ExternalLink href={article.url}>
                        {getSourceName(article.url, article.source)}
                      </ExternalLink>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
      </div>
    </div>
  );
}
