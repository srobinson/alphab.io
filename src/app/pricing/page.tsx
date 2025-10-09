"use client";

import { motion, type Variants } from "framer-motion";
import { Banknote, Calendar, CheckCircle, Clock, Heart, Receipt, User } from "lucide-react";
import Link from "next/link";
import { GradientHero } from "@/components";
import {
  AnimatedUnderlineText,
  createLetterPulseVariants,
  PREDEFINED_UNDERLINE_PATHS,
} from "@/components/ui/animated_underline_text";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { useContactDrawer } from "@/contexts/contact-drawer-context";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 2 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// Animation variants
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 2 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const directLetters = "DIRECT".split("");
const directBaseDelay = 0;
const directLetterPulseVariants = createLetterPulseVariants(directBaseDelay, 1.15);

const accessLetters = "ACCESS".split("");
const accessBaseDelay = 0.2;
const accessLetterPulseVariants = createLetterPulseVariants(accessBaseDelay, 1.15);

export default function PricingPage() {
  const { openContactDrawer } = useContactDrawer();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 bg-background border-b border-cyber-border overflow-hidden">
        <GradientHero />
        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight leading-none"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <AnimatedUnderlineText
              pathDefinition={PREDEFINED_UNDERLINE_PATHS.gentleArc}
              underlineClassName="text-neon-pink"
              animationDelay={directBaseDelay}
              animationDuration={0.2}
            >
              <span style={{ display: "inline-block" }}>
                {directLetters.map((letter, index) => (
                  <motion.span
                    key={`tech-${index}`}
                    custom={index}
                    variants={directLetterPulseVariants}
                    initial="initial"
                    animate="pulse"
                    style={{ display: "inline-block", originY: 0.7 }}
                    className="text-foreground bg-clip-text"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </AnimatedUnderlineText>{" "}
            <AnimatedUnderlineText
              pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
              underlineClassName="text-neon-pink"
              animationDelay={accessBaseDelay}
              animationDuration={0.2}
            >
              <span style={{ display: "inline-block" }}>
                {accessLetters.map((letter, index) => (
                  <motion.span
                    key={`tech-${index}`}
                    custom={index}
                    variants={accessLetterPulseVariants}
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
            TO TECH
          </motion.h1>
          {/* <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-2">
            <span className="bg-linear-to-r from-neon-pink to-neon-purple text-white px-8 py-2 text-sm font-bold tracking-wider">
              INVESTMENT
            </span>
          </motion.div> */}
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            No agency overhead. No marketing team markups. Just pure AI expertise and implementation
            power.
          </motion.p>
        </div>
      </section>

      <div className="blog-background min-h-screen">
        <motion.section
          className="mx-auto px-6 pb-16 pt-10 lg:pb-24 max-w-4xl"
          initial={{ y: 3 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative">
            {/* Statement header */}
            <div className="relative bg-card border-2 border-cyber-border rounded-s overflow-hidden shadow-2xl">
              <div className="bg-black text-white p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <Receipt className="h-8 w-8 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">INVESTMENT STATEMENT</h2>
                    <p className="text-gray-300 text-sm">Direct value transfer. No middlemen.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">Statement Date</p>
                  <p className="font-mono font-bold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Statement body */}
              <div className="p-8 bg-card border-t border-cyber-border">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Holder</p>
                    <p className="text-xl font-bold text-foreground flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Your Business
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Service Provider</p>
                    <p className="text-xl font-bold text-foreground">AlphaB AI Consulting</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-t border-cyber-border">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-sm bg-black/80 flex items-center justify-center mr-4 shrink-0">
                        <Clock className="h-5 w-5 text-neon-yellow" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground">Half-Day Engagement</h3>
                        <p className="text-muted-foreground mt-1">
                          5 hours of focused expertise and implementation
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs uppercase font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 tracking-widest;">
                            Strategy
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs uppercase font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 tracking-widest;">
                            Implementation
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs uppercase font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 tracking-widest;">
                            Training
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xl font-bold text-foreground">$1,000</div>
                      <div className="text-sm text-muted-foreground">$200/hour value</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-cyber-border">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-sm bg-black/80 flex items-center justify-center mr-4 shrink-0">
                        <Calendar className="h-5 w-5 text-neon-yellow" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground">Full-Day Immersion</h3>
                        <p className="text-muted-foreground mt-1">
                          12 hours of comprehensive AI transformation
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs uppercase font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 tracking-widest;">
                            Deep Dive
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs uppercase font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 tracking-widest;">
                            Full Implementation
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs uppercase font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 tracking-widest;">
                            Team Training
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xl font-bold text-foreground">$1,500</div>
                      <div className="text-sm text-muted-foreground">$125/hour value</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-cyber-border">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-sm bg-black/80 flex items-center justify-center mr-4 shrink-0">
                        <Heart className="h-5 w-5 text-neon-yellow" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground">Community Projects</h3>
                        <p className="text-muted-foreground mt-1">
                          I regularly contribute to worthy causes and community initiatives
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs uppercase font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 tracking-widest;">
                            Ask Me
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold text-foreground">
                        Let&rsquo;s Talk
                      </div>
                      <div className="text-sm text-muted-foreground">Flexible arrangements</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statement footer */}
              <div className="p-8 bg-background border-t border-cyber-border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-foreground">Direct access to expertise</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-foreground">No agency overhead</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-foreground">Immediate implementation</span>
                    </div>
                  </div>
                  <GradientButton
                    variant="yellow-red"
                    size="lg"
                    className="uppercase px-6 sm:px-8 py-3 sm:py-4 font-bold tracking-wider text-sm sm:text-base"
                    onClick={() =>
                      openContactDrawer({ mode: "contact", source: "pricing_custom_tier" })
                    }
                  >
                    <Banknote className="mr-2 h-5 w-5" />
                    Secure Your Investment
                  </GradientButton>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute -rotate-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <div className="text-foreground text-[180px] font-black tracking-tighter">
                PREMIUM
              </div>
            </div>
          </div>
        </motion.section>

        {/* Value Proposition Section */}
        {/* <motion.section
        className="container mx-auto px-6 py-16 max-w-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="bg-gray-50dark:bg-black/50 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
            THE <span className="text-pink-600 dark:text-pink-500">NEW PARADIGM</span> OF AI CONSULTING
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="w-8 h-8 rounded-sm bg-pink-600 dark:bg-pink-500 text-white font-bold flex items-center justify-center mr-3">
                  1
                </span>
                The Old Way
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Expensive agency retainers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Multiple layers of account managers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Slow implementation cycles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Generic AI strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Paying for overhead, not expertise</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="w-8 h-8 rounded-sm bg-pink-600 dark:bg-pink-500 text-white font-bold flex items-center justify-center mr-3">
                  2
                </span>
                The AlphaB Way
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Direct access to senior AI expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Focused, high-impact engagements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Immediate implementation and results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Customized AI solutions for your needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>100% of your investment goes to expertise</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section> */}

        {/* Call to Action */}
        <motion.section
          className="container mx-auto px-6 py-0 pb-10 text-center max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
              READY TO <span className="text-neon-pink">INVEST</span> IN YOUR AI FUTURE?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you&rsquo;re looking for a strategic consultation, implementation support, or
              exploring a community collaboration, let&rsquo;s start the conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white dark:bg-pink-500 dark:hover:bg-pink-600 font-bold px-8 py-6 text-lg"
                onClick={() => openContactDrawer({ mode: "contact", source: "pricing_bottom_cta" })}
              >
                Book Your Consultation
              </Button>
              <Link href="/my-approach" passHref legacyBehavior>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-cyber-border hover:border-gray-400 dark:hover:border-gray-600 font-bold px-8 py-6 text-lg"
                >
                  Learn More About My Approach
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
