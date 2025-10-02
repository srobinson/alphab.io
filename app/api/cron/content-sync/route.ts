import { NextRequest, NextResponse } from 'next/server'
import { ContentSyncService } from '@/lib/content/sync-service'
import { monitor } from '@/lib/monitoring'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for cron jobs

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    monitor.info('Content sync initiated', {
      user_agent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for')
    })

    // Verify request is from Vercel Cron or has correct secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (!cronSecret) {
      monitor.error('CRON_SECRET not configured')
      return NextResponse.json({ error: 'Cron not configured' }, { status: 500 })
    }
    
    // Check for Vercel Cron header or Bearer token
    const isVercelCron = request.headers.get('user-agent')?.includes('vercel-cron')
    const hasValidSecret = authHeader === `Bearer ${cronSecret}`
    
    if (!isVercelCron && !hasValidSecret) {
      monitor.warn('Unauthorized cron request attempt', {
        ip: request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent')
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    monitor.info('Starting automated content sync')
    
    // Initialize sync service
    const syncService = new ContentSyncService()
    
    // Test connection first
    const connectionValid = await syncService.testConnection()
    if (!connectionValid) {
      monitor.critical('Database connection failed during content sync')
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
    
    monitor.info('Sync options configured', syncOptions)
    
    // Perform content sync with monitoring
    const results = await monitor.timeAsync(
      'content-sync-all-sources',
      () => syncService.syncAllSources(syncOptions),
      { options: syncOptions }
    )
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
    
    // Log results with monitoring
    monitor.info('Content sync completed successfully', stats)
    
    // Track individual source results
    results.forEach(result => {
      monitor.trackContentSync({
        sourceName: result.sourceName,
        itemsFetched: result.itemsFetched,
        itemsProcessed: result.itemsIngested,
        duration: result.duration,
        success: result.success,
        error: result.error
      })
    })
    
    // Alert if too many sources failed
    const failureRate = (results.length - stats.successfulSources) / results.length
    if (failureRate > 0.5) {
      monitor.critical('More than 50% of content sources failed', undefined, {
        total_sources: results.length,
        successful: stats.successfulSources,
        failure_rate: failureRate
      })
    }
    
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
    const duration = Date.now() - startTime
    monitor.critical('Content sync failed catastrophically', error, {
      duration_ms: duration
    })
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      duration
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