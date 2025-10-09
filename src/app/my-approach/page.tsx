"use client";

import { motion, type Variants } from "framer-motion";
import { Brain, Cog, Shield, Target, TrendingUp, Zap } from "lucide-react";
import { Suspense } from "react";
import { ConversationCTA } from "@/components/cta/conversation";
import { Intro } from "@/components/intro";
import { HeroSection } from "./_components";

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

const pillarCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 80 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function MyApproachPage() {
  return (
    <>
      <Intro />
      <div className="max-w-9xl">
        <div className="bg-black text-white">
          {/* Hero Section */}
          <Suspense
            fallback={
              <div className="py-16 bg-background border-b border-cyber-border">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                  <div className="animate-pulse space-y-6">
                    <div className="h-16 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            }
          >
            <HeroSection />
          </Suspense>
        </div>

        <div className="blog-background">
          <section className="container mx-auto px-6 pb-0 pt-10 lg:pb-24">
            <div className="space-y-16">
              {pillarDetails.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    className="group flex flex-col lg:flex-row lg:items-start gap-x-8 gap-y-6 p-6 rounded-lg bg-card/50 backdrop-blur-xs shadow-lg border border-cyber-border transition-all duration-200 ease-out hover:shadow-xl hover:shadow-neon-blue/30 hover:scale-[1.02] hover:border-neon-blue/50"
                    initial="hidden"
                    whileInView="visible"
                    variants={pillarCardVariants}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div className="shrink-0 w-20 h-20 bg-neon-blue/20 border-2 border-neon-blue/40 rounded-xl flex items-center justify-center shadow-lg lg:w-24 lg:h-24 transition-transform duration-200 ease-out group-hover:scale-110">
                      <IconComponent className="w-10 h-10 text-foreground lg:w-12 lg:h-12 transition-transform duration-200 ease-out group-hover:rotate-[-5deg]" />
                    </div>
                    <div className="grow">
                      <h2 className="text-2xl md:text-3xl font-extrabold text-neon-white">
                        {pillar.title}
                      </h2>
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                        {pillar.subtitle}
                      </h3>
                      <p className="text-2xl text-muted-foreground mb-4 leading-relaxed">
                        {pillar.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pillar.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="uppercase px-3 py-1 bg-neon-blue/10 text-neon-yellow border border-neon-blue/20 text-sm font-semibold"
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
          {/* CTA Section */}
          <Suspense
            fallback={
              <div className="container mx-auto px-6 pb-20 text-center max-w-6xl">
                <div className="animate-pulse space-y-6">
                  <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
                  <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
                  <div className="h-16 bg-muted rounded w-64 mx-auto"></div>
                </div>
              </div>
            }
          >
            <ConversationCTA />
          </Suspense>
        </div>
      </div>
    </>
  );
}
