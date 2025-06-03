import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin } from "lucide-react"

// This would typically fetch from your CMS or database
const getBlogPost = async (slug: string) => {
    const posts = [
        {
            slug: "multimodal-ai-gpt4v-analysis",
            title: "The Rise of Multimodal AI: Analyzing GPT-4V and Beyond",
            excerpt: "Deep dive into the latest multimodal AI capabilities and their implications for business applications.",
            content: `
        <h2>Introduction to Multimodal AI</h2>
        <p>Multimodal AI represents a significant leap forward in artificial intelligence capabilities, combining text, image, and other data modalities to create more sophisticated and versatile AI systems.</p>
        
        <h2>GPT-4V: A Game Changer</h2>
        <p>OpenAI's GPT-4V (Vision) has demonstrated remarkable capabilities in understanding and reasoning about visual content alongside text, opening new possibilities for AI applications.</p>
        
        <h2>Business Implications</h2>
        <p>The integration of multimodal AI into business processes can revolutionize customer service, content creation, and data analysis workflows.</p>
        
        <h2>Future Outlook</h2>
        <p>As multimodal AI continues to evolve, we can expect even more sophisticated applications that blur the lines between different types of data and reasoning.</p>
      `,
            category: "AI Research",
            readTime: "8 min read",
            publishedAt: "2024-01-15T10:00:00Z",
            author: "RADE AI Solutions",
            tags: ["Multimodal AI", "GPT-4V", "Computer Vision", "AI Research"],
        },
        {
            slug: "rag-enterprise-ai-future",
            title: "Retrieval-Augmented Generation: The Future of Enterprise AI",
            excerpt: "How RAG is transforming enterprise AI applications and why it matters for your business.",
            content: `
        <h2>Understanding RAG</h2>
        <p>Retrieval-Augmented Generation (RAG) combines the power of large language models with external knowledge retrieval, creating more accurate and contextually relevant AI responses.</p>
        
        <h2>Enterprise Applications</h2>
        <p>RAG is particularly valuable for enterprise applications where accuracy and up-to-date information are critical for business operations.</p>
        
        <h2>Implementation Strategies</h2>
        <p>Successful RAG implementation requires careful consideration of data architecture, retrieval mechanisms, and integration with existing systems.</p>
      `,
            category: "Enterprise AI",
            readTime: "6 min read",
            publishedAt: "2024-01-14T10:00:00Z",
            author: "RADE AI Solutions",
            tags: ["RAG", "Enterprise AI", "Knowledge Retrieval", "LLM"],
        },
    ]

    return posts.find(post => post.slug === slug)
}

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getBlogPost(params.slug)

    if (!post) {
        return {
            title: "Post Not Found",
        }
    }

    return {
        title: `${post.title} | RADE AI Blog`,
        description: post.excerpt,
        keywords: post.tags,
        authors: [{ name: post.author }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://alphab.io/blog/${post.slug}`,
            type: "article",
            publishedTime: post.publishedAt,
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
            description: post.excerpt,
            images: [`/images/blog/${post.slug}-twitter.jpg`],
        },
        alternates: {
            canonical: `https://alphab.io/blog/${post.slug}`,
        },
    }
}

export default async function BlogPostPage({ params }: Props) {
    const post = await getBlogPost(params.slug)

    if (!post) {
        notFound()
    }

    const articleStructuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": `https://alphab.io/images/blog/${post.slug}-og.jpg`,
        "author": {
            "@type": "Person",
            "name": post.author,
            "url": "https://alphab.io"
        },
        "publisher": {
            "@type": "Organization",
            "name": "RADE AI Solutions",
            "logo": {
                "@type": "ImageObject",
                "url": "https://alphab.io/images/rade-logo.svg"
            }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://alphab.io/blog/${post.slug}`
        },
        "keywords": post.tags.join(", "),
        "articleSection": post.category,
        "wordCount": post.content.split(' ').length,
        "timeRequired": post.readTime,
    }

    const shareUrl = `https://alphab.io/blog/${post.slug}`
    const shareText = `${post.title} - ${post.excerpt}`

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
            />
            <article className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white transition-colors duration-300">
                {/* Navigation */}
                <nav className="container mx-auto px-6 py-8 max-w-4xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Blog
                    </Link>
                </nav>

                {/* Article Header */}
                <header className="container mx-auto px-6 pb-8 max-w-4xl">
                    <div className="flex items-center gap-4 mb-6">
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

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                        {post.title}
                    </h1>

                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                By <strong className="text-gray-900 dark:text-white">{post.author}</strong>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Share:</span>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on Twitter"
                                >
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on LinkedIn"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <main className="container mx-auto px-6 pb-16 max-w-4xl">
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Related Posts CTA */}
                <section className="container mx-auto px-6 py-16 text-center max-w-4xl">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                            Stay Updated with AI Insights
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Get the latest AI technology analysis and insights delivered daily.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                                asChild
                            >
                                <Link href="/blog">
                                    Read More Articles
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                            >
                                <Link href="/blog/rss.xml">
                                    Subscribe to RSS
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </article>
        </>
    )
}