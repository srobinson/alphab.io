"use client"

import { HeroSection } from "@/components/sections/hero-section"
import { CreatorPillars } from "@/components/sections/creator-pillars"
import { ParadigmInfographic } from "@/components/sections/paradigm-infographic"
import { CTASection } from "@/components/sections/cta-section"

export function HomeView() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white overflow-x-hidden transition-colors duration-200">
      <HeroSection />
      <CreatorPillars />
      <div className="px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <ParadigmInfographic />
        </div>
      </div>
      <CTASection />
    </div>
  )
}