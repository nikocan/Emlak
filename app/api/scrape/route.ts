import { NextRequest, NextResponse } from 'next/server'
import { scraperService } from '@/lib/services/scraperService'
import { ScraperSource, ScrapeOptions } from '@/lib/types/scraper'

/**
 * POST /api/scrape
 * Scraping işlemi başlatır
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, city, district, options } = body

    // Validation
    if (!source || !city) {
      return NextResponse.json(
        { error: 'Source and city are required' },
        { status: 400 }
      )
    }

    // Source validasyonu
    if (!Object.values(ScraperSource).includes(source)) {
      return NextResponse.json(
        { error: 'Invalid source' },
        { status: 400 }
      )
    }

    // Scraping işlemini başlat
    const result = await scraperService.scrape(
      source as ScraperSource,
      city,
      district,
      options as ScrapeOptions
    )

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/scrape/status
 * Scraper durumlarını döndürür
 */
export async function GET() {
  try {
    const statuses = scraperService.getScraperStatuses()

    return NextResponse.json({
      success: true,
      statuses,
    })
  } catch (error) {
    console.error('Get status error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
