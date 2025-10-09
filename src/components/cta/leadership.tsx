"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function LeadershipCTA() {
  return (
    <motion.section
      className="container mx-auto px-6 pb-20 text-center max-w-6xl"
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h3
          className="p-0 text-3xl md:text-4xl lg:text-5xl font-black text-foreground"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          viewport={{ once: true }}
        >
          <div>READY TO LEARN MORE</div>
          <div className="inline-block text-neon-green-500 text-8xl my-8 rounded-full bg-neon-green w-26 h-26">
            <Link href="/my-approach" passHref legacyBehavior>
              <a>?</a>
            </Link>
          </div>
        </motion.h3>
      </div>
    </motion.section>
  );
}
