#!/usr/bin/env node

const fs = require("node:fs").promises;
const path = require("node:path");

const SERPAPI_ENDPOINT = "https://serpapi.com/search";

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

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../../.env.local") });

class BlogGenerator {
  constructor() {
    this.configPath = path.join(__dirname, "config");
    this.dataPath = path.join(__dirname, "data");
    this.outputPath = path.join(__dirname, "../../app/blog_generated");

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

    console.log("🤖 Blog Generator initialized");
  }

  async generateBlogPost(options = {}) {
    const {
      topic,
      type = "analysis", // analysis, tutorial, prediction, reality-check
      style = "analytical",
    } = options;

    if (!topic) {
      throw new Error("Topic is required for blog generation");
    }

    console.log(`📝 Generating ${type} blog post about: ${topic}`);

    // Step 1: Research and outline
    const research = await this.conductResearch(topic, type);
    const outline = await this.createOutline(research, type, style);

    // Step 2: Generate content sections
    const sections = await this.generateSections(outline, research);

    // Step 3: Create SEO metadata
    const seoData = await this.generateSEOMetadata(topic, sections, type);

    // Step 4: Assemble final post
    const blogPost = await this.assembleBlogPost({
      topic,
      type,
      style,
      outline,
      sections,
      seoData,
      research,
    });

    // Step 5: Save draft
    const draftId = this.generateDraftId(topic);
    const draftPath = await this.saveDraft(blogPost, draftId);

    console.log(`✅ Blog post generated successfully!`);
    console.log(`📄 Draft saved to: ${draftPath}`);
    console.log(`💰 Estimated cost: $${this.costTracker.totalSpent.toFixed(4)}`);

    return { blogPost, draftId, draftPath };
  }

  async conductResearch(topic, type) {
    console.log("🔍 Conducting research...");

    const researchPrompt = this.buildResearchPrompt(topic, type);
    const tools = this.webSearchApiKey ? this.getToolDefinitions() : undefined;
    const research = await this.callOpenRouter(researchPrompt, "analysis", { tools });

    try {
      return extractJSON(research);
    } catch (error) {
      console.error("❌ Failed to parse research JSON:", error.message);
      console.log("Raw response:", `${research.substring(0, 200)}...`);
      throw new Error("AI returned invalid JSON format. Please try again.");
    }
  }

  buildResearchPrompt(topic, type) {
    return `You are an expert AI industry analyst. Today's date is ${CURRENT_DATE}. Research the topic "${topic}" for a ${type} blog post using the most recent credible information (prioritize sources from ${CURRENT_YEAR} or the previous 12 months unless historical context is required).

Your analysis should be comprehensive and include:

1. CURRENT STATE ANALYSIS
   - What are the key facts about this topic?
   - What recent developments have occurred?
   - What are the current capabilities/limitations?

2. MARKET DYNAMICS
   - Who are the key players?
   - What business models are emerging?
   - What's the investment/funding landscape?

3. TECHNICAL DETAILS
   - How does the technology actually work?
   - What are the technical challenges?
   - What breakthroughs are needed?

4. CONTRARIAN PERSPECTIVES
   - What are the common misconceptions?
   - What skepticism exists and is it valid?
   - What might go wrong or fail?

5. BUSINESS IMPLICATIONS
   - How does this affect different industries?
   - What practical applications exist today?
   - What should business leaders know?

6. FUTURE OUTLOOK
   - What are realistic timelines for development?
   - What are the most likely scenarios?
   - What would surprise experts?

IMPORTANT: You must return ONLY a valid JSON object with no additional text, commentary, or formatting. Start your response with { and end with }.

Return your research as this exact JSON structure:

{
  "currentState": {
    "facts": ["fact1", "fact2"],
    "developments": ["dev1", "dev2"],
    "capabilities": ["cap1", "cap2"],
    "limitations": ["limit1", "limit2"]
  },
  "marketDynamics": {
    "keyPlayers": ["player1", "player2"],
    "businessModels": ["model1", "model2"],
    "funding": ["funding1", "funding2"]
  },
  "technicalDetails": {
    "howItWorks": "explanation",
    "challenges": ["challenge1", "challenge2"],
    "breakthroughs": ["breakthrough1", "breakthrough2"]
  },
  "contrarian": {
    "misconceptions": ["misconception1", "misconception2"],
    "validSkepticism": ["skepticism1", "skepticism2"],
    "risks": ["risk1", "risk2"]
  },
  "businessImpact": {
    "industries": ["industry1", "industry2"],
    "applications": ["app1", "app2"],
    "leaderInsights": ["insight1", "insight2"]
  },
  "futureOutlook": {
    "timelines": ["timeline1", "timeline2"],
    "scenarios": ["scenario1", "scenario2"],
    "surprises": ["surprise1", "surprise2"]
  }
}`;
  }

  async createOutline(research, type, style) {
    console.log("📋 Creating outline...");

    const outlinePrompt = this.buildOutlinePrompt(research, type, style);
    const tools = this.webSearchApiKey ? this.getToolDefinitions() : undefined;
    const outline = await this.callOpenRouter(outlinePrompt, "creative", { tools });

    try {
      return extractJSON(outline);
    } catch (error) {
      console.error("❌ Failed to parse outline JSON:", error.message);
      console.log("Raw response:", `${outline.substring(0, 200)}...`);
      throw new Error("AI returned invalid JSON format for outline. Please try again.");
    }
  }

  buildOutlinePrompt(research, type, _style) {
    const voiceGuide = this.voiceFramework.brandVoice;
    const pillar =
      this.voiceFramework.contentPillars.find((p) =>
        p.name.toLowerCase().includes(type.toLowerCase())
      ) || this.voiceFramework.contentPillars[0];

    return `Create a compelling blog post outline using this research data and voice framework. Assume today's date is ${CURRENT_DATE}; ensure references to "now" or "today" reflect ${CURRENT_YEAR}.

RESEARCH DATA:
${JSON.stringify(research, null, 2)}

VOICE FRAMEWORK:
- Persona: ${voiceGuide.persona}
- Perspective: ${voiceGuide.perspective}
- Content Pillar: ${pillar.name} - ${pillar.description}

REQUIREMENTS:
1. Hook: Start with a surprising insight, contrarian take, or provocative question
2. Clear thesis: Make a bold, defensible claim
3. Logical flow: Build argument with evidence and examples
4. Unique angle: Find what others aren't saying
5. Actionable conclusion: Give readers clear next steps

IMPORTANT: Return ONLY valid JSON with no additional text. Start with { and end with }.

{
  "hook": "Compelling opening that grabs attention",
  "thesis": "Clear central argument/position",
  "sections": [
    {
      "title": "Section title",
      "key_points": ["Point 1", "Point 2"],
      "evidence": ["Data/examples to support"],
      "transition": "How this connects to next section"
    }
  ],
  "conclusion": {
    "summary": "Key takeaways",
    "action_items": ["What readers should do"],
    "call_to_action": "Specific next step"
  },
  "unique_angle": "What makes this perspective different",
  "target_keywords": ["SEO-focused keywords"]
}`;
  }

  async generateSections(outline, research) {
    console.log("✍️ Generating content sections...");

    const sections = [];

    // Generate introduction with hook
    const intro = await this.generateIntroduction(outline.hook, outline.thesis);
    sections.push({ type: "introduction", content: this.cleanSectionContent(intro) });

    // Generate main sections
    for (const section of outline.sections) {
      const content = await this.generateSection(section, research);
      sections.push({
        type: "section",
        title: section.title,
        content: this.cleanSectionContent(content),
      });
    }

    // Generate conclusion
    const conclusion = await this.generateConclusion(outline.conclusion);
    sections.push({ type: "conclusion", content: this.cleanSectionContent(conclusion) });

    return sections;
  }

  cleanSectionContent(content) {
    if (typeof content !== "string") {
      return content;
    }

    const preambleRegexes = [
      /^based on .*?here'?s the blog section:?$/i,
      /^based on .*?here is the blog section:?$/i,
      /^here'?s the blog section.*$/i,
      /^here is the blog section.*$/i,
    ];

    const isPreamble = (line) => {
      const simplified = line.replace(/[\u2018\u2019]/g, "'").trim();
      return preambleRegexes.some((regex) => regex.test(simplified));
    };

    const lines = content.split(/\r?\n/);

    while (lines.length > 0 && isPreamble(lines[0])) {
      lines.shift();
    }

    while (lines.length > 0 && lines[0].trim() === "") {
      lines.shift();
    }

    return lines.join("\n").replace(/^\s+/, "");
  }

  async generateIntroduction(hook, thesis) {
    const prompt = `Write a compelling blog post introduction using this framework:

HOOK: ${hook}
THESIS: ${thesis}

VOICE GUIDELINES:
- ${this.voiceFramework.brandVoice.persona}
- Tone: ${this.voiceFramework.brandVoice.tone.primary}
- Use signature phrases like: ${this.voiceFramework.signaturePhrases.slice(0, 2).join(", ")}

Write 200-300 words that:
1. Open with the hook in an engaging way
2. Provide necessary context
3. Present the thesis clearly
4. Preview what's coming
5. Use data or specific examples to build credibility, referencing the correct year (${CURRENT_YEAR}) for current statistics

Make it conversational but authoritative, skeptical but not cynical.

Important style rules:
- Return only the finished introduction prose.
- Do not include meta commentary, disclaimers, or sentences like "Here’s the introduction".
- Start directly with the opening sentence of the introduction.`;

    const tools = this.webSearchApiKey ? this.getToolDefinitions() : undefined;
    return await this.callOpenRouter(prompt, "creative", { tools });
  }

  async generateSection(sectionOutline, research) {
    const prompt = `Write a blog section with this outline:

TITLE: ${sectionOutline.title}
KEY POINTS: ${sectionOutline.key_points.join(", ")}
SUPPORTING EVIDENCE: ${sectionOutline.evidence.join(", ")}

RESEARCH CONTEXT:
${JSON.stringify(research, null, 2)}

VOICE GUIDELINES:
- Data-driven analysis with practical insights
- Use specific examples and numbers when possible
- Address counterarguments
- Maintain ${this.voiceFramework.brandVoice.tone.primary} tone

Write 400-600 words that:
1. Present the key points clearly
2. Support with evidence from research
3. Use concrete examples
4. Address potential objections
5. Connect to broader implications

Use current data points where possible and state the accurate year (${CURRENT_YEAR}) when describing present-day adoption, revenue, or market stats.

Transition naturally to: ${sectionOutline.transition}

CRITICAL FORMATTING RULES:
- Respond with the complete section content only
- Do NOT add labels, prefaces, or phrases such as "Here's the blog section" or "Based on the research" before the actual content
- Do NOT repeat the section title in the body text (the title will be added as a heading separately)
- Begin immediately with the first paragraph of content
- Start with a topic sentence, not a restatement of the title`;

    const tools = this.webSearchApiKey ? this.getToolDefinitions() : undefined;
    return await this.callOpenRouter(prompt, "analysis", { tools });
  }

  async generateConclusion(conclusionOutline) {
    const prompt = `Write a powerful blog conclusion:

SUMMARY: ${conclusionOutline.summary}
ACTION ITEMS: ${conclusionOutline.action_items.join(", ")}
CALL TO ACTION: ${conclusionOutline.call_to_action}

Write 200-250 words that:
1. Summarize key insights without repetition
2. Provide clear, actionable next steps
3. End with a memorable final thought
4. Include a specific call to action

Ensure the takeaways feel timely for leaders planning in ${CURRENT_YEAR}.

Use signature phrases: ${this.voiceFramework.signaturePhrases.slice(-2).join(", ")}

Important style rules:
- Provide only the conclusion content.
- Avoid meta statements or framing like "Here’s the conclusion".
- Start immediately with the concluding sentence or heading.`;

    const tools = this.webSearchApiKey ? this.getToolDefinitions() : undefined;
    return await this.callOpenRouter(prompt, "creative", { tools });
  }

  async generateSEOMetadata(topic, sections, type) {
    console.log("🔍 Generating SEO metadata...");

    const content = sections.map((s) => s.content).join("\n\n");
    const prompt = `Create SEO metadata for this blog post:

TOPIC: ${topic}
TYPE: ${type}
CONTENT SAMPLE: ${content.substring(0, 1000)}...

Generate:
1. SEO-optimized title (under 60 characters)
2. Meta description (150-160 characters)
3. Primary keywords (5-7 phrases)
4. Internal linking suggestions
5. Schema markup data

TITLE REQUIREMENTS:
- The title MUST closely reflect the original topic: "${topic}"
- Optimize for SEO while staying true to the user's intended focus
- If the topic is already a good title, use it with minor refinements
- AVOID overused patterns like "The Hidden Truth About..." or "The Surprising Secret..."
- AVOID adding "in ${CURRENT_YEAR}" or "in 2025" unless it's essential to the topic
- Create unique, specific titles that stand out
- Vary your approach - don't repeat similar structures
- Keep titles timeless when possible

Consider these diverse title styles (pick ONE that fits best):
1. Direct value: "${topic}" (if already strong)
2. Question format: "Should [Audience] [Action] About [Topic]?"
3. Impact-focused: "What [Topic] Means for [Industry/Audience]"
4. Practical guide: "How to [Action] in the Age of [Technology]"
5. Contrarian take: "Why Everyone's Wrong About [Topic]"
6. Data-driven: "[Number] Key Insights About [Topic]"
7. News angle: "Why [Recent Development] Changes [Industry]"

Ensure titles, descriptions, and schema references reflect the current year (${CURRENT_YEAR}) unless citing historical events.

IMPORTANT: Return ONLY valid JSON with no additional text. Start with { and end with }.

{
  "title": "SEO-optimized title",
  "metaDescription": "Compelling meta description",
  "keywords": ["keyword1", "keyword2"],
  "internalLinks": ["suggested internal links"],
  "schema": {
    "type": "BlogPosting",
    "headline": "Article headline",
    "description": "Article description"
  }
}`;

    const tools = this.webSearchApiKey ? this.getToolDefinitions() : undefined;
    const seoData = await this.callOpenRouter(prompt, "analysis", { tools });

    try {
      return extractJSON(seoData);
    } catch (error) {
      console.error("❌ Failed to parse SEO JSON:", error.message);
      console.log("Raw response:", `${seoData.substring(0, 200)}...`);
      throw new Error("AI returned invalid JSON format for SEO data. Please try again.");
    }
  }

  async assembleBlogPost(data) {
    const { topic, type, style, outline, sections, seoData } = data;

    const sanitize = (value) => {
      const replaceDash = (str) => str.replace(/\u2014/g, "-");

      if (typeof value === "string") {
        return replaceDash(value);
      }

      if (Array.isArray(value)) {
        return value.map((item) => sanitize(item));
      }

      if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, sanitize(val)]));
      }

      return value;
    };

    const sanitizedSeoData = sanitize(seoData);

    // Create frontmatter
    const frontmatter = {
      title: sanitizedSeoData.title,
      description: sanitizedSeoData.metaDescription,
      date: new Date().toISOString().split("T")[0],
      category: this.mapTypeToCategory(type),
      tags: sanitizedSeoData.keywords.slice(0, 5),
      author: "RADE AI Solutions",
      readTime: this.estimateReadTime(sections),
      seo: {
        keywords: sanitizedSeoData.keywords,
        schema: sanitizedSeoData.schema,
      },
      generated: true,
      generatedAt: new Date().toISOString(),
    };

    // Assemble content
    const content = sections
      .map((section) => {
        if (section.type === "introduction") {
          return sanitize(section.content);
        } else if (section.type === "section") {
          return `## ${sanitize(section.title)}\n\n${sanitize(section.content)}`;
        } else if (section.type === "conclusion") {
          return `## Key Takeaways\n\n${sanitize(section.content)}`;
        }
      })
      .join("\n\n");

    return {
      frontmatter: sanitize(frontmatter),
      content: sanitize(content),
      metadata: sanitize({
        topic,
        type,
        style,
        outline,
        generatedAt: new Date().toISOString(),
        cost: this.costTracker.totalSpent,
      }),
    };
  }

  mapTypeToCategory(type) {
    const mapping = {
      analysis: "AI Analysis",
      tutorial: "Technical Guide",
      prediction: "Future Forecast",
      "reality-check": "Reality Check",
    };
    return mapping[type] || "AI Insights";
  }

  estimateReadTime(sections) {
    const totalWords = sections.reduce((count, section) => {
      return count + (section.content.match(/\w+/g) || []).length;
    }, 0);

    return `${Math.ceil(totalWords / 200)} min read`;
  }

  async saveDraft(blogPost, draftId) {
    const filename = `${draftId}.json`;
    const filepath = path.join(this.outputPath, "drafts", filename);

    await fs.writeFile(filepath, JSON.stringify(blogPost, null, 2));

    return filepath;
  }

  generateDraftId(topic) {
    const sanitized = topic
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 40);

    const timestamp = Date.now().toString().slice(-6);
    return `${sanitized}-${timestamp}`;
  }

  async callOpenRouter(prompt, modelType = "analysis", options = {}) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not found in environment variables");
    }

    const modelConfig =
      this.openrouterConfig.models[modelType] || this.openrouterConfig.models.analysis;

    console.log(`🤖 Calling OpenRouter (${modelConfig.model})...`);

    const messages = options.initialMessages ? [...options.initialMessages] : [];
    if (!options.skipInitialUserMessage) {
      messages.push({ role: "user", content: prompt });
    }

    const tools = options.tools;
    const maxIterations = 5;

    try {
      for (let iteration = 0; iteration < maxIterations; iteration++) {
        const body = {
          model: modelConfig.model,
          messages,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens,
        };

        if (tools && tools.length > 0) {
          body.tools = tools;
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://alphab.io",
            "X-Title": "RADE AI Blog Generator",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`OpenRouter API error ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        const message = data.choices?.[0]?.message;

        this.costTracker.requestCount++;
        const inputTokens = data.usage?.prompt_tokens || 0;
        const outputTokens = data.usage?.completion_tokens || 0;
        const estimatedCost = this.estimateCost(modelConfig.model, inputTokens, outputTokens);
        this.costTracker.totalSpent += estimatedCost;
        console.log(
          `💰 Request cost: $${estimatedCost.toFixed(4)} (Total: $${this.costTracker.totalSpent.toFixed(4)})`
        );

        if (!message) {
          throw new Error("OpenRouter returned an empty message");
        }

        const toolCalls = message.tool_calls || [];

        if (toolCalls.length > 0) {
          messages.push({
            role: "assistant",
            content: message.content || "",
            tool_calls: toolCalls,
          });

          for (const toolCall of toolCalls) {
            const toolName = toolCall.function?.name;
            const args = toolCall.function?.arguments;

            if (!toolName) {
              continue;
            }

            let parsedArgs = {};
            if (typeof args === "string") {
              try {
                parsedArgs = JSON.parse(args);
              } catch (error) {
                console.warn(`⚠️  Failed to parse tool arguments for ${toolName}:`, error.message);
              }
            }

            console.log(`🛠️  Tool call → ${toolName}`, parsedArgs);
            const toolResponse = await this.executeTool(toolName, parsedArgs);
            if (toolResponse?.error) {
              console.warn(`⚠️  ${toolName} returned an error: ${toolResponse.error}`);
            } else if (toolName === "search_web") {
              const resultCount = Array.isArray(toolResponse?.results)
                ? toolResponse.results.length
                : 0;
              console.log(
                `🔎 search_web results: ${resultCount} hits${resultCount ? ` (top: ${toolResponse.results[0].title || "n/a"})` : ""}`
              );
            }

            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResponse),
            });
          }

          continue;
        }

        if (Array.isArray(message.content)) {
          const combined = message.content.map((part) => part.text).join("\n");
          return combined.trim();
        }

        if (message.content) {
          return message.content;
        }

        // If message has no content but also no tool calls, break to avoid loop
        break;
      }

      throw new Error("OpenRouter conversation ended without a final response");
    } catch (error) {
      throw new Error(`OpenRouter API call failed: ${error.message}`);
    }
  }

  getToolDefinitions() {
    return [
      {
        type: "function",
        function: {
          name: "search_web",
          description:
            "Search the web for up-to-date information. Use this to fetch recent news, stats, or announcements.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query describing the information to look up.",
              },
              count: {
                type: "integer",
                description: "Approximate number of search results (1-10).",
                minimum: 1,
                maximum: 10,
                default: 5,
              },
            },
            required: ["query"],
          },
        },
      },
    ];
  }

  async executeTool(name, args) {
    switch (name) {
      case "search_web":
        return await this.searchWeb(args?.query, args?.count);
      default:
        return { error: `Unknown tool: ${name}` };
    }
  }

  async searchWeb(query, count = 5) {
    if (!query || typeof query !== "string") {
      return { error: "Missing search query" };
    }

    if (!this.webSearchApiKey) {
      return { error: "SERPAPI_API_KEY not configured", query };
    }

    const resultLimit = Math.max(1, Math.min(count || 5, 10));
    const params = new URLSearchParams({
      engine: "google",
      q: query,
      num: String(resultLimit),
      api_key: this.webSearchApiKey,
    });

    try {
      const response = await fetch(`${SERPAPI_ENDPOINT}?${params.toString()}`);

      if (!response.ok) {
        const errorText = await response.text();
        return { error: `SerpAPI error ${response.status}: ${errorText}`, query };
      }

      const data = await response.json();
      const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
      const results = organic.slice(0, resultLimit).map((item) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet || item.title,
        position: item.position,
        source: item.source || item.displayed_link,
      }));

      return {
        query,
        fetchedAt: new Date().toISOString(),
        provider: "serpapi",
        results,
      };
    } catch (error) {
      return { error: `Search request failed: ${error.message}`, query };
    }
  }

  estimateCost(model, inputTokens, outputTokens) {
    // OpenRouter pricing per 1K tokens (as of 2024)
    const pricing = {
      "anthropic/claude-3.5-sonnet": { input: 0.003, output: 0.015 },
      "openai/gpt-4-turbo": { input: 0.01, output: 0.03 },
      "openai/gpt-4o": { input: 0.005, output: 0.015 },
      "meta-llama/llama-3.1-70b-instruct": { input: 0.0009, output: 0.0009 },
      default: { input: 0.002, output: 0.01 },
    };

    const rates = pricing[model] || pricing.default;
    return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
  }
}

// CLI interface
if (require.main === module) {
  const generator = new BlogGenerator();

  const topic = process.argv[2];
  const type = process.argv[3] || "analysis";

  if (!topic) {
    console.log('Usage: node blog-generator.js "Topic" [type]');
    console.log("Types: analysis, tutorial, prediction, reality-check");
    process.exit(1);
  }

  generator
    .initialize()
    .then(() => generator.generateBlogPost({ topic, type }))
    .then((result) => {
      console.log(`\n🎉 Success! Draft ID: ${result.draftId}`);
      console.log(`Next step: node blog-publisher.js ${result.draftId}`);
    })
    .catch((error) => {
      console.error("❌ Generation failed:", error.message);
      process.exit(1);
    });
}

module.exports = BlogGenerator;
