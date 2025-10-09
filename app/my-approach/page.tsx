"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Brain, Cog, Shield, Target, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const pillarDetails = [
  {
    icon: Brain,
    title: "DEEP IMMERSION & DISCOVERY",
    subtitle: "Understanding Your Unique Frequency",
    description:
      "My process begins with a profound dive into your business's core, its operational DNA, market positioning, and specific challenges. I don't just listen; I analyze, question, and immerse myself to truly understand your vision and the nuances of your industry. This phase is about mapping your existing landscape and identifying the most impactful opportunities for AI integration.",
    keywords: [
      "Business Analysis",
      "Requirement Elicitation",
      "Opportunity Mapping",
      "Stakeholder Workshops",
    ],
  },
  {
    icon: Cog,
    title: "BESPOKE SOLUTION ARCHITECTURE",
    subtitle: "Engineering Your AI Blueprint",
    description:
      "One-size-fits-all has no place in transformative AI. I architect custom AI solutions and infrastructures meticulously tailored to your specific objectives and existing systems. This involves selecting the right models, designing data pipelines, and ensuring scalability, security, and ethical considerations are woven into the fabric of the design from day one.",
    keywords: [
      "Custom AI Models",
      "System Design",
      "Data Strategy",
      "Scalable Infrastructure",
      "Ethical AI Frameworks",
    ],
  },
  {
    icon: Shield,
    title: "ETHICAL & RESPONSIBLE AI",
    subtitle: "Integrity at Every Stage",
    description:
      "Building trust is paramount in AI. I am committed to developing and deploying AI solutions that are not only powerful but also transparent, fair, and accountable. This includes robust data governance, bias detection and mitigation strategies, and clear explanations of AI decision-making processes to ensure your AI initiatives are a force for good.",
    keywords: [
      "AI Ethics",
      "Data Privacy",
      "Bias Mitigation",
      "Transparency",
      "Regulatory Compliance",
    ],
  },
  {
    icon: Target,
    title: "PRECISION IMPLEMENTATION & INTEGRATION",
    subtitle: "Surgical Deployment for Seamless Adoption",
    description:
      "A brilliant strategy is only as good as its execution. I oversee the meticulous implementation of the designed AI solutions, ensuring seamless integration with your existing workflows and technologies. This phase focuses on rigorous testing, iterative refinement, and minimizing disruption to your operations, leading to a smooth transition and rapid value realization.",
    keywords: [
      "Agile Deployment",
      "System Integration",
      "Quality Assurance",
      "Change Management",
      "Performance Monitoring",
    ],
  },
  {
    icon: Zap,
    title: "STRATEGIC INNOVATION & FUTURE-PROOFING",
    subtitle: "Pioneering Your Competitive Edge",
    description:
      "The AI landscape evolves at lightning speed. My approach incorporates continuous learning and adaptation, ensuring your AI solutions not only solve today's problems but also position you for future opportunities. I help you build a culture of AI-driven innovation, identifying emerging trends and technologies to keep you ahead of the curve.",
    keywords: [
      "Emerging Technologies",
      "R&D",
      "Innovation Strategy",
      "Continuous Improvement",
      "Future-State Planning",
    ],
  },
  {
    icon: TrendingUp,
    title: "SCALABLE GROWTH & OPTIMIZATION",
    subtitle: "Evolving with Your Ambitions",
    description:
      "Your AI capabilities should grow with your business. I design systems that are inherently scalable and focus on continuous optimization post-deployment. This involves establishing key performance indicators (KPIs), monitoring outcomes, and iteratively enhancing the solutions to maximize ROI and adapt to your evolving business needs.",
    keywords: [
      "Performance Optimization",
      "Scalability Planning",
      "ROI Measurement",
      "Iterative Enhancement",
      "Long-term Partnership",
    ],
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const pillarCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function MyApproachPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight md:leading-tight lg:leading-tight"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            MY{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              APPROACH
            </span>{" "}
            TO AI
            <span style={{ display: "block", marginTop: "0.1em" }}>LEADERSHIP</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transforming visions into reality requires a meticulous, adaptive, and deeply
            collaborative methodology. My approach is built upon six foundational pillars, ensuring
            every AI solution is powerful, purposeful, and precisely aligned with your strategic
            objectives.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.23 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Six Core Pillars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Collaborative Methodology</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Strategic Alignment</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-0 pt-10 lg:pb-24 max-w-6xl">
        <div className="space-y-16">
          {pillarDetails.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                className="group flex flex-col lg:flex-row lg:items-start gap-x-8 gap-y-6 p-6 rounded-lg bg-white dark:bg-gray-900/20 shadow-lg dark:shadow-gray-800/30 border border-gray-200 dark:border-gray-700/40 transition-all duration-200 ease-out hover:shadow-xl dark:hover:shadow-blue-500/30 hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-500"
                initial="hidden"
                whileInView="visible"
                variants={pillarCardVariants}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg lg:w-24 lg:h-24 transition-transform duration-200 ease-out group-hover:scale-110">
                  <IconComponent className="w-10 h-10 text-white lg:w-12 lg:h-12 transition-transform duration-200 ease-out group-hover:rotate-[-5deg]" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 mb-2">
                    {pillar.title}
                  </h2>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    {pillar.subtitle}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {pillar.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs bg-gray-200 text-blue-700 dark:bg-gray-700 dark:text-blue-300 px-3 py-1 rounded-full transition-colors duration-150 ease-out hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 cursor-default"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className="container mx-auto px-6 pb-20 text-center max-w-6xl"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.h3
            className="p-0 text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
          >
            READY TO EXPLORE OUR
            <span className="text-blue-600 dark:text-blue-500">AI SERVICES</span>?
          </motion.h3>
          <motion.p
            className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto pb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
          >
            Discover the comprehensive suite of AI services designed to transform your business and
            amplify your competitive advantage.
          </motion.p>
          <Link href="/services" passHref legacyBehavior>
            <a>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-bold px-12 py-6 text-xl"
                >
                  EXPLORE SERVICES
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </a>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
