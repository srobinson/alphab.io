import { Suspense } from "react";
import { Gradient1 } from "@/components";
import { getBlogIndex } from "@/lib/blog";
import { BlogCTA } from "./_components/blog-cta";
import { BlogHero } from "./_components/blog-hero";
import { BlogPostCard } from "./_components/blog-post-card";
// Animation variants for letter pulse effects (used in BlogHero component)

export const revalidate = 300; // 5 minutes

export default async function BlogPage() {
  const { posts = [] } = await getBlogIndex();

  const featuredPosts = posts
    .filter((post) => post.category === "Reality Check" || post.generated)
    .slice(0, 2);
  const featuredSlugs = featuredPosts.map((post) => post.slug);
  const recentPosts = posts.filter((post) => !featuredSlugs.includes(post.slug));
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AlphaB AI Tech Blog",
    description:
      "Daily insights into cutting-edge AI technologies, research papers, and emerging tech trends",
    url: "https://alphab.io/blog",
    author: {
      "@type": "Person",
      name: "RADE AI Solutions",
      url: "https://alphab.io",
    },
    publisher: {
      "@type": "Organization",
      name: "AlphaB",
      url: "https://alphab.io",
    },
    blogPost: posts.map((post) => ({
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
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <div className="min-h-screen bg-background">
        <Gradient1 />
        {/* Hero Section */}
        <Suspense
          fallback={
            <div className="py-16 bg-background border-b border-cyber-border">
              <div className="container mx-auto px-6 max-w-6xl text-center">
                <div className="animate-pulse space-y-6">
                  <div className="h-16 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          }
        >
          <BlogHero />
        </Suspense>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="container mx-auto px-6 pb-16 pt-10 max-w-6xl">
            <h2 className="text-3xl font-black text-foreground mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {featuredPosts.map((post, index) => (
                <Suspense
                  key={post.slug}
                  fallback={
                    <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-cyber-border animate-pulse">
                      <div className="space-y-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </div>
                    </div>
                  }
                >
                  <BlogPostCard post={post} index={index} />
                </Suspense>
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="container mx-auto px-6 pb-16 max-w-6xl">
            <h2 className="text-3xl font-black text-foreground mb-8">Recent Posts</h2>
            <div className="grid gap-6">
              {recentPosts.map((post, index) => (
                <Suspense
                  key={post.slug}
                  fallback={
                    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-cyber-border animate-pulse">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-6 bg-muted rounded w-2/3"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                  }
                >
                  <BlogPostCard post={post} index={index} variant="recent" />
                </Suspense>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <Suspense
          fallback={
            <div className="container mx-auto px-6 py-16 text-center max-w-4xl">
              <div className="animate-pulse space-y-6">
                <div className="h-10 bg-muted rounded w-1/2 mx-auto"></div>
                <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
                <div className="h-12 bg-muted rounded w-40 mx-auto"></div>
              </div>
            </div>
          }
        >
          <BlogCTA />
        </Suspense>
      </div>
    </>
  );
}
