// RSS parsing and content fetching service
import Parser from 'rss-parser'
import { decodeHtmlEntities } from '../utils/html-entities'
import type { ContentSource } from './sources'

type RawFeedItem = {
  guid?: string
  title?: string
  link?: string
  pubDate?: string
  isoDate?: string
  contentSnippet?: string
  description?: string
  summary?: string
  content?: string
  author?: string
  categories?: string[]
  enclosure?: { url?: string }
  tags?: string[]
  ['content:encoded']?: string
  ['dc:creator']?: string
  ['media:thumbnail']?: { $?: { url?: string } }
  ['itunes:image']?: { $?: { href?: string } }
  [key: string]: unknown
}

type RawFeed = {
  items?: RawFeedItem[]
  [key: string]: unknown
}

export interface RSSItem {
  guid: string
  title: string
  link: string
  pubDate: Date
  description: string
  source: string
  sourceId: string
  category: string
  priority: string
  content?: string | undefined
  author?: string | undefined
  tags?: string[]
  imageUrl?: string | undefined // Add image URL field
}

export interface FetchResult {
  source: ContentSource
  items: RSSItem[]
  success: boolean
  error?: string
  duration: number
}

export class RSSParser {
	private parser: Parser<RawFeed, RawFeedItem>

	constructor() {
		this.parser = new Parser<RawFeed, RawFeedItem>({
      timeout: 15000,
      headers: {
        'User-Agent': 'alphab.io-content-fetcher/1.0 (https://alphab.io)'
      },
      customFields: {
        item: ['author', 'dc:creator', 'content:encoded', 'content', 'media:thumbnail', 'enclosure']
      }
    })
  }

  async fetchFromSource(
    source: ContentSource,
    attemptNumber: number = 1,
    maxRetries: number = 3
  ): Promise<FetchResult> {
    const startTime = Date.now()

    try {
      if (!source.rssUrl) {
        throw new Error('No RSS URL provided')
      }

      console.log(`[${source.name}] Attempt ${attemptNumber}/${maxRetries}`)

      const feed = await this.parser.parseURL(source.rssUrl)
      const items = this.processFeedItems(feed, source)

      console.log(`[${source.name}] ✓ Success: ${items.length} items fetched`)

      return {
        source,
        items,
        success: true,
        duration: Date.now() - startTime
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.warn(`[${source.name}] ✗ Attempt ${attemptNumber}/${maxRetries} failed:`, errorMessage)

      // Retry logic with exponential backoff
      if (attemptNumber < maxRetries) {
        const delay = 1000 * Math.pow(2, attemptNumber - 1) // 1s, 2s, 4s
        console.log(`[${source.name}] Retrying in ${delay}ms...`)

        await new Promise(resolve => setTimeout(resolve, delay))
        return this.fetchFromSource(source, attemptNumber + 1, maxRetries)
      }

      // All retries exhausted
      console.error(`[${source.name}] ✗ All ${maxRetries} attempts failed`)

      return {
        source,
        items: [],
        success: false,
        error: `Failed after ${maxRetries} attempts: ${errorMessage}`,
        duration: Date.now() - startTime
      }
    }
  }

	private processFeedItems(feed: RawFeed, source: ContentSource): RSSItem[] {
		if (!feed.items) return []

		return feed.items
			.slice(0, source.maxItems || 10)
			.map((item) => this.createRSSItem(item, source))
			.filter((item: RSSItem) => this.isValidItem(item))
	}

	private createRSSItem(item: RawFeedItem, source: ContentSource): RSSItem {
    // Clean and normalize the description
	const description = this.cleanDescription(
		item.contentSnippet ||
		item.description ||
		item.summary ||
		''
	)

    // Extract tags from categories or keywords
    const tags = this.extractTags(item, source)

    // Extract image URL from RSS item
    const imageUrl = this.extractImageUrl(item)

    // Generate a GUID if none exists
	const guid = item.guid || item.link || `${source.id}-${Date.now()}-${Math.random()}`

    return {
      guid,
      title: this.cleanTitle(item.title || 'Untitled'),
      link: this.normalizeUrl(item.link || ''),
      pubDate: this.parseDate(item.pubDate || item.isoDate) || new Date(),
      description,
      source: source.name,
      sourceId: source.id,
      category: source.category,
      priority: source.priority,
		content: (item['content:encoded'] as string | undefined) || (item.content as string | undefined),
		author: (item.author as string | undefined) || (item['dc:creator'] as string | undefined) || undefined,
      tags,
      imageUrl // Add extracted image URL
    }
  }

	private extractImageUrl(item: RawFeedItem): string | undefined {
		// Try multiple fields for image extraction

		// 1. Media thumbnail (common in RSS feeds)
		const mediaThumbnail = item['media:thumbnail']
		if (mediaThumbnail && typeof mediaThumbnail === 'object' && ' $' in mediaThumbnail) {
			const attributes = (mediaThumbnail as { $?: { url?: string } }).$
			if (attributes?.url) {
				return attributes.url
			}
		}

		// 2. Enclosure (podcast/media feeds)
		if (item.enclosure?.url && this.isImageUrl(item.enclosure.url)) {
			return item.enclosure.url
		}

		// 3. Content encoded - extract first image
		if (typeof item['content:encoded'] === 'string') {
			const imageMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/i)
			if (imageMatch && imageMatch[1]) {
				return imageMatch[1]
			}
		}

		// 4. Description - extract first image
		if (typeof item.description === 'string') {
			const imageMatch = item.description.match(/<img[^>]+src="([^">]+)"/i)
			if (imageMatch && imageMatch[1]) {
				return imageMatch[1]
			}
		}

		// 5. iTunes image (for podcast feeds)
		const itunesImage = item['itunes:image']
		if (itunesImage && typeof itunesImage === 'object' && ' $' in itunesImage) {
			const attributes = (itunesImage as { $?: { href?: string } }).$
			if (attributes?.href) {
				return attributes.href
			}
		}

		return undefined
	}

  private isImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const urlLower = url.toLowerCase()
    return imageExtensions.some(ext => urlLower.includes(ext))
  }

  private cleanTitle(title: string): string {
    return decodeHtmlEntities(
      title
        .replace(/\s+/g, ' ')
        .replace(/[\r\n\t]/g, ' ')
        .trim()
        .substring(0, 200)
    )
  }

  private cleanDescription(description: string): string {
    return decodeHtmlEntities(
      description
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .replace(/\s+/g, ' ')
        .replace(/[\r\n\t]/g, ' ')
        .trim()
        .substring(0, 500)
    )
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      // Remove common tracking parameters
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'fbclid', 'gclid', 'mc_cid', 'mc_eid', '_ga', '_gl'
      ]

      trackingParams.forEach(param => {
        urlObj.searchParams.delete(param)
      })

      return urlObj.toString()
    } catch {
      return url
    }
  }

  private parseDate(dateString: string | undefined): Date | null {
    if (!dateString) return null

    try {
      return new Date(dateString)
    } catch {
      return null
    }
  }

	private extractTags(item: RawFeedItem, source: ContentSource): string[] {
    const tags: string[] = []

    // Add source-based tags
    tags.push(source.category)

    // Extract from categories
    if (item.categories && Array.isArray(item.categories)) {
      item.categories.forEach((category: string) => {
        if (category && category.length > 0 && category.length < 30) {
          tags.push(category.toLowerCase())
        }
      })
    }

    // Add priority-based tags
    if (source.priority === 'high') {
      tags.push('featured')
    }

    return [...new Set(tags)].slice(0, 10) // Remove duplicates and limit
  }

  private isValidItem(item: RSSItem): boolean {
    // Basic validation
    if (!item.title || item.title.length < 10) return false
    if (!item.link || !this.isValidUrl(item.link)) return false
    if (!item.description || item.description.length < 20) return false

    // Filter out common spam/irrelevant patterns
    const spamPatterns = [
      /^\[AD\]/i,
      /^SPONSORED/i,
      /job\s*(opening|vacancy|position)/i,
      /hiring\s*now/i
    ]

    return !spamPatterns.some(pattern => pattern.test(item.title))
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  async fetchMultipleSources(sources: ContentSource[]): Promise<FetchResult[]> {
    const promises = sources.map(source => this.fetchFromSource(source))
    return Promise.allSettled(promises).then(results =>
      results.map((result, index) =>
        result.status === 'fulfilled'
          ? result.value
          : {
              source: sources[index]!,
              items: [],
              success: false,
              error: 'Promise rejected',
              duration: 0
            }
      )
    )
  }
}
