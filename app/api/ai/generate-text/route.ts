import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/services/aiService'
import { AIFeature } from '@/lib/types/ai'

/**
 * POST /api/ai/generate-text
 * AI ile ilan metni oluşturma
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { property, tone, length, includeEmojis } = body

    if (!property) {
      return NextResponse.json(
        { error: 'Property data is required' },
        { status: 400 }
      )
    }

    const result = await aiService.process({
      feature: AIFeature.DESCRIPTION_GENERATION,
      input: '',
      options: {
        property,
        tone: tone || 'professional',
        length: length || 'medium',
        includeEmojis: includeEmojis !== false,
        language: 'tr',
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Text generation error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
