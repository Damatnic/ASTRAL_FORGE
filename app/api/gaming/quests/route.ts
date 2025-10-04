import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get today's workouts
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayWorkouts = await prisma.workoutSession.count({
      where: {
        userId: user.id,
        completed: true,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Get this week's data
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    const weekWorkouts = await prisma.workoutSession.count({
      where: {
        userId: user.id,
        completed: true,
        date: { gte: weekStart },
      },
    })

    const weekSets = await prisma.setEntry.count({
      where: {
        session: {
          userId: user.id,
          completed: true,
          date: { gte: weekStart },
        },
      },
    })

    const weekVolume = await prisma.setEntry.findMany({
      where: {
        session: {
          userId: user.id,
          completed: true,
          date: { gte: weekStart },
        },
      },
      select: { weight: true, reps: true },
    })

    const totalWeekVolume = weekVolume.reduce(
      (sum, set) => sum + (set.weight * set.reps),
      0
    )

    // Daily Quests
    const dailyQuests = [
      {
        id: 'daily-workout',
        type: 'daily' as const,
        title: 'Complete a Workout',
        description: 'Finish any workout session today',
        progress: todayWorkouts,
        goal: 1,
        xpReward: 50,
        completed: todayWorkouts >= 1,
        icon: '💪',
      },
      {
        id: 'daily-sets',
        type: 'daily' as const,
        title: 'Grind 15 Sets',
        description: 'Complete 15 sets in a single workout',
        progress: Math.min(todayWorkouts > 0 ? 12 : 0, 15), // Mock progress
        goal: 15,
        xpReward: 30,
        completed: false,
        icon: '🔥',
      },
      {
        id: 'daily-pr',
        type: 'daily' as const,
        title: 'Hit a New PR',
        description: 'Set a new personal record',
        progress: 0,
        goal: 1,
        xpReward: 100,
        completed: false,
        icon: '🏆',
      },
    ]

    // Weekly Quests
    const weeklyQuests = [
      {
        id: 'weekly-workouts',
        type: 'weekly' as const,
        title: 'Train 4 Times',
        description: 'Complete 4 workouts this week',
        progress: weekWorkouts,
        goal: 4,
        xpReward: 200,
        completed: weekWorkouts >= 4,
        icon: '📅',
      },
      {
        id: 'weekly-volume',
        type: 'weekly' as const,
        title: 'Move 10,000kg',
        description: 'Lift 10,000kg total volume this week',
        progress: Math.floor(totalWeekVolume / 1000),
        goal: 10,
        xpReward: 250,
        completed: totalWeekVolume >= 10000,
        icon: '⚡',
      },
      {
        id: 'weekly-sets',
        type: 'weekly' as const,
        title: 'Forge 100 Sets',
        description: 'Complete 100 sets this week',
        progress: weekSets,
        goal: 100,
        xpReward: 300,
        completed: weekSets >= 100,
        icon: '🔨',
      },
    ]

    return NextResponse.json({
      dailyQuests,
      weeklyQuests,
    })
  } catch (error) {
    console.error('Error fetching quests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    )
  }
}

