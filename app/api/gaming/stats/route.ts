import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
      include: { streaks: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get recent workouts for calculations
    const recentSessions = await prisma.workoutSession.findMany({
      where: { userId: user.id, completed: true },
      orderBy: { date: 'desc' },
      take: 30,
      include: {
        sets: {
          include: { exercise: true },
        },
      },
    })

    // Calculate Strength (based on max lifts)
    const allSets = recentSessions.flatMap((s) => s.sets)
    const maxWeight = allSets.length > 0
      ? Math.max(...allSets.map((s) => s.weight))
      : 0
    const strength = Math.min(100, Math.round((maxWeight / 200) * 100)) // Assuming 200kg max

    // Calculate Endurance (based on volume and workout duration)
    const avgDuration = recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / recentSessions.length
      : 0
    const totalVolume = allSets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
    const endurance = Math.min(100, Math.round((avgDuration / 90) * 50 + (totalVolume / 50000) * 50))

    // Calculate Discipline (based on streak)
    const currentStreak = user.streaks?.current || 0
    const discipline = Math.min(100, Math.round((currentStreak / 30) * 100))

    // Calculate Power Level (overall rating)
    const totalWorkouts = await prisma.workoutSession.count({
      where: { userId: user.id, completed: true },
    })
    const prs = await prisma.achievement.count({
      where: { userId: user.id, type: 'pr' },
    })
    const power = Math.min(100, Math.round(
      (totalWorkouts / 100) * 30 +
      (totalVolume / 100000) * 40 +
      (prs / 20) * 30
    ))

    return NextResponse.json({
      strength,
      endurance,
      discipline,
      power,
    })
  } catch (error) {
    console.error('Error fetching gaming stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

