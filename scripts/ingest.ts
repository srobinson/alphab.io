#!/usr/bin/env -S node
// Local-only ingest CLI (TypeScript, not exposed via web)
// Usage:
//   pnpm dlx tsx scripts/ingest.ts <url> [--source <name>] [--tags tag1,tag2] [--no-summarize] [--save-content]
// Or add an npm script: "ingest": "tsx scripts/ingest.ts"
// Env required:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   OPENROUTER_API_KEY (for summaries)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { type IngestResult, ingestUrl } from "../lib/server/ingest";

type Args = { _: string[]; flags: Record<string, string> };

function parseArgs(argv: string[]): Args {
  const flags: Record<string, string> = {};
  const positional: string[] = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a || !a.startsWith("--")) {
      if (a) positional.push(a);
      continue;
    }
    const [k, v] = a.includes("=")
      ? a.slice(2).split("=")
      : [a.slice(2), argv[i + 1] && !argv[i + 1]?.startsWith("--") ? argv[++i] : "true"];
    if (k && v) flags[k] = v;
  }
  return { _: positional, flags };
}

async function main() {
  const args = parseArgs(process.argv);
  const url = args._[0];
  if (!url) {
    console.error(
      "Usage: tsx scripts/ingest.ts <url> [--source <name>] [--tags tag1,tag2] [--no-summarize] [--save-content]"
    );
    process.exit(1);
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
    process.exit(1);
  }

  const sb: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "alphab-ingest-cli/1.0" } },
  });

  const tagsFlag = args.flags.tags;
  const tags =
    typeof tagsFlag === "string" && tagsFlag.length
      ? tagsFlag
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const doSummarize = args.flags["no-summarize"] !== "true";
  const doSaveContent = args.flags["save-content"] === "true";
  const source = args.flags.source;

  console.log(
    "→ Ingesting",
    url,
    "source=",
    source || "(hostname)",
    "summarize=",
    doSummarize,
    "saveContent=",
    doSaveContent,
    "tags=",
    tags
  );
  const res: IngestResult = await ingestUrl(
    {
      url,
      ...(source ? { source } : {}),
      tags,
      doSummarize,
      doSaveContent,
    },
    sb
  );
  console.log("← Result:", res);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
