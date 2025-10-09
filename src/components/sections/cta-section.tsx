// CTA section that encourages businesses to engage directly with AlphaB for RADE AI consulting services - emphasizing the personal, collaborative approach
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <motion.section
      className="container mx-auto px-6 py-2 my-2 text-center max-w-6xl"
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.33, ease: "easeIn" },
        },
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h3
          className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.33, delay: 0 }}
          viewport={{ once: true }}
        >
          READY TO <span className="text-blue-600 dark:text-blue-500">TRANSFORM</span> YOUR BUSINESS
          WITH AI?
        </motion.h3>
        <motion.p
          className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.33, delay: 0 }}
          viewport={{ once: true }}
        >
          Let&rsquo;s build your AI strategy together. I&rsquo;ll work directly with you to develop
          solutions that drive innovation, optimize operations, and deliver measurable results. No
          corporate layers, just expert guidance.
        </motion.p>
        <motion.div
          className="pt-10"
          initial={{ opacity: 0, y: 10, padding: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.33, delay: 0 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-bold px-12 py-6 text-xl"
          >
            <Link
              href="/my-approach"
              aria-label="Let's Talk Strategy - Get started with RADE AI Solutions"
              role="button"
            >
              Let&rsquo;s Talk Strategy
              <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
