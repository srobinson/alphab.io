"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface BriefingItem {
  id: string;
  title: string;
  summary: string;
  icon?: React.ElementType;
  category?: string;
}

interface AiDispatchProps {
  mainHeadline: string;
  briefings: BriefingItem[];
  dispatchSource?: string;
  dispatchDate?: string;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function AiDispatch(
  { mainHeadline, briefings, dispatchSource = "RADE AI CORE" }: AiDispatchProps,
) {
  const currentDate = formatDate(new Date());
  const [showHeader, setShowHeader] = useState(false);
  const [creatorIntelText, setCreatorIntelText] = useState("");
  const [dateText, setDateText] = useState("");
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const fullCreatorIntelText = "CREATOR INTEL";
  const fullDateText = `${dispatchSource} // ${currentDate}`;

  // Typewriter effect for Creator Intel
  useEffect(() => {
    if (!showHeader) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullCreatorIntelText.length) {
        setCreatorIntelText(fullCreatorIntelText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Start date text after Creator Intel is complete
        setTimeout(() => {
          let dateIndex = 0;
          const dateInterval = setInterval(() => {
            if (dateIndex <= fullDateText.length) {
              setDateText(fullDateText.slice(0, dateIndex));
              dateIndex++;
            } else {
              clearInterval(dateInterval);
            }
          }, 30);
        }, 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [showHeader, fullCreatorIntelText, fullDateText]);

  // Trigger header reveal when headline comes into view
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				// When headline comes into view, start the typewriter effect
				if (entry.isIntersecting) {
					setShowHeader(true);
				}
			},
			{
				threshold: 0.1, // Trigger when 10% of headline is visible
				rootMargin: "0px",
			},
		);

		const currentHeadline = headlineRef.current;

		if (currentHeadline) {
			observer.observe(currentHeadline);
		}

		return () => {
			if (currentHeadline) {
				observer.unobserve(currentHeadline);
			}
		};
	}, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-md mt-8 md:mt-20 border border-blue-400/30 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 xl:p-20 shadow-2xl shadow-blue-500/25 w-full max-w-7xl mx-auto overflow-hidden relative"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dispatch Meta Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-12 pb-6 border-b border-blue-400/30">
        <div className="flex items-center text-base md:text-lg uppercase tracking-wider text-blue-300 font-bold">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showHeader ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Newspaper className="w-6 h-6 mr-4" />
          </motion.div>
          <span className="font-mono">
            {creatorIntelText}
            {creatorIntelText.length < fullCreatorIntelText.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-blue-400"
              >
                |
              </motion.span>
            )}
          </span>
        </div>
        <div className="text-sm md:text-base text-blue-200/80 font-medium font-mono">
          {dateText}
          {dateText.length < fullDateText.length && dateText.length > 0 && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-blue-400"
            >
              |
            </motion.span>
          )}
        </div>
      </div>

      {/* Main Headline */}
      <motion.h1
        ref={headlineRef}
        className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-200 mb-8 md:mb-16 leading-tight tracking-tight drop-shadow-2xl"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {mainHeadline}
      </motion.h1>

      {/* Briefings List */}
      <div className="relative z-10 space-y-6 md:space-y-8">
        {briefings.map((briefing, index) => {
          const IconComponent = briefing.icon;

          return (
            <motion.article
              key={briefing.id}
              className="relative group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative p-6 md:p-8 lg:p-10 bg-gradient-to-r from-slate-800/90 via-blue-900/30 to-slate-800/90 backdrop-blur-sm rounded-xl md:rounded-2xl border border-blue-400/20 shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:border-blue-400/40 overflow-hidden">
                {/* Card Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex items-start gap-4 md:gap-6">
                  {IconComponent && (
                    <motion.div
                      className="flex-shrink-0 p-3 md:p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-xl shadow-xl"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </motion.div>
                  )}

                  <div className="flex-grow space-y-3 md:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <motion.h2
                        className="text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-200 leading-tight"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        {briefing.title}
                      </motion.h2>
                      {briefing.category && (
                        <motion.span
                          className="inline-block px-3 py-1 text-xs md:text-sm font-bold text-blue-900 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full uppercase tracking-wider shadow-lg flex-shrink-0"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.2 + 0.3,
                          }}
                          viewport={{ once: true, amount: 0.3 }}
                        >
                          {briefing.category}
                        </motion.span>
                      )}
                    </div>

                    <motion.p
                      className="text-base md:text-lg text-blue-100/90 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {briefing.summary}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
