"use client";

import { motion, type Variants } from "framer-motion";
import { Mail } from "lucide-react";
import { IndustryMoves } from "@/components/industry-moves";
import {
  AnimatedUnderlineText,
  PREDEFINED_UNDERLINE_PATHS,
} from "@/components/ui/animated_underline_text";
import { GradientButton } from "@/components/ui/gradient-button";
import { useContactDrawer } from "@/contexts/contact-drawer-context";

// Animation variants
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const createLetterPulseVariants = (baseDelay: number, pulseScale = 1.3): Variants => ({
  initial: { scale: 1, letterSpacing: "normal" },
  pulse: (i: number) => ({
    scale: [1, pulseScale, 1],
    letterSpacing: ["normal", "2px", "normal"],
    transition: {
      delay: baseDelay + i * 0.08,
      duration: 0.2,
      ease: "circOut",
    },
  }),
});

const industryLetters = "INDUSTRY".split("");
const industryBaseDelay = 0;
const industryLetterPulseVariants = createLetterPulseVariants(industryBaseDelay, 1.15);

const movesLetters = "MOVES".split("");
const movesBaseDelay = 0.2;
const movesLetterPulseVariants = createLetterPulseVariants(movesBaseDelay, 1.1);

export default function IndustryMovesPage() {
  const { openContactDrawer } = useContactDrawer();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-background border-b border-cyber-border overflow-hidden">
        <div className="absolute inset-0 bg-cyber-radial opacity-30"></div>
        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <AnimatedUnderlineText
              pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
              underlineClassName="text-neon-blue"
              animationDelay={industryBaseDelay}
              animationDuration={0.7}
            >
              <span style={{ display: "inline-block" }}>
                {industryLetters.map((letter, index) => (
                  <motion.span
                    key={`industry-${index}`}
                    custom={index}
                    variants={industryLetterPulseVariants}
                    initial="initial"
                    animate="pulse"
                    style={{
                      display: "inline-block",
                      originY: 0.7,
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </AnimatedUnderlineText>{" "}
            <AnimatedUnderlineText
              pathDefinition={PREDEFINED_UNDERLINE_PATHS.gentleArc}
              underlineClassName="text-neon-blue"
              animationDelay={movesBaseDelay}
              animationDuration={0.7}
            >
              <span style={{ display: "inline-block" }}>
                {movesLetters.map((letter, index) => (
                  <motion.span
                    key={`moves-${index}`}
                    custom={index}
                    variants={movesLetterPulseVariants}
                    initial="initial"
                    animate="pulse"
                    style={{
                      display: "inline-block",
                      originY: 0.7,
                    }}
                    className="bg-linear-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </AnimatedUnderlineText>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            Stay ahead of the curve with real-time AI developments, strategic insights, and industry
            trends from leading tech sources.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
              <span>Curated Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
              <span>Expert Analysis</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry Moves Component */}
      <IndustryMoves />

      {/* Additional Info Section */}
      <section className="py-16 bg-card border-t border-cyber-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Why Industry Moves Matter
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-neon-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-neon-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-Time Intelligence</h3>
              <p className="text-muted-foreground">
                Get instant access to breaking AI developments and industry shifts as they happen.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-neon-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-neon-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Strategic Insights</h3>
              <p className="text-muted-foreground">
                Understand the implications of industry moves for your AI strategy and competitive
                positioning.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-neon-purple/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-neon-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Curated Sources</h3>
              <p className="text-muted-foreground">
                Handpicked content from TechCrunch, VentureBeat, The Verge, and other trusted
                industry sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        className="container mx-auto px-6 pb-20 p-10 text-center max-w-6xl"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.25, ease: "easeOut" },
          },
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0 }}
            viewport={{ once: true }}
          >
            <GradientButton
              variant="blue"
              size="lg"
              onClick={() => openContactDrawer({ mode: "contact", source: "industry_moves_cta" })}
            >
              START THE CONVERSATION
              <Mail className="ml-3 h-6 w-6" />
            </GradientButton>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
