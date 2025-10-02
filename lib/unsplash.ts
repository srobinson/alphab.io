// Unsplash API integration
interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
}

interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashImage[]
}

/**
 * Search for images on Unsplash
 */
export async function searchUnsplashImages(
  query: string,
  perPage: number = 1
): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    console.warn('Unsplash API key not configured')
    return null
  }

  try {
    console.log(`🖼️  Unsplash API call: searching for "${query}"`)
    const url = new URL('https://api.unsplash.com/search/photos')
    url.searchParams.set('query', query)
    url.searchParams.set('per_page', perPage.toString())
    url.searchParams.set('orientation', 'landscape')

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status}`)
      return null
    }

    const data: UnsplashSearchResponse = await response.json()

    if (data.results && data.results.length > 0) {
      // Return the small image URL (400x300)
      // Add UTM parameters for Unsplash attribution
      const imageUrl = data.results[0].urls.small
      const urlWithAttribution = `${imageUrl}&w=400&h=200&fit=crop`
      console.log(`✅ Unsplash API success: found image for "${query}"`)
      return urlWithAttribution
    }

    console.log(`❌ Unsplash API: no results for "${query}"`)
    return null
  } catch (error) {
    console.error('Failed to fetch Unsplash image:', error)
    return null
  }
}

/**
 * Get a random photo from Unsplash
 */
export async function getRandomUnsplashImage(
  query?: string
): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    return null
  }

  try {
    const url = new URL('https://api.unsplash.com/photos/random')
    if (query) {
      url.searchParams.set('query', query)
    }
    url.searchParams.set('orientation', 'landscape')

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data: UnsplashImage = await response.json()
    const imageUrl = data.urls.small
    return `${imageUrl}&w=400&h=200&fit=crop`
  } catch (error) {
    console.error('Failed to fetch random Unsplash image:', error)
    return null
  }
}
