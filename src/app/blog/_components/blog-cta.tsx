"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Gradient2 } from "@/components";
import { Button } from "@/components/ui/button";
import { useContactDrawer } from "@/contexts/contact-drawer-context";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function BlogCTA() {
  const { openContactDrawer } = useContactDrawer();

  return (
    <motion.section
      className="relative blog-background p-6 py-28 text-center"
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Gradient2 />
      <motion.div
        className="absolute inset-1"
        initial={{ opacity: 1, scale: 0.95 }}
        whileInView={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        viewport={{ once: true }}
      ></motion.div>
      <motion.div
        className="relative inset-1 p-2 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-neon-yellow mb-12 tracking-tight leading-none uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          viewport={{ once: true }}
        >
          Stay Ahead of the AI Curve
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              openContactDrawer({ mode: "newsletter", source: "blog_cta" });
            }}
          >
            <Button
              size="lg"
              className="bg-black/80 uppercase text-white border-2 border-white/20 hover:bg-black hover:border-white/40 backdrop-blur-xs font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl px-20 py-8"
            >
              Subscribe Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </motion.div>
        <motion.div
          className="text-xl m-12 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>Get daily AI insights delivered to your inbox</p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
