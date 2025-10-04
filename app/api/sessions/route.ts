import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get actual user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json([])
    }

    // Get recent completed sessions with their sets
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
        completed: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      include: {
        sets: {
          include: {
            exercise: true,
          },
        },
      },
    })

    // Format the response
    const formatted = sessions.map(session => {
      // Count unique exercises
      const exerciseIds = new Set(session.sets.map(s => s.exerciseId))
      
      return {
        id: session.id,
        name: session.name || 'Workout',
        date: session.date.toISOString(),
        duration: session.duration || 0,
        exercises: exerciseIds.size,
        sets: session.sets.length,
      }
    })

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

