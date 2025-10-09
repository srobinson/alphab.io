import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import type React from "react";
import { SkipNav } from "@/components/accessibility/skip-nav";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider"; // Make sure this path is correct
import ScrollToTop from "@/components/utils/scroll-to-top";
import "@/styles/globals.css";
import { Gradient1 } from "@/components";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "AlphaB - AI Solutions & Innovation | Custom AI Development",
    template: "%s | AlphaB",
  },
  description:
    "AlphaB delivers expert AI solutions and consulting services through RADE, our flagship AI consulting practice. Transform your business with ethical AI solutions, strategic implementation, and cutting-edge technologies.",
  keywords: [
    "AlphaB",
    "AI consulting",
    "AI solutions",
    "custom AI development",
    "AI strategy",
    "AI implementation",
    "machine learning consulting",
    "ethical AI",
    "AI transformation",
    "business AI solutions",
    "AI integration",
  ],
  authors: [{ name: "AlphaB" }],
  creator: "AlphaB",
  publisher: "AlphaB",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alphab.io",
    siteName: "AlphaB",
    title: "AlphaB - AI Solutions & Innovation | Custom AI Development",
    description:
      "AlphaB delivers expert AI solutions and consulting services. Transform your business with ethical AI solutions and strategic implementation through our RADE practice.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AlphaB - AI Solutions & Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaB - AI Solutions & Innovation",
    description:
      "AlphaB delivers expert AI solutions and consulting services. Transform your business with ethical AI solutions.",
    images: ["/images/twitter-image.jpg"],
    creator: "@alphab_io",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/favicon-96x96.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-icon-180x180.png",
      },
    ],
  },
  alternates: {
    canonical: "https://alphab.io",
  },
} satisfies Metadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://alphab.io/#organization",
        name: "AlphaB",
        url: "https://alphab.io",
        logo: {
          "@type": "ImageObject",
          url: new URL(
            "/images/alphab-logo.svg",
            metadata.metadataBase || "https://alphab.io"
          ).toString(),
          width: 200,
          height: 200,
        },
        description:
          "AlphaB delivers expert AI solutions and consulting services specializing in ethical AI solutions and strategic implementation through our RADE practice.",
        foundingDate: "2024",
        areaServed: "Worldwide",
        sameAs: ["https://github.com/alphabio", "https://twitter.com/alphab_io"],
      },
      {
        "@type": "WebSite",
        "@id": "https://alphab.io/#website",
        url: "https://alphab.io",
        name: "AlphaB - AI Solutions & Innovation",
        description: "AlphaB delivers expert AI solutions and consulting services",
        publisher: {
          "@id": "https://alphab.io/#organization",
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://alphab.io/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://alphab.io/#service",
        name: "AlphaB AI Solutions",
        image: new URL(
          "/images/alphab-logo.svg",
          metadata.metadataBase || "https://alphab.io"
        ).toString(),
        description: "Professional AI consulting and development services by AlphaB",
        provider: {
          "@id": "https://alphab.io/#organization",
        },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "AI Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Strategy & Consulting",
                description: "Develop clear, actionable AI roadmaps aligned with business goals",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Custom AI Model Development",
                description: "Bespoke AI models tailored to unique data and challenges",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Implementation & Integration",
                description: "Seamless integration of AI capabilities into existing workflows",
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="alphab-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} font-sans relative`}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {/* Animated background pattern */}
        <Gradient1 />
        <SkipNav />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScrollToTop />
          <Header />
          <main id="main-content">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
