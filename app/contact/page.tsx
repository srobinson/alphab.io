"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle, Bell } from "lucide-react"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    try {
      if (!supabase) {
        throw new Error('Database connection not available. Please try again later.')
      }

      // Store contact submission
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .insert({
          name: name,
          email: email,
          message: message,
          source: 'contact_page',
          ip_address: null,
          user_agent: navigator.userAgent,
          subscribed_to_newsletter: subscribeToNewsletter
        })
        .select('id')

      if (contactError) {
        throw new Error('Failed to store contact submission. Please try again later.')
      }

      const contactId = contactData[0]?.id;

      // If user wants newsletter subscription, add them
      if (subscribeToNewsletter) {
        try {
          const { error: subscriptionError } = await supabase.rpc('upsert_user_and_subscribe', {
            p_email: email,
            p_publication: 'general',
            p_source: 'contact_page_signup',
            p_first_name: name.split(' ')[0] || null,
            p_last_name: name.split(' ').slice(1).join(' ') || null,
            p_user_agent: navigator.userAgent
          })

          if (subscriptionError) {
            console.warn('Newsletter subscription failed:', subscriptionError)
            // Don't fail the whole form if newsletter signup fails
          }
        } catch (subscriptionError) {
          console.warn('Newsletter subscription failed:', subscriptionError)
        }
      }

      // Track analytics event
      try {
        await supabase.rpc('track_analytics_event', {
          p_event_type: 'contact_form',
          p_event_name: 'form_submitted',
          p_properties: {
            source: 'contact_page',
            has_newsletter_signup: subscribeToNewsletter
          },
          p_page_url: window.location.href,
          p_user_agent: navigator.userAgent
        })
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError)
      }

      setIsSubmitted(true)

      // Send notification (don't fail the form if this fails)
      try {
        const response = await fetch('/api/notify-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactId: contactId,
            notificationType: 'new_contact'
          })
        })

        if (response.ok) {
          console.log('Notification sent successfully')
        }
      } catch (notificationError) {
        console.warn('Failed to send notification:', notificationError)
      }

      // Reset form
      event.currentTarget.reset()
      setSubscribeToNewsletter(false)

    } catch (err: any) {
      console.error('Contact form error:', err)
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // Root container for the page, ensuring it takes full height and applies base theme colors
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
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

        {!isSubmitted ? (
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
                disabled={isSubmitting}
                className="bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-offset-white dark:ring-offset-black focus:ring-blue-500 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-offset-white dark:ring-offset-black focus:ring-blue-500 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-offset-white dark:ring-offset-black focus:ring-blue-500 disabled:opacity-50"
                placeholder="Tell me about your vision or inquiry..."
              />
            </motion.div>

            {/* Newsletter subscription option */}
            <motion.div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800" variants={itemVariants}>
              <input
                type="checkbox"
                id="newsletter"
                checked={subscribeToNewsletter}
                onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <Label htmlFor="newsletter" className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <Bell className="inline-block h-4 w-4 mr-2 text-blue-500" />
                Subscribe to newsletter for AI insights and updates
              </Label>
            </motion.div>

            {error && (
              <motion.div
                className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                variants={itemVariants}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md
                           text-white bg-blue-600 hover:bg-blue-700
                           dark:bg-blue-500 dark:hover:bg-blue-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2
                           focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900
                           focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 text-blue-300 group-hover:text-blue-100" />
                  )}
                </span>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            className="text-center space-y-6 p-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            variants={itemVariants}
          >
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-400 mb-4">
                Thank you for reaching out. I'll get back to you within 24 hours.
              </p>
              {subscribeToNewsletter && (
                <p className="text-green-600 dark:text-green-400 text-sm">
                  ✓ You've also been subscribed to our newsletter for AI insights and updates.
                </p>
              )}
            </div>
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setError('')
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Send Another Message
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
