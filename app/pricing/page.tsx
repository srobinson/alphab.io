"use client"

import { motion } from "framer-motion"
import { Clock, Calendar, CheckCircle, Receipt, User, Banknote, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mb-2"
          >
            <span className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-1 text-sm font-bold tracking-wider">
              INVESTMENT
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6"
          >
            DIRECT ACCESS TO{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              EXPERTISE
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            No agency overhead. No marketing team markups. Just pure AI expertise and implementation power.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Direct Access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No Overhead</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Pure Expertise</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statement-inspired Pricing Section */}
      <motion.section
        className="container mx-auto px-6 pb-16 pt-10 lg:pb-24 max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="relative">
          {/* Background texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-xl opacity-80"></div>

          {/* Statement header */}
          <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 flex justify-between items-center">
              <div className="flex items-center">
                <Receipt className="h-8 w-8 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">INVESTMENT STATEMENT</h2>
                  <p className="text-blue-100 text-sm">Direct value transfer. No middlemen.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Statement Date</p>
                <p className="font-mono font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Statement body */}
            <div className="p-8 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account Holder</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Your Business
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Service Provider</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">RADE AI Consulting</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Half-Day Engagement</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        5 hours of focused expertise and implementation
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Strategy
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Implementation
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Training
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">$1,000</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">$200/hour value</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Full-Day Immersion</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        12 hours of comprehensive AI transformation
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Deep Dive
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Full Implementation
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Team Training
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">$1,500</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">$125/hour value</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                      <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Community Projects</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        I regularly contribute to worthy causes and community initiatives
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Ask Me
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">Let's Talk</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Flexible arrangements</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statement footer */}
            <div className="p-8 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Direct access to expertise</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">No agency overhead</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Immediate implementation</span>
                  </div>
                </div>
                <Link href="/contact" passHref legacyBehavior>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-bold px-8 py-6 text-lg w-full md:w-auto"
                  >
                    <Banknote className="mr-2 h-5 w-5" />
                    Secure Your Investment
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute -rotate-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <div className="text-black dark:text-white text-[180px] font-black tracking-tighter">PREMIUM</div>
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
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
            THE <span className="text-blue-600 dark:text-blue-500">NEW PARADIGM</span> OF AI CONSULTING
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold flex items-center justify-center mr-3">
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
                <span className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold flex items-center justify-center mr-3">
                  2
                </span>
                The RADE Way
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            READY TO <span className="text-blue-600 dark:text-blue-500">INVEST</span> IN YOUR AI FUTURE?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Whether you're looking for a strategic consultation, implementation support, or exploring a community
            collaboration, let's start the conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" passHref legacyBehavior>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-bold px-8 py-6 text-lg"
              >
                Book Your Consultation
              </Button>
            </Link>
            <Link href="/my-approach" passHref legacyBehavior>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 font-bold px-8 py-6 text-lg"
              >
                Learn More About My Approach
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
