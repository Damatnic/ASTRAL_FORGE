import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get('exerciseId')

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId required' }, { status: 400 })
    }

    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json([])
    }

    // Get progression for specific exercise
    const sets = await prisma.setEntry.findMany({
      where: {
        exerciseId,
        session: {
          userId: user.id,
          completed: true,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
      take: 100, // Last 100 sets
    })

    // Group by date and find max weight for each day
    const maxByDate = new Map<string, { weight: number; reps: number }>()
    
    sets.forEach(set => {
      const date = set.timestamp.toISOString().split('T')[0]
      const existing = maxByDate.get(date)
      if (!existing || set.weight > existing.weight) {
        maxByDate.set(date, { weight: set.weight, reps: set.reps })
      }
    })

    // Convert to array format
    const data = Array.from(maxByDate.entries()).map(([date, { weight, reps }]) => ({
      date,
      weight,
      reps,
      estimated1RM: Math.round(weight * (1 + reps / 30)), // Brzycki formula
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching strength data:', error)
    return NextResponse.json([])
  }
}

