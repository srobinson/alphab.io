// Content classification and quality filtering
import type { RSSItem } from './rss-parser'

export interface ContentClassification {
  category: 'breaking' | 'trending' | 'update' | 'insight'
  relevanceScore: number
  tags: string[]
  isBreaking: boolean
  isTrending: boolean
  priority: number
  confidence: number
}

export interface ClassifiedContent extends RSSItem {
  classification: ContentClassification
}

export class ContentClassifier {
  private breakingKeywords = [
    'breaking', 'announces', 'launches', 'releases', 'unveils', 'reveals',
    'first-ever', 'record', 'milestone', 'breakthrough', 'emergency',
    'urgent', 'exclusive', 'just in', 'developing'
  ]

  private trendingKeywords = [
    'trend', 'popular', 'viral', 'widespread', 'adoption', 'surge',
    'boom', 'explodes', 'soars', 'dominates', 'taking over'
  ]

  private updateKeywords = [
    'update', 'upgrade', 'version', 'patch', 'fixes', 'improves',
    'enhances', 'adds', 'removes', 'changes', 'modifies'
  ]

  private insightKeywords = [
    'analysis', 'opinion', 'perspective', 'insight', 'think', 'believe',
    'expert', 'study', 'research', 'findings', 'concludes', 'suggests'
  ]

  private aiTerms = [
    'ai', 'artificial intelligence', 'machine learning', 'deep learning',
    'neural network', 'gpt', 'llm', 'chatgpt', 'openai', 'anthropic',
    'claude', 'gemini', 'bard', 'automation', 'robotics', 'nlp'
  ]

  private techTerms = [
    'technology', 'tech', 'software', 'hardware', 'computing', 'digital',
    'platform', 'api', 'cloud', 'saas', 'startup', 'venture capital'
  ]

  async classifyContent(item: RSSItem): Promise<ClassifiedContent> {
    const classification = await this.analyzeContent(item)
    
    return {
      ...item,
      classification
    }
  }

  private async analyzeContent(item: RSSItem): Promise<ContentClassification> {
    const text = `${item.title} ${item.description}`.toLowerCase()
    
    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(text, item)
    
    // Determine category
	const category = this.determineCategory(text)
    
    // Check if breaking news
    const isBreaking = this.isBreakingNews(text, item)
    
    // Check if trending
    const isTrending = this.isTrendingContent(text, item)
    
    // Calculate priority (1-100, higher is better)
    const priority = this.calculatePriority(relevanceScore, category, isBreaking, isTrending, item)
    
    // Enhanced tags
    const tags = this.generateEnhancedTags(text, item)
    
    // Confidence score (0-1)
    const confidence = this.calculateConfidence(relevanceScore, category, item)

    return {
      category,
      relevanceScore,
      tags,
      isBreaking,
      isTrending,
      priority,
      confidence
    }
  }

  private calculateRelevanceScore(text: string, item: RSSItem): number {
    let score = 0
    
    // Base score from source priority
    if (item.priority === 'high') score += 30
    else if (item.priority === 'medium') score += 20
    else score += 10
    
    // AI relevance boost
    const aiMatches = this.countKeywordMatches(text, this.aiTerms)
    score += aiMatches * 15
    
    // Tech relevance boost
    const techMatches = this.countKeywordMatches(text, this.techTerms)
    score += techMatches * 10
    
    // Recency boost (newer content scores higher)
    const hoursOld = (Date.now() - item.pubDate.getTime()) / (1000 * 60 * 60)
    if (hoursOld < 1) score += 20
    else if (hoursOld < 6) score += 15
    else if (hoursOld < 24) score += 10
    else if (hoursOld < 72) score += 5
    
    // Title quality boost
    if (item.title.length > 50 && item.title.length < 100) score += 5
    
    // Description quality boost
    if (item.description.length > 100 && item.description.length < 300) score += 5
    
    return Math.min(100, Math.max(0, score))
  }

	private determineCategory(text: string): ContentClassification['category'] {
    const breakingScore = this.countKeywordMatches(text, this.breakingKeywords)
    const trendingScore = this.countKeywordMatches(text, this.trendingKeywords)
    const updateScore = this.countKeywordMatches(text, this.updateKeywords)
    const insightScore = this.countKeywordMatches(text, this.insightKeywords)
    
    const scores = {
      breaking: breakingScore,
      trending: trendingScore,
      update: updateScore,
      insight: insightScore
    }
    
    const maxScore = Math.max(...Object.values(scores))
    if (maxScore === 0) return 'update' // Default category
    
	const bestCategory = Object.entries(scores).find(([, score]) => score === maxScore)?.[0]
	return (bestCategory as ContentClassification['category']) ?? 'update'
  }

  private isBreakingNews(text: string, item: RSSItem): boolean {
    // Check for breaking keywords
    const hasBreakingKeywords = this.countKeywordMatches(text, this.breakingKeywords) > 0
    
    // Check recency (breaking news should be very recent)
    const hoursOld = (Date.now() - item.pubDate.getTime()) / (1000 * 60 * 60)
    const isRecent = hoursOld < 6
    
    // Check for major company mentions (OpenAI, Google, Microsoft, etc.)
    const majorCompanies = ['openai', 'google', 'microsoft', 'apple', 'meta', 'amazon', 'nvidia']
    const hasMajorCompany = this.countKeywordMatches(text, majorCompanies) > 0
    
    return hasBreakingKeywords && isRecent && hasMajorCompany
  }

  private isTrendingContent(text: string, item: RSSItem): boolean {
    // Check for trending keywords
    const hasTrendingKeywords = this.countKeywordMatches(text, this.trendingKeywords) > 0
    
    // Check for high engagement indicators
    const engagementTerms = ['million', 'billion', 'users', 'downloads', 'adoption', 'growth']
    const hasEngagement = this.countKeywordMatches(text, engagementTerms) > 0
    
    // High priority sources are more likely to be trending
    const isHighPriority = item.priority === 'high'
    
    return hasTrendingKeywords || (hasEngagement && isHighPriority)
  }

  private calculatePriority(
    relevanceScore: number,
    category: ContentClassification['category'],
    isBreaking: boolean,
    isTrending: boolean,
    item: RSSItem
  ): number {
    let priority = relevanceScore
    
    // Category bonuses
    if (category === 'breaking') priority += 25
    else if (category === 'trending') priority += 20
    else if (category === 'insight') priority += 15
    else if (category === 'update') priority += 10
    
    // Special flags bonuses
    if (isBreaking) priority += 30
    if (isTrending) priority += 20
    
    // Source category bonuses
    if (item.category === 'research') priority += 15
    else if (item.category === 'ai') priority += 10
    
    return Math.min(100, Math.max(0, priority))
  }

  private generateEnhancedTags(text: string, item: RSSItem): string[] {
    const tags = [...(item.tags || [])]
    
    // Add AI-specific tags
    this.aiTerms.forEach(term => {
      if (text.includes(term)) {
        tags.push(term.replace(/\s+/g, '-'))
      }
    })
    
    // Add company tags
    const companies = ['openai', 'google', 'microsoft', 'anthropic', 'meta', 'nvidia', 'apple']
    companies.forEach(company => {
      if (text.includes(company)) {
        tags.push(company)
      }
    })
    
    // Add technology tags
    const technologies = ['gpt', 'llm', 'transformer', 'neural-network', 'machine-learning']
    technologies.forEach(tech => {
      if (text.includes(tech.replace('-', ' '))) {
        tags.push(tech)
      }
    })
    
    return [...new Set(tags)].slice(0, 15) // Remove duplicates and limit
  }

  private calculateConfidence(
    relevanceScore: number,
    category: ContentClassification['category'],
    item: RSSItem
  ): number {
    let confidence = 0.5 // Base confidence
    
    // Higher relevance = higher confidence
    confidence += (relevanceScore / 100) * 0.3
    
    // High priority sources = higher confidence
    if (item.priority === 'high') confidence += 0.15
    else if (item.priority === 'medium') confidence += 0.1
    
    // Recent content = higher confidence
    const hoursOld = (Date.now() - item.pubDate.getTime()) / (1000 * 60 * 60)
    if (hoursOld < 24) confidence += 0.05
    
    return Math.min(1, Math.max(0, confidence))
  }

  private countKeywordMatches(text: string, keywords: string[]): number {
    return keywords.reduce((count, keyword) => {
      return count + (text.includes(keyword.toLowerCase()) ? 1 : 0)
    }, 0)
  }

  async filterRelevant(items: RSSItem[], minRelevanceScore = 40): Promise<ClassifiedContent[]> {
    const classified = await Promise.all(
      items.map(item => this.classifyContent(item))
    )
    
    return classified
      .filter(item => item.classification.relevanceScore >= minRelevanceScore)
      .sort((a, b) => b.classification.priority - a.classification.priority)
  }

  async getTopContent(items: RSSItem[], limit = 12): Promise<ClassifiedContent[]> {
    const relevant = await this.filterRelevant(items, 30)
    return relevant.slice(0, limit)
  }

  async getBreakingNews(items: RSSItem[], limit = 5): Promise<ClassifiedContent[]> {
    const classified = await Promise.all(
      items.map(item => this.classifyContent(item))
    )
    
    return classified
      .filter(item => item.classification.isBreaking)
      .sort((a, b) => b.classification.priority - a.classification.priority)
      .slice(0, limit)
  }

  async getTrendingContent(items: RSSItem[], limit = 8): Promise<ClassifiedContent[]> {
    const classified = await Promise.all(
      items.map(item => this.classifyContent(item))
    )
    
    return classified
      .filter(item => item.classification.isTrending)
      .sort((a, b) => b.classification.priority - a.classification.priority)
      .slice(0, limit)
  }
}
