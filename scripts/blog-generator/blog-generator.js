#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

class BlogGenerator {
  constructor() {
    this.configPath = path.join(__dirname, 'config');
    this.dataPath = path.join(__dirname, 'data');
    this.outputPath = path.join(__dirname, '../../app/blog_generated');

    this.voiceFramework = null;
    this.openrouterConfig = null;
    this.costTracker = { totalSpent: 0, requestCount: 0 };
  }

  async initialize() {
    // Load configurations
    this.voiceFramework = JSON.parse(
      await fs.readFile(path.join(this.configPath, 'voice-framework.json'), 'utf8')
    );
    this.openrouterConfig = JSON.parse(
      await fs.readFile(path.join(this.configPath, 'openrouter.json'), 'utf8')
    );

    // Ensure output directory exists
    await fs.mkdir(this.outputPath, { recursive: true });
    await fs.mkdir(path.join(this.outputPath, 'drafts'), { recursive: true });

    console.log('🤖 Blog Generator initialized');
  }

  async generateBlogPost(options = {}) {
    const {
      topic,
      type = 'analysis', // analysis, tutorial, prediction, reality-check
      style = 'analytical',
      targetLength = 'medium' // short (800-1200), medium (1500-2500), long (3000-4000)
    } = options;

    if (!topic) {
      throw new Error('Topic is required for blog generation');
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
      research
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
    console.log('🔍 Conducting research...');

    const researchPrompt = this.buildResearchPrompt(topic, type);
    const research = await this.callOpenRouter(researchPrompt, 'analysis');

    try {
      return JSON.parse(research);
    } catch (error) {
      console.error('❌ Failed to parse research JSON:', error.message);
      console.log('Raw response:', research.substring(0, 200) + '...');
      throw new Error('AI returned invalid JSON format. Please try again.');
    }
  }

  buildResearchPrompt(topic, type) {
    return `You are an expert AI industry analyst. Research the topic "${topic}" for a ${type} blog post.

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
    console.log('📋 Creating outline...');

    const outlinePrompt = this.buildOutlinePrompt(research, type, style);
    const outline = await this.callOpenRouter(outlinePrompt, 'creative');

    try {
      return JSON.parse(outline);
    } catch (error) {
      console.error('❌ Failed to parse outline JSON:', error.message);
      console.log('Raw response:', outline.substring(0, 200) + '...');
      throw new Error('AI returned invalid JSON format for outline. Please try again.');
    }
  }

  buildOutlinePrompt(research, type, style) {
    const voiceGuide = this.voiceFramework.brandVoice;
    const pillar = this.voiceFramework.contentPillars.find(p =>
      p.name.toLowerCase().includes(type.toLowerCase())
    ) || this.voiceFramework.contentPillars[0];

    return `Create a compelling blog post outline using this research data and voice framework.

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
    console.log('✍️ Generating content sections...');

    const sections = [];

    // Generate introduction with hook
    const intro = await this.generateIntroduction(outline.hook, outline.thesis);
    sections.push({ type: 'introduction', content: intro });

    // Generate main sections
    for (const section of outline.sections) {
      const content = await this.generateSection(section, research);
      sections.push({ type: 'section', title: section.title, content });
    }

    // Generate conclusion
    const conclusion = await this.generateConclusion(outline.conclusion);
    sections.push({ type: 'conclusion', content: conclusion });

    return sections;
  }

  async generateIntroduction(hook, thesis) {
    const prompt = `Write a compelling blog post introduction using this framework:

HOOK: ${hook}
THESIS: ${thesis}

VOICE GUIDELINES:
- ${this.voiceFramework.brandVoice.persona}
- Tone: ${this.voiceFramework.brandVoice.tone.primary}
- Use signature phrases like: ${this.voiceFramework.signaturePhrases.slice(0, 2).join(', ')}

Write 200-300 words that:
1. Open with the hook in an engaging way
2. Provide necessary context
3. Present the thesis clearly
4. Preview what's coming
5. Use data or specific examples to build credibility

Make it conversational but authoritative, skeptical but not cynical.`;

    return await this.callOpenRouter(prompt, 'creative');
  }

  async generateSection(sectionOutline, research) {
    const prompt = `Write a blog section with this outline:

TITLE: ${sectionOutline.title}
KEY POINTS: ${sectionOutline.key_points.join(', ')}
SUPPORTING EVIDENCE: ${sectionOutline.evidence.join(', ')}

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

Transition naturally to: ${sectionOutline.transition}`;

    return await this.callOpenRouter(prompt, 'analysis');
  }

  async generateConclusion(conclusionOutline) {
    const prompt = `Write a powerful blog conclusion:

SUMMARY: ${conclusionOutline.summary}
ACTION ITEMS: ${conclusionOutline.action_items.join(', ')}
CALL TO ACTION: ${conclusionOutline.call_to_action}

Write 200-250 words that:
1. Summarize key insights without repetition
2. Provide clear, actionable next steps
3. End with a memorable final thought
4. Include a specific call to action

Use signature phrases: ${this.voiceFramework.signaturePhrases.slice(-2).join(', ')}`;

    return await this.callOpenRouter(prompt, 'creative');
  }

  async generateSEOMetadata(topic, sections, type) {
    console.log('🔍 Generating SEO metadata...');

    const content = sections.map(s => s.content).join('\n\n');
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

Use these title formats as inspiration:
${this.voiceFramework.seoStrategy.titleFormats.join(', ')}

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

    const seoData = await this.callOpenRouter(prompt, 'analysis');

    try {
      return JSON.parse(seoData);
    } catch (error) {
      console.error('❌ Failed to parse SEO JSON:', error.message);
      console.log('Raw response:', seoData.substring(0, 200) + '...');
      throw new Error('AI returned invalid JSON format for SEO data. Please try again.');
    }
  }

  async assembleBlogPost(data) {
    const { topic, type, style, outline, sections, seoData } = data;

    // Create frontmatter
    const frontmatter = {
      title: seoData.title,
      description: seoData.metaDescription,
      date: new Date().toISOString().split('T')[0],
      category: this.mapTypeToCategory(type),
      tags: seoData.keywords.slice(0, 5),
      author: "RADE AI Solutions",
      readTime: this.estimateReadTime(sections),
      seo: {
        keywords: seoData.keywords,
        schema: seoData.schema
      },
      generated: true,
      generatedAt: new Date().toISOString()
    };

    // Assemble content
    const content = sections.map(section => {
      if (section.type === 'introduction') {
        return section.content;
      } else if (section.type === 'section') {
        return `## ${section.title}\n\n${section.content}`;
      } else if (section.type === 'conclusion') {
        return `## Key Takeaways\n\n${section.content}`;
      }
    }).join('\n\n');

    return {
      frontmatter,
      content,
      metadata: {
        topic,
        type,
        style,
        outline,
        generatedAt: new Date().toISOString(),
        cost: this.costTracker.totalSpent
      }
    };
  }

  mapTypeToCategory(type) {
    const mapping = {
      'analysis': 'AI Analysis',
      'tutorial': 'Technical Guide',
      'prediction': 'Future Forecast',
      'reality-check': 'Reality Check'
    };
    return mapping[type] || 'AI Insights';
  }

  estimateReadTime(sections) {
    const totalWords = sections.reduce((count, section) => {
      return count + (section.content.match(/\w+/g) || []).length;
    }, 0);

    return Math.ceil(totalWords / 200) + ' min read';
  }

  async saveDraft(blogPost, draftId) {
    const filename = `${draftId}.json`;
    const filepath = path.join(this.outputPath, 'drafts', filename);

    await fs.writeFile(filepath, JSON.stringify(blogPost, null, 2));

    return filepath;
  }

  generateDraftId(topic) {
    const sanitized = topic.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 40);

    const timestamp = Date.now().toString().slice(-6);
    return `${sanitized}-${timestamp}`;
  }

  async callOpenRouter(prompt, modelType = 'analysis') {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not found in environment variables');
    }

    const modelConfig = this.openrouterConfig.models[modelType] || this.openrouterConfig.models.analysis;

    console.log(`🤖 Calling OpenRouter (${modelConfig.model})...`);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://alphab.io',
          'X-Title': 'RADE AI Blog Generator'
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Track costs
      this.costTracker.requestCount++;
      const inputTokens = data.usage?.prompt_tokens || 0;
      const outputTokens = data.usage?.completion_tokens || 0;
      const estimatedCost = this.estimateCost(modelConfig.model, inputTokens, outputTokens);
      this.costTracker.totalSpent += estimatedCost;

      console.log(`💰 Request cost: $${estimatedCost.toFixed(4)} (Total: $${this.costTracker.totalSpent.toFixed(4)})`);

      return content;

    } catch (error) {
      throw new Error(`OpenRouter API call failed: ${error.message}`);
    }
  }

  estimateCost(model, inputTokens, outputTokens) {
    // OpenRouter pricing per 1K tokens (as of 2024)
    const pricing = {
      'anthropic/claude-3.5-sonnet': { input: 0.003, output: 0.015 },
      'openai/gpt-4-turbo': { input: 0.01, output: 0.03 },
      'openai/gpt-4o': { input: 0.005, output: 0.015 },
      'meta-llama/llama-3.1-70b-instruct': { input: 0.0009, output: 0.0009 },
      'default': { input: 0.002, output: 0.01 }
    };

    const rates = pricing[model] || pricing.default;
    return (inputTokens / 1000 * rates.input) + (outputTokens / 1000 * rates.output);
  }
}

// CLI interface
if (require.main === module) {
  const generator = new BlogGenerator();

  const topic = process.argv[2];
  const type = process.argv[3] || 'analysis';

  if (!topic) {
    console.log('Usage: node blog-generator.js "Topic" [type]');
    console.log('Types: analysis, tutorial, prediction, reality-check');
    process.exit(1);
  }

  generator.initialize()
    .then(() => generator.generateBlogPost({ topic, type }))
    .then(result => {
      console.log(`\n🎉 Success! Draft ID: ${result.draftId}`);
      console.log(`Next step: node blog-publisher.js ${result.draftId}`);
    })
    .catch(error => {
      console.error('❌ Generation failed:', error.message);
      process.exit(1);
    });
}

module.exports = BlogGenerator;