"use client";

import { motion } from "framer-motion";
import {
    Camera,
    Layers,
    Lightbulb,
    Megaphone,
    Mic,
    Rocket,
    Target,
    Users,
} from "lucide-react";

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
];

export function CreatorPillars() {
    return (
        <motion.section
            className="container mx-auto px-6 pt-8 pb-16 lg:pb-24 max-w-6xl"
            initial="hidden"
            whileInView="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { duration: 0.5, ease: "easeOut" },
                },
            }}
            viewport={{ once: true, amount: 0.1 }}
        >
            {
                /* <motion.h2
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
                }}
                className="font-black tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-gray-900 dark:text-gray-100"
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
            </motion.h2> */
            }

            <motion.div
                className="text-center mb-16 mt-12 md:mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 dark:text-gray-100 mb-6">
                    Here&rsquo;s what I know
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                    I&rsquo;ve spent years in the trenches, building systems that
                    actually work. Not theory. Not hype. Just proven methods
                    that turn content into results.
                </p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.15,
                            delayChildren: 0.3,
                            duration: 0.6,
                        },
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {creatorPillars.map((pillar, index) => {
                    const IconComponent = pillar.icon;
                    return (
                        <motion.div
                            key={pillar.title}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    y: 60,
                                    scale: 0.8,
                                    rotateX: -15,
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    rotateX: 0,
                                    transition: {
                                        type: "spring",
                                        damping: 20,
                                        stiffness: 100,
                                        duration: 0.8,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    },
                                },
                            }}
                            whileHover={{
                                y: -8,
                                scale: 1.05,
                                rotateY: 5,
                                transition: {
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 200,
                                },
                            }}
                            className="group h-full space-y-4 p-5 bg-gray-50/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-700/50 transition-all duration-300 ease-out hover:shadow-2xl dark:hover:shadow-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/70"
                            style={{ perspective: "1000px" }}
                        >
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.2 + index * 0.1,
                                    duration: 0.5,
                                }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110"
                                    whileHover={{
                                        rotate: 360,
                                        scale: 1.2,
                                        transition: { duration: 0.6 },
                                    }}
                                >
                                    <IconComponent className="w-5 h-5 text-white transition-transform duration-200 ease-out group-hover:rotate-3" />
                                </motion.div>
                                <motion.h3
                                    className="text-lg lg:text-xl font-black tracking-tight text-gray-900 dark:text-white"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{
                                        delay: 0.3 + index * 0.1,
                                        duration: 0.5,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    {pillar.title}
                                </motion.h3>
                            </motion.div>
                            <motion.p
                                className="text-gray-700 dark:text-gray-300 text-sm lg:text-base leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.4 + index * 0.1,
                                    duration: 0.6,
                                }}
                                viewport={{ once: true }}
                            >
                                {pillar.description}
                            </motion.p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.section>
    );
}
