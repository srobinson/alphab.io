#!/usr/bin/env tsx
// Test script for RSS parsing and content classification
// Usage: pnpm dlx tsx scripts/test-automation.ts

import { RSSParser } from '../lib/content/rss-parser'
import { ContentClassifier } from '../lib/content/classifier'
import { getActiveSourcesByPriority } from '../lib/content/sources'

async function testRSSParsing() {
  console.log('🚀 Testing RSS parsing and content classification...\n')
  
  const parser = new RSSParser()
  const classifier = new ContentClassifier()
  const sources = getActiveSourcesByPriority().slice(0, 3) // Test first 3 sources
  
  console.log(`Testing ${sources.length} sources:\n`)
  
  for (const source of sources) {
    console.log(`📡 Fetching from: ${source.name}`)
    console.log(`   URL: ${source.rssUrl}`)
    console.log(`   Category: ${source.category}, Priority: ${source.priority}`)
    
    try {
      const result = await parser.fetchFromSource(source)
      
      if (result.success) {
        console.log(`   ✅ Success: ${result.items.length} items fetched in ${result.duration}ms`)
        
        if (result.items.length > 0) {
          // Test classification on first item
          const firstItem = result.items[0]
          const classified = await classifier.classifyContent(firstItem)
          
          console.log(`   📊 Classification of first item:`)
          console.log(`      Title: ${firstItem.title.substring(0, 60)}...`)
          console.log(`      Category: ${classified.classification.category}`)
          console.log(`      Relevance Score: ${classified.classification.relevanceScore}`)
          console.log(`      Is Breaking: ${classified.classification.isBreaking}`)
          console.log(`      Is Trending: ${classified.classification.isTrending}`)
          console.log(`      Priority: ${classified.classification.priority}`)
          console.log(`      Tags: ${classified.classification.tags.slice(0, 5).join(', ')}`)
        }
      } else {
        console.log(`   ❌ Failed: ${result.error}`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    console.log('')
  }
  
  console.log('✨ RSS parsing test completed!\n')
}

async function testContentClassification() {
  console.log('🧠 Testing content classification with sample data...\n')
  
  const classifier = new ContentClassifier()
  
  const sampleItems = [
    {
      guid: 'test-1',
      title: 'OpenAI Announces Major Breakthrough in GPT-5 Development',
      link: 'https://example.com/openai-gpt5',
      pubDate: new Date(),
      description: 'OpenAI reveals significant advances in their next-generation AI model with unprecedented reasoning capabilities',
      source: 'TechCrunch',
      sourceId: 'techcrunch-ai',
      category: 'ai',
      priority: 'high',
      tags: ['ai', 'openai', 'gpt']
    },
    {
      guid: 'test-2', 
      title: 'Analysis: The Future of AI in Enterprise Applications',
      link: 'https://example.com/ai-enterprise-analysis',
      pubDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      description: 'Expert analysis on how artificial intelligence is transforming business operations across industries',
      source: 'MIT Technology Review',
      sourceId: 'mit-tech-review',
      category: 'research',
      priority: 'high',
      tags: ['ai', 'enterprise', 'analysis']
    },
    {
      guid: 'test-3',
      title: 'Software Update: New Version 2.1 Released with Bug Fixes',
      link: 'https://example.com/software-update',
      pubDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      description: 'Minor update includes performance improvements and security patches',
      source: 'Tech Blog',
      sourceId: 'tech-blog',
      category: 'tech',
      priority: 'low',
      tags: ['update', 'software']
    }
  ]
  
  for (const item of sampleItems) {
    const classified = await classifier.classifyContent(item)
    
    console.log(`📄 Title: ${item.title}`)
    console.log(`   Category: ${classified.classification.category}`)
    console.log(`   Relevance Score: ${classified.classification.relevanceScore}`)
    console.log(`   Priority: ${classified.classification.priority}`)
    console.log(`   Breaking: ${classified.classification.isBreaking}`)
    console.log(`   Trending: ${classified.classification.isTrending}`)
    console.log(`   Confidence: ${(classified.classification.confidence * 100).toFixed(1)}%`)
    console.log('')
  }
  
  console.log('✨ Content classification test completed!\n')
}

async function main() {
  console.log('🔧 Content Automation Test Suite')
  console.log('==================================\n')
  
  try {
    await testRSSParsing()
    await testContentClassification()
    
    console.log('🎉 All tests completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Run database migration: supabase migration up')
    console.log('2. Set environment variables: CRON_SECRET, SUPABASE_SERVICE_ROLE_KEY')
    console.log('3. Test cron endpoint: curl -H "Authorization: Bearer your-secret" /api/cron/content-sync')
    console.log('4. Deploy to Vercel with cron configuration')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

main().catch(console.error)