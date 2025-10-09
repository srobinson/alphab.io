import { getBlogIndex } from "@/lib/blog";
import { BlogCTA } from "./_components/blog-cta";
import { BlogHero } from "./_components/blog-hero";
import { BlogPostCard } from "./_components/blog-post-card";

export const dynamic = "force-static";

// Animation variants for letter pulse effects (used in BlogHero component)

export default async function BlogPage() {
  const blogData = await getBlogIndex();

  // Handle empty state gracefully
  if (!blogData || !blogData.posts || blogData.posts.length === 0) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              blogPost: [],
            }),
          }}
        />
        <div className="min-h-screen blog-background">
          <div className="container mx-auto px-6 py-16 max-w-6xl text-center">
            <h1 className="text-4xl font-bold mb-4">No blog posts available yet</h1>
            <p className="text-muted-foreground">
              Check back soon for the latest insights on AI and technology trends.
            </p>
          </div>
        </div>
      </>
    );
  }

  const { posts = [] } = blogData;

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
      {/* <div className="min-h-screen bg-background"></div> */}
      <BlogHero />
      <div className="blog-background min-h-screen">
        {featuredPosts.length > 0 && (
          <section className="container mx-auto px-6 pb-0 pt-10 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {featuredPosts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="container mx-auto px-6 pb-16 max-w-6xl">
            <div className="grid gap-6">
              {recentPosts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} index={index} variant="recent" />
              ))}
            </div>
          </section>
        )}
      </div>
      {/* Newsletter CTA */}
      <BlogCTA />
    </>
  );
}
