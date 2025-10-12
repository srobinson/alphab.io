#!/usr/bin/env node

const fs = require("node:fs").promises;
const path = require("node:path");

const SERPAPI_ENDPOINT = "https://serpapi.com/search";

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../../.env.local") });

const extractJSON = (text) => {
  if (typeof text !== "string") {
    throw new Error("Expected JSON string response");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.slice(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    }
    throw error;
  }
};

const { date: CURRENT_DATE, year: CURRENT_YEAR } = (() => {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0],
    year: now.getFullYear(),
  };
})();

class CustomBlogGenerator {
  constructor() {
    this.configPath = path.join(__dirname, "config");
    this.dataPath = path.join(__dirname, "data");
    this.outputPath = path.join(__dirname, "../../src/app/blog_generated");

    this.voiceFramework = null;
    this.openrouterConfig = null;
    this.costTracker = { totalSpent: 0, requestCount: 0 };
    this.webSearchApiKey = process.env.SERPAPI_API_KEY;
  }

  async initialize() {
    // Load configurations
    this.voiceFramework = JSON.parse(
      await fs.readFile(path.join(this.configPath, "voice-framework.json"), "utf8")
    );
    this.openrouterConfig = JSON.parse(
      await fs.readFile(path.join(this.configPath, "openrouter.json"), "utf8")
    );

    // Ensure output directory exists
    await fs.mkdir(this.outputPath, { recursive: true });
    await fs.mkdir(path.join(this.outputPath, "drafts"), { recursive: true });

    console.log("🤖 Custom Blog Generator initialized");
  }

  parseOutlineFile(content) {
    // Parse the outline file to extract:
    // - Title ideas
    // - Outline/sections
    // - Topics/keywords
    // - Research needed flag

    const result = {
      titles: [],
      outline: [],
      keywords: [],
      researchNeeded: false,
      rawContent: content,
    };

    // Extract title ideas
    const titleSection = content.match(/\*\*Title Ideas?:\*\*\s*([\s\S]*?)(?=\n\s*\n|\*\*|$)/i);
    if (titleSection) {
      const titles = titleSection[1].match(/[-•*]\s*"([^"]+)"|[-•*]\s*([^\n]+)/g);
      if (titles) {
        result.titles = titles
          .map((t) =>
            t
              .replace(/^[-•*]\s*"?/, "")
              .replace(/"?\s*$/, "")
              .trim()
          )
          .filter((t) => t.length > 0);
      }
    }

    // Extract outline
    const outlineSection = content.match(/\*\*Outline:\*\*\s*([\s\S]*?)(?=\n\s*\n\*\*|$)/i);
    if (outlineSection) {
      const items = outlineSection[1].match(/[-•*]\s*([^\n]+)/g);
      if (items) {
        result.outline = items
          .map((item) => item.replace(/^[-•*]\s*/, "").trim())
          .filter((item) => item.length > 0);
      }
    }

    // Check for research needed flag
    result.researchNeeded = /research|background|context|search/i.test(content);

    // Extract any keywords or topics
    const keywordSection = content.match(
      /\*\*(?:Keywords?|Topics?):\*\*\s*([\s\S]*?)(?=\n\s*\n|\*\*|$)/i
    );
    if (keywordSection) {
      result.keywords = keywordSection[1]
        .split(/[,\n]/)
        .map((k) => k.replace(/^[-•*]\s*/, "").trim())
        .filter((k) => k.length > 0);
    }

    return result;
  }

  async conductResearch(topics, outline) {
    if (!this.webSearchApiKey) {
      console.log("⚠️  No SERPAPI key found, skipping web research");
      return { searches: [], summary: "No web research conducted" };
    }

    console.log("🔍 Conducting web research...");
    const searches = [];

    // Create search queries from topics and outline
    const queries = [];

    // Add main topics
    topics.forEach((topic) => {
      queries.push(topic);
    });

    // Add outline items as queries
    outline.slice(0, 3).forEach((item) => {
      // Clean up outline items to make good search queries
      const query = item.replace(/^(?:The|A|An)\s+/i, "").substring(0, 100);
      if (query.length > 10) {
        queries.push(query);
      }
    });

    // Limit to top 3 queries to manage costs
    const uniqueQueries = [...new Set(queries)].slice(0, 3);

    for (const query of uniqueQueries) {
      try {
        console.log(`   Searching: "${query}"`);
        const results = await this.webSearch(query);
        searches.push({ query, results });
      } catch (error) {
        console.warn(`   Failed to search "${query}": ${error.message}`);
      }
    }

    return { searches };
  }

  async webSearch(query) {
    const url = new URL(SERPAPI_ENDPOINT);
    url.searchParams.append("q", query);
    url.searchParams.append("api_key", this.webSearchApiKey);
    url.searchParams.append("engine", "google");
    url.searchParams.append("num", "5");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      organic_results: (data.organic_results || []).slice(0, 5).map((r) => ({
        title: r.title,
        link: r.link,
        snippet: r.snippet,
      })),
    };
  }

  async callOpenRouter(messages, options = {}) {
    const { model = "anthropic/claude-3.5-sonnet", temperature = 0.7, maxTokens = 4000 } = options;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://alphab.io",
        "X-Title": "alphab.io Blog Generator",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // Track costs
    if (data.usage) {
      const cost =
        (data.usage.prompt_tokens / 1000000) * 3 + (data.usage.completion_tokens / 1000000) * 15;
      this.costTracker.totalSpent += cost;
      this.costTracker.requestCount++;
    }

    return data.choices[0].message.content;
  }

  async generateBlogFromOutline(outlineData, options = {}) {
    const { selectedTitle, tag = "analysis", doResearch = true } = options;

    // Choose title
    const title = selectedTitle || outlineData.titles[0] || "Untitled Blog Post";
    console.log(`\n📝 Generating blog post: "${title}"`);
    console.log(`🏷️  Tag: ${tag}`);

    // Conduct research if needed
    let research = null;
    if (doResearch && outlineData.researchNeeded) {
      research = await this.conductResearch([title, ...outlineData.keywords], outlineData.outline);
    }

    // Step 1: Expand the outline with AI
    console.log("\n📋 Expanding outline...");
    const expandedOutline = await this.expandOutline(title, outlineData, research);

    // Step 2: Generate introduction
    console.log("✍️  Writing introduction...");
    const introduction = await this.generateIntroduction(title, expandedOutline, research);

    // Step 3: Generate main content sections
    console.log("📄 Writing main content...");
    const sections = await this.generateSections(title, expandedOutline, research);

    // Step 4: Generate conclusion
    console.log("🎯 Writing conclusion...");
    const conclusion = await this.generateConclusion(title, sections, research);

    // Step 5: Generate SEO metadata
    console.log("🔍 Generating SEO metadata...");
    const seoData = await this.generateSEOMetadata(
      title,
      introduction + sections.join("\n") + conclusion
    );

    // Step 6: Assemble final post
    const blogPost = this.assembleBlogPost({
      title,
      tag,
      introduction,
      sections,
      conclusion,
      seoData,
    });

    // Step 7: Save draft
    const draftId = this.generateDraftId(title);
    const draftPath = path.join(this.outputPath, "drafts", `${draftId}.mdx`);
    await fs.writeFile(draftPath, blogPost);

    console.log(`\n✅ Blog post draft saved!`);
    console.log(`📁 Location: ${draftPath}`);
    console.log(`💰 Cost: $${this.costTracker.totalSpent.toFixed(4)}`);
    console.log(`🔢 API calls: ${this.costTracker.requestCount}`);
    console.log(`\n📋 Draft ID: ${draftId}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review: cat "${draftPath}"`);
    console.log(`   2. List drafts: pnpm blog:list`);
    console.log(`   3. Publish: pnpm blog:publish ${draftId}`);

    return { draftId, draftPath, blogPost };
  }

  async expandOutline(title, outlineData, research) {
    const researchContext = research?.searches
      ? research.searches
          .map(
            (s) =>
              `Search: ${s.query}\nResults:\n${s.results.organic_results
                .map((r) => `- ${r.title}: ${r.snippet}`)
                .join("\n")}`
          )
          .join("\n\n")
      : "No research available";

    const prompt = `You are helping expand a blog post outline into a detailed structure.

Title: ${title}

Original Outline:
${outlineData.outline.map((item, i) => `${i + 1}. ${item}`).join("\n")}

Raw Content/Notes:
${outlineData.rawContent.substring(0, 1000)}

${research ? `\nWeb Research:\n${researchContext.substring(0, 2000)}` : ""}

Create a detailed, expanded outline with:
1. Clear section headings (use ## for H2, ### for H3)
2. Key points to cover in each section
3. Specific examples or data points to include
4. A logical flow from introduction to conclusion

Return the expanded outline in markdown format.`;

    const response = await this.callOpenRouter([{ role: "user", content: prompt }], {
      maxTokens: 2000,
    });

    return response;
  }

  async generateIntroduction(title, outline, research) {
    const researchContext = research?.searches
      ? research.searches[0]?.results.organic_results
          .slice(0, 3)
          .map((r) => `${r.title}: ${r.snippet}`)
          .join("\n")
      : "";

    const prompt = `${this.voiceFramework.systemPrompt}

Write an engaging introduction for this blog post:

Title: ${title}

Outline Preview:
${outline.substring(0, 500)}

${researchContext ? `Recent Context:\n${researchContext}\n` : ""}

Requirements:
- Hook the reader with a provocative question, statistic, or observation
- Establish context and relevance
- Preview what the post will cover
- Use **bold** for key terms, backtick code for technical references
- Consider starting with a 💡 or 🎯 callout box (blockquote) for impact
- Keep it 2-3 paragraphs
- Make it visually engaging with formatting

Write only the introduction, no headings.`;

    return await this.callOpenRouter([{ role: "user", content: prompt }], { maxTokens: 1000 });
  }

  async generateSections(title, outline, research) {
    const sections = [];

    // Split outline into major sections
    const sectionHeaders = outline.match(/^##\s+.+$/gm) || [];

    if (sectionHeaders.length === 0) {
      // Generate as one section if no clear structure
      const section = await this.generateSingleSection(title, outline, research);
      sections.push(section);
    } else {
      // Generate each section
      for (let i = 0; i < Math.min(sectionHeaders.length, 5); i++) {
        const header = sectionHeaders[i];
        const nextHeader = sectionHeaders[i + 1];

        // Extract content for this section
        const startIdx = outline.indexOf(header);
        const endIdx = nextHeader ? outline.indexOf(nextHeader) : outline.length;
        const sectionOutline = outline.substring(startIdx, endIdx);

        console.log(`   Section ${i + 1}/${sectionHeaders.length}: ${header}`);
        const section = await this.generateSingleSection(title, sectionOutline, research, i);
        sections.push(section);
      }
    }

    return sections;
  }

  async generateSingleSection(title, sectionOutline, research, index = 0) {
    const researchContext = research?.searches?.[index]
      ? research.searches[index].results.organic_results
          .slice(0, 3)
          .map((r) => `${r.title}: ${r.snippet}`)
          .join("\n")
      : "";

    const formattingGuide = `Requirements for RICH, ENGAGING content:
- Include the section heading from the outline (## or ###)
- Write 2-4 paragraphs of detailed content
- **MUST use diverse formatting**:
  * Use **bold** for key terms and concepts
  * Use backtick code for technical terms, APIs, tools, commands
  * Add at least ONE callout box using blockquote with emoji:
    > 💡 **Key Insight:** Important takeaway
    > 🎯 **Action Item:** What readers should do
    > ⚠️ **Warning:** Common pitfalls
    > 📊 **Data Point:** Statistics or metrics
  * Use bullet lists (-) for features, benefits, or key points
  * Use numbered lists (1.) for steps or rankings
  * If relevant, include a code block (triple backticks) for examples
  * If comparing things, use a markdown table
- Break up long paragraphs with visual elements
- Keep it practical and actionable
- Aim for visual variety - don't just write plain paragraphs`;

    const prompt = `${this.voiceFramework.systemPrompt}

Write this section for the blog post "${title}":

Section Outline:
${sectionOutline}

${researchContext ? `Relevant Research:\n${researchContext}\n` : ""}

${formattingGuide}

Write the complete section with heading and rich formatting.`;

    return await this.callOpenRouter([{ role: "user", content: prompt }], { maxTokens: 1500 });
  }

  async generateConclusion(title, sections, _research) {
    const contentSummary = sections.join("\n").substring(0, 1000);

    const prompt = `${this.voiceFramework.systemPrompt}

Write a conclusion for this blog post:

Title: ${title}

Content Summary:
${contentSummary}

Requirements:
- Summarize key takeaways (2-3 main points)
- End with a call-to-action or forward-looking statement
- Keep it concise (1-2 paragraphs)
- Maintain the conversational tone
- Use markdown formatting

Write only the conclusion with a ## Conclusion heading.`;

    return await this.callOpenRouter([{ role: "user", content: prompt }], { maxTokens: 800 });
  }

  async generateSEOMetadata(title, content) {
    const prompt = `Generate SEO metadata for this blog post.

Title: ${title}

Content Preview:
${content.substring(0, 1000)}

Generate a JSON object with:
{
  "description": "155-160 character meta description that's compelling and includes key terms",
  "slug": "url-friendly-slug",
  "tags": ["tag1", "tag2", "tag3"],
  "excerpt": "2-3 sentence excerpt for the blog listing page"
}

Return only valid JSON.`;

    const response = await this.callOpenRouter([{ role: "user", content: prompt }], {
      maxTokens: 500,
      temperature: 0.5,
    });

    return extractJSON(response);
  }

  assembleBlogPost({ title, tag, introduction, sections, conclusion, seoData }) {
    const now = new Date();
    const publishDate = now.toISOString().split("T")[0];

    return `---
title: "${title}"
publishedAt: "${publishDate}"
summary: "${seoData.excerpt}"
tag: "${tag}"
draft: true
---

${introduction}

${sections.join("\n\n")}

${conclusion}

---

*This post was generated using AI assistance. Have thoughts or feedback? Let me know!*
`;
  }

  generateDraftId(title) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);

    const timestamp = Date.now().toString().slice(-6);
    return `${slug}-${timestamp}`;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📝 Custom Blog Generator - Generate from Outline

Usage:
  pnpm blog:custom <outline-file> [options]
  pnpm blog:custom <outline-file> --title "Selected Title" --tag analysis
  pnpm blog:custom <outline-file> --no-research

Options:
  --title "..."     Select specific title from outline (uses first if not specified)
  --tag <tag>       Specify tag (analysis, reality-check, technical-deep-dive, etc.)
  --no-research     Skip web research even if outline suggests it

Examples:
  pnpm blog:custom NOTES/PROMOTION.md
  pnpm blog:custom NOTES/PROMOTION.md --title "Building a Fast CSS Parser" --tag technical-deep-dive
  pnpm blog:custom outline.txt --tag analysis --no-research
`);
    process.exit(0);
  }

  const filePath = args[0];
  const options = {
    selectedTitle: null,
    tag: "analysis",
    doResearch: true,
  };

  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--title" && args[i + 1]) {
      options.selectedTitle = args[i + 1];
      i++;
    } else if (args[i] === "--tag" && args[i + 1]) {
      options.tag = args[i + 1];
      i++;
    } else if (args[i] === "--no-research") {
      options.doResearch = false;
    }
  }

  try {
    // Read outline file
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

    console.log(`📂 Reading outline from: ${absolutePath}`);
    const content = await fs.readFile(absolutePath, "utf8");

    const generator = new CustomBlogGenerator();
    await generator.initialize();

    const outlineData = generator.parseOutlineFile(content);

    console.log(`\n📋 Parsed Outline:`);
    console.log(`   Titles found: ${outlineData.titles.length}`);
    if (outlineData.titles.length > 0) {
      outlineData.titles.forEach((t, i) => {
        console.log(`      ${i + 1}. ${t}`);
      });
    }
    console.log(`   Sections: ${outlineData.outline.length}`);
    console.log(`   Keywords: ${outlineData.keywords.length}`);
    console.log(`   Research needed: ${outlineData.researchNeeded ? "Yes" : "No"}`);

    await generator.generateBlogFromOutline(outlineData, options);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code === "ENOENT") {
      console.error(`   File not found: ${filePath}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CustomBlogGenerator;
