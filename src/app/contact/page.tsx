"use client";

import { motion, type Variants } from "framer-motion";
import { AlertCircle, Bell, CheckCircle, Mail, MessageSquare, Send, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Animation variants remain the same
const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    // Honeypot spam trap
    const company = (formData.get("company") as string) || "";
    if (company.trim().length > 0) {
      // silently succeed to bots
      setIsSubmitting(false);
      return;
    }
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      // Store contact submission via secure API (bypasses RLS server-side)
      const contactResp = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          source: "contact_page",
          subscribed_to_newsletter: subscribeToNewsletter,
        }),
      });
      if (!contactResp.ok) {
        const data = await contactResp.json().catch(() => ({}));
        throw new Error(
          data.error || "Failed to store contact submission. Please try again later."
        );
      }
      const { id: contactId } = await contactResp.json();
      console.log("Contact stored successfully with ID:", contactId);

      // If user wants newsletter subscription, add them via unified API (sends welcome email)
      if (subscribeToNewsletter) {
        try {
          const resp = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              publication: "general",
              source: "contact_page_signup",
              first_name: name.split(" ")[0] || null,
              last_name: name.split(" ").slice(1).join(" ") || null,
            }),
          });
          if (!resp.ok) {
            const data = await resp.json().catch(() => ({}));
            console.warn("Newsletter subscription failed:", data.error || resp.statusText);
          }
        } catch (subscriptionError: unknown) {
          console.warn("Newsletter subscription failed:", subscriptionError);
        }
      }

      // No client notification needed; /api/contacts triggers /api/notify-contact server-side

      setIsSubmitted(true);

      // Reset form
      event.currentTarget.reset();
      setSubscribeToNewsletter(false);
    } catch (err: unknown) {
      console.error("Contact form error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Root container for the page, ensuring it takes full height and applies base theme colors
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-background">
      <motion.div
        className="max-w-2xl w-full space-y-10 p-8 md:p-12
                   rounded-xl shadow-2xl
                   border border-cyber-border bg-card/5 backdrop-blur-cyber"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
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

        {!isSubmitted ? (
          <motion.form className="space-y-8" onSubmit={handleSubmit} variants={itemVariants}>
            {/* Honeypot field */}
            <input
              type="text"
              name="company"
              autoComplete="off"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            <motion.div className="relative" variants={itemVariants}>
              <Label
                htmlFor="name"
                className="absolute -top-3 left-2.5 bg-transparent px-1 text-sm text-muted-foreground"
              >
                <User className="inline-block h-4 w-4 mr-1" /> Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={isSubmitting}
                className="bg-transparent text-white placeholder:text-muted-foreground border-cyber-border focus:border-neon-blue focus:ring-neon-blue/30 disabled:opacity-50"
                placeholder="Your Name"
              />
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <Label
                htmlFor="email"
                className="absolute -top-3 left-2.5 bg-transparent px-1 text-sm text-muted-foreground"
              >
                <Mail className="inline-block h-4 w-4 mr-1" /> Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                className="bg-transparent text-white placeholder:text-muted-foreground border-cyber-border focus:border-neon-blue focus:ring-neon-blue/30 disabled:opacity-50"
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <Label
                htmlFor="message"
                className="absolute -top-3 left-2.5 bg-transparent px-1 text-sm text-muted-foreground"
              >
                <MessageSquare className="inline-block h-4 w-4 mr-1" /> Your Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                required
                disabled={isSubmitting}
                className="bg-transparent text-white placeholder:text-muted-foreground border-cyber-border focus:border-neon-blue focus:ring-neon-blue/30 disabled:opacity-50"
                placeholder="Tell me about your vision or inquiry..."
              />
            </motion.div>

            {/* Newsletter subscription option */}
            <motion.div
              className="flex items-center space-x-3 p-4 bg-neon-blue/5 rounded-lg border border-neon-blue/20"
              variants={itemVariants}
            >
              <input
                type="checkbox"
                id="newsletter"
                checked={subscribeToNewsletter}
                onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <Label
                htmlFor="newsletter"
                className="flex items-center text-sm text-muted-foreground cursor-pointer"
              >
                <Bell className="inline-block h-4 w-4 mr-2 text-neon-blue" />
                Subscribe to newsletter for AI insights and updates
              </Label>
            </motion.div>

            {error && (
              <motion.div
                className="flex items-center space-x-2 p-4 bg-neon-red/5 border border-neon-red/20 rounded-lg"
                variants={itemVariants}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-neon-red text-sm">{error}</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md
                           text-white bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink hover:opacity-90
                           focus:outline-none focus:ring-2 focus:ring-offset-2
                           focus:ring-offset-background
                           focus:ring-neon-blue disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-neon-blue/30"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 text-blue-300 group-hover:text-blue-100" />
                  )}
                </span>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            className="text-center space-y-6 p-8 bg-neon-green/5 rounded-lg border border-neon-green/20"
            variants={itemVariants}
          >
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <div>
              <h3 className="text-2xl font-bold text-neon-green mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-neon-green/80 mb-4">
                Thank you for reaching out. I&rsquo;ll get back to you within 24 hours.
              </p>
              {subscribeToNewsletter && (
                <p className="text-neon-green/80 text-sm">
                  ✓ You&rsquo;ve also been subscribed to our newsletter for AI insights and updates.
                </p>
              )}
            </div>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setError("");
              }}
              className="bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90 text-white shadow-2xl shadow-neon-green/30"
            >
              Send Another Message
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
