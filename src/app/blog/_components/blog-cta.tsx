"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function BlogCTA() {
  return (
    <motion.section
      className="container mx-auto px-6 py-16 text-center max-w-4xl"
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-2xl p-8 text-white shadow-2xl shadow-neon-blue/30"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-3xl font-black mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          viewport={{ once: true }}
        >
          Stay Ahead of the AI Curve
        </motion.h2>
        <motion.p
          className="text-xl mb-6 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Get daily AI insights delivered to your inbox. Join thousands of AI professionals staying
          informed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="bg-black/80 text-white border-2 border-white/20 hover:bg-black hover:border-white/40 backdrop-blur-sm font-bold px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            asChild
          >
            <Link href="/contact">
              Subscribe Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
