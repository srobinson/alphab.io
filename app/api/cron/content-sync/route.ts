import { NextRequest, NextResponse } from 'next/server'
import { ContentSyncService } from '@/lib/content/sync-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify request is from Vercel Cron or has correct secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (!cronSecret) {
      console.error('CRON_SECRET not configured')
      return NextResponse.json({ error: 'Cron not configured' }, { status: 500 })
    }
    
    // Check for Vercel Cron header or Bearer token
    const isVercelCron = request.headers.get('user-agent')?.includes('vercel-cron')
    const hasValidSecret = authHeader === `Bearer ${cronSecret}`
    
    if (!isVercelCron && !hasValidSecret) {
      console.warn('Unauthorized cron request attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('Starting automated content sync...')
    
    // Initialize sync service
    const syncService = new ContentSyncService()
    
    // Test connection first
    const connectionValid = await syncService.testConnection()
    if (!connectionValid) {
      console.error('Database connection failed')
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    // Get sync options from query parameters
    const url = new URL(request.url)
    const enableSummarization = url.searchParams.get('summarize') !== 'false'
    const saveContent = url.searchParams.get('saveContent') === 'true'
    const minRelevanceScore = parseInt(url.searchParams.get('minScore') || '40')
    const maxItemsPerSource = parseInt(url.searchParams.get('maxItems') || '10')
    
    const syncOptions = {
      enableSummarization,
      saveContent,
      minRelevanceScore,
      maxItemsPerSource,
      updateIndustryMoves: true
    }
    
    console.log('Sync options:', syncOptions)
    
    // Perform content sync
    const startTime = Date.now()
    const results = await syncService.syncAllSources(syncOptions)
    const totalDuration = Date.now() - startTime
    
    // Calculate summary statistics
    const stats = {
      totalSources: results.length,
      successfulSources: results.filter(r => r.success).length,
      totalItemsFetched: results.reduce((sum, r) => sum + r.itemsFetched, 0),
      totalItemsIngested: results.reduce((sum, r) => sum + r.itemsIngested, 0),
      totalDuration: totalDuration,
      averageDurationPerSource: Math.round(totalDuration / results.length),
      timestamp: new Date().toISOString()
    }
    
    // Log results
    console.log('Content sync completed:', stats)
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Content sync completed successfully',
      stats,
      results: results.map(r => ({
        sourceId: r.sourceId,
        sourceName: r.sourceName,
        success: r.success,
        itemsFetched: r.itemsFetched,
        itemsIngested: r.itemsIngested,
        duration: r.duration,
        error: r.error
      }))
    })
    
  } catch (error) {
    console.error('Content sync failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Health check endpoint
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const syncService = new ContentSyncService()
    const connectionValid = await syncService.testConnection()
    const lastSyncTime = await syncService.getLastSyncTime()
    
    return NextResponse.json({
      healthy: connectionValid,
      lastSync: lastSyncTime?.toISOString() || null,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}