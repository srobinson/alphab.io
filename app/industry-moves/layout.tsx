import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry Moves | RADE - AI Leadership Solutions",
  description:
    "Stay ahead with the latest AI developments, strategic insights, and industry trends. Real-time updates from leading tech sources and expert analysis.",
  keywords: [
    "AI news",
    "industry trends",
    "artificial intelligence",
    "tech updates",
    "AI developments",
    "strategic insights",
  ],
  openGraph: {
    title: "Industry Moves | RADE - AI Leadership Solutions",
    description:
      "Stay ahead with the latest AI developments, strategic insights, and industry trends.",
    type: "website",
  },
};

export default function IndustryMovesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
