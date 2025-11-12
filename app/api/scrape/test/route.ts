import { NextRequest, NextResponse } from 'next/server'
import { scraperService } from '@/lib/services/scraperService'
import { ScraperSource } from '@/lib/types/scraper'

/**
 * POST /api/scrape/test
 * Belirli bir scraper'ı test eder
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source } = body

    // Validation
    if (!source) {
      return NextResponse.json(
        { error: 'Source is required' },
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

    // Test
    const isWorking = await scraperService.testScraper(source as ScraperSource)

    return NextResponse.json({
      success: true,
      source,
      isWorking,
      message: isWorking
        ? 'Scraper is working correctly'
        : 'Scraper connection failed',
    })
  } catch (error) {
    console.error('Test scraper error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/scrape/test
 * Tüm scraper'ları test eder
 */
export async function GET() {
  try {
    const sources = Object.values(ScraperSource)
    const results: Record<string, boolean> = {}

    for (const source of sources) {
      results[source] = await scraperService.testScraper(source)
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('Test all scrapers error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
