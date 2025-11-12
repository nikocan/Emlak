import { NextRequest, NextResponse } from 'next/server'
import { socialMediaService } from '@/lib/services/socialMediaService'

/**
 * POST /api/social/generate-post
 * Sosyal medya post'u oluşturma
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { property, platforms, useAI, aiOptions, customText } = body

    if (!property || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Property and platforms are required' },
        { status: 400 }
      )
    }

    const result = await socialMediaService.generatePost({
      property,
      platforms,
      useAI: useAI !== false,
      aiOptions: aiOptions || {
        tone: 'professional',
        includeEmojis: true,
        length: 'medium',
      },
      customText,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Post generation error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
