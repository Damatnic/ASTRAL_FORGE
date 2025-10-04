import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HabitFormationAgent } from '@/lib/agents/habit-formation'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, exerciseId, setNumber, weight, reps, rpe, rir, velocity } = data

    // Create set entry
    const set = await prisma.setEntry.create({
      data: {
        sessionId,
        exerciseId,
        setNumber,
        weight,
        reps,
        rpe,
        rir,
        velocity,
        completed: true,
      },
    })

    // Check for personal records
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    })

    if (session) {
      const habitAgent = new HabitFormationAgent(prisma)
      
      // Check for PRs
      const prAchievement = await habitAgent.checkForPRs(
        session.userId,
        exerciseId,
        weight,
        reps
      )

      // Check for volume milestones
      await habitAgent.checkVolumeMilestones(session.userId)

      return NextResponse.json({
        success: true,
        set,
        achievement: prAchievement,
      })
    }

    return NextResponse.json({ success: true, set })
  } catch (error) {
    console.error('Error creating set:', error)
    return NextResponse.json(
      { error: 'Failed to create set' },
      { status: 500 }
    )
  }
}

