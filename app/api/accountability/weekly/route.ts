import { NextRequest, NextResponse } from 'next/server'
import { HabitFormationAgent } from '@/lib/agents/habit-formation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'

    const habitAgent = new HabitFormationAgent(prisma)
    const weeklyCompletion = await habitAgent.getWeeklyCompletion(userId)

    return NextResponse.json(weeklyCompletion)
  } catch (error) {
    console.error('Error fetching weekly completion:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly completion' },
      { status: 500 }
    )
  }
}


