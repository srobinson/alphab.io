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

const approachLetters = "APPROACH".split("");
const approachBaseDelay = 0;
const approachLetterPulseVariants = createLetterPulseVariants(approachBaseDelay, 1.15);

const leadershipLetters = "LEADERSHIP".split("");
const leadershipBaseDelay = 0.2;
const leadershipLetterPulseVariants = createLetterPulseVariants(leadershipBaseDelay, 0);

export function HeroSection() {
  return (
    <section className="relative py-16 bg-background border-b border-cyber-border overflow-hidden">
      <GradientHero />
      <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          MY{" "}
          <AnimatedUnderlineText
            pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
            underlineClassName="text-neon-pink"
            animationDelay={approachBaseDelay}
            animationDuration={0.7}
          >
            <span style={{ display: "inline-block" }} className="text-neon-yellow">
              {approachLetters.map((letter, index) => (
                <motion.span
                  key={`approach-${index}`}
                  custom={index}
                  variants={approachLetterPulseVariants}
                  initial="initial"
                  animate="pulse"
                  style={{ display: "inline-block", originY: 0.7 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </AnimatedUnderlineText>{" "}
          TO AI{" "}
          <AnimatedUnderlineText
            pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
            underlineClassName="text-white"
            animationDelay={approachBaseDelay}
            animationDuration={0.7}
          >
            <span style={{ display: "inline-block" }} className="gradient-text-red-pink">
              {leadershipLetters.map((letter, index) => (
                <motion.span
                  key={`leadership-${index}`}
                  custom={index}
                  variants={leadershipLetterPulseVariants}
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
          Transforming visions into reality requires a meticulous, adaptive, and deeply
          collaborative methodology. My approach is built upon six foundational pillars, ensuring
          every AI solution is powerful, purposeful, and precisely aligned with your strategic
          objectives.
        </motion.p>
      </div>
    </section>
  );
}
