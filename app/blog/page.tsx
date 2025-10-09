"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Calendar, Clock, Rss } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatedUnderlineText,
  PREDEFINED_UNDERLINE_PATHS,
} from "@/components/ui/animated_underline_text";
import { Button } from "@/components/ui/button";

// Animation variants
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const createLetterPulseVariants = (baseDelay: number, pulseScale = 1.3): Variants => ({
  initial: { scale: 1, letterSpacing: "normal" },
  pulse: (i: number) => ({
    scale: [1, pulseScale, 1],
    letterSpacing: ["normal", "2px", "normal"],
    transition: {
      delay: baseDelay + i * 0.08,
      duration: 0.4,
      ease: "circOut",
    },
  }),
});

const techLetters = "TECH".split("");
const techBaseDelay = 0;
const techLetterPulseVariants = createLetterPulseVariants(techBaseDelay, 1.15);

const insightsLetters = "INSIGHTS".split("");
const insightsBaseDelay = 0.2;
const insightsLetterPulseVariants = createLetterPulseVariants(insightsBaseDelay, 1.1);

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  publishedAt?: string;
  category: string;
  tags: string[];
  readTime?: string;
  generated?: boolean;
};

export default function BlogPage() {
  // Blog posts will be loaded from generated content
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load blog posts from generated content
    const loadBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog/index");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setBlogPosts((data.posts as BlogPost[]) || []);
        setError(null);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
        // Fallback to placeholder data if needed
        setBlogPosts([]);
        setError("Unable to load blog posts right now. Please check back soon.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const featuredPosts = blogPosts
    .filter((post) => post.category === "Reality Check" || post.generated)
    .slice(0, 2);
  const featuredSlugs = featuredPosts.map((post) => post.slug);
  const recentPosts = blogPosts.filter((post) => !featuredSlugs.includes(post.slug));
  const showStateCard =
    (loading && blogPosts.length === 0) ||
    Boolean(error) ||
    (!loading && !error && blogPosts.length === 0);
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "RADE AI Tech Blog",
    description:
      "Daily insights into cutting-edge AI technologies, research papers, and emerging tech trends",
    url: "https://rade.alphab.io/blog",
    author: {
      "@type": "Person",
      name: "RADE AI Solutions",
      url: "https://alphab.io",
    },
    publisher: {
      "@type": "Organization",
      name: "RADE AI Solutions",
      url: "https://alphab.io",
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://rade.alphab.io/blog/${post.slug}`,
      datePublished: post.publishedAt || post.date,
      author: {
        "@type": "Person",
        name: "RADE AI Solutions",
      },
      publisher: {
        "@type": "Organization",
        name: "RADE AI Solutions",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 max-w-6xl text-center">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-none"
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              AI{" "}
              <AnimatedUnderlineText
                pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
                underlineClassName="text-blue-600 dark:text-blue-500"
                animationDelay={techBaseDelay}
                animationDuration={0.2}
              >
                <span style={{ display: "inline-block" }}>
                  {techLetters.map((letter, index) => (
                    <motion.span
                      key={`tech-${index}`}
                      custom={index}
                      variants={techLetterPulseVariants}
                      initial="initial"
                      animate="pulse"
                      style={{ display: "inline-block", originY: 0.7 }}
                      className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </AnimatedUnderlineText>{" "}
              <AnimatedUnderlineText
                pathDefinition={PREDEFINED_UNDERLINE_PATHS.gentleArc}
                underlineClassName="text-blue-600 dark:text-blue-500"
                animationDelay={insightsBaseDelay}
                animationDuration={0.2}
              >
                <span style={{ display: "inline-block" }}>
                  {insightsLetters.map((letter, index) => (
                    <motion.span
                      key={`insights-${index}`}
                      custom={index}
                      variants={insightsLetterPulseVariants}
                      initial="initial"
                      animate="pulse"
                      style={{ display: "inline-block", originY: 0.7 }}
                      className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </AnimatedUnderlineText>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              Daily analysis of cutting-edge AI technologies, research papers, and emerging trends
              shaping the future of artificial intelligence.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-bold px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                asChild
              >
                <Link href="/blog/rss.xml">
                  <Rss className="mr-2 h-5 w-5" />
                  Subscribe to RSS
                </Link>
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                2 new posts daily • Expert AI analysis
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Daily Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Research Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Emerging Trends</span>
              </div>
            </motion.div>
          </div>
        </section>

        {showStateCard && (
          <section className="container mx-auto px-6 pt-12 pb-4 max-w-6xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute top-16 right-16 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: ".25" }}
              ></div>
              <div
                className="absolute bottom-8 left-1/2 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: ".25" }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 p-12 text-center backdrop-blur-sm">
                {loading && (
                  <div className="space-y-8">
                    {/* Animated loading text */}
                    <div className="flex items-center justify-center gap-2">
                      <motion.span
                        className="text-xl text-gray-600 dark:text-gray-300 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        Loading the latest insights
                      </motion.span>
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{
                            duration: 0.25,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        ></motion.div>
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{
                            duration: 0.25,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        ></motion.div>
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{
                            duration: 0.25,
                            repeat: Infinity,
                            delay: 0.26,
                          }}
                        ></motion.div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="max-w-md mx-auto">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: 0.25,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        ></motion.div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Fetching AI insights and analysis...
                      </p>
                    </div>

                    {/* Animated icons */}
                    <div className="flex justify-center gap-8">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 0.25,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </motion.div>
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{
                          duration: 0.25,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2,
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-purple-600 dark:text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </motion.div>
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 0.25,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.25,
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Loading steps */}
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Analyzing AI trends</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                          style={{ animationDelay: "0.20" }}
                        ></div>
                        <span>Processing insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                          style={{ animationDelay: ".30" }}
                        ></div>
                        <span>Preparing content</span>
                      </div>
                    </div>
                  </div>
                )}
                {!loading && error && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-red-600 dark:text-red-400 font-medium">{error}</p>
                  </div>
                )}
                {!loading && !error && blogPosts.length === 0 && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                      Fresh content is being generated. Check back shortly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="container mx-auto px-6 pb-16 pt-10 max-w-6xl">
            <motion.h2
              className="text-3xl font-black text-gray-900 dark:text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              viewport={{ once: true }}
            >
              Featured Articles
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  className="group bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 transition-all duration-200 hover:shadow-xl dark:hover:shadow-blue-500/20 hover:scale-[1.02]"
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariants}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.publishedAt || post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime || "-"}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {post.description}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="container mx-auto px-6 pb-16 max-w-6xl">
            <motion.h2
              className="text-3xl font-black text-gray-900 dark:text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              viewport={{ once: true }}
            >
              Recent Posts
            </motion.h2>
            <div className="grid gap-6">
              {recentPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  className="group bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700/60 transition-all duration-200 hover:shadow-lg dark:hover:shadow-blue-500/10 hover:border-blue-400 dark:hover:border-blue-500"
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariants}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded">
                          {post.category}
                        </span>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.publishedAt || post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime || "-"}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap"
                    >
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <motion.section
          className="container mx-auto px-6 py-16 text-center max-w-4xl"
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl p-8 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl font-black mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Stay Ahead of the AI Curve
            </motion.h2>
            <motion.p
              className="text-xl mb-6 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Get daily AI insights delivered to your inbox. Join thousands of AI professionals
              staying informed.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                asChild
              >
                <Link href="/contact">
                  Subscribe Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}
