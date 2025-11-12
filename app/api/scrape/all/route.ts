import { NextRequest, NextResponse } from 'next/server'
import { scraperService } from '@/lib/services/scraperService'
import { ScrapeOptions } from '@/lib/types/scraper'

/**
 * POST /api/scrape/all
 * Tüm kaynaklardan paralel scraping yapar
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { city, district, options } = body

    // Validation
    if (!city) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      )
    }

    // Tüm kaynaklardan scraping yap
    const results = await scraperService.scrapeAll(
      city,
      district,
      options as ScrapeOptions
    )

    // Toplu istatistikler
    const summary = {
      totalSources: results.length,
      successfulSources: results.filter(r => r.status === 'success').length,
      totalProperties: results.reduce((sum, r) => sum + r.totalSaved, 0),
      totalErrors: results.reduce((sum, r) => sum + r.totalErrors, 0),
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    }

    return NextResponse.json({
      success: true,
      summary,
      results,
    })
  } catch (error) {
    console.error('Scrape all error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
