import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/services/aiService'
import { AIFeature } from '@/lib/types/ai'

/**
 * POST /api/ai/enhance
 * Görsel iyileştirme
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, options } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const result = await aiService.process({
      feature: AIFeature.IMAGE_ENHANCEMENT,
      input: imageUrl,
      options,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Image enhancement error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
