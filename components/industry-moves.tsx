"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Zap, Brain, Rocket } from "lucide-react"

const industryMoves = [
    {
        id: 1,
        icon: Brain,
        category: "AI Leadership",
        title: "OpenAI Announces GPT-5 Development",
        description: "Next-generation AI model promises unprecedented reasoning capabilities",
        time: "2 hours ago",
        trending: true
    },
    {
        id: 2,
        icon: Rocket,
        category: "Enterprise AI",
        title: "Microsoft Copilot Integration Expands",
        description: "AI assistant now available across entire Office 365 suite",
        time: "4 hours ago",
        trending: false
    },
    {
        id: 3,
        icon: TrendingUp,
        category: "Market Analysis",
        title: "AI Investment Reaches $50B in Q4",
        description: "Venture capital funding for AI startups hits record high",
        time: "6 hours ago",
        trending: true
    },
    {
        id: 4,
        icon: Zap,
        category: "Innovation",
        title: "Google Unveils Gemini Ultra 2.0",
        description: "Advanced multimodal AI model surpasses human performance",
        time: "8 hours ago",
        trending: false
    }
]

export function IndustryMoves() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % industryMoves.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [])

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

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {industryMoves.map((move, index) => {
                        const IconComponent = move.icon
                        return (
                            <motion.div
                                key={move.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative p-6 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${index === currentIndex
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-lg"
                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md"
                                    }`}
                            >
                                {move.trending && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                        TRENDING
                                    </div>
                                )}

                                <div className="flex items-center mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${index === currentIndex
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                        }`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                            {move.category}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                    {move.title}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                    {move.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                        {move.time}
                                    </span>
                                    <motion.div
                                        className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                            }`}
                                        animate={{
                                            scale: index === currentIndex ? [1, 1.2, 1] : 1,
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: index === currentIndex ? Infinity : 0,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center mt-8 space-x-2">
                    {industryMoves.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-blue-500 scale-110"
                                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}