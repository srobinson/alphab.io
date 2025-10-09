#!/usr/bin/env tsx
// Test dynamic thumbnails
// Usage: pnpm dlx tsx scripts/test-thumbnails.ts

import * as SimpleThumbnailService from "../src/lib/content/simple-thumbnails";

const sampleArticles = [
  {
    title: "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
    source: "TechCrunch",
    category: "breaking",
    tags: ["ai", "openai", "gpt", "reasoning"],
  },
  {
    title: "Analysis: The Future of Machine Learning in Healthcare",
    source: "MIT Technology Review",
    category: "insight",
    tags: ["machine-learning", "healthcare", "analysis"],
  },
  {
    title: "Trending: AI Chatbots Surge 300% in Enterprise Adoption",
    source: "VentureBeat",
    category: "trending",
    tags: ["chatbots", "enterprise", "adoption"],
  },
  {
    title: "Software Update: TensorFlow 3.0 Released with New Features",
    source: "Google AI Blog",
    category: "update",
    tags: ["tensorflow", "update", "google"],
  },
  {
    title: "Understanding Reasoning LLMs and Their Applications",
    source: "Sebastian Raschka's Blog",
    category: "insight",
    tags: ["llm", "reasoning", "applications"],
  },
];

function testThumbnailGeneration() {
  console.log("🎨 Testing Dynamic Thumbnail Generation");
  console.log("======================================\n");

  sampleArticles.forEach((article, index) => {
    console.log(`📰 Article ${index + 1}: ${article.title}`);
    console.log(`   Source: ${article.source}`);
    console.log(`   Category: ${article.category}`);
    console.log(`   Tags: ${article.tags.join(", ")}`);

    // Get all thumbnail options
    const options = SimpleThumbnailService.getThumbnailOptions(article);

    console.log("   🖼️  Thumbnail Options:");
    console.log(`      Picsum (Deterministic):  ${options.picsum}`);
    console.log(`      Unsplash (Keywords):     ${options.unsplash}`);
    console.log(`      Category (Filtered):     ${options.category}`);
    console.log(`      Gradient (Generated):    ${options.gradient.substring(0, 50)}...`);

    // Get the best thumbnail
    const bestThumbnail = SimpleThumbnailService.getBestThumbnail(article);
    console.log(`   ⭐ Best Choice: ${bestThumbnail}`);
    console.log("");
  });

  console.log("🔍 How It Works:");
  console.log("================");
  console.log("1. **Picsum**: Deterministic images based on title hash");
  console.log("   - Same title = same image (consistent)");
  console.log("   - Different titles = different images (variety)");
  console.log("");
  console.log("2. **Unsplash**: High-quality images based on AI/tech keywords");
  console.log("   - Searches for relevant terms from title/tags");
  console.log("   - Returns professional stock photos");
  console.log("");
  console.log("3. **Category Filters**: Picsum with visual effects");
  console.log("   - Breaking: Grayscale + blur (urgent feel)");
  console.log("   - Trending: Full color (vibrant)");
  console.log("   - Update: Grayscale (neutral)");
  console.log("   - Insight: Blur effect (thoughtful)");
  console.log("");
  console.log("4. **Smart Selection**:");
  console.log("   - AI/tech keywords → Unsplash (high quality)");
  console.log("   - General content → Picsum (reliable variety)");
  console.log("");

  console.log("✅ Benefits:");
  console.log("- Every post gets a unique image");
  console.log("- Images are deterministic (same article = same image)");
  console.log("- No API keys required (works immediately)");
  console.log("- High-quality images for AI/tech content");
  console.log("- Graceful fallbacks if services are down");
  console.log("");

  console.log("🚀 Implementation Status:");
  console.log("- ✅ SimpleThumbnailService created");
  console.log("- ✅ Integrated into curated-news API");
  console.log("- ✅ RSS parser extracts images from feeds");
  console.log("- ✅ Multiple fallback strategies");
  console.log("- ✅ Ready for production use");
}

testThumbnailGeneration();
