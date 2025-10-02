"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ShareButtonsProps {
	slug: string;
	title: string;
	description: string;
}

const FALLBACK_BASE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://alphab.io"
).replace(/\/$/, "");

export function ShareButtons({ slug, title, description }: ShareButtonsProps) {
	const [baseUrl, setBaseUrl] = useState(FALLBACK_BASE_URL);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && window.location?.origin) {
			setBaseUrl(window.location.origin.replace(/\/$/, ""));
		}
	}, []);

	const shareUrl = useMemo(() => `${baseUrl}/blog/${slug}`, [baseUrl, slug]);
	const truncatedDescription = useMemo(() => {
		const clean = description?.trim() || "";
		return clean.length > 160 ? `${clean.slice(0, 157)}…` : clean;
	}, [description]);

	const shareText = useMemo(() => {
		const headline = title?.trim() || "Check this out";
		return truncatedDescription
			? `${headline} - ${truncatedDescription}`
			: headline;
	}, [title, truncatedDescription]);

	const encodedUrl = useMemo(() => encodeURIComponent(shareUrl), [shareUrl]);
	const encodedTitle = useMemo(
		() => encodeURIComponent(title?.trim() || ""),
		[title],
	);
	const encodedText = useMemo(() => encodeURIComponent(shareText), [shareText]);

	const shareLinks = useMemo(
		() => [
			{
				name: "X",
				icon: Twitter,
				href: `https://twitter.com/share?text=${encodedText}&url=${encodedUrl}`,
				srLabel: "Share on X",
			},
			{
				name: "LinkedIn",
				icon: Linkedin,
				href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
				srLabel: "Share on LinkedIn",
			},
			{
				name: "Facebook",
				icon: Facebook,
				href: `https://www.facebook.com/sharer.php?u=${encodedUrl}&p%5Btitle%5D=${encodedTitle}`,
				srLabel: "Share on Facebook",
			},
		],
		[encodedUrl, encodedTitle, encodedText],
	);

	const copyLink = async () => {
		try {
			if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(shareUrl);
			} else {
				const input = document.createElement("textarea");
				input.value = shareUrl;
				input.setAttribute("readonly", "");
				input.style.position = "absolute";
				input.style.left = "-9999px";
				document.body.appendChild(input);
				input.select();
				document.execCommand("copy");
				document.body.removeChild(input);
			}

			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy link", error);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
				Share:
			</span>
			<button
				type="button"
				onClick={copyLink}
				aria-label={copied ? "Link copied" : "Copy link"}
				className={cn(
					buttonVariants({ variant: "outline", size: "sm" }),
					"inline-flex items-center gap-2",
				)}
			>
				<Share2 className="w-4 h-4" />
				<span className="sr-only">Copy link</span>
			</button>
			{shareLinks.map(({ name, icon: Icon, href, srLabel }) => (
				<a
					key={name}
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={srLabel}
					className={cn(
						buttonVariants({ variant: "outline", size: "sm" }),
						"inline-flex items-center gap-2",
					)}
				>
					<Icon className="w-4 h-4" />
					<span className="sr-only">{srLabel}</span>
				</a>
			))}
			{copied && (
				<span className="text-xs text-blue-600 dark:text-blue-400 ml-1">
					Link copied
				</span>
			)}
		</div>
	);
}
