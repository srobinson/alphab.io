"use client" // No changes to this file, props are passed from home-view.tsx

import type React from "react"

import { motion } from "framer-motion"
import { Newspaper } from "lucide-react" // Example icons

interface BriefingItem {
  id: string
  title: string
  summary: string
  icon?: React.ElementType // Optional icon for each briefing
  category?: string
}

interface AiDispatchProps {
  mainHeadline: string
  briefings: BriefingItem[]
  dispatchSource?: string
  dispatchDate?: string
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function AiDispatch({ mainHeadline, briefings, dispatchSource = "RADE AI CORE" }: AiDispatchProps) {
  const currentDate = formatDate(new Date())

  return (
    <motion.div
      className="bg-gray-100/80 dark:bg-black/60 backdrop-blur-md mt-10 border border-gray-300/70 dark:border-gray-700/50 rounded-lg p-6 md:p-8 shadow-2xl w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }} // Delay after title/ticker
    >
      {/* Dispatch Meta Header */}
      <div className="flex items-center justify-between mb-6 mt-2 pb-3 border-b border-gray-300/70 dark:border-gray-700/50">
        <div className="flex items-center text-xs uppercase tracking-wider text-blue-600 dark:text-blue-500 font-semibold">
          <Newspaper className="w-4 h-4 mr-2" />
          <span>Creator Intel</span> {/* Changed from Intel Dispatch */}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">
          <span>{dispatchSource} // </span>
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 dark:from-blue-500 dark:via-cyan-500 dark:to-blue-600 mb-8 leading-tight">
        {mainHeadline}
      </h1>

      {/* Briefings Section */}
      <div className="space-y-6">
        {briefings.map((briefing, index) => {
          const IconComponent = briefing.icon
          return (
            <motion.article
              key={briefing.id}
              className="p-4 bg-gray-200/50 dark:bg-gray-800/40 rounded-md border border-gray-300/50 dark:border-gray-700/40"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .4 + index * 0.2, duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex items-start">
                {IconComponent && (
                  <div className="mr-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-500">
                    <IconComponent className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-grow">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">{briefing.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                    {briefing.summary}
                  </p>
                  {briefing.category && (
                    <p className="mt-3 text-xs text-cyan-600 dark:text-cyan-500 uppercase tracking-wider font-medium">
                      Category: {briefing.category}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </motion.div>
  )
}
