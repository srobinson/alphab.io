import { SkipNav } from "@/components/accessibility/skip-nav";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { ThemeProvider } from "@/components/theme-provider"; // Make sure this path is correct
import ScrollToTop from "@/components/utils/scroll-to-top";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
	),
	title: {
		default: "RADE - AI Solutions & Consulting | Custom AI Development",
		template: "%s | RADE - AI Solutions",
	},
	description:
		"Expert AI consulting and custom AI development services. Transform your business with ethical AI solutions, strategic implementation, and cutting-edge AI technologies. Get your AI strategy today.",
	keywords: [
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
	authors: [{ name: "RADE AI Solutions" }],
	creator: "RADE AI Solutions",
	publisher: "RADE AI Solutions",
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
		siteName: "RADE - AI Solutions",
		title: "RADE - AI Solutions & Consulting | Custom AI Development",
		description:
			"Expert AI consulting and custom AI development services. Transform your business with ethical AI solutions and strategic implementation.",
		images: [
			{
				url: "/images/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "RADE AI Solutions - Expert AI Consulting Services",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "RADE - AI Solutions & Consulting",
		description:
			"Expert AI consulting and custom AI development services. Transform your business with ethical AI solutions.",
		images: ["/images/twitter-image.jpg"],
		creator: "@rade_ai",
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
				name: "RADE AI Solutions",
				url: "https://alphab.io",
				logo: {
					"@type": "ImageObject",
					url: "https://alphab.io/images/rade-logo.svg",
					width: 200,
					height: 200,
				},
				description:
					"Expert AI consulting and custom AI development services specializing in ethical AI solutions and strategic implementation.",
				foundingDate: "2024",
				areaServed: "Worldwide",
				serviceType: [
					"AI Consulting",
					"Custom AI Development",
					"AI Strategy",
					"AI Implementation",
					"Machine Learning Solutions",
				],
				sameAs: [
					"https://linkedin.com/company/rade-ai",
					"https://twitter.com/rade_ai",
				],
			},
			{
				"@type": "WebSite",
				"@id": "https://alphab.io/#website",
				url: "https://alphab.io",
				name: "RADE - AI Solutions",
				description: "Expert AI consulting and custom AI development services",
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
				name: "RADE AI Solutions",
				image: "https://alphab.io/images/rade-logo.svg",
				description: "Professional AI consulting and development services",
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
								description:
									"Develop clear, actionable AI roadmaps aligned with business goals",
							},
						},
						{
							"@type": "Offer",
							itemOffered: {
								"@type": "Service",
								name: "Custom AI Model Development",
								description:
									"Bespoke AI models tailored to unique data and challenges",
							},
						},
						{
							"@type": "Offer",
							itemOffered: {
								"@type": "Service",
								name: "AI Implementation & Integration",
								description:
									"Seamless integration of AI capabilities into existing workflows",
							},
						},
					],
				},
			},
		],
	};

	// Determine host to decide whether to render RADE header
	const headersList = await headers();
	const host = headersList.get("host") || "";
	const isRadeHost = host.includes("rade.");

	return (
		<html lang="en" suppressHydrationWarning>
			{/* <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head> */}
			<body className={inter.className}>
				{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
					<GoogleAnalytics
						measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
					/>
				)}
				<SkipNav />
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<ScrollToTop />
					{isRadeHost ? <ConditionalHeader /> : null}
					<main id="main-content">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
