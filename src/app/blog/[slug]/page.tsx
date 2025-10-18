import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import { ShareButtons } from "./share-buttons";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const published = post.publishedAt || post.date;

  return {
    title: `${post.title} | AlphaB AI Blog`,
    description: post.description,
    keywords: post.seoKeywords.length > 0 ? post.seoKeywords : post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://alphab.io/blog/${post.slug}`,
      type: "article",
      publishedTime: published,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: `/images/blog/${post.slug}-og.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/images/blog/${post.slug}-twitter.jpg`],
    },
    alternates: {
      canonical: `https://alphab.io/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const published = post.publishedAt || post.date;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `https://alphab.io/images/blog/${post.slug}-og.jpg`,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://alphab.io",
    },
    publisher: {
      "@type": "Organization",
      name: "AlphaB",
      logo: {
        "@type": "ImageObject",
        url: "https://alphab.io/images/alphab-logo.svg",
      },
    },
    datePublished: published,
    dateModified: published,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://alphab.io/blog/${post.slug}`,
    },
    keywords: post.seoKeywords.length > 0 ? post.seoKeywords.join(", ") : post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.wordCount,
    timeRequired: post.readTime,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {/* Fix this to top nav before it disappears under the main nav */}

      <div className="fixed top-[64px] z-10 bg-black/99 shadow-2xl left-0 right-0 border-b border-gray-200 dark:border-gray-800">
        <nav className="px-6 py-4 mx-auto max-w-7xl">
          <Link
            href="/blog"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all hover:gap-3 gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>
        </nav>
      </div>
      <article className="relative blog-background top-[55px] min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Decorative gradient overlay */}

        {/* Article Container - Header + Content as one block */}
        <div className="relative mx-1 sm:container sm:mx-auto sm:px-6 sm:pb-12 sm:max-w-7xl">
          <div className="relative bg-whitedark:bg-black/50 shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xs overflow-hidden">
            {/* Header Section with gradient background */}
            <header className="relative bg-linear-to-br from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent p-8 md:p-12">
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/25">
                    {post.category}
                  </span>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {new Date(published).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {post.readTime}
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text">
                  {post.title}
                </h1>

                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-light">
                  {post.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-300/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Written by</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {post.author}
                      </div>
                    </div>
                  </div>

                  <ShareButtons
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                  />
                </div>
              </div>
            </header>

            {/* Article Content - seamlessly connected */}
            <main className="blog-content relative sm:p-2 ">
              <div
                className="prose prose-lg dark:prose-invert max-w-none
								prose-headings:font-bold prose-headings:tracking-tight
								prose-headings:text-gray-900 dark:prose-headings:text-white
								prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
								prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
								prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
								prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
								prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
								prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
								prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
								prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700 prose-pre:shadow-lg
								prose-ul:list-disc prose-ul:my-6
								prose-ol:list-decimal prose-ol:my-6
								prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-2 prose-li:leading-relaxed
								prose-li:marker:text-blue-500 dark:prose-li:marker:text-blue-400 prose-li:marker:font-bold
								prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </main>
          </div>
        </div>

        {/* Related Posts CTA */}
        <section className="relative container mx-auto px-6 py-16 max-w-4xl">
          <div className="relative bg-linear-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-700 dark:via-blue-600 dark:to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/25 dark:shadow-blue-950/50 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Stay Updated with AI Insights
              </h2>
              <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
                Get the latest AI technology analysis and insights delivered daily. Join our
                community of tech enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-blue-600 dark:text-blue-700 font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/blog">Read More Articles</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 font-bold"
                  asChild
                >
                  <Link href="/blog/rss.xml">Subscribe to RSS</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
