"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ServicesCTA() {
  return (
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
          className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          viewport={{ once: true }}
        >
          READY TO IGNITE YOUR
          <span className="text-neon-blue">AI STRATEGY</span>?
        </motion.h3>
        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto pb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          viewport={{ once: true }}
        >
          Let&rsquo;s connect. I&rsquo;m here to understand your vision and architect the AI
          solutions that will propel your business into the future.
        </motion.p>
        <Link href="/contact" passHref legacyBehavior>
          <a>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink hover:opacity-90 text-white font-bold px-12 py-6 text-xl shadow-2xl shadow-neon-blue/30"
              >
                START THE CONVERSATION
                <Mail className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>
          </a>
        </Link>
      </div>
    </motion.section>
  );
}
