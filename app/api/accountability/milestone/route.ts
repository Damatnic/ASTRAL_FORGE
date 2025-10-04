import { NextRequest, NextResponse } from 'next/server'
import { HabitFormationAgent } from '@/lib/agents/habit-formation'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'

    const habitAgent = new HabitFormationAgent(prisma)
    const milestone = await habitAgent.getNextMilestone(userId)

    return NextResponse.json(milestone)
  } catch (error) {
    console.error('Error fetching milestone:', error)
    return NextResponse.json(
      { error: 'Failed to fetch milestone' },
      { status: 500 }
    )
  }
}

