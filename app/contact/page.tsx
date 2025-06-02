"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Send, Mail, User, MessageSquare } from "lucide-react"

// Animation variants remain the same
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function ContactPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    alert("Form submitted! (This is a placeholder)")
  }

  return (
    // Root container for the page, ensuring it takes full height and applies base theme colors
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        className="max-w-2xl w-full space-y-10 p-8 md:p-12 
                   bg-gray-50 dark:bg-gray-900/50 
                   rounded-xl shadow-2xl 
                   border border-gray-200 dark:border-gray-700/60 
                   dark:backdrop-blur-md"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <Mail className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-500" />
          <h2 className="mt-6 text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            LET'S <span className="text-blue-600 dark:text-blue-400">CONNECT</span>
          </h2>
          <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
            Have a project in mind, a question, or just want to explore the possibilities of AI?
            <br />
            I'm here to listen and help you chart the course.
          </p>
        </motion.div>

        <motion.form className="space-y-8" onSubmit={handleSubmit} variants={itemVariants}>
          <motion.div className="relative" variants={itemVariants}>
            <Label
              htmlFor="name"
              className="absolute -top-3 left-2.5 bg-gray-50 dark:bg-gray-900/0 px-1 text-sm text-gray-600 dark:text-gray-400"
            >
              <User className="inline-block h-4 w-4 mr-1" /> Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              className="bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-offset-white dark:ring-offset-black focus:ring-blue-500"
              placeholder="Your Name"
            />
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <Label
              htmlFor="email"
              className="absolute -top-3 left-2.5 bg-gray-50 dark:bg-gray-900/0 px-1 text-sm text-gray-600 dark:text-gray-400"
            >
              <Mail className="inline-block h-4 w-4 mr-1" /> Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-offset-white dark:ring-offset-black focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <Label
              htmlFor="message"
              className="absolute -top-3 left-2.5 bg-gray-50 dark:bg-gray-900/0 px-1 text-sm text-gray-600 dark:text-gray-400"
            >
              <MessageSquare className="inline-block h-4 w-4 mr-1" /> Your Message
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              required
              className="bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-offset-white dark:ring-offset-black focus:ring-blue-500"
              placeholder="Tell me about your vision or inquiry..."
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full group relative flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md 
                         text-white bg-blue-600 hover:bg-blue-700 
                         dark:bg-blue-500 dark:hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 
                         focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Send className="h-5 w-5 text-blue-300 group-hover:text-blue-100" />
              </span>
              Send Message
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}
