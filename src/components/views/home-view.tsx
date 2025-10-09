// Client Component that orchestrates the homepage sections
// This must be a Client Component because it imports animated sections (HeroSection, CreatorPillars, etc.)
// Each section handles its own animations and interactivity
// AlphaB homepage showcasing RADE AI consulting with a personal, direct approach
// Note: CreatorPillars component should be renamed to RADECapabilities or AIConsultingPillars in future refactor
"use client";

import { CreatorPillars } from "@/components/sections/creator-pillars";
import { CTASection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ParadigmInfographic } from "@/components/sections/paradigm-infographic";

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
  );
}
