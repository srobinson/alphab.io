"use client";

import { ClockBackground } from "@/components/background/clock-background";
import HeroReveal from "@/components/hero-reveal";
import { Button } from "@/components/ui/button";
import { AiDispatch } from "@/components/views/home/ai-dispatch";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Settings2, TrendingUp } from "lucide-react";
import Link from "next/link";

// Animation variants
const newsShowVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
            delay: 0,
        },
    },
};

// Real talk about what I actually do
const dispatchDataForBusiness = {
    mainHeadline:
        "With years of hands-on experience, I’ve built AI systems that deliver real-world results",
    briefings: [
        {
            id: "brief1",
            icon: BrainCircuit,
            title: "I cut through the AI hype",
            summary:
                "No buzzwords, no theoretical frameworks. I've seen what works and what doesn't. I'll tell you exactly which AI implementations will move your needle and which ones are just expensive experiments.",
            category: "Strategic Assessment",
        },
        {
            id: "brief2",
            icon: TrendingUp,
            title: "I build systems that scale",
            summary:
                "While others are building demos, I'm architecting production-ready AI that handles real workloads. From computer vision pipelines to NLP systems that understand context—I build for the long haul.",
            category: "Enterprise Solutions",
        },
        {
            id: "brief3",
            icon: Settings2,
            title: "I solve the messy problems",
            summary:
                "Data quality issues, model drift, integration nightmares—I've debugged it all. The stuff that breaks AI projects? I've already figured out how to prevent it.",
            category: "Technical Excellence",
        },
        {
            id: "brief4",
            icon: BrainCircuit,
            title: "I make data tell the truth",
            summary:
                "Your data has stories to tell, but most analytics just create pretty charts. I build intelligence that finds the patterns that matter and automates the insights that drive decisions.",
            category: "Data Intelligence",
        },
    ],
};

export function HeroSection() {
    return (
        <motion.section
            className="hero relative flex flex-col text-center overflow-hidden pt-8 pb-10"
            initial="hidden"
            animate="visible"
            aria-label="Hero section with AI solutions overview"
        >
            {
                /* <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-blue-950/20" />
                <AnimatedParticles delay={0} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div> */
            }

            {/* Full viewport clock */}
            <ClockBackground />

            <div className="border-0 border-solid relative z-20 container mx-auto px-6 max-w-6xl">
                {/* Hero tagline at the top */}
                <motion.div
                    initial={{ opacity: 0.72 }}
                    animate={{ opacity: 1 }}
                    className="text-center relative md:pt-10"
                    style={{ perspective: "2000px" }}
                >
                    <div className="relative z-10">
                        <HeroReveal />
                    </div>
                </motion.div>

                {/* AI Dispatch section */}
                <motion.div
                    variants={newsShowVariants}
                    initial="hidden"
                    animate="visible"
                    className="pt-10"
                >
                    <AiDispatch
                        mainHeadline={dispatchDataForBusiness.mainHeadline}
                        briefings={dispatchDataForBusiness.briefings}
                    />
                </motion.div>

                {/* Deploy button with no bottom padding */}
                <motion.div
                    className="flex justify-center pt-10 pb-10"
                    variants={newsShowVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Button
                        asChild
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 border-0 focus:ring-4 focus:ring-blue-500/50 focus:outline-none"
                        style={{
                            fontFamily:
                                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        <Link
                            href="/my-approach"
                            aria-label="Deploy AI Strategy - Get started with RADE AI Solutions"
                            role="button"
                        >
                            Deploy AI Strategy
                            <ArrowRight
                                className="ml-3 w-5 h-5"
                                aria-hidden="true"
                            />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </motion.section>
    );
}
