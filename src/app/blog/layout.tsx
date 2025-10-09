import type { Metadata } from "next";
import "./blog-background.css";

export const metadata: Metadata = {
  title: "AI Tech Blog | Daily AI Insights & Technology Analysis",
  description:
    "Daily insights into cutting-edge AI technologies, research papers, and emerging tech trends. Stay ahead with expert analysis of the latest AI developments.",
  keywords: [
    "AI blog",
    "AI news",
    "AI research",
    "machine learning blog",
    "AI technology trends",
    "AI insights",
    "tech analysis",
    "AI papers",
    "emerging AI tech",
    "AI developments",
  ],
  openGraph: {
    title: "AI Tech Blog | Daily AI Insights & Technology Analysis",
    description:
      "Daily insights into cutting-edge AI technologies, research papers, and emerging tech trends.",
    url: "https://alphab.io/blog",
    type: "website",
    images: [
      {
        url: "/images/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "AlphaB AI Blog - Daily AI Technology Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tech Blog | Daily AI Insights",
    description:
      "Daily insights into cutting-edge AI technologies, research papers, and emerging tech trends.",
    images: ["/images/blog-twitter.jpg"],
  },
  alternates: {
    canonical: "https://alphab.io/blog",
    types: {
      "application/rss+xml": [
        {
          url: "https://alphab.io/blog/rss.xml",
          title: "AlphaB AI Blog RSS Feed",
        },
      ],
    },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-background min-h-screen">{children}</div>;
}
