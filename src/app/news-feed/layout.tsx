import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Feed | AlphaB - AI Intelligence Hub",
  description:
    "Your unified AI intelligence hub combining real-time industry updates with in-depth analysis. Stay ahead with curated news, expert insights, and emerging AI trends.",
  keywords: [
    "AI news feed",
    "AI intelligence hub",
    "AI industry updates",
    "AI blog",
    "tech news",
    "AI analysis",
    "AI observatory",
    "AI trends",
    "machine learning news",
    "artificial intelligence updates",
    "AI insights",
    "tech industry news",
    "AI research",
    "emerging technology",
    "AI developments",
  ],
  authors: [{ name: "AlphaB", url: "https://alphab.io" }],
  creator: "AlphaB",
  publisher: "AlphaB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://alphab.io"),
  alternates: {
    canonical: "https://alphab.io/news-feed",
  },
  openGraph: {
    title: "News Feed | AlphaB - AI Intelligence Hub",
    description:
      "Your unified AI intelligence hub combining real-time industry updates with in-depth analysis. Stay ahead with curated news, expert insights, and emerging AI trends.",
    url: "https://alphab.io/news-feed",
    siteName: "AlphaB",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AlphaB AI News Feed - Intelligence Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI News Feed | Intelligence Hub",
    description:
      "Your unified AI intelligence hub combining real-time industry updates with in-depth analysis. Stay ahead with curated news, expert insights, and emerging AI trends.",
    images: ["/images/twitter-image.jpg"],
    creator: "@alphab_io",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
};

export default function NewsFeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
