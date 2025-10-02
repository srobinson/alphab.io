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
    imageUrl?: string // Add support for RSS extracted images
  }): string {
    // Priority order for best thumbnails:
    
    // 1. Use RSS extracted image if available (BEST - actual article image)
    if (options.imageUrl && this.isValidImageUrl(options.imageUrl)) {
      return options.imageUrl
    }
    
    // 2. Generate rich SVG thumbnail with article info
    if (this.shouldGenerateSVG(options)) {
      return this.generateRichSVG(options)
    }
    
    // 3. Use deterministic Picsum for variety (not random!)
    return this.getPicsumImage(options.title)
  }

  /**
   * Check if image URL is valid and accessible
   */
  private static isValidImageUrl(url: string): boolean {
    if (!url || url.trim().length === 0) return false
    
    try {
      const parsed = new URL(url)
      // Check for valid protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) return false
      
      // Check for image extensions or known image hosts
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      const imageHosts = ['picsum.photos', 'unsplash.com', 'images.', 'img.', 'cdn.']
      
      const urlLower = url.toLowerCase()
      const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext))
      const isImageHost = imageHosts.some(host => urlLower.includes(host))
      
      return hasImageExtension || isImageHost
    } catch {
      return false
    }
  }

  /**
   * Decide if we should generate SVG (for better branding)
   */
  private static shouldGenerateSVG(options: {
    title: string
    source: string
    category: string
    tags?: string[]
  }): boolean {
    // Generate SVG for brand sources with specific styling
    const brandSources = ['RADE', 'System']
    return brandSources.includes(options.source)
  }

  /**
   * Generate rich, branded SVG thumbnail
   */
  private static generateRichSVG(options: {
    title: string
    source: string
    category: string
    tags?: string[]
  }): string {
    const colors = this.getCategoryColors(options.category)
    const seed = this.hashString(options.title)
    const angle = seed % 360
    
    // Truncate title for display
    const displayTitle = options.title.length > 60 
      ? options.title.substring(0, 60) + '...'
      : options.title
    
    // Escape special characters for SVG
    const safeTitle = this.escapeXml(displayTitle)
    const safeSource = this.escapeXml(options.source)
    const safeCategory = this.escapeXml(options.category.toUpperCase())
    
    const svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.primary};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <pattern id="pattern-${seed}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/>
        </pattern>
      </defs>
      
      <!-- Background gradient -->
      <rect width="400" height="200" fill="url(#grad-${seed})"/>
      
      <!-- Pattern overlay -->
      <rect width="400" height="200" fill="url(#pattern-${seed})"/>
      
      <!-- Category badge -->
      <rect x="20" y="20" width="auto" height="24" fill="rgba(255,255,255,0.25)" rx="12"/>
      <text x="30" y="36" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="1">${safeCategory}</text>
      
      <!-- Icon based on category -->
      <g transform="translate(340, 25)">
        ${this.getCategoryIconSVG(options.category)}
      </g>
      
      <!-- Title with better typography -->
      <text x="20" y="80" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="700" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3)">
        ${this.wrapText(safeTitle, 35).map((line, i) => 
          `<tspan x="20" dy="${i === 0 ? 0 : 22}">${line}</tspan>`
        ).join('')}
      </text>
      
      <!-- Source -->
      <text x="20" y="175" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="13" font-weight="600">${safeSource}</text>
      
      <!-- Decorative element -->
      <circle cx="380" cy="180" r="15" fill="rgba(255,255,255,0.15)"/>
      <circle cx="380" cy="180" r="10" fill="rgba(255,255,255,0.1)"/>
    </svg>`
    
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  /**
   * Get category-specific icon as SVG path
   */
  private static getCategoryIconSVG(category: string): string {
    const icons: Record<string, string> = {
      'breaking': '<path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" fill="white" opacity="0.9"/>',
      'trending': '<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="white" opacity="0.9"/>',
      'update': '<circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2" opacity="0.9"/><path d="M12 6v6l4 2" stroke="white" stroke-width="2" fill="none" opacity="0.9"/>',
      'insight': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" opacity="0.9"/>',
    }
    
    return `<svg width="30" height="30" viewBox="0 0 24 24">${icons[category] || icons['update']}</svg>`
  }

  /**
   * Wrap text to fit within width
   */
  private static wrapText(text: string, maxChars: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      if ((currentLine + word).length <= maxChars) {
        currentLine += (currentLine ? ' ' : '') + word
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
        if (lines.length >= 2) break // Max 3 lines
      }
    }
    
    if (currentLine && lines.length < 3) lines.push(currentLine)
    return lines.slice(0, 3)
  }

  /**
   * Escape XML special characters
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
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