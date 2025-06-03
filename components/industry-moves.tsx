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

    // Fetch news from API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news')
                const data = await response.json()

                // Convert news items to industry moves format and take first 12
                const moves: IndustryMove[] = data.items.slice(0, 12).map((item: NewsItem, index: number) => ({
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

                setIndustryMoves(moves)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch news:', error)
                // Fallback to default content with images
                setIndustryMoves([
                    {
                        id: "1",
                        icon: Brain,
                        category: "AI Leadership",
                        title: "OpenAI Announces GPT-5 Development",
                        description: "Next-generation AI model promises unprecedented reasoning capabilities",
                        time: "2 hours ago",
                        trending: true,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "2",
                        icon: Rocket,
                        category: "Enterprise AI",
                        title: "Microsoft Copilot Integration Expands",
                        description: "AI assistant now available across entire Office 365 suite",
                        time: "4 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "3",
                        icon: TrendingUp,
                        category: "Creator Tools",
                        title: "AI Content Generation Reaches New Heights",
                        description: "Latest tools enable creators to produce high-quality content 10x faster",
                        time: "6 hours ago",
                        trending: true,
                        image: "/images/ai-head-design.webp"
                    },
                    {
                        id: "4",
                        icon: Lightbulb,
                        category: "Innovation",
                        title: "Revolutionary AI Workflow Automation",
                        description: "New platforms streamline entire content creation pipelines",
                        time: "8 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp"
                    }
                ])
                setLoading(false)
            }
        }

        fetchNews()
    }, [])

    // Generate fallback image based on category and add variety
    const getFallbackImage = (category: string, index: number) => {
        const categoryImages: { [key: string]: string[] } = {
            "Breaking News": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop&auto=format"
            ],
            "Trending": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format"
            ],
            "Updates": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop&auto=format"
            ],
            "Insights": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format"
            ],
            "AI Leadership": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format"
            ],
            "Enterprise AI": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format"
            ],
            "Creator Tools": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&auto=format"
            ],
            "Innovation": [
                "/images/ai-head-design.webp",
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format"
            ]
        };

        const images = categoryImages[category] || categoryImages["AI Leadership"];
        return images[index % images.length];
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                    {industryMoves.map((move, index) => {
                        const IconComponent = move.icon
                        const isClickable = move.link && move.link !== "#"
                        const imageUrl = move.image || getFallbackImage(move.category, index)

                        const cardContent = (
                            <motion.div
                                key={move.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: (index % 8) * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${isClickable ? 'cursor-pointer' : 'cursor-default'} h-full flex flex-col`}
                            >
                                {move.trending && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                                        TRENDING
                                    </div>
                                )}

                                {/* Image Section */}
                                <div className="relative w-full h-48 overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt={move.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/images/ai-head-design.webp";
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
                </div>
            </div>
        </section>
    )
}