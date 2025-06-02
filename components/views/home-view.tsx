"use client"

import { HeroSection } from "@/components/sections/hero-section"
import { CreatorPillars } from "@/components/sections/creator-pillars"
import { CTASection } from "@/components/sections/cta-section"
import { IndustryMoves } from "@/components/industry-moves"

export function HomeView() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white overflow-x-hidden transition-colors duration-200">
      <HeroSection />
      <CreatorPillars />
      <CTASection />
      <IndustryMoves />
    </div>
  )
}
