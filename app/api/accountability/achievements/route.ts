import { NextRequest, NextResponse } from 'next/server'
import { HabitFormationAgent } from '@/lib/agents/habit-formation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'
    const recent = searchParams.get('recent') === 'true'

    const habitAgent = new HabitFormationAgent(prisma)

    const achievements = recent
      ? await habitAgent.getRecentAchievements(userId)
      : await habitAgent.getAchievements(userId)

    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}


