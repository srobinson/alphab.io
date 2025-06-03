import { IndustryMoves } from "@/components/industry-moves"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Industry Moves | RADE - AI Leadership Solutions",
    description: "Stay ahead with the latest AI developments, strategic insights, and industry trends. Real-time updates from leading tech sources and expert analysis.",
    keywords: ["AI news", "industry trends", "artificial intelligence", "tech updates", "AI developments", "strategic insights"],
    openGraph: {
        title: "Industry Moves | RADE - AI Leadership Solutions",
        description: "Stay ahead with the latest AI developments, strategic insights, and industry trends.",
        type: "website",
    },
}

export default function IndustryMovesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                        Industry{" "}
                        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                            Moves
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Stay ahead of the curve with real-time AI developments, strategic insights, and industry trends from leading tech sources.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live Updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Curated Sources</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Expert Analysis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Moves Component */}
            <IndustryMoves />

            {/* Additional Info Section */}
            <section className="py-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Why Industry Moves Matter
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-Time Intelligence</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Get instant access to breaking AI developments and industry shifts as they happen.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Strategic Insights</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Understand the implications of industry moves for your AI strategy and competitive positioning.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Curated Sources</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Handpicked content from TechCrunch, VentureBeat, The Verge, and other trusted industry sources.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}