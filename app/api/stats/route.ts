import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'

    // Get actual user from database
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({
        totalWorkouts: 0,
        totalVolume: '0',
        prs: 0,
      })
    }

    // Count completed workouts
    const totalWorkouts = await prisma.workoutSession.count({
      where: {
        userId: user.id,
        completed: true,
      },
    })

    // Calculate total volume (weight × reps)
    const sets = await prisma.setEntry.findMany({
      where: {
        session: {
          userId: user.id,
          completed: true,
        },
      },
      select: {
        weight: true,
        reps: true,
      },
    })

    const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
    const volumeInK = (totalVolume / 1000).toFixed(1)

    // Count PRs (achievements of type 'pr')
    const prs = await prisma.achievement.count({
      where: {
        userId: user.id,
        type: 'pr',
      },
    })

    return NextResponse.json({
      totalWorkouts,
      totalVolume: volumeInK,
      prs,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

