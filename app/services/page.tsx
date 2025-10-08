"use client";

import {
  AnimatedUnderlineText,
  PREDEFINED_UNDERLINE_PATHS,
} from "@/components/ui/animated_underline_text";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  LineChart,
  Mail,
  Presentation,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const services = [
	{
		icon: BrainCircuit,
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
		icon: Bot,
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
		icon: Settings2,
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
		icon: Presentation,
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
		icon: ShieldCheck,
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
		icon: LineChart,
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

const sectionVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
	hidden: { opacity: 0, y: 20, scale: 0.98 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

const createLetterPulseVariants = (baseDelay: number, pulseScale = 1.3) => ({
	initial: { scale: 1, letterSpacing: "normal" },
	pulse: (i: number) => ({
		scale: [1, pulseScale, 1],
		letterSpacing: ["normal", "2px", "normal"],
		transition: {
			delay: baseDelay + i * 0.08,
			duration: 0.4,
			ease: "circOut",
		},
	}),
});

const amplifyLetters = "AMPLIFY".split("");
const amplifyBaseDelay = 0;
const amplifyLetterPulseVariants = createLetterPulseVariants(
	amplifyBaseDelay,
	1.15,
);

const influenceLetters = "INFLUENCE".split("");
const influenceBaseDelay = 0.2;
const influenceLetterPulseVariants = createLetterPulseVariants(
	influenceBaseDelay,
	0,
);

export default function ServicesPage() {
	const servicesStructuredData = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "RADE AI Services",
		description:
			"Comprehensive AI services including strategy consulting, custom AI model development, implementation, and ethical AI governance.",
		provider: {
			"@type": "Organization",
			name: "RADE AI Solutions",
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
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				{/* Hero Section */}
				<section className="py-16 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
					<div className="container mx-auto px-6 max-w-6xl text-center">
						<motion.h1
							className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6"
							initial="hidden"
							animate="visible"
							variants={sectionVariants}
						>
							AI{" "}
							<span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
								SERVICES
							</span>{" "}
							TO{" "}
							<AnimatedUnderlineText
								pathDefinition={PREDEFINED_UNDERLINE_PATHS.slightCurveUp}
								underlineClassName="text-blue-600 dark:text-blue-500"
								animationDelay={amplifyBaseDelay}
								animationDuration={0.7}
							>
								<span style={{ display: "inline-block" }}>
									{amplifyLetters.map((letter, index) => (
										<motion.span
											key={`amplify-${index}`}
											custom={index}
											variants={amplifyLetterPulseVariants}
											initial="initial"
											animate="pulse"
											style={{ display: "inline-block", originY: 0.7 }}
										>
											{letter}
										</motion.span>
									))}
								</span>
							</AnimatedUnderlineText>{" "}
							YOUR{" "}
							<AnimatedUnderlineText
								pathDefinition={PREDEFINED_UNDERLINE_PATHS.gentleArc}
								underlineClassName="text-blue-600 dark:text-blue-500"
								animationDelay={influenceBaseDelay}
								animationDuration={0.7}
							>
								<span style={{ display: "inline-block" }}>
									{influenceLetters.map((letter, index) => (
										<motion.span
											key={`influence-${index}`}
											custom={index}
											variants={influenceLetterPulseVariants}
											initial="initial"
											animate="pulse"
											style={{ display: "inline-block", originY: 0.7 }}
										>
											{letter}
										</motion.span>
									))}
								</span>
							</AnimatedUnderlineText>
						</motion.h1>
						<motion.p
							className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							I offer a comprehensive suite of AI services designed to empower
							your business, from strategic ideation to full-scale
							implementation and beyond. Each service is tailored to deliver
							measurable impact and sustainable growth.
						</motion.p>
						<motion.div
							className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.24 }}
						>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
								<span>Strategy & Consulting</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>Custom Development</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
								<span>Implementation & Support</span>
							</div>
						</motion.div>
					</div>
				</section>

				<section className="container mx-auto px-6 pt-6 pb-16 lg:pb-24 max-w-6xl">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
						{services.map((service, index) => {
							const IconComponent = service.icon;
							return (
								<motion.div
									key={index}
									className="group bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700/60 flex flex-col transition-all duration-200 ease-out hover:shadow-xl dark:hover:shadow-blue-500/30 hover:scale-[1.03] hover:border-blue-400 dark:hover:border-blue-500"
									initial="hidden"
									whileInView="visible"
									variants={cardVariants}
									viewport={{ once: true, amount: 0.1 }}
								>
									<div className="flex items-start mb-6">
										<div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center mr-4 transition-transform duration-200 ease-out group-hover:scale-110 flex-shrink-0">
											<IconComponent className="w-6 h-6 text-white transition-transform duration-200 ease-out group-hover:rotate-[-3deg]" />
										</div>
										<h2 className="text-2xl font-black text-blue-600 dark:text-blue-400">
											{service.title}
										</h2>
									</div>
									<p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
										{service.description}
									</p>
									<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
										{service.details.map((detail) => (
											<li
												key={detail}
												className="flex items-start transition-colors duration-150 ease-out hover:text-blue-600 dark:hover:text-blue-400"
											>
												<span className="text-blue-600 dark:text-blue-500 mr-2 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors duration-150 ease-out">
													&#10003;
												</span>
												{detail}
											</li>
										))}
									</ul>
								</motion.div>
							);
						})}
					</div>
				</section>

				<motion.section
					className="container mx-auto px-6 pb-20 text-center max-w-6xl"
					initial="hidden"
					whileInView="visible"
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: {
							opacity: 1,
							y: 0,
							transition: { duration: 0.6, ease: "easeOut" },
						},
					}}
					viewport={{ once: true, amount: 0.2 }}
				>
					<div className="max-w-4xl mx-auto space-y-8">
						<motion.h3
							className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0 }}
							viewport={{ once: true }}
						>
							READY TO IGNITE YOUR
							<span className="text-blue-600 dark:text-blue-500">
								AI STRATEGY
							</span>
							?
						</motion.h3>
						<motion.p
							className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto pb-10"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0 }}
							viewport={{ once: true }}
						>
							Let&rsquo;s connect. I&rsquo;m here to understand your vision and
							architect the AI solutions that will propel your business into the
							future.
						</motion.p>
						<Link href="/contact" passHref legacyBehavior>
							<a>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0 }}
									viewport={{ once: true }}
								>
									<Button
										size="lg"
										className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-bold px-12 py-6 text-xl"
									>
										START THE CONVERSATION
										<Mail className="ml-3 h-6 w-6" />
									</Button>
								</motion.div>
							</a>
						</Link>
					</div>
				</motion.section>
			</div>
		</>
	);
}
