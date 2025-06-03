"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, Rss } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedUnderlineText, PREDEFINED_UNDERLINE_PATHS } from "@/components/ui/animated_underline_text"

// Animation variants
const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

const createLetterPulseVariants = (baseDelay: number, pulseScale = 1.3) => ({
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
})

const techLetters = "TECH".split("")
const techBaseDelay = 0
const techLetterPulseVariants = createLetterPulseVariants(techBaseDelay, 1.15)

const insightsLetters = "INSIGHTS".split("")
const insightsBaseDelay = 0.2
const insightsLetterPulseVariants = createLetterPulseVariants(insightsBaseDelay, 1.1)

// Placeholder blog posts - replace with your actual blog data
const featuredPosts = [
    {
        id: "1",
        title: "The Rise of Multimodal AI: Analyzing GPT-4V and Beyond",
        excerpt: "Deep dive into the latest multimodal AI capabilities and their implications for business applications.",
        category: "AI Research",
        readTime: "8 min read",
        publishedAt: "2024-01-15",
        slug: "multimodal-ai-gpt4v-analysis",
        featured: true,
    },
    {
        id: "2",
        title: "Retrieval-Augmented Generation: The Future of Enterprise AI",
        excerpt: "How RAG is transforming enterprise AI applications and why it matters for your business.",
        category: "Enterprise AI",
        readTime: "6 min read",
        publishedAt: "2024-01-14",
        slug: "rag-enterprise-ai-future",
        featured: true,
    },
]

const recentPosts = [
    {
        id: "3",
        title: "Anthropic's Constitutional AI: A New Paradigm for AI Safety",
        excerpt: "Exploring Anthropic's approach to AI alignment and what it means for responsible AI development.",
        category: "AI Safety",
        readTime: "7 min read",
        publishedAt: "2024-01-13",
        slug: "anthropic-constitutional-ai-safety",
    },
    {
        id: "4",
        title: "Vector Databases: The Infrastructure Behind Modern AI",
        excerpt: "Understanding the role of vector databases in powering semantic search and AI applications.",
        category: "AI Infrastructure",
        readTime: "5 min read",
        publishedAt: "2024-01-12",
        slug: "vector-databases-ai-infrastructure",
    },
    {
        id: "5",
        title: "Fine-tuning vs RAG: Choosing the Right Approach for Your AI Project",
        excerpt: "A comprehensive comparison of fine-tuning and RAG approaches for customizing AI models.",
        category: "AI Development",
        readTime: "9 min read",
        publishedAt: "2024-01-11",
        slug: "fine-tuning-vs-rag-comparison",
    },
]

export default function BlogPage() {
    const blogStructuredData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "RADE AI Tech Blog",
        "description": "Daily insights into cutting-edge AI technologies, research papers, and emerging tech trends",
        "url": "https://alphab.io/blog",
        "author": {
            "@type": "Person",
            "name": "RADE AI Solutions",
            "url": "https://alphab.io"
        },
        "publisher": {
            "@type": "Organization",
            "name": "RADE AI Solutions",
            "url": "https://alphab.io"
        },
        "blogPost": [...featuredPosts, ...recentPosts].map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "url": `https://alphab.io/blog/${post.slug}`,
            "datePublished": post.publishedAt,
            "author": {
                "@type": "Person",
                "name": "RADE AI Solutions"
            },
            "publisher": {
                "@type": "Organization",
                "name": "RADE AI Solutions"
            }
        }))
    }

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
                                animationDuration={0.7}
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
                                animationDuration={0.7}
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
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Daily analysis of cutting-edge AI technologies, research papers, and emerging trends shaping the future of artificial intelligence.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
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
                            transition={{ duration: 0.6, delay: 0.7 }}
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

                {/* Featured Posts */}
                <section className="container mx-auto px-6 pb-16 pt-10 ptmax-w-6xl">
                    <motion.h2
                        className="text-3xl font-black text-gray-900 dark:text-white mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Featured Articles
                    </motion.h2>
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {featuredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
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
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {post.readTime}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                    {post.excerpt}
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

                {/* Recent Posts */}
                <section className="container mx-auto px-6 pb-16 max-w-6xl">
                    <motion.h2
                        className="text-3xl font-black text-gray-900 dark:text-white mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Recent Posts
                    </motion.h2>
                    <div className="grid gap-6">
                        {recentPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
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
                                                {new Date(post.publishedAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {post.readTime}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Link href={`/blog/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {post.excerpt}
                                        </p>
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
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <motion.h2
                            className="text-3xl font-black mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            Stay Ahead of the AI Curve
                        </motion.h2>
                        <motion.p
                            className="text-xl mb-6 opacity-90"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            Get daily AI insights delivered to your inbox. Join thousands of AI professionals staying informed.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
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
    )
}