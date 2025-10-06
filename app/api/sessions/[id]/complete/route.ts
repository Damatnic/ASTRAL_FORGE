import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HabitFormationAgent } from '@/lib/agents/habit-formation'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id

    // Get the session
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        sets: true,
        user: true,
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.completed) {
      return NextResponse.json(
        { message: 'Session already completed' },
        { status: 200 }
      )
    }

    // Calculate duration (time since session creation)
    const now = new Date()
    const durationMinutes = Math.floor(
      (now.getTime() - session.date.getTime()) / 1000 / 60
    )

    // Mark session as complete
    const updatedSession = await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        duration: durationMinutes,
      },
    })

    // Update streak
    const habitAgent = new HabitFormationAgent(prisma)
    const streakData = await habitAgent.updateStreak(session.userId, now)

    // Check for volume milestones
    await habitAgent.checkVolumeMilestones(session.userId)

    return NextResponse.json({
      success: true,
      session: updatedSession,
      streak: streakData,
      message: 'Workout completed successfully!',
    })
  } catch (error) {
    console.error('Error completing session:', error)
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    )
  }
}


