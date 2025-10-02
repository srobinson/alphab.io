#!/usr/bin/env tsx

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import { GET } from "../app/api/curated-news/route";

type ArticleRow = {
	id: string;
	title: string;
	image_url: string | null;
	published_at: string | null;
	created_at?: string | null;
};

function loadEnvExports(file = ".env.local") {
	const envPath = resolve(process.cwd(), file);
	if (!existsSync(envPath)) return;

	const content = readFileSync(envPath, "utf-8");
	for (const rawLine of content.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;

		const match =
			line.match(/^export\s+([A-Z0-9_]+)=(.*)$/i) ||
			line.match(/^([A-Z0-9_]+)=(.*)$/i);
		if (!match) continue;

		const [, key, rawValue] = match;
		if (!key) continue;

		let value = rawValue.trim();
		if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}

		if (!(key in process.env)) {
			process.env[key] = value;
		}
	}
}

loadEnvExports();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error(
		"Supabase configuration missing. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
	);
	process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
	auth: { persistSession: false, autoRefreshToken: false },
});

async function findRecentArticlesWithoutImages(limit = 10) {
	const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
	const { data, error } = await supabaseAdmin
		.from<ArticleRow>("articles")
		.select("id,title,image_url,published_at,created_at")
		.is("image_url", null)
		.gte("published_at", since)
		.order("published_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to query articles: ${error.message}`);
	}

	return data || [];
}

async function refreshIndustryMoves(pages: number[], pageSize: number) {
	for (const page of pages) {
		const url = new URL("http://localhost/api/curated-news");
		url.searchParams.set("page", page.toString());
		url.searchParams.set("limit", pageSize.toString());

		const response = await GET(new Request(url.toString()));
		const payload = await response.json();
		const withImages = payload.items.filter((item: any) => Boolean(item.image));
		console.log(
			`Fetched page ${page} (limit ${pageSize}) → ${withImages.length}/${payload.items.length} items already returned an image`,
		);
	}
}

async function main() {
	const initial = await findRecentArticlesWithoutImages();

	if (!initial.length) {
		console.log("All recent articles already have image_url populated – nothing to validate.");
		return;
	}

	console.log("Articles missing image_url before refresh:");
	initial.forEach((article) => {
		console.log(
			` • ${article.id} | ${article.title.slice(0, 80)}${
				article.title.length > 80 ? "…" : ""
			} | published_at=${article.published_at}`,
		);
	});

	// Hit multiple pages to encourage the API to process uncached articles.
	await refreshIndustryMoves([1, 2], 50);

	const refreshedIds = initial.map((article) => article.id);
	const { data: after, error } = await supabaseAdmin
		.from<ArticleRow>("articles")
		.select("id,image_url")
		.in("id", refreshedIds);

	if (error) {
		throw new Error(`Failed to re-query articles: ${error.message}`);
	}

	console.log("\nimage_url status after hitting curated-news API:");
	after?.forEach((row) => {
		console.log(` • ${row.id} | image_url ${row.image_url ? "SET" : "MISSING"}`);
	});
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
