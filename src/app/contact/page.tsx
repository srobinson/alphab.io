"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { ContactDrawerForm } from "@/components/contact/contact-drawer-form";
// import { Intro } from "@/components/intro";

export default function ContactPage() {
  return (
    <>
      {/* <Intro /> */}
      <div className="alphab-background min-h-screen flex items-center justify-center py-12 px-1 sm:px-6 lg:px-8 transition-colors duration-300 bg-background">
        <motion.div
          className="max-w-2xl w-full p-2 py-8 space-y-10 sm:p-8 md:p-12
                   rounded-sm shadow-2xl
                   sm:border border-cyber-border bg-card/5 backdrop-blur-cyber"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Mail className="mx-auto h-12 w-12 text-neon-blue" />
            <h2 className="mt-6 text-3xl md:text-4xl font-black text-foreground">
              LET&rsquo;S <span className="text-neon-blue">CONNECT</span>
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Have a project in mind, a question, or just want to explore the possibilities of AI?
              <br />
              I&apos;m here to listen and help you chart the course.
            </p>
          </motion.div>

          <ContactDrawerForm mode="contact" source="contact_page" />
        </motion.div>
      </div>
    </>
  );
}
