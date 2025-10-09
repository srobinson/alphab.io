"use client";

import { motion, type Variants } from "framer-motion";
import { Rss } from "lucide-react";
import Link from "next/link";
import { GradientHero } from "@/components";
import {
  AnimatedUnderlineText,
  createLetterPulseVariants,
  PREDEFINED_UNDERLINE_PATHS,
} from "@/components/ui/animated_underline_text";
import { Button } from "@/components/ui/button";

// Animation variants
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 2 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const techLetters = "TECH".split("");
const techBaseDelay = 0;
const techLetterPulseVariants = createLetterPulseVariants(techBaseDelay, 1.15);

const insightsLetters = "INSIGHTS".split("");
const insightsBaseDelay = 0.2;
const insightsLetterPulseVariants = createLetterPulseVariants(insightsBaseDelay, 1.1);

export function BlogHero() {
  return (
    <section className="relative py-16 overflow-hidden">
      <GradientHero />
      <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight leading-none"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          AI{" "}
          <AnimatedUnderlineText
            pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
            underlineClassName="text-neon-pink"
            animationDelay={techBaseDelay}
            animationDuration={0.2}
          >
            <span style={{ display: "inline-block" }}>
              {techLetters.map((letter, index) => (
                <motion.span
                  key={`tech-${index}`}
                  custom={index}
                  variants={techLetterPulseVariants}
                  initial="initial"
                  animate="pulse"
                  style={{ display: "inline-block", originY: 0.7 }}
                  className="text-neon-yellow bg-clip-text"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </AnimatedUnderlineText>{" "}
          <AnimatedUnderlineText
            pathDefinition={PREDEFINED_UNDERLINE_PATHS.gentleArc}
            underlineClassName="text-neon-pink"
            animationDelay={insightsBaseDelay}
            animationDuration={0.2}
          >
            <span style={{ display: "inline-block" }}>
              {insightsLetters.map((letter, index) => (
                <motion.span
                  key={`insights-${index}`}
                  custom={index}
                  variants={insightsLetterPulseVariants}
                  initial="initial"
                  animate="pulse"
                  style={{ display: "inline-block", originY: 0.7 }}
                  className="bg-linear-to-r text-foreground bg-clip-text"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </AnimatedUnderlineText>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0 }}
        >
          Daily analysis of cutting-edge AI technologies, research papers, and emerging trends
          shaping the future of artificial intelligence.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0 }}
        >
          <Button
            size="lg"
            className="bg-black hover:opacity-90 text-white uppercase font-bold px-12 py-3 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-yellow-500/25"
            asChild
          >
            <Link
              className="px-12 bg-linear-to-t from-red-500 via-pink-500 to-yellow-500 opacity-90"
              href="/blog/rss.xml"
            >
              <Rss size={64} className="h-24 w-24" />
              Subscribe to RSS
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
            <span>Daily Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
            <span>Research Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
            <span>Emerging Trends</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
