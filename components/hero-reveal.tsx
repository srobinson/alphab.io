"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroReveal() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // All animations start immediately - snappy and simultaneous
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative pt-10 Xmin-h-screen Xoverflow-hidden flex items-center justify-center">
            {/* Subtle Background - Lower z-index so clock shows through */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950/30 via-black/20 to-gray-900/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
            </div>

            {/* Very Subtle Grid Pattern - Lower opacity */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Main Content - Higher z-index, vertically aligned top */}
            <div className="relative z-20 text-center px-6 max-w-7xl mx-auto -mt-2 md:-mt-2">
                {/* AI: - Powerful, Bold Typography - Snappy Animation */}
                <div className="mb-4">
                    <h1
                        className={`font-black tracking-tighter transition-all duration-600 ease-out
                            text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[16rem] xl:text-[18rem]
                            leading-[0.8] ${isVisible ? "transform translate-y-0 opacity-100" : "transform translate-y-full opacity-0"}`}
                        style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontWeight: 900,
                            letterSpacing: "-0.05em"
                        }}
                        aria-label="AI: The Time is Now - RADE AI Solutions"
                    >
                        <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                            AI:
                        </span>
                    </h1>
                </div>

                {/* THE TIME IS NOW - Viewport-Fitted Typography - All Simultaneous */}
                <div className="mb-8 overflow-hidden">
                    <div className="space-y-2">
                        {/* THE TIME IS */}
                        <div
                            className={`font-black tracking-tight transition-all duration-600 ease-out
                                text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-[7rem]
                                leading-[0.9] ${isVisible ? "transform translate-y-0 opacity-100" : "transform translate-y-8 opacity-0"}`}
                            style={{
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                fontWeight: 900,
                                letterSpacing: "-0.02em"
                            }}
                        >
                            <span className="text-white">Transform Your Business</span>
                        </div>

                        {/* NOW - Larger, Blue, Slightly Rotated */}
                        <div
                            className={`font-black tracking-tight transition-all duration-600 ease-out
                                text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem]
                                leading-[1.0] pb-4 ${isVisible ? "transform translate-y-0 opacity-100 rotate-1" : "transform translate-y-8 opacity-0 rotate-0"}`}
                            style={{
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                fontWeight: 900,
                                letterSpacing: "-0.02em"
                            }}
                        >
                            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Today
                            </span>
                        </div>
                    </div>
                </div>

                {/* Elegant Divider - Simultaneous */}
                <div
                    className={`w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-8 transition-all duration-600 ${isVisible ? "opacity-60 scale-x-100" : "opacity-0 scale-x-0"}`}
                />

                {/* CTA Button - Sophisticated - Simultaneous */}
                <div
                    className={`transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
                >
                    <Button
                        asChild
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 border-0 focus:ring-4 focus:ring-blue-500/50 focus:outline-none"
                        style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontWeight: 600
                        }}
                    >
                        <Link
                            href="/my-approach"
                            aria-label="Deploy AI Strategy - Get started with RADE AI Solutions"
                            role="button"
                        >
                            Deploy AI Strategy
                            <ArrowRight className="ml-3 w-5 h-5" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
                {/* Subtitle - Professional & Clean - Simultaneous */}
                <div className="mb-2 mt-12 overflow-hidden">
                    <p
                        className={`text-xl md:text-2xl lg:text-3xl text-gray-300 font-medium tracking-wide transition-all duration-600 ease-out ${isVisible ? "transform translate-y-0 opacity-100" : "transform translate-y-4 opacity-0"}`}
                        style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            letterSpacing: "0.02em"
                        }}
                    >
                        — Your Chief Artificial Intelligence Officer
                    </p>
                </div>

            </div>

            {/* Very Subtle Ambient Effects - Lower z-index */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[40rem] h-[40rem] bg-blue-500/3 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-500/3 rounded-full blur-3xl z-0" />
        </div>
    )
}
