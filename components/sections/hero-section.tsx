"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BrainCircuit, TrendingUp, Settings2 } from "lucide-react"
import { AnimatedParticles } from "@/components/ui/particle-background"
import { AiDispatch } from "@/components/views/home/ai-dispatch"
import { ClockBackground } from "@/components/background/clock-background"
import HeroReveal from "@/components/hero-reveal"

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
}

// Dispatch data for business AI transformation
const dispatchDataForBusiness = {
    mainHeadline: "Transform Your Business with Strategic AI Implementation & Expert Consulting",
    briefings: [
        {
            id: "brief1",
            icon: BrainCircuit,
            title: "AI Strategy & Roadmap Development",
            summary:
                "Develop comprehensive AI strategies aligned with your business goals. From opportunity assessment to implementation roadmaps, I help you identify high-impact AI use cases and create actionable plans for successful AI adoption.",
            category: "Strategic Planning",
        },
        {
            id: "brief2",
            icon: TrendingUp,
            title: "Custom AI Model Development & Integration",
            summary:
                "Build bespoke AI solutions tailored to your unique challenges. From NLP and computer vision to predictive analytics, I develop and integrate high-performance AI models that deliver measurable business results.",
            category: "Technical Implementation",
        },
        {
            id: "brief3",
            icon: Settings2,
            title: "AI Operations & Governance Framework",
            summary:
                "Establish robust AI governance, ethical frameworks, and operational excellence. Ensure responsible AI practices, regulatory compliance, and scalable deployment strategies that grow with your business.",
            category: "Governance & Scale",
        },
        {
            id: "brief4",
            icon: BrainCircuit,
            title: "AI-Driven Business Intelligence & Analytics",
            summary:
                "Transform raw data into actionable insights with advanced AI-powered analytics. Implement intelligent dashboards, predictive forecasting, and automated reporting systems that drive data-driven decision making across your organization.",
            category: "Data & Analytics",
        },
    ],
}

export function HeroSection() {
    return (
        <motion.section
            className="relative flex flex-col text-center overflow-hidden pt-8 pb-10"
            initial="hidden"
            animate="visible"
            aria-label="Hero section with AI solutions overview"
        >
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-blue-950/20" />
                <AnimatedParticles delay={0} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

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
                <motion.div variants={newsShowVariants} initial="hidden" animate="visible" className="pt-10">
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
                    <Link href="/my-approach" passHref legacyBehavior>
                        <Button
                            size="lg"
                            className="group bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-6 text-xl w-full sm:w-auto
                dark:bg-blue-500 dark:hover:bg-blue-600 relative overflow-hidden shadow-2xl"
                        >
                            <span className="relative z-10">DEPLOY AI STRATEGY</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    )
}