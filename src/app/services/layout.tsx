import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Services & Solutions | Custom AI Development & Consulting",
  description:
    "Comprehensive AI services including strategy consulting, custom AI model development, implementation, and ethical AI governance. Transform your business with expert AI solutions.",
  keywords: [
    "AI services",
    "AI consulting",
    "custom AI development",
    "AI strategy",
    "AI implementation",
    "machine learning services",
    "AI model development",
    "AI integration",
    "ethical AI",
    "AI governance",
    "business intelligence",
    "AI analytics",
  ],
  openGraph: {
    title: "AI Services & Solutions | AlphaB AI Solutions",
    description:
      "Comprehensive AI services including strategy consulting, custom AI model development, implementation, and ethical AI governance.",
    url: "https://alphab.io/services",
    type: "website",
    images: [
      {
        url: "/images/services-og.jpg",
        width: 1200,
        height: 630,
        alt: "AlphaB AI Services - Comprehensive AI Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Services & Solutions | AlphaB AI Solutions",
    description:
      "Comprehensive AI services including strategy consulting, custom AI model development, implementation, and ethical AI governance.",
    images: ["/images/services-twitter.jpg"],
  },
  alternates: {
    canonical: "https://alphab.io/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
