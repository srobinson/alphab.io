import type { Metadata } from "next";
import { Suspense } from "react";
import { LeadershipCTA } from "@/components/cta";
import { ServiceCard } from "./_components/service-card";
import { ServicesHero } from "./_components/services-hero";

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
  },
];

export const metadata: Metadata = {
  title: "AI Services - AlphaB",
  description:
    "Comprehensive AI services including strategy consulting, custom AI model development, implementation, and ethical AI governance.",
};

export default function ServicesPage() {
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
      <div className="min-h-screen bg-background">
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

        <section className="container mx-auto px-6 pt-6 pb-16 lg:pb-24 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <Suspense
                key={index}
                fallback={
                  <div className="bg-card/50 backdrop-blur-xs p-8 rounded-xl border border-cyber-border animate-pulse">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="h-8 bg-muted rounded w-3/4"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-full mb-2"></div>
                      <div className="h-6 bg-muted rounded w-5/6 mb-6"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-4/5"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                }
              >
                <ServiceCard service={service} index={index} />
              </Suspense>
            ))}
          </div>
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
    </>
  );
}
