// Simple thumbnail utilities for immediate use
export class SimpleThumbnailService {
  
  /**
   * Generate a deterministic Picsum image based on article title
   */
  static getPicsumImage(title: string, width = 400, height = 200): string {
    // Create deterministic seed from title
    const seed = this.hashString(title)
    return `https://picsum.photos/seed/${seed}/${width}/${height}`
  }

  /**
   * Generate Unsplash image based on keywords
   */
  static getUnsplashImage(title: string, tags: string[] = [], width = 400, height = 200): string {
    // Extract keywords for Unsplash search
    const keywords = this.extractKeywords(title, tags)
    const searchTerm = keywords.length > 0 ? keywords[0] : 'technology'
    
    return `https://source.unsplash.com/${width}x${height}/?${searchTerm}`
  }

  /**
   * Generate Lorem Picsum with category-based filters
   */
  static getCategoryImage(category: string, title: string): string {
    const seed = this.hashString(title)
    const categoryMap = {
      'breaking': `https://picsum.photos/seed/${seed}/400/200?grayscale&blur=1`,
      'trending': `https://picsum.photos/seed/${seed}/400/200`,
      'update': `https://picsum.photos/seed/${seed}/400/200?grayscale`,
      'insight': `https://picsum.photos/seed/${seed}/400/200?blur=1`,
    }
    
    return categoryMap[category as keyof typeof categoryMap] || `https://picsum.photos/seed/${seed}/400/200`
  }

  /**
   * Generate gradient placeholder with category colors
   */
  static getGradientPlaceholder(category: string, source: string, title: string): string {
    const hash = this.hashString(title)
    const colors = this.getCategoryColors(category)
    
    // Create SVG with gradient and text
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#grad)" />
        <text x="20" y="30" fill="white" font-family="Arial" font-size="12" font-weight="bold">${category.toUpperCase()}</text>
        <text x="20" y="180" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="11">${source}</text>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  /**
   * Main method - returns the best available thumbnail
   */
  static getBestThumbnail(options: {
    title: string
    source: string
    category: string
    tags?: string[]
    url?: string
  }): string {
    // Try different approaches in order of preference
    
    // 1. Use Unsplash for high-quality images
    if (this.shouldUseUnsplash(options.tags)) {
      return this.getUnsplashImage(options.title, options.tags)
    }
    
    // 2. Use deterministic Picsum for variety
    return this.getPicsumImage(options.title)
  }

  /**
   * Check if we should use Unsplash (has relevant keywords)
   */
  private static shouldUseUnsplash(tags: string[] = []): boolean {
    const techKeywords = ['ai', 'artificial-intelligence', 'technology', 'computer', 'data', 'digital', 'robot', 'machine-learning']
    return tags.some(tag => techKeywords.includes(tag.toLowerCase()))
  }

  /**
   * Extract relevant keywords for image search
   */
  private static extractKeywords(title: string, tags: string[] = []): string[] {
    const techTerms = ['ai', 'artificial intelligence', 'technology', 'tech', 'computer', 'data', 'digital', 'robot', 'automation']
    const titleWords = title.toLowerCase().split(' ')
    
    // Find tech terms in title
    const titleKeywords = techTerms.filter(term => 
      titleWords.some(word => word.includes(term.replace(' ', '')))
    )
    
    // Combine with tags
    const allKeywords = [...titleKeywords, ...tags]
    
    // Map to Unsplash-friendly terms
    const mappedKeywords = allKeywords.map(keyword => {
      const mapping: Record<string, string> = {
        'ai': 'artificial-intelligence',
        'tech': 'technology',
        'ml': 'machine-learning',
        'robot': 'robotics'
      }
      return mapping[keyword.toLowerCase()] || keyword
    })
    
    return [...new Set(mappedKeywords)].slice(0, 3)
  }

  /**
   * Get category-specific color schemes
   */
  private static getCategoryColors(category: string): { primary: string; secondary: string } {
    const colorSchemes = {
      'breaking': { primary: '#EF4444', secondary: '#DC2626' }, // Red
      'trending': { primary: '#F59E0B', secondary: '#D97706' }, // Orange
      'update': { primary: '#3B82F6', secondary: '#2563EB' },   // Blue
      'insight': { primary: '#8B5CF6', secondary: '#7C3AED' },  // Purple
    }
    
    return colorSchemes[category as keyof typeof colorSchemes] || colorSchemes.update
  }

  /**
   * Simple string hash function
   */
  private static hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Get multiple thumbnail options for testing
   */
  static getThumbnailOptions(options: {
    title: string
    source: string
    category: string
    tags?: string[]
  }) {
    return {
      picsum: this.getPicsumImage(options.title),
      unsplash: this.getUnsplashImage(options.title, options.tags),
      category: this.getCategoryImage(options.category, options.title),
      gradient: this.getGradientPlaceholder(options.category, options.source, options.title)
    }
  }
}