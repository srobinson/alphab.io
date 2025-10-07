import { Button } from "@/components/ui/button";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import MarkdownIt from "markdown-it";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import { ShareButtons } from "./share-buttons";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

const markdown = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
});

type BlogPost = {
	slug: string;
	title: string;
	description: string;
	category: string;
	date: string;
	publishedAt?: string;
	readTime: string;
	author: string;
	tags: string[];
	seoKeywords: string[];
	generated: boolean;
	contentHtml: string;
	wordCount: number;
};

type ParamsPromise = Promise<{ slug: string }>;

type MetadataShape = {
	title?: string;
	description?: string;
	category?: string;
	date?: string;
	publishedAt?: string;
	readTime?: string;
	author?: string;
	tags?: unknown;
	seo?: {
		keywords?: unknown;
	};
	generated?: boolean;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const toStringArray = (value: unknown): string[] =>
	Array.isArray(value)
		? value.filter((entry): entry is string => typeof entry === "string")
		: [];

async function loadPost(slug: string): Promise<BlogPost | null> {
	const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
	const metaPath = path.join(CONTENT_DIR, `${slug}.meta.json`);

	let rawMdx: string;
	try {
		rawMdx = await fs.readFile(mdxPath, "utf8");
	} catch {
		return null;
	}

	const parsed = matter(rawMdx);
	let metadata: MetadataShape = {};

	if (isObject(parsed.data)) {
		metadata = { ...metadata, ...(parsed.data as MetadataShape) };
	}

	try {
		const rawMeta = await fs.readFile(metaPath, "utf8");
		const parsedMeta = JSON.parse(rawMeta);
		if (isObject(parsedMeta)) {
			metadata = { ...metadata, ...(parsedMeta as MetadataShape) };
		}
	} catch {
		// Optional metadata file
	}

	const contentHtml = markdown.render(parsed.content);

	const wordCount = (parsed.content.match(/\w+/g) || []).length;
	const readTime = metadata.readTime ||
		`${Math.max(1, Math.ceil(wordCount / 200))} min read`;

	const tags = toStringArray(metadata.tags);
	const seoKeywords = toStringArray(metadata.seo?.keywords);
	const author = typeof metadata.author === "string"
		? metadata.author
		: "RADE AI Solutions";
	const category = typeof metadata.category === "string"
		? metadata.category
		: "AI Insights";
	const title = typeof metadata.title === "string" ? metadata.title : slug;
	const description = typeof metadata.description === "string"
		? metadata.description
		: "";
	const date = typeof metadata.date === "string"
		? metadata.date
		: new Date().toISOString();
	const publishedAt = typeof metadata.publishedAt === "string"
		? metadata.publishedAt
		: metadata.date;

	return {
		slug,
		title,
		description,
		category,
		date,
		publishedAt: publishedAt || date,
		readTime,
		author,
		tags,
		seoKeywords,
		generated: Boolean(metadata.generated),
		contentHtml,
		wordCount,
	};
}

export async function generateMetadata({
	params,
}: {
	params: ParamsPromise;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = await loadPost(slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	const published = post.publishedAt || post.date;

	return {
		title: `${post.title} | RADE AI Blog`,
		description: post.description,
		keywords: post.seoKeywords.length > 0 ? post.seoKeywords : post.tags,
		authors: [{ name: post.author }],
		openGraph: {
			title: post.title,
			description: post.description,
			url: `https://rade.alphab.io/blog/${post.slug}`,
			type: "article",
			publishedTime: published,
			authors: [post.author],
			tags: post.tags,
			images: [
				{
					url: `/images/blog/${post.slug}-og.jpg`,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
			images: [`/images/blog/${post.slug}-twitter.jpg`],
		},
		alternates: {
			canonical: `https://rade.alphab.io/blog/${post.slug}`,
		},
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: ParamsPromise;
}) {
	const { slug } = await params;
	const post = await loadPost(slug);

	if (!post) {
		notFound();
	}

	const published = post.publishedAt || post.date;

	const articleStructuredData = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		image: `https://alphab.io/images/blog/${post.slug}-og.jpg`,
		author: {
			"@type": "Person",
			name: post.author,
			url: "https://alphab.io",
		},
		publisher: {
			"@type": "Organization",
			name: "RADE AI Solutions",
			logo: {
				"@type": "ImageObject",
				url: "https://alphab.io/images/rade-logo.svg",
			},
		},
		datePublished: published,
		dateModified: published,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://rade.alphab.io/blog/${post.slug}`,
		},
		keywords: post.seoKeywords.length > 0
			? post.seoKeywords.join(", ")
			: post.tags.join(", "),
		articleSection: post.category,
		wordCount: post.wordCount,
		timeRequired: post.readTime,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(articleStructuredData),
				}}
			/>
			<article className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
				{/* Decorative gradient overlay */}
				<div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
					<div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
				</div>

				{/* Navigation */}
				<nav className="relative container mx-auto px-6 py-8 max-w-5xl">
					<Link
						href="/blog"
						className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all hover:gap-3 gap-2 group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						<span className="font-medium">Back to Blog</span>
					</Link>
				</nav>

				{/* Article Container - Header + Content as one block */}
				<div className="relative container mx-auto px-6 pb-12 max-w-5xl">
					<div className="relative bg-white dark:bg-gray-900/50 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm overflow-hidden">
						{/* Decorative corner accents */}
						<div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-blue-500/20 dark:border-blue-400/20 rounded-tl-3xl" />
						<div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-purple-500/20 dark:border-purple-400/20 rounded-br-3xl" />

						{/* Header Section with gradient background */}
						<header className="relative bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent p-8 md:p-12">
							<div className="relative z-10">
								<div className="flex flex-wrap items-center gap-3 mb-6">
									<span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/25">
										{post.category}
									</span>
									<div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
										<Calendar className="w-4 h-4 mr-1.5" />
										{new Date(published).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</div>
									<div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
										<Clock className="w-4 h-4 mr-1.5" />
										{post.readTime}
									</div>
								</div>

								<h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
									{post.title}
								</h1>

								<p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-light">
									{post.description}
								</p>

								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-300/50 dark:border-gray-700/50">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
											{post.author.charAt(0)}
										</div>
										<div>
											<div className="text-sm text-gray-600 dark:text-gray-400">
												Written by
											</div>
											<div className="font-semibold text-gray-900 dark:text-white">
												{post.author}
											</div>
										</div>
									</div>

									<ShareButtons
										slug={post.slug}
										title={post.title}
										description={post.description}
									/>
								</div>
							</div>
						</header>

						{/* Article Content - seamlessly connected */}
						<main className="relative p-8 md:p-12 lg:px-16 lg:py-12">
							<div
								className="prose prose-lg dark:prose-invert max-w-none 
								prose-headings:font-bold prose-headings:tracking-tight
								prose-headings:text-gray-900 dark:prose-headings:text-white 
								prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
								prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
								prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
								prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
								prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
								prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
								prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
								prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700 prose-pre:shadow-lg
								prose-ul:list-disc prose-ul:my-6
								prose-ol:list-decimal prose-ol:my-6
								prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-2 prose-li:leading-relaxed
								prose-li:marker:text-blue-500 dark:prose-li:marker:text-blue-400 prose-li:marker:font-bold
								prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8"
								dangerouslySetInnerHTML={{ __html: post.contentHtml }}
							/>

							{/* Tags */}
							{post.tags.length > 0 && (
								<div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
									<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
										<span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
										Related Topics
									</h3>
									<div className="flex flex-wrap gap-2.5">
										{post.tags.map((tag) => (
											<span
												key={tag}
												className="px-4 py-2 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm"
											>
												#{tag}
											</span>
										))}
									</div>
								</div>
							)}
						</main>
					</div>
				</div>

				{/* Related Posts CTA */}
				<section className="relative container mx-auto px-6 py-16 max-w-4xl">
					<div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-700 dark:via-blue-600 dark:to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/25 dark:shadow-blue-950/50 overflow-hidden">
						{/* Decorative elements */}
						<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

						<div className="relative z-10 text-center">
							<h2 className="text-3xl md:text-4xl font-black text-white mb-4">
								Stay Updated with AI Insights
							</h2>
							<p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
								Get the latest AI technology analysis and insights delivered
								daily. Join our community of tech enthusiasts.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									className="bg-white hover:bg-gray-100 text-blue-600 dark:text-blue-700 font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
									asChild
								>
									<Link href="/blog">Read More Articles</Link>
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="border-2 border-white text-white hover:bg-white/10 font-bold"
									asChild
								>
									<Link href="/blog/rss.xml">Subscribe to RSS</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</article>
		</>
	);
}
