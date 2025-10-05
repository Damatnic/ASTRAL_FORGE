import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { handleApiError } from '@/lib/error-handler'

export const dynamic = 'force-dynamic'

// GET /api/progress/duration-trends - Workout duration trends
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
        completed: true,
        date: {
          gte: startDate,
        },
      },
      include: {
        sets: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    const result = sessions.map(session => {
      const volume = session.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
      return {
        date: session.date.toISOString().split('T')[0],
        duration: session.duration || 0,
        sets: session.sets.length,
        volume,
        exercises: new Set(session.sets.map(s => s.exerciseId)).size,
      }
    })

    // Calculate moving average
    const windowSize = 3
    const withMovingAvg = result.map((item, index) => {
      const start = Math.max(0, index - windowSize + 1)
      const window = result.slice(start, index + 1)
      const avgDuration = window.reduce((sum, w) => sum + w.duration, 0) / window.length

      return {
        ...item,
        movingAvg: Math.round(avgDuration),
      }
    })

    return NextResponse.json(withMovingAvg)
  } catch (error) {
    return handleApiError(error)
  }
}
