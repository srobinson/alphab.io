# AI Blog Generation System

A sophisticated system for generating high-quality, SEO-optimized blog posts using AI, designed to maintain consistent voice and produce truly unique content.

## Overview

This system consists of three main components:

1. **Blog Analyzer** - Analyzes your content database to identify trending topics and content opportunities
2. **Blog Generator** - Uses AI to generate comprehensive, well-researched blog posts
3. **Blog Publisher** - Converts drafts to static MDX files ready for deployment

## Setup

### 1. Environment Variables

Add to your `.env.local`:

```bash
# OpenRouter API (required for generation)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Install Dependencies

The system uses your existing Node.js setup - no additional dependencies required.

## Usage

### Step 1: Analyze Trends

```bash
# Analyze trends from last 7 days
npm run blog:analyze

# Analyze trends from last 14 days
npm run blog:analyze 14
```

This will:
- Analyze recent articles in your database
- Identify trending topics and themes
- Suggest content opportunities
- Save analysis data for reference

### Step 2: Generate Blog Post

```bash
# Generate analysis-style post
npm run blog:generate "The Future of RAG in Enterprise AI" analysis

# Generate tutorial-style post
npm run blog:generate "How to Implement Vector Search" tutorial

# Generate prediction-style post
npm run blog:generate "Why AI Agents Will Dominate 2024" prediction

# Generate reality-check style post
npm run blog:generate "The AGI Hype vs Reality" reality-check
```

This will:
- Conduct AI-powered research on the topic
- Create a detailed outline with unique angles
- Generate all content sections
- Create SEO metadata
- Save as draft for review

### Step 3: Review and Publish

```bash
# List all drafts
npm run blog:list

# Preview a specific draft
npm run blog:preview draft-id-12345

# Publish draft to static files
npm run blog:publish draft-id-12345

# Unpublish a generated post (by slug or draft ID)
npm run blog:unpublish my-post-slug
```

## Content Strategy

### Voice Framework

The system maintains consistent voice through:

- **Persona**: AI Industry Analyst & Technical Strategist
- **Tone**: Analytical yet accessible, data-driven with healthy skepticism
- **Structure**: Hook → Thesis → Evidence → Insights → Action

### Content Pillars

1. **Reality Check** - Separating AI hype from genuine breakthroughs
2. **Business Impact** - How AI developments translate to business value
3. **Technical Deep Dive** - In-depth analysis of AI technologies
4. **Future Forecast** - Data-driven predictions about AI evolution

### SEO Strategy

- Long-tail, question-based keywords
- Problem-solving focused content
- Schema markup for rich snippets
- Internal linking suggestions
- Optimized meta descriptions

## Generated Content Structure

```
content/blog/
├── index.json              # Blog post index
├── rss.xml                 # RSS feed
├── post-slug.mdx           # Blog post content
└── post-slug.meta.json     # Post metadata
```

## Cost Management

- Tracks OpenRouter API usage
- Estimates costs per generation
- Alerts when approaching budget limits
- Optimizes prompts for efficiency

## Example Workflow

1. **Weekly Analysis**:
   ```bash
   npm run blog:analyze 7
   ```

2. **Generate 2-3 Posts**:
   ```bash
   npm run blog:generate "AI Safety in Production Systems" analysis
   npm run blog:generate "Building RAG Applications" tutorial
   npm run blog:generate "The Real State of AI in 2024" reality-check
   ```

3. **Review and Publish**:
   ```bash
   npm run blog:list
   npm run blog:preview draft-id-1
   npm run blog:publish draft-id-1
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Add new blog posts"
   git push
   ```

## Customization

### Voice Configuration

Edit `config/voice-framework.json` to adjust:
- Writing style and tone
- Content pillars and themes
- Signature phrases
- SEO strategies

### Model Configuration

Edit `config/openrouter.json` to adjust:
- Default AI models
- Temperature and creativity settings
- Cost tracking preferences

## Advanced Features

### Batch Generation

Generate multiple posts from analysis:

```bash
# After running blog:analyze, this will suggest 3-5 posts
node scripts/blog-generator/batch-generator.js
```

### Content Enhancement

Enhance existing articles into full blog posts:

```bash
node scripts/blog-generator/enhancer.js article-id-123
```

### Analytics Integration

Track post performance:

```bash
node scripts/blog-generator/analytics.js
```

## Troubleshooting

### Common Issues

1. **OpenRouter API Errors**: Check your API key and credit balance
2. **Generation Timeouts**: Reduce content length or complexity
3. **Quality Issues**: Adjust temperature settings or model choice

### Debug Mode

Run with debug output:

```bash
DEBUG=true npm run blog:generate "Topic" analysis
```

## Best Practices

1. **Quality over Quantity**: Generate 1-2 high-quality posts per week
2. **Fact-Check**: Always review AI-generated content for accuracy
3. **Personalize**: Add your own insights and examples
4. **Monitor Costs**: Track OpenRouter usage regularly
5. **SEO Optimize**: Use suggested keywords and meta descriptions

## Integration with Existing Blog

The system generates static MDX files that can be integrated with your existing blog infrastructure. Update your blog page to read from the generated content directory.

---

🤖 **AI-Powered** • 📊 **Data-Driven** • 🎯 **SEO-Optimized** • 💰 **Cost-Conscious**
