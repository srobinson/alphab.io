"use client";

import { Suspense } from "react";
import Masonry from "react-masonry-css";
import { ServiceCard, ServicesHero } from "@/app/services";
import { Intro } from "@/components";
import { LeadershipCTA } from "@/components/cta";

const services = [
  {
    iconName: "BrainCircuit",
    title: "AI Strategy & Consulting",
    description:
      "Develop a clear, actionable AI roadmap aligned with your business goals. I help you identify high-impact AI opportunities, assess readiness, and define a strategy for successful AI adoption and transformation.",
    details: [
      "AI Opportunity Assessment & Use Case Identification",
      "AI Readiness & Maturity Evaluation",
      "Custom AI Roadmap Development",
      "Technology Stack & Vendor Selection Advisory",
      "Change Management & AI Adoption Strategy",
    ],
    variant: "blue" as const,
    emoji: "🧠",
  },
  {
    iconName: "Bot",
    title: "Custom AI Model Development",
    description:
      "Leverage the power of bespoke AI models tailored to your unique data and challenges. From Natural Language Processing (NLP) to computer vision and predictive analytics, I build high-performance models that deliver tangible results.",
    details: [
      "Machine Learning (ML) & Deep Learning (DL) Solutions",
      "Natural Language Processing (NLP) & Understanding (NLU)",
      "Computer Vision & Image Analysis Systems",
      "Predictive Analytics & Forecasting Models",
      "Generative AI & LLM-Powered Applications",
    ],
    variant: "purple" as const,
    emoji: "🤖",
  },
  {
    iconName: "Settings2",
    title: "AI Solution Implementation & Integration",
    description:
      "Seamlessly integrate AI capabilities into your existing workflows and systems. I manage the end-to-end implementation process, ensuring robust deployment, scalability, and minimal disruption to your operations.",
    details: [
      "AI System Architecture & Design",
      "Data Pipeline Development & ETL Processes",
      "API Integration & Microservices for AI",
      "Cloud-Based AI Deployment (AWS, Azure, GCP)",
      "Ongoing Model Monitoring & Maintenance",
    ],
    variant: "cyan" as const,
    emoji: "⚙️",
  },
  {
    iconName: "Presentation",
    title: "AI Product Positioning & Go-to-Market",
    description:
      "Position your AI-driven products and services for maximum market impact. I provide expert guidance on value proposition, messaging, and go-to-market strategies to ensure your innovations resonate with your target audience.",
    details: [
      "AI Product Value Proposition & Messaging",
      "Competitive Landscape Analysis for AI Products",
      "Target Audience Segmentation & Persona Development",
      "AI Sales Enablement & Training Materials",
      "Thought Leadership & Content Strategy for AI",
    ],
    variant: "red" as const,
    emoji: "📊",
  },
  {
    iconName: "ShieldCheck",
    title: "Ethical AI & Governance Frameworks",
    description:
      "Build trust and ensure responsible AI practices with robust governance frameworks. I help you navigate the complexities of AI ethics, data privacy, and regulatory compliance, fostering transparency and accountability.",
    details: [
      "AI Ethics Audits & Bias Assessments",
      "Data Governance & Privacy Policies for AI",
      "Explainable AI (XAI) Implementation",
      "Regulatory Compliance (e.g., GDPR, CCPA) for AI Systems",
      "Responsible AI Training & Awareness Programs",
    ],
    variant: "green" as const,
    emoji: "🛡️",
  },
  {
    iconName: "LineChart",
    title: "AI-Driven Business Intelligence & Analytics",
    description:
      "Unlock deeper insights from your data with advanced AI-powered analytics. I help you transform raw data into actionable intelligence, enabling data-driven decision-making and optimizing business performance.",
    details: [
      "Advanced Data Visualization & Reporting",
      "Customer Segmentation & Behavior Analysis",
      "Operational Efficiency & Process Optimization",
      "Market Trend Analysis & Predictive Insights",
      "Custom BI Dashboard Development",
    ],
    variant: "yellow" as const,
    emoji: "📈",
  },
];

export default function HomePage() {
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AlphaB AI Services",
    description:
      "Comprehensive AI services including strategy consulting, custom AI model development, implementation, and ethical AI governance.",
    provider: {
      "@type": "Organization",
      name: "AlphaB",
      url: "https://alphab.io",
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI Services Catalog",
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          category: "AI Services",
        },
        position: index + 1,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesStructuredData),
        }}
      />
      <Suspense
        fallback={
          <div className="alphab-background relative z-10 flex flex-col items-center justify-center h-[100vh] px-4 sm:px-6">
            <div className="animate-pulse space-y-6"></div>
          </div>
        }
      >
        <Intro />
      </Suspense>

      <div className="max-w-9xl">
        <div className="bg-black text-white">
          {/* Hero Section */}
          <Suspense
            fallback={
              <div className="py-16 bg-background border-b border-cyber-border">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                  <div className="animate-pulse space-y-6">
                    <div className="h-16 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            }
          >
            <ServicesHero />
          </Suspense>
        </div>

        <div className="alphab-background">
          <section className="container mx-auto px-6 pt-6 pb-16 lg:pb-24">
            <Masonry
              breakpointCols={{
                default: 2,
                1536: 2, // 2xl
                1280: 2, // xl
                1024: 1, // lg
                768: 1, // md
                640: 1, // sm
              }}
              className="flex -ml-6 w-auto"
              columnClassName="pl-6 bg-clip-padding"
            >
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} index={index} />
              ))}
            </Masonry>
          </section>

          {/* CTA Section */}
          <Suspense
            fallback={
              <div className="container mx-auto px-6 pb-20 text-center max-w-6xl">
                <div className="animate-pulse space-y-6">
                  <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
                  <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
                  <div className="h-16 bg-muted rounded w-64 mx-auto"></div>
                </div>
              </div>
            }
          >
            <LeadershipCTA />
          </Suspense>
        </div>
      </div>
    </>
  );
}
