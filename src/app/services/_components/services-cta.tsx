"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { useContactDrawer } from "@/contexts/contact-drawer-context";

export function ServicesCTA() {
  const { openContactDrawer } = useContactDrawer();

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              openContactDrawer({ mode: "contact", source: "services_cta" });
            }}
          >
            <GradientButton variant="blue" size="lg">
              START THE CONVERSATION
              <Mail className="ml-3 h-6 w-6" />
            </GradientButton>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
