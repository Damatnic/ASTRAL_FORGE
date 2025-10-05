import { NextRequest, NextResponse } from 'next/server'
import { HabitFormationAgent } from '@/lib/agents/habit-formation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'

    const habitAgent = new HabitFormationAgent(prisma)
    const score = await habitAgent.calculateMotivationScore(userId)

    return NextResponse.json({ score })
  } catch (error) {
    console.error('Error calculating motivation score:', error)
    return NextResponse.json(
      { error: 'Failed to calculate motivation score' },
      { status: 500 }
    )
  }
}

