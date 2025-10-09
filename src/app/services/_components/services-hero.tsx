"use client";

import { motion, type Variants } from "framer-motion";
import { GradientHero } from "@/components";
import {
  AnimatedUnderlineText,
  PREDEFINED_UNDERLINE_PATHS,
} from "@/components/ui/animated_underline_text";

// Animation variants
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const createLetterPulseVariants = (baseDelay: number, pulseScale = 1.3): Variants => ({
  initial: { scale: 1, letterSpacing: "normal" },
  pulse: (i: number) => ({
    scale: [1, pulseScale, 1],
    letterSpacing: ["normal", "2px", "normal"],
    transition: {
      delay: baseDelay + i * 0.08,
      duration: 0.4,
      ease: "circOut",
    },
  }),
});

const amplifyLetters = "AMPLIFY".split("");
const amplifyBaseDelay = 0;
const amplifyLetterPulseVariants = createLetterPulseVariants(amplifyBaseDelay, 0);

const influenceLetters = "INFLUENCE".split("");
const influenceBaseDelay = 0.2;
const influenceLetterPulseVariants = createLetterPulseVariants(influenceBaseDelay, 0);

export function ServicesHero() {
  return (
    <section className="relative py-16 overflow-hidden border-b-2 border-cyber-border">
      <GradientHero />
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          AI <span className="text-neon-yellow">SERVICES</span> TO{" "}
          <AnimatedUnderlineText
            pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
            underlineClassName="text-white"
            animationDelay={amplifyBaseDelay}
            animationDuration={0.7}
          >
            <span style={{ display: "inline-block" }} className="gradient-text-pink-red">
              {amplifyLetters.map((letter, index) => (
                <motion.span
                  key={`amplify-${index}`}
                  custom={index}
                  variants={amplifyLetterPulseVariants}
                  initial="initial"
                  animate="pulse"
                  style={{ display: "inline-block", originY: 0.7 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </AnimatedUnderlineText>{" "}
          YOUR{" "}
          <AnimatedUnderlineText
            pathDefinition={PREDEFINED_UNDERLINE_PATHS.gentleArc}
            underlineClassName="text-white"
            animationDelay={influenceBaseDelay}
            animationDuration={0.7}
          >
            <span style={{ display: "inline-block" }} className="gradient-text-red-pink">
              {influenceLetters.map((letter, index) => (
                <motion.span
                  key={`influence-${index}`}
                  custom={index}
                  variants={influenceLetterPulseVariants}
                  initial="initial"
                  animate="pulse"
                  style={{ display: "inline-block", originY: 0.7 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </AnimatedUnderlineText>
        </motion.h1>
        <motion.p
          className="text-xl md:text-3xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          I offer a comprehensive suite of AI services designed to empower your business, from
          strategic ideation to full-scale implementation and beyond. Each service is tailored to
          deliver measurable impact and sustainable growth.
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
            <span>Strategy & Consulting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
            <span>Custom Development</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
            <span>Implementation & Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
