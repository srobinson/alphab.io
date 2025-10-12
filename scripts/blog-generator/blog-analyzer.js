#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
const fs = require("node:fs").promises;
const path = require("node:path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../../.env.local") });

class BlogAnalyzer {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async analyzeRecentTrends(daysBack = 7) {
    console.log(`🔍 Analyzing trends from the last ${daysBack} days...`);

    const { data: rawArticles, error } = await this.supabase
      .from("articles")
      .select("title, summary, tags, source, published_at, url")
      .eq("status", "published")
      .gte("published_at", new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
      .order("published_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }

    const articles = Array.isArray(rawArticles) ? rawArticles : [];

    console.log(`📊 Found ${articles.length} articles to analyze`);

    // Extract topics and themes
    const topics = articles.length ? this.extractTopics(articles) : [];
    const themes = articles.length ? this.identifyThemes(articles) : [];
    const opportunities = articles.length
      ? await this.findContentOpportunities(articles, topics, themes)
      : [];

    const analysis = {
      timeframe: `${daysBack} days`,
      articleCount: articles.length,
      generatedAt: new Date().toISOString(),
      topics,
      themes,
      opportunities,
      rawData: articles.slice(0, 20), // Keep sample for reference
    };

    // Save analysis
    const dataDir = path.join(__dirname, "data");
    await fs.mkdir(dataDir, { recursive: true });
    const outputPath = path.join(dataDir, `trend-analysis-${Date.now()}.json`);
    await fs.writeFile(outputPath, JSON.stringify(analysis, null, 2));

    console.log(`💾 Analysis saved to: ${outputPath}`);

    // Display summary
    this.displayAnalysisSummary(analysis);

    return analysis;
  }

  extractTopics(articles) {
    const topicFrequency = {};
    const keywordPatterns = [
      // AI Technologies
      /\b(GPT-?[0-9]+|Claude|Gemini|LLaMA|BERT|Transformer)\b/gi,
      /\b(RAG|retrieval.?augmented|fine.?tuning|prompt.?engineering)\b/gi,
      /\b(multimodal|vision|image.?generation|text.?to.?speech)\b/gi,

      // Business Applications
      /\b(enterprise|B2B|SaaS|automation|workflow)\b/gi,
      /\b(customer.?service|chatbot|virtual.?assistant)\b/gi,
      /\b(code.?generation|developer.?tools|programming)\b/gi,

      // Industry Trends
      /\b(AGI|artificial.?general.?intelligence|superintelligence)\b/gi,
      /\b(AI.?safety|alignment|ethics|bias)\b/gi,
      /\b(regulation|governance|policy|compliance)\b/gi,

      // Companies & Funding
      /\b(OpenAI|Anthropic|Google|Microsoft|Meta|Amazon)\b/gi,
      /\b(funding|investment|valuation|IPO|acquisition)\b/gi,
      /\b(startup|unicorn|seed.?round|series.?[A-Z])\b/gi,
    ];

    articles.forEach((article) => {
      const text = `${article.title} ${article.summary || ""}`.toLowerCase();
      keywordPatterns.forEach((pattern) => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach((match) => {
            const normalized = match.toLowerCase().replace(/[^\w]/g, " ").trim();
            topicFrequency[normalized] = (topicFrequency[normalized] || 0) + 1;
          });
        }
      });
    });

    if (articles.length === 0) {
      return [];
    }

    return Object.entries(topicFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([topic, count]) => ({
        topic,
        count,
        percentage: ((count / articles.length) * 100).toFixed(1),
      }));
  }

  identifyThemes(articles) {
    if (articles.length === 0) {
      return [];
    }

    const themes = [
      {
        name: "AI Capability Leap",
        keywords: ["breakthrough", "advancement", "capability", "performance", "benchmark"],
        description: "Major advances in AI capabilities or performance",
      },
      {
        name: "Market Dynamics",
        keywords: ["funding", "investment", "competition", "market", "revenue", "growth"],
        description: "Business and market developments in AI",
      },
      {
        name: "Practical Applications",
        keywords: ["implementation", "deployment", "use case", "application", "adoption"],
        description: "Real-world AI implementations and use cases",
      },
      {
        name: "Technical Innovation",
        keywords: ["architecture", "algorithm", "method", "technique", "approach"],
        description: "New technical approaches or methodologies",
      },
      {
        name: "Industry Impact",
        keywords: ["industry", "sector", "transformation", "disruption", "change"],
        description: "How AI is affecting different industries",
      },
      {
        name: "Challenges & Limitations",
        keywords: ["challenge", "limitation", "problem", "issue", "concern"],
        description: "Problems and limitations in current AI",
      },
    ];

    return themes
      .map((theme) => {
        const matchingArticles = articles.filter((article) => {
          const text = `${article.title} ${article.summary || ""}`.toLowerCase();
          return theme.keywords.some((keyword) => text.includes(keyword));
        });

        return {
          ...theme,
          articleCount: matchingArticles.length,
          percentage: ((matchingArticles.length / articles.length) * 100).toFixed(1),
          sampleTitles: matchingArticles.slice(0, 3).map((a) => a.title),
        };
      })
      .sort((a, b) => b.articleCount - a.articleCount);
  }

  async findContentOpportunities(articles, topics, themes) {
    // Load existing blog posts to avoid duplicates
    const existingPosts = await this.loadExistingBlogPosts();
    const existingTitles = existingPosts.map((p) => p.title.toLowerCase());
    const existingTopics = existingPosts.flatMap((p) => p.tags || []).map((t) => t.toLowerCase());

    console.log(`📚 Found ${existingPosts.length} existing blog posts to filter out`);

    const opportunities = [];
    const _currentYear = new Date().getFullYear();

    // Helper to check if topic is already covered
    const isTopicCovered = (title, keywords = []) => {
      const titleLower = title.toLowerCase();
      // Check if similar title exists
      if (existingTitles.some((existing) => this.calculateSimilarity(existing, titleLower) > 0.6)) {
        return true;
      }
      // Check if keywords heavily overlap with existing posts
      if (keywords.length > 0) {
        const keywordOverlap = keywords.filter((k) =>
          existingTopics.includes(k.toLowerCase())
        ).length;
        return keywordOverlap / keywords.length > 0.7;
      }
      return false;
    };

    // 1. CONTROVERSY & REALITY CHECK opportunities
    const controversialKeywords = [
      "debate",
      "criticism",
      "concern",
      "risk",
      "limitation",
      "failure",
      "challenge",
      "problem",
      "controversy",
      "backlash",
    ];
    const controversialArticles = articles.filter((article) => {
      const text = `${article.title} ${article.summary || ""}`.toLowerCase();
      return controversialKeywords.some((keyword) => text.includes(keyword));
    });

    if (controversialArticles.length >= 1) {
      // Extract specific issues being discussed
      const issues = this.extractSpecificIssues(controversialArticles);
      issues.slice(0, 3).forEach((issue) => {
        // Create more specific, engaging titles based on the issue
        const titleVariations = {
          "AI copyright and legal battles": `The AI Copyright War: What Developers Need to Know`,
          "AI bias and fairness concerns": `AI Bias in 2025: Still a Problem Worth Solving?`,
          "AI regulation and policy conflicts": `When AI Companies Fight Back Against Regulation`,
          "AI environmental and energy costs": `The Hidden Environmental Cost of AI Nobody Talks About`,
          "AI job displacement and economic impact": `AI Job Displacement: Separating Fear from Reality`,
          "AI accuracy and reliability problems": `Why Your AI Still Hallucinates (And What To Do About It)`,
          "AI safety and security risks": `AI Security Risks: What's Real and What's Hype`,
          "AI privacy and data concerns": `Your Data and AI: The Privacy Problem Getting Worse`,
          "AI hype versus reality": `AI Hype vs Reality: A ${new Date().getFullYear()} Reality Check`,
        };

        const title = titleVariations[issue.topic] || `The ${issue.topic} Problem in AI`;

        if (!isTopicCovered(title, [issue.topic])) {
          opportunities.push({
            type: "Reality Check",
            title,
            description: `Critical analysis of ${issue.topic.toLowerCase()} with current examples`,
            confidence: issue.count >= 2 ? "high" : "medium",
            reasoning: `${issue.count} ${issue.count === 1 ? "article" : "articles"} covering this controversy`,
            sampleArticles: issue.articles.slice(0, 3),
            issue: issue,
          });
        }
      });
    }

    // 2. TECHNICAL DEEP DIVE opportunities
    const technicalTopics = topics.filter(
      (t) =>
        t.count >= 3 &&
        ["rag", "transformer", "multimodal", "fine tuning", "prompt engineering", "embedding"].some(
          (tech) => t.topic.includes(tech)
        )
    );

    technicalTopics.slice(0, 2).forEach((tech) => {
      const title = `Understanding ${tech.topic}: A Practical Guide`;
      if (!isTopicCovered(title, [tech.topic])) {
        opportunities.push({
          type: "Technical Deep Dive",
          title,
          description: `Explain how ${tech.topic} works with real-world applications`,
          confidence: "high",
          reasoning: `${tech.count} mentions indicate strong interest`,
          trendData: tech,
        });
      }
    });

    // 3. COMPANY/PRODUCT ANALYSIS opportunities with specific storylines
    const companies = ["openai", "anthropic", "google", "microsoft", "meta", "amazon"];
    const companyMentions = topics.filter(
      (t) => companies.some((c) => t.topic.includes(c)) && t.count >= 5
    );

    companyMentions.slice(0, 2).forEach((company) => {
      // Try to find specific storylines about this company
      const companyArticles = articles.filter((article) => {
        const text = `${article.title} ${article.summary || ""}`.toLowerCase();
        return text.includes(company.topic);
      });

      // Extract specific angles from the articles
      const storylines = this.extractCompanyStorylines(companyArticles, company.topic);

      if (storylines.length > 0) {
        // Use the most prominent storyline
        const topStory = storylines[0];
        const title = topStory.title;
        if (!isTopicCovered(title, [company.topic])) {
          opportunities.push({
            type: "Business Impact",
            title,
            description: topStory.description,
            confidence: "high",
            reasoning: `${topStory.articleCount} articles about ${topStory.angle}`,
            trendData: company,
            storyline: topStory,
          });
        }
      } else {
        // Fallback to generic company analysis
        const title = `What ${company.topic}'s Latest Moves Mean for the AI Industry`;
        if (!isTopicCovered(title, [company.topic])) {
          opportunities.push({
            type: "Business Impact",
            title,
            description: `Analyze ${company.topic}'s strategy and market implications`,
            confidence: "medium",
            reasoning: `${company.count} recent mentions indicate newsworthy activity`,
            trendData: company,
          });
        }
      }
    });

    // 4. EMERGING TREND opportunities (3-7 mentions = early signal, but be selective)
    const emergingTopics = topics.filter(
      (t) =>
        parseInt(t.count, 10) >= 3 &&
        parseInt(t.count, 10) <= 7 &&
        !companies.some((c) => t.topic.includes(c)) && // Exclude companies
        !["regulation", "data", "enterprise", "vision", "model"].includes(t.topic) // Exclude generic terms
    );

    emergingTopics.slice(0, 1).forEach((emerging) => {
      // Only include if it's a specific technology or concept
      const title = `${emerging.topic.charAt(0).toUpperCase() + emerging.topic.slice(1)}: The Emerging AI Trend to Watch`;
      if (!isTopicCovered(title, [emerging.topic])) {
        opportunities.push({
          type: "Future Forecast",
          title,
          description: `Early analysis of ${emerging.topic} and its potential impact`,
          confidence: "medium",
          reasoning: `${emerging.count} early mentions suggest emerging interest`,
          emergingTrend: emerging,
        });
      }
    });

    // 5. SPECIFIC PRODUCT/FEATURE opportunities
    const productPatterns = [
      { pattern: /GPT-?5|o3|o4|gpt.*next/i, name: "GPT-5", company: "OpenAI" },
      {
        pattern: /claude.*3\.5|claude.*opus|claude.*sonnet/i,
        name: "Claude 3.5",
        company: "Anthropic",
      },
      { pattern: /gemini.*2\.0|gemini.*ultra/i, name: "Gemini 2.0", company: "Google" },
      { pattern: /sora/i, name: "Sora", company: "OpenAI" },
      { pattern: /ChatGPT.*app|ChatGPT.*platform/i, name: "ChatGPT Platform", company: "OpenAI" },
    ];

    productPatterns.forEach(({ pattern, name, company }) => {
      const productArticles = articles.filter((article) => {
        const text = `${article.title} ${article.summary || ""}`;
        return pattern.test(text);
      });

      if (productArticles.length >= 2) {
        const title = `${name}: ${company}'s Latest AI Move Explained`;
        if (!isTopicCovered(title, [name, company])) {
          opportunities.push({
            type: "Product Analysis",
            title,
            description: `In-depth look at ${company}'s ${name} and what it means for developers`,
            confidence: "high",
            reasoning: `${productArticles.length} articles covering ${name}`,
            productData: { name, company, articleCount: productArticles.length },
          });
        }
      }
    });

    // 6. THEME-BASED OPPORTUNITIES (as fallback)
    const strongThemes = themes.filter(
      (t) => parseInt(t.articleCount, 10) >= 5 && !["Challenges & Limitations"].includes(t.name) // Already covered by reality check
    );

    strongThemes.slice(0, 1).forEach((theme) => {
      const title = this.generateThemeBasedTitle(theme);
      if (!isTopicCovered(title)) {
        opportunities.push({
          type: "Analysis",
          title,
          description: theme.description,
          confidence: "medium",
          reasoning: `${theme.articleCount} articles around this theme`,
          themeData: theme,
        });
      }
    });

    // 7. COMPARISON & VS opportunities
    const topCompanies = topics
      .filter((t) => companies.some((c) => t.topic.includes(c)))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    if (topCompanies.length >= 2) {
      const title = `${topCompanies[0].topic} vs ${topCompanies[1].topic}: Which AI Strategy Will Win?`;
      if (!isTopicCovered(title, [topCompanies[0].topic, topCompanies[1].topic])) {
        opportunities.push({
          type: "Comparison",
          title,
          description: `Head-to-head analysis of competing AI approaches`,
          confidence: "high",
          reasoning: `Both heavily discussed (${topCompanies[0].count} vs ${topCompanies[1].count} mentions)`,
          comparison: { a: topCompanies[0], b: topCompanies[1] },
        });
      }
    }

    // 8. INDUSTRY-SPECIFIC opportunities
    const industries = this.extractIndustryMentions(articles);
    industries.slice(0, 2).forEach((industry) => {
      const title = `How AI is Transforming ${industry.name}`;
      if (!isTopicCovered(title, [industry.name])) {
        opportunities.push({
          type: "Industry Analysis",
          title,
          description: `Industry-specific AI applications and impact in ${industry.name}`,
          confidence: "medium",
          reasoning: `${industry.count} articles mention ${industry.name}`,
          industryData: industry,
        });
      }
    });

    return opportunities.slice(0, 8); // Return top 8 diverse opportunities
  }

  // Helper: Calculate similarity between two strings
  calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/).filter((w) => w.length > 3));
    const words2 = new Set(str2.split(/\s+/).filter((w) => w.length > 3));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // Helper: Extract specific storylines about a company
  extractCompanyStorylines(articles, company) {
    if (articles.length === 0) return [];

    const storylinePatterns = [
      {
        angle: "controversy and backlash",
        regex:
          /controversy|scandal|backlash|criticism|protest|lawsuit|legal.*(?:action|battle)|police|subpoena/i,
        titleTemplate: (c) =>
          `${c.charAt(0).toUpperCase() + c.slice(1)}'s Latest Controversy: What Really Happened`,
        descTemplate: (c) =>
          `Analysis of recent controversies surrounding ${c} and their implications`,
      },
      {
        angle: "product launches and updates",
        regex:
          /launch|release|announce|unveil|introduce|new.*(?:feature|model|product|version)|update/i,
        titleTemplate: (c) =>
          `${c.charAt(0).toUpperCase() + c.slice(1)}'s Latest Product: Is It a Game Changer?`,
        descTemplate: (c) => `Deep dive into ${c}'s recent product launches and what they mean`,
      },
      {
        angle: "business strategy and partnerships",
        regex: /partnership|deal|acquisition|investment|strategy|expansion|pivot|collaborate/i,
        titleTemplate: (c) =>
          `${c.charAt(0).toUpperCase() + c.slice(1)}'s Strategic Moves: Reading the Tea Leaves`,
        descTemplate: (c) => `Analysis of ${c}'s business strategy and recent partnerships`,
      },
      {
        angle: "market competition",
        regex: /compet|rival|versus|vs\.|battle|war|fight|challenge.*(?:dominance|leader)/i,
        titleTemplate: (c) =>
          `How ${c.charAt(0).toUpperCase() + c.slice(1)} is Fighting for AI Dominance`,
        descTemplate: (c) => `Examining ${c}'s competitive position in the AI market`,
      },
      {
        angle: "technical breakthroughs",
        regex: /breakthrough|advance|improvement|performance|capability|benchmark|state.*art|SOTA/i,
        titleTemplate: (c) =>
          `${c.charAt(0).toUpperCase() + c.slice(1)}'s Technical Breakthrough: Hype or Reality?`,
        descTemplate: (c) => `Technical analysis of ${c}'s recent AI advances`,
      },
    ];

    const matchedStorylines = [];

    for (const pattern of storylinePatterns) {
      const matchingArticles = articles.filter((article) => {
        const text = `${article.title} ${article.summary || ""}`;
        return pattern.regex.test(text);
      });

      if (matchingArticles.length > 0) {
        matchedStorylines.push({
          angle: pattern.angle,
          title: pattern.titleTemplate(company),
          description: pattern.descTemplate(company),
          articleCount: matchingArticles.length,
          sampleArticles: matchingArticles.slice(0, 3).map((a) => a.title),
        });
      }
    }

    // Sort by article count (most coverage = most newsworthy)
    return matchedStorylines.sort((a, b) => b.articleCount - a.articleCount);
  }

  // Helper: Extract specific issues from articles
  extractSpecificIssues(articles) {
    // Group related controversial articles by actual topics, not just keywords
    const topicClusters = {};

    articles.forEach((article) => {
      const text = `${article.title} ${article.summary || ""}`.toLowerCase();

      // Look for specific controversies and issues with more context
      const patterns = [
        {
          key: "AI copyright and legal battles",
          regex:
            /copyright|lawsuit|legal.*(?:dispute|battle|case)|intellectual property|training.*data|unauthorized/i,
        },
        {
          key: "AI bias and fairness concerns",
          regex: /bias|fairness|discriminat|toxic|harmful.*content|ethical.*concern/i,
        },
        {
          key: "AI regulation and policy conflicts",
          regex:
            /regulat|policy|government|legislation|compliance|lawsuit.*regulat|police.*(?:ai|subpoena)/i,
        },
        {
          key: "AI environmental and energy costs",
          regex:
            /environmental|energy.*(?:consumption|cost|impact)|data center.*(?:power|energy)|carbon|sustainability/i,
        },
        {
          key: "AI job displacement and economic impact",
          regex:
            /job.*(?:loss|displacement|impact)|unemployment|worker.*(?:replace|automat)|economic.*impact/i,
        },
        {
          key: "AI accuracy and reliability problems",
          regex:
            /hallucination|accuracy|error|mistake|reliability|failure|(?:AI|model).*(?:wrong|incorrect|fail)/i,
        },
        {
          key: "AI safety and security risks",
          regex:
            /safety|security.*(?:risk|threat|breach)|vulnerability|attack|misuse|manipulation/i,
        },
        {
          key: "AI privacy and data concerns",
          regex:
            /privacy|data.*(?:breach|leak|collection)|personal.*(?:information|data)|surveillance/i,
        },
        {
          key: "AI hype versus reality",
          regex:
            /hype|overhype|promise.*(?:unfulfilled|fall)|expectation|disappoint|limitation.*(?:current|practical)/i,
        },
      ];

      patterns.forEach(({ key, regex }) => {
        if (regex.test(text)) {
          if (!topicClusters[key]) {
            topicClusters[key] = { topic: key, count: 0, articles: [], summaries: [] };
          }
          topicClusters[key].count++;
          topicClusters[key].articles.push(article.title);
          if (article.summary) {
            topicClusters[key].summaries.push(article.summary);
          }
        }
      });
    });

    return Object.values(topicClusters)
      .filter((cluster) => cluster.count >= 1) // At least 1 article
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Helper: Generate theme-based title
  generateThemeBasedTitle(theme) {
    const templates = {
      "AI Capability Leap": `The Real Breakthrough in ${theme.sampleTitles[0]?.split(" ")[0] || "AI"}`,
      "Market Dynamics": "Understanding the AI Market Shift",
      "Practical Applications": "AI Applications That Actually Work",
      "Technical Innovation": "The Technical Innovation Everyone Missed",
      "Industry Impact": "Industries Being Transformed by AI Right Now",
    };
    return templates[theme.name] || `Deep Dive: ${theme.name}`;
  }

  // Helper: Extract industry mentions
  extractIndustryMentions(articles) {
    const industries = [
      "healthcare",
      "finance",
      "banking",
      "retail",
      "manufacturing",
      "education",
      "legal",
      "marketing",
      "sales",
      "customer service",
      "logistics",
      "transportation",
      "energy",
      "agriculture",
    ];

    const industryCounts = {};
    articles.forEach((article) => {
      const text = `${article.title} ${article.summary || ""}`.toLowerCase();
      industries.forEach((industry) => {
        if (text.includes(industry)) {
          if (!industryCounts[industry]) {
            industryCounts[industry] = { name: industry, count: 0, articles: [] };
          }
          industryCounts[industry].count++;
          industryCounts[industry].articles.push(article.title);
        }
      });
    });

    return Object.values(industryCounts)
      .filter((i) => i.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  // Helper: Load existing blog posts
  async loadExistingBlogPosts() {
    const blogDir = path.join(__dirname, "../../content/blog");
    try {
      const files = await fs.readdir(blogDir);
      const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

      const posts = await Promise.all(
        mdxFiles.map(async (file) => {
          try {
            const content = await fs.readFile(path.join(blogDir, file), "utf8");
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (frontmatterMatch) {
              const frontmatter = frontmatterMatch[1];
              const titleMatch = frontmatter.match(/title:\s*['"]?(.+?)['"]?\n/);
              const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);

              return {
                title: titleMatch ? titleMatch[1].replace(/^['"]|['"]$/g, "") : "",
                tags: tagsMatch
                  ? tagsMatch[1].split(",").map((t) => t.trim().replace(/['"\s]/g, ""))
                  : [],
                file,
              };
            }
          } catch (err) {
            console.error(`Error reading ${file}:`, err.message);
          }
          return null;
        })
      );

      return posts.filter((p) => p?.title);
    } catch (error) {
      console.warn("Could not load existing blog posts:", error.message);
      return [];
    }
  }

  displayAnalysisSummary(analysis) {
    console.log("\n🎯 FRESH CONTENT OPPORTUNITIES (excluding existing posts):");
    if (analysis.opportunities.length === 0) {
      console.log("   No new opportunities found. Your existing posts cover current trends well!");
      console.log("   Try analyzing a longer timeframe: pnpm blog:analyze 14");
    } else {
      analysis.opportunities.forEach((opp, i) => {
        const tagSlug = this.getTagSlugForOpportunity(opp);
        console.log(`\n${i + 1}. [${opp.type}] ${opp.title}`);
        console.log(`   📝 ${opp.description}`);
        console.log(`   💡 Why: ${opp.reasoning}`);
        console.log(`   📊 Confidence: ${opp.confidence}`);
        console.log(`   🏷️  Tag: ${tagSlug}`);
      });
    }

    console.log("\n📈 TOP TRENDING TOPICS:");
    analysis.topics.slice(0, 10).forEach((topic, i) => {
      const bar = "█".repeat(Math.ceil(parseFloat(topic.percentage) / 2));
      console.log(
        `${i + 1}. ${topic.topic.padEnd(25)} ${bar} ${topic.count} (${topic.percentage}%)`
      );
    });

    console.log("\n🔥 DOMINANT THEMES:");
    analysis.themes.slice(0, 5).forEach((theme, i) => {
      const themeTag = this.getTagForTheme(theme.name);
      console.log(`${i + 1}. ${theme.name}: ${theme.articleCount} articles (${theme.percentage}%)`);
      if (theme.sampleTitles && theme.sampleTitles.length > 0) {
        console.log(`   📰 Example: "${theme.sampleTitles[0]}"`);
      }
      console.log(`   🏷️  Tag: ${themeTag}`);
    });

    console.log("\n💡 QUICK ACTIONS:");
    if (analysis.opportunities.length > 0) {
      const topOpp = analysis.opportunities[0];
      const sanitizedTitle = topOpp.title
        .replace(/[^a-z0-9\s]/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      const tagSlug = this.getTagSlugForOpportunity(topOpp);
      console.log(`\n   1️⃣ Generate the top opportunity:`);
      console.log(`      pnpm blog:generate "${sanitizedTitle}" ${tagSlug}`);
      console.log(`\n   2️⃣ Then list your drafts:`);
      console.log(`      pnpm blog:list`);
      console.log(`\n   3️⃣ Publish a draft using its ID:`);
      console.log(`      pnpm blog:publish <draft-id>`);
    }
    console.log(`\n   📊 Analyze longer period: pnpm blog:analyze 14`);
  }

  // Helper: Get tag slug for an opportunity
  getTagSlugForOpportunity(opportunity) {
    const typeToTag = {
      "Reality Check": "reality-check",
      "Technical Deep Dive": "technical-deep-dive",
      "Business Impact": "business-impact",
      "Future Forecast": "future-forecast",
      Analysis: "analysis",
      Comparison: "comparison",
      "Industry Analysis": "industry-analysis",
      "Product Analysis": "product-analysis",
    };

    return typeToTag[opportunity.type] || "analysis";
  }

  // Helper: Get tag for theme
  getTagForTheme(themeName) {
    const themeToTag = {
      "AI Capability Leap": "technical-deep-dive",
      "Market Dynamics": "business-impact",
      "Practical Applications": "analysis",
      "Technical Innovation": "technical-deep-dive",
      "Industry Impact": "industry-analysis",
      "Challenges & Limitations": "reality-check",
    };

    return themeToTag[themeName] || "analysis";
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new BlogAnalyzer();
  const days = process.argv[2] ? parseInt(process.argv[2], 10) : 7;

  analyzer
    .analyzeRecentTrends(days)
    .then(() => {
      console.log(
        "\n✅ Analysis complete! Use the opportunities above to generate compelling blog posts."
      );
    })
    .catch((error) => {
      console.error("❌ Analysis failed:", error.message);
      process.exit(1);
    });
}

module.exports = BlogAnalyzer;
