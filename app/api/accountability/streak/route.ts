import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'

    const streak = await prisma.streak.findUnique({
      where: { userId },
    })

    if (!streak) {
      return NextResponse.json({
        current: 0,
        longest: 0,
        lastWorkout: null,
      })
    }

    return NextResponse.json({
      current: streak.current,
      longest: streak.longest,
      lastWorkout: streak.lastWorkout,
    })
  } catch (error) {
    console.error('Error fetching streak:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streak' },
      { status: 500 }
    )
  }
}

