import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json([])
    }

    // Get last 30 days of workout data
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
        completed: true,
        startedAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        sets: true,
      },
      orderBy: {
        startedAt: 'asc',
      },
    })

    // Calculate daily volume
    const volumeByDate = new Map<string, number>()
    
    sessions.forEach(session => {
      const date = session.startedAt.toISOString().split('T')[0]
      const volume = session.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
      volumeByDate.set(date, (volumeByDate.get(date) || 0) + volume)
    })

    // Convert to array format
    const data = Array.from(volumeByDate.entries()).map(([date, volume]) => ({
      date,
      volume: Math.round(volume),
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching volume data:', error)
    return NextResponse.json([])
  }
}

