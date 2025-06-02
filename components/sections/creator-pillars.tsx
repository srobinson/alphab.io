"use client"

import { motion } from "framer-motion"
import {
    Lightbulb,
    Megaphone,
    Rocket,
    Mic,
    Target,
    Layers,
    Camera,
    Users,
} from "lucide-react"
import { AnimatedUnderlineText, PREDEFINED_UNDERLINE_PATHS } from "@/components/ui/animated_underline_text"

const creatorPillars = [
    {
        icon: Lightbulb,
        title: "UNLEASH CREATIVITY",
        description:
            "Tap into AI to brainstorm fresh ideas, write captivating scripts, generate stunning visuals, and overcome creative blocks to produce unique content that captivates and converts.",
    },
    {
        icon: Megaphone,
        title: "AMPLIFY YOUR REACH",
        description:
            "Use AI-powered analytics to understand your audience, optimize for discovery, and execute potent social media and marketing strategies that build massive authority.",
    },
    {
        icon: Rocket,
        title: "MAXIMIZE YOUR IMPACT",
        description:
            "Automate workflows, streamline your operations from content repurposing to email marketing, and leverage AI-driven analytics to track performance and convert your growing influence into tangible results.",
    },
    {
        icon: Mic,
        title: "MASTER YOUR UNIQUE VOICE",
        description:
            "AI voice synthesis ensures consistent narration across all content, while AI writing assistants learn your tone and style. Maintain brand consistency with AI-powered style transfer for visuals and copy.",
    },
    {
        icon: Target,
        title: "OPTIMIZE FOR VIRALITY",
        description:
            "AI analyzes millions of data points to predict optimal posting times, generates high-performing thumbnails, and identifies trending topics before they explode. Turn guesswork into guaranteed growth.",
    },
    {
        icon: Layers,
        title: "SCALE ACROSS PLATFORMS",
        description:
            "Transform one piece of content into dozens. AI automatically converts long-form videos into viral shorts, podcasts into blog posts, and creates platform-specific variants that maximize reach and engagement.",
    },
    {
        icon: Camera,
        title: "ELEVATE VISUAL PRODUCTION",
        description:
            "Professional-grade AI video editing, automated color grading, seamless background replacement, and motion graphics generation. Create Hollywood-quality content without the Hollywood budget.",
    },
    {
        icon: Users,
        title: "DEEPEN AUDIENCE CONNECTION",
        description:
            "AI-powered community management responds to comments intelligently, personalizes content recommendations for each viewer, and analyzes sentiment to help you create content that truly resonates.",
    },
]

export function CreatorPillars() {
    return (
        <motion.section
            className="container mx-auto px-6 pt-8 pb-16 lg:pb-24 max-w-6xl"
            initial="hidden"
            whileInView="visible"
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
            }}
            viewport={{ once: true, amount: 0.1 }}
        >
            <motion.h2
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
                }}
                className="font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-900 dark:text-gray-100"
            >
                <AnimatedUnderlineText
                    pathDefinition={PREDEFINED_UNDERLINE_PATHS.gentleArc}
                    underlineClassName="text-blue-500 dark:text-blue-400"
                    animationDelay={0}
                    animationDuration={0.7}
                >
                    <span style={{ display: "inline-block" }}>Elevate</span>
                </AnimatedUnderlineText>{" "}
                Your Influence.
            </motion.h2>

            <motion.div
                className="text-center mb-16 mt-12 md:mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 dark:text-blue-500 mb-4">
                    How AI Gives You The Creator's Edge
                </h2>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0 } },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {creatorPillars.map((pillar) => {
                    const IconComponent = pillar.icon
                    return (
                        <motion.div
                            key={pillar.title}
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
                            }}
                            className="group h-full space-y-4 p-5 bg-gray-50/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-700/50 transition-all duration-200 ease-out hover:shadow-2xl dark:hover:shadow-blue-500/30 hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-500/70"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                                    <IconComponent className="w-5 h-5 text-white transition-transform duration-200 ease-out group-hover:rotate-3" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-black tracking-tight text-gray-900 dark:text-white">
                                    {pillar.title}
                                </h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base leading-relaxed">
                                {pillar.description}
                            </p>
                        </motion.div>
                    )
                })}
            </motion.div>
        </motion.section>
    )
}