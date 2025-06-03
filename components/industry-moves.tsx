"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Zap, Brain, Rocket, AlertCircle, BarChart3, Lightbulb, Globe } from "lucide-react"

interface NewsItem {
    id: string
    text: string
    link?: string
    category: "breaking" | "trending" | "update" | "insight"
    time: string
    source: string
    isRSS?: boolean
    image?: string
    description?: string
}

interface IndustryMove {
    id: string
    icon: any
    category: string
    title: string
    description: string
    time: string
    trending: boolean
    link?: string
    image?: string
}

// Icon mapping for categories
const categoryIcons = {
    breaking: AlertCircle,
    trending: TrendingUp,
    update: Rocket,
    insight: Brain,
    default: Lightbulb
}

// Category display names
const categoryNames = {
    breaking: "Breaking News",
    trending: "Trending",
    update: "Updates",
    insight: "Insights"
}

export function IndustryMoves() {
    const [industryMoves, setIndustryMoves] = useState<IndustryMove[]>([])
    const [loading, setLoading] = useState(true)
    const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set())

    // Fetch curated news from database
    useEffect(() => {
        const fetchCuratedNews = async () => {
            try {
                // Fetch from curated news API (ready for Supabase backend)
                const response = await fetch('/api/curated-news')
                const data = await response.json()

                // Convert API response to industry moves format
                const curatedMoves: IndustryMove[] = data.items.map((item: NewsItem, index: number) => ({
                    id: item.id,
                    icon: categoryIcons[item.category] || categoryIcons.default,
                    category: categoryNames[item.category] || item.category,
                    title: item.text,
                    description: item.description || `Latest from ${item.source}`,
                    time: item.time,
                    trending: item.category === 'breaking' || item.category === 'trending',
                    link: item.link,
                    image: item.image
                }))

                setIndustryMoves(curatedMoves)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch curated news:', error)
                // Fallback to sample data if API fails
                const fallbackMoves: IndustryMove[] = [
                    {
                        id: "1",
                        icon: Brain,
                        category: "AI Leadership",
                        title: "OpenAI Announces GPT-5 Development",
                        description: "Next-generation AI model promises unprecedented reasoning capabilities with advanced multimodal understanding",
                        time: "2 hours ago",
                        trending: true,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "2",
                        icon: Rocket,
                        category: "Enterprise AI",
                        title: "Microsoft Copilot Integration Expands",
                        description: "AI assistant now available across entire Office 365 suite, transforming workplace productivity",
                        time: "4 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "3",
                        icon: TrendingUp,
                        category: "Creator Tools",
                        title: "AI Content Generation Reaches New Heights",
                        description: "Latest tools enable creators to produce high-quality content 10x faster with unprecedented quality",
                        time: "6 hours ago",
                        trending: true,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "4",
                        icon: Lightbulb,
                        category: "Innovation",
                        title: "Revolutionary AI Workflow Automation",
                        description: "New platforms streamline entire content creation pipelines from ideation to distribution",
                        time: "8 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "5",
                        icon: Globe,
                        category: "Industry News",
                        title: "AI Regulation Framework Takes Shape",
                        description: "Global leaders collaborate on comprehensive AI governance standards for responsible development",
                        time: "12 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "6",
                        icon: BarChart3,
                        category: "Market Analysis",
                        title: "AI Investment Reaches Record Highs",
                        description: "Venture capital funding in AI startups surpasses $50B milestone in 2024",
                        time: "1 day ago",
                        trending: true,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "7",
                        icon: Zap,
                        category: "Technology",
                        title: "Breakthrough in AI Energy Efficiency",
                        description: "New chip architecture reduces AI model training costs by 80% while improving performance",
                        time: "1 day ago",
                        trending: false,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "8",
                        icon: Brain,
                        category: "Research",
                        title: "AI Achieves Human-Level Reasoning",
                        description: "Latest research demonstrates AI systems matching human performance in complex logical tasks",
                        time: "2 days ago",
                        trending: true,
                        image: "/images/ai-head-design.webp"
                    }
                ]

                setIndustryMoves(fallbackMoves)
                setLoading(false)
            }
        }

        fetchCuratedNews()
    }, [])

    // Generate fallback image based on category - using only local images to prevent loading issues
    const getFallbackImage = (category: string, index: number) => {
        // Use only local images to prevent external loading issues
        return "/images/ai-head-design.webp";
    }

    if (loading) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                            Industry Moves
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Loading the latest AI developments and strategic insights...
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    </div>
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                        Industry Moves
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Stay ahead with the latest AI developments and strategic insights
                    </p>
                </div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {industryMoves.map((move, index) => {
                        const IconComponent = move.icon
                        const isClickable = move.link && move.link !== "#"
                        const imageUrl = move.image || getFallbackImage(move.category, index)

                        const cardContent = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className={`relative rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${isClickable ? 'cursor-pointer' : 'cursor-default'} h-full flex flex-col`}
                            >
                                {move.trending && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                                        TRENDING
                                    </div>
                                )}

                                {/* Image Section */}
                                <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    <img
                                        src={imageUrl}
                                        alt={move.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (target.src !== "/images/ai-head-design.webp") {
                                                target.src = "/images/ai-head-design.webp";
                                            }
                                        }}
                                        onLoad={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.opacity = "1";
                                            setImagesLoaded(prev => new Set(prev).add(move.id));
                                        }}
                                        style={{
                                            opacity: imagesLoaded.has(move.id) ? 1 : 0,
                                            transition: "opacity 0.3s ease-in-out"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-blue-500 text-white">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                                {move.category}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 leading-tight line-clamp-2 flex-shrink-0">
                                        {move.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3 flex-1">
                                        {move.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs text-gray-500 dark:text-gray-500">
                                            {move.time}
                                        </span>
                                        {isClickable && (
                                            <div className="text-blue-500 text-xs font-medium">
                                                Read more →
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )

                        return isClickable ? (
                            <a key={move.id} href={move.link} target="_blank" rel="noopener noreferrer" className="h-full">
                                {cardContent}
                            </a>
                        ) : cardContent
                    })}
                </motion.div>
            </div>
        </section >
    )
}