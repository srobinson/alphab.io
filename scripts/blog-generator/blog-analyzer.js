#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

class BlogAnalyzer {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async analyzeRecentTrends(daysBack = 7) {
    console.log(`🔍 Analyzing trends from the last ${daysBack} days...`);

    const { data: articles, error } = await this.supabase
      .from('articles')
      .select('title, summary, tags, source, published_at, url')
      .eq('status', 'published')
      .gte('published_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }

    console.log(`📊 Found ${articles.length} articles to analyze`);

    // Extract topics and themes
    const topics = this.extractTopics(articles);
    const themes = this.identifyThemes(articles);
    const opportunities = this.findContentOpportunities(articles, topics, themes);

    const analysis = {
      timeframe: `${daysBack} days`,
      articleCount: articles.length,
      generatedAt: new Date().toISOString(),
      topics,
      themes,
      opportunities,
      rawData: articles.slice(0, 20) // Keep sample for reference
    };

    // Save analysis
    const dataDir = path.join(__dirname, 'data');
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
      /\b(startup|unicorn|seed.?round|series.?[A-Z])\b/gi
    ];

    articles.forEach(article => {
      const text = `${article.title} ${article.summary || ''}`.toLowerCase();
      keywordPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const normalized = match.toLowerCase().replace(/[^\w]/g, ' ').trim();
            topicFrequency[normalized] = (topicFrequency[normalized] || 0) + 1;
          });
        }
      });
    });

    return Object.entries(topicFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([topic, count]) => ({ topic, count, percentage: (count / articles.length * 100).toFixed(1) }));
  }

  identifyThemes(articles) {
    const themes = [
      {
        name: "AI Capability Leap",
        keywords: ["breakthrough", "advancement", "capability", "performance", "benchmark"],
        description: "Major advances in AI capabilities or performance"
      },
      {
        name: "Market Dynamics",
        keywords: ["funding", "investment", "competition", "market", "revenue", "growth"],
        description: "Business and market developments in AI"
      },
      {
        name: "Practical Applications",
        keywords: ["implementation", "deployment", "use case", "application", "adoption"],
        description: "Real-world AI implementations and use cases"
      },
      {
        name: "Technical Innovation",
        keywords: ["architecture", "algorithm", "method", "technique", "approach"],
        description: "New technical approaches or methodologies"
      },
      {
        name: "Industry Impact",
        keywords: ["industry", "sector", "transformation", "disruption", "change"],
        description: "How AI is affecting different industries"
      },
      {
        name: "Challenges & Limitations",
        keywords: ["challenge", "limitation", "problem", "issue", "concern"],
        description: "Problems and limitations in current AI"
      }
    ];

    return themes.map(theme => {
      const matchingArticles = articles.filter(article => {
        const text = `${article.title} ${article.summary || ''}`.toLowerCase();
        return theme.keywords.some(keyword => text.includes(keyword));
      });

      return {
        ...theme,
        articleCount: matchingArticles.length,
        percentage: (matchingArticles.length / articles.length * 100).toFixed(1),
        sampleTitles: matchingArticles.slice(0, 3).map(a => a.title)
      };
    }).sort((a, b) => b.articleCount - a.articleCount);
  }

  findContentOpportunities(articles, topics, themes) {
    const opportunities = [];

    // Look for controversial or contrarian angles
    const controversialKeywords = ["debate", "criticism", "concern", "risk", "limitation", "failure"];
    const controversialArticles = articles.filter(article => {
      const text = `${article.title} ${article.summary || ''}`.toLowerCase();
      return controversialKeywords.some(keyword => text.includes(keyword));
    });

    if (controversialArticles.length > 0) {
      opportunities.push({
        type: "Reality Check",
        title: "The Other Side of the AI Hype",
        description: "Address controversies and limitations being discussed",
        confidence: "high",
        sampleArticles: controversialArticles.slice(0, 3).map(a => a.title)
      });
    }

    // Look for technical deep dives
    const technicalTopics = topics.filter(t =>
      ["rag", "transformer", "multimodal", "fine tuning"].some(tech =>
        t.topic.includes(tech)
      )
    );

    if (technicalTopics.length > 0) {
      opportunities.push({
        type: "Technical Deep Dive",
        title: `How ${technicalTopics[0].topic} Actually Works (And Why It Matters)`,
        description: "Explain complex technical concepts with practical implications",
        confidence: "high",
        trending: technicalTopics[0]
      });
    }

    // Look for business application angles
    const businessThemes = themes.filter(t =>
      ["Market Dynamics", "Practical Applications", "Industry Impact"].includes(t.name)
    );

    if (businessThemes.length > 0) {
      opportunities.push({
        type: "Business Impact",
        title: "What Recent AI Developments Mean for Business Leaders",
        description: "Translate technical advances into business implications",
        confidence: "medium",
        relevantThemes: businessThemes.map(t => t.name)
      });
    }

    // Look for prediction opportunities
    const emergingTopics = topics.filter(t => parseInt(t.count) >= 2 && parseInt(t.count) <= 5);

    if (emergingTopics.length > 0) {
      opportunities.push({
        type: "Future Forecast",
        title: `Why ${emergingTopics[0].topic} Will Be Huge in 2024`,
        description: "Early prediction on emerging trend",
        confidence: "medium",
        emergingTrend: emergingTopics[0]
      });
    }

    return opportunities;
  }

  displayAnalysisSummary(analysis) {
    console.log('\n🎯 CONTENT OPPORTUNITIES:');
    analysis.opportunities.forEach((opp, i) => {
      console.log(`${i + 1}. [${opp.type}] ${opp.title}`);
      console.log(`   ${opp.description} (Confidence: ${opp.confidence})`);
    });

    console.log('\n📈 TOP TRENDING TOPICS:');
    analysis.topics.slice(0, 5).forEach((topic, i) => {
      console.log(`${i + 1}. ${topic.topic} (${topic.count} mentions, ${topic.percentage}%)`);
    });

    console.log('\n🔥 DOMINANT THEMES:');
    analysis.themes.slice(0, 3).forEach((theme, i) => {
      console.log(`${i + 1}. ${theme.name}: ${theme.articleCount} articles (${theme.percentage}%)`);
    });
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new BlogAnalyzer();
  const days = process.argv[2] ? parseInt(process.argv[2]) : 7;

  analyzer.analyzeRecentTrends(days)
    .then(() => {
      console.log('\n✅ Analysis complete! Use the opportunities above to generate compelling blog posts.');
    })
    .catch(error => {
      console.error('❌ Analysis failed:', error.message);
      process.exit(1);
    });
}

module.exports = BlogAnalyzer;