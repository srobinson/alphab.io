"use client";

import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { Intro, ProgressBar } from "@/components";
import { IndustryMoves } from "@/components/industry-moves";
import { BlogPostCard } from "../blog/_components/blog-post-card";
import { NewsFeedHero } from "./_components/news-feed-hero";
import { QuickUpdatesSidebar } from "./_components/quick-updates-sidebar";

// Blog post interface (matching existing blog structure)
interface BlogPost {
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

interface BlogIndex {
  posts: BlogPost[];
  lastUpdated: string | null;
  totalPosts: number;
}

// News item interface (matching curated news structure)
interface NewsItem {
  id: string;
  text: string;
  link?: string;
  category: "breaking" | "trending" | "update" | "insight";
  time: string;
  timestamp: string;
  source: string;
  isRSS?: boolean;
  image?: string;
  description?: string;
}

export default function NewsFeedPage() {
  const [blogData, setBlogData] = useState<BlogIndex | null>(null);
  const [blogError, setBlogError] = useState<Error | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch("/api/blog/index");
        if (!response.ok) {
          throw new Error(`Blog API responded with status: ${response.status}`);
        }
        const data = await response.json();
        setBlogData(data);
      } catch (error) {
        console.error("Failed to load blog data:", {
          error: error instanceof Error ? error.message : error,
          timestamp: new Date().toISOString(),
          endpoint: "/api/blog/index",
        });
        setBlogError(error as Error);
        setBlogData({ posts: [], lastUpdated: null, totalPosts: 0 });
      } finally {
        setIsLoadingBlog(false);
      }
    };

    fetchBlogData();
  }, []);

  // Fetch curated news data
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch("/api/curated-news?page=1&limit=20");
        if (!response.ok) {
          throw new Error(`Curated news API responded with status: ${response.status}`);
        }
        const data = await response.json();

        // Narrow data with Array.isArray check and default to empty array when invalid
        const items = Array.isArray(data.items) ? data.items : [];
        setNewsItems(items);
      } catch (error) {
        console.error("Failed to load news data:", {
          error: error instanceof Error ? error.message : error,
          timestamp: new Date().toISOString(),
          endpoint: "/api/curated-news",
          params: "page=1&limit=20",
        });
        setNewsItems([]);
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchNewsData();
  }, []);

  if (isLoadingBlog || isLoadingNews) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          <ProgressBar key="news-feed-loading-progress" />
        </div>
      </div>
    );
  }

  const { posts = [] } = blogData || {};

  // Filter featured posts (Reality Check category or generated posts)
  const featuredPosts = posts
    .filter((post) => post.category === "Reality Check" || post.generated)
    .slice(0, 1);

  const featuredSlugs = featuredPosts.map((post) => post.slug);
  const recentPosts = posts.filter((post) => !featuredSlugs.includes(post.slug));

  // Prepare structured data for SEO
  const itemListElement = [
    ...featuredPosts.slice(0, 1).map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: `https://alphab.io/blog/${post.slug}`,
        datePublished: post.publishedAt || post.date,
        author: {
          "@type": "Person",
          name: "AlphaB",
        },
        publisher: {
          "@type": "Organization",
          name: "AlphaB",
        },
      },
    })),
    ...newsItems.slice(0, 5).map((item, i) => ({
      "@type": "ListItem",
      position: featuredPosts.length + i + 1,
      item: {
        "@type": "NewsArticle",
        headline: item.text,
        description: item.description || `Latest ${item.category} from ${item.source}`,
        url: item.link || `https://alphab.io/news-feed#${item.id}`,
        datePublished: item.timestamp,
        author: {
          "@type": "Organization",
          name: item.source,
        },
        publisher: {
          "@type": "Organization",
          name: "AlphaB",
        },
      },
    })),
  ];

  const newsFeedStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI News Feed - Intelligence Hub",
    description:
      "Your unified AI intelligence hub combining real-time industry updates with in-depth analysis. Stay ahead with curated news, expert insights, and emerging AI trends.",
    url: "https://alphab.io/news-feed",
    mainEntity: {
      "@type": "ItemList",
      itemListElement,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsFeedStructuredData) }}
      />
      <Intro />

      <div className="max-w-9xl">
        <div className="min-h-screen bg-black text-white">
          {/* Hero Section with Ticker */}
          <Suspense
            fallback={
              <div className="bg-black border-b border-cyber-border">
                <div className="container mx-auto px-6 py-8 max-w-7xl">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
                    <div className="h-6 bg-gray-800 rounded w-full"></div>
                  </div>
                </div>
              </div>
            }
          >
            <NewsFeedHero newsItems={newsItems.slice(0, 15)} isLoading={isLoadingNews} />
          </Suspense>

          {/* Main Content Grid */}
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 2xl:grid-cols-[1fr_350px] gap-8">
              {/* Main Column */}
              <main className="space-y-12">
                {/* Featured Posts Section */}
                {blogData && blogData.posts.length > 0 && (
                  <section>
                    <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
                      {featuredPosts.map((post, index) => (
                        <motion.div
                          key={post.slug}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <BlogPostCard post={post} index={index} variant="featured" />
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Blog Error Message */}
                {blogError && (
                  <section>
                    <div className="cyber-card p-6 border-red-500/20 bg-red-500/5">
                      <p className="text-red-400 text-sm">
                        Unable to load featured analysis. Please try refreshing the page.
                      </p>
                    </div>
                  </section>
                )}

                {/* Recent Posts Section */}
                {blogData && blogData.posts.length > 0 && recentPosts.length > 0 && (
                  <section>
                    <div className="space-y-6">
                      {recentPosts.map((post, index) => (
                        <motion.div
                          key={post.slug}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <BlogPostCard post={post} index={index} variant="recent" />
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Industry Moves Section */}
                <motion.section
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Suspense
                    fallback={
                      <div className="cyber-card p-8 animate-pulse">
                        <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-800 rounded"></div>
                          ))}
                        </div>
                      </div>
                    }
                  >
                    <IndustryMoves />
                  </Suspense>
                </motion.section>
              </main>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <Suspense
                  fallback={
                    <div className="space-y-6">
                      <div className="cyber-card p-6 animate-pulse">
                        <div className="h-6 bg-gray-800 rounded w-1/2 mb-4"></div>
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-800 rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <QuickUpdatesSidebar
                    newsItems={newsItems.slice(0, 8)}
                    isLoading={isLoadingNews}
                  />
                </Suspense>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
