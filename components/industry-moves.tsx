"use client";

import { motion } from "framer-motion";
import {
    AlertCircle,
    BarChart3,
    Brain,
    Globe,
    Lightbulb,
    Rocket,
    TrendingUp,
    Zap,
} from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import Masonry from "react-masonry-css";

interface NewsItem {
    id: string;
    text: string;
    link?: string;
    category: "breaking" | "trending" | "update" | "insight";
    time: string;
    source: string;
    isRSS?: boolean;
    image?: string;
    description?: string;
}

interface IndustryMove {
    id: string;
    icon: any;
    category: string;
    title: string;
    description: string;
    time: string;
    trending: boolean;
    link?: string;
    image?: string;
}

// Icon mapping for categories
const categoryIcons = {
    breaking: AlertCircle,
    trending: TrendingUp,
    update: Rocket,
    insight: Brain,
    default: Lightbulb,
};

// Category display names
const categoryNames = {
    breaking: "Breaking News",
    trending: "Trending",
    update: "Updates",
    insight: "Insights",
};

export function IndustryMoves() {
    const [displayedMoves, setDisplayedMoves] = useState<IndustryMove[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);
    const ITEMS_PER_PAGE = 12;

    // Fetch curated news from database
    useEffect(() => {
        const fetchCuratedNews = async () => {
            try {
                console.log('📥 Fetching initial page...');
                // Fetch from curated news API with pagination
                const response = await fetch(`/api/curated-news?page=1&limit=${ITEMS_PER_PAGE}`);
                const data = await response.json();

                console.log('✅ Loaded page 1:', data.items.length, 'items, Total:', data.pagination?.total, 'Has more:', data.pagination?.hasMore);

                // Convert API response to industry moves format
                const curatedMoves: IndustryMove[] = data.items.map((
                    item: NewsItem,
                    index: number,
                ) => ({
                    id: item.id,
                    icon: categoryIcons[item.category] || categoryIcons.default,
                    category: categoryNames[item.category] || item.category,
                    title: item.text,
                    description: item.description ||
                        `Latest from ${item.source}`,
                    time: item.time,
                    trending: item.category === "breaking" ||
                        item.category === "trending",
                    link: item.link,
                    image: item.image,
                }));

                setDisplayedMoves(curatedMoves);
                setHasMore(data.pagination?.hasMore ?? false);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch curated news:", error);
                // Fallback to sample data if API fails
                const fallbackMoves: IndustryMove[] = [
                    {
                        id: "1",
                        icon: Brain,
                        category: "AI Leadership",
                        title: "OpenAI Announces GPT-5 Development",
                        description:
                            "Next-generation AI model promises unprecedented reasoning capabilities with advanced multimodal understanding",
                        time: "2 hours ago",
                        trending: true,
                        image: "/images/ai-head-design.webp",
                    },
                    {
                        id: "2",
                        icon: Rocket,
                        category: "Enterprise AI",
                        title: "Microsoft Copilot Integration Expands",
                        description:
                            "AI assistant now available across entire Office 365 suite, transforming workplace productivity",
                        time: "4 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp",
                    },
                    {
                        id: "3",
                        icon: TrendingUp,
                        category: "Creator Tools",
                        title: "AI Content Generation Reaches New Heights",
                        description:
                            "Latest tools enable creators to produce high-quality content 10x faster with unprecedented quality",
                        time: "6 hours ago",
                        trending: true,
                        image: "/images/ai-head-design.webp",
                    },
                    {
                        id: "4",
                        icon: Lightbulb,
                        category: "Innovation",
                        title: "Revolutionary AI Workflow Automation",
                        description:
                            "New platforms streamline entire content creation pipelines from ideation to distribution",
                        time: "8 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp",
                    },
                    {
                        id: "5",
                        icon: Globe,
                        category: "Industry News",
                        title: "AI Regulation Framework Takes Shape",
                        description:
                            "Global leaders collaborate on comprehensive AI governance standards for responsible development",
                        time: "12 hours ago",
                        trending: false,
                        image: "/images/ai-head-design.webp",
                    },
                    {
                        id: "6",
                        icon: BarChart3,
                        category: "Market Analysis",
                        title: "AI Investment Reaches Record Highs",
                        description:
                            "Venture capital funding in AI startups surpasses $50B milestone in 2024",
                        time: "1 day ago",
                        trending: true,
                        image: "/images/ai-head-design.webp",
                    },
                    {
                        id: "7",
                        icon: Zap,
                        category: "Technology",
                        title: "Breakthrough in AI Energy Efficiency",
                        description:
                            "New chip architecture reduces AI model training costs by 80% while improving performance",
                        time: "1 day ago",
                        trending: false,
                        image: "/images/ai-head-design.webp",
                    },
                    {
                        id: "8",
                        icon: Brain,
                        category: "Research",
                        title: "AI Achieves Human-Level Reasoning",
                        description:
                            "Latest research demonstrates AI systems matching human performance in complex logical tasks",
                        time: "2 days ago",
                        trending: true,
                        image: "/images/ai-head-design.webp",
                    },
                ];

                setDisplayedMoves(fallbackMoves);
                setHasMore(false);
                setLoading(false);
            }
        };

        fetchCuratedNews();
    }, []);

    // Load more items from API
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        console.log('🔄 loadMore called - Page:', page + 1, 'HasMore:', hasMore, 'Loading:', loadingMore);
        setLoadingMore(true);
        
        try {
            const nextPage = page + 1;
            console.log('📥 Fetching page', nextPage);
            const response = await fetch(`/api/curated-news?page=${nextPage}&limit=${ITEMS_PER_PAGE}`);
            const data = await response.json();
            
            console.log('✅ Loaded page', nextPage, ':', data.items.length, 'items');
            
            // Convert API response to industry moves format
            const newMoves: IndustryMove[] = data.items.map((
                item: NewsItem,
            ) => ({
                id: item.id,
                icon: categoryIcons[item.category] || categoryIcons.default,
                category: categoryNames[item.category] || item.category,
                title: item.text,
                description: item.description ||
                    `Latest from ${item.source}`,
                time: item.time,
                trending: item.category === "breaking" ||
                    item.category === "trending",
                link: item.link,
                image: item.image,
            }));
            
            setDisplayedMoves(prev => [...prev, ...newMoves]);
            setPage(nextPage);
            setHasMore(data.pagination?.hasMore ?? false);
            console.log('📊 Now showing', displayedMoves.length + newMoves.length, 'total items. Has more:', data.pagination?.hasMore);
        } catch (error) {
            console.error("Failed to load more items:", error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    }, [page, loadingMore, hasMore, displayedMoves.length]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    console.log('🔄 Loading more content... (Page', page + 1, ')');
                    loadMore();
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '400px' // Trigger 400px before the target is visible
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore, hasMore, loadingMore, page]);

    // Masonry breakpoint configuration
    const breakpointColumnsObj = {
        default: 4,
        1536: 4, // 2xl
        1280: 3, // xl
        1024: 3, // lg
        768: 2, // md
        640: 1  // sm
    };

    // Generate fallback image based on category with variety
    const getFallbackImage = (category: string, title: string) => {
        // Create deterministic fallback based on title hash
        const hashString = (str: string): number => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        };
        
        const seed = hashString(title);
        
        // Use Picsum with deterministic seed for variety
        return `https://picsum.photos/seed/${seed}/400/200`;
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                            Industry Moves
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Loading the latest AI developments and strategic
                            insights...
                        </p>
                    </div>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="flex -ml-6 w-auto"
                        columnClassName="pl-6 bg-clip-padding"
                    >
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse mb-6"
                            >
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700">
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3">
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20">
                                        </div>
                                    </div>
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2">
                                    </div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3">
                                    </div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16">
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Masonry>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                        Industry Moves
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Stay ahead with the latest AI developments and strategic
                        insights
                    </p>
                </div>

                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex -ml-6 w-auto"
                    columnClassName="pl-6 bg-clip-padding"
                >
                    {displayedMoves.map((move, index) => {
                        const IconComponent = move.icon;
                        const isClickable = move.link && move.link !== "#";
                        const imageUrl = move.image ||
                            getFallbackImage(move.category, move.title);

                        const cardContent = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: Math.min(index * 0.05, 0.6),
                                }}
                                className={`relative rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
                                    isClickable
                                        ? "cursor-pointer"
                                        : "cursor-default"
                                } mb-6 flex flex-col`}
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
                                            const target = e
                                                .target as HTMLImageElement;
                                            if (
                                                target.src !==
                                                    "/images/ai-head-design.webp"
                                            ) {
                                                target.src =
                                                    "/images/ai-head-design.webp";
                                            }
                                        }}
                                        onLoad={(e) => {
                                            const target = e
                                                .target as HTMLImageElement;
                                            target.style.opacity = "1";
                                            setImagesLoaded((prev) =>
                                                new Set(prev).add(move.id)
                                            );
                                        }}
                                        style={{
                                            opacity: imagesLoaded.has(move.id)
                                                ? 1
                                                : 0,
                                            transition:
                                                "opacity 0.3s ease-in-out",
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

                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                        {move.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
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
                        );

                        return isClickable
                            ? (
                                <a
                                    key={move.id}
                                    href={move.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {cardContent}
                                </a>
                            )
                            : (
                                <div key={move.id}>
                                    {cardContent}
                                </div>
                            );
                    })}
                </Masonry>

                {/* Loading more indicator */}
                {loadingMore && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Intersection observer target */}
                <div ref={observerTarget} className="h-10" />

                {/* End of content message */}
                {!hasMore && displayedMoves.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            You've reached the end of the latest updates
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
