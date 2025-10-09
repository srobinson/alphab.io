// Section showcasing what AlphaB delivers through the RADE practice - emphasizing direct expert access and personal accountability
"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Lightbulb,
  LineChart,
  Presentation,
  Settings2,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

// Business AI consulting capabilities delivered through RADE practice
const creatorPillars = [
  {
    icon: Lightbulb,
    title: "AI STRATEGY THAT WORKS",
    description:
      "I develop clear, actionable AI roadmaps aligned with your business goals. No fluff, no buzzwords - just strategies that identify high-impact opportunities and deliver measurable ROI.",
  },
  {
    icon: BrainCircuit,
    title: "CUSTOM AI BUILT RIGHT",
    description:
      "I build bespoke AI models tailored to your unique challenges. From NLP to computer vision and predictive analytics - you get production-ready solutions, not prototypes.",
  },
  {
    icon: Settings2,
    title: "SEAMLESS INTEGRATION",
    description:
      "I integrate AI into your existing workflows without the drama. Robust deployment, scalability, and minimal disruption - because I've done this dozens of times before.",
  },
  {
    icon: ShieldCheck,
    title: "ETHICAL AI YOU CAN TRUST",
    description:
      "I implement governance frameworks, bias mitigation, and ensure compliance with data privacy regulations. Build AI that your customers and regulators will trust.",
  },
  {
    icon: LineChart,
    title: "DATA INTELLIGENCE THAT MATTERS",
    description:
      "I transform raw data into actionable insights. No vanity metrics - just AI-powered analytics that enable data-driven decisions and optimize performance.",
  },
  {
    icon: Presentation,
    title: "AI PRODUCT STRATEGY",
    description:
      "I help position your AI-driven products for market success. Expert guidance on value proposition, messaging, and go-to-market strategies that resonate.",
  },
  {
    icon: Zap,
    title: "INTELLIGENT AUTOMATION",
    description:
      "I identify automation opportunities and implement AI solutions that increase efficiency and reduce costs. Real automation, not just workflow tools with AI stickers.",
  },
  {
    icon: Users,
    title: "DIRECT EXPERT ACCESS",
    description:
      "You work directly with me, not a team of account managers. I provide training, workshops, and ongoing support to build your internal AI capabilities.",
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
      {/* <motion.h2
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
            </motion.h2> */}

      <motion.div
        className="text-center mb-16 mt-12 md:mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 dark:text-gray-100 mb-6">
          What I Deliver Through RADE
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
          I&rsquo;ve spent years in the trenches building enterprise AI that actually works. Not
          theory. Not hype. Just proven solutions that deliver ROI. You work directly with me, not a
          team of juniors.
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
              className="group h-full space-y-4 p-5 bg-gray-50/70dark:bg-black/50 backdrop-blur-xs rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-700/50 transition-all duration-300 ease-out hover:shadow-2xl dark:hover:shadow-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/70"
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
