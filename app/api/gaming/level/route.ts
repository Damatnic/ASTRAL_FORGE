import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HabitFormationSystem } from '@/lib/agents/habits'

export async function GET() {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user stats
    const [workoutCount, setEntries, prs] = await Promise.all([
      prisma.workoutSession.count({
        where: { userId: user.id, completed: true },
      }),
      prisma.setEntry.findMany({
        where: { session: { userId: user.id } },
        select: { weight: true, reps: true },
      }),
      prisma.achievement.count({
        where: { userId: user.id, type: 'pr' },
      }),
    ])

    // Calculate total volume
    const totalVolume = setEntries.reduce(
      (sum, set) => sum + (set.weight * set.reps),
      0
    )

    // Calculate level using HabitFormationSystem
    const habitSystem = new HabitFormationSystem()
    const levelData = habitSystem.calculateLevel(
      workoutCount,
      totalVolume,
      prs
    )

    // Calculate total XP
    const totalXP = (workoutCount * 10) + Math.floor(totalVolume / 1000) + (prs * 50)

    // Calculate current XP in level (for progress bar)
    const levelThresholds = [
      0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000,
      6250, 7750, 9500, 11500, 14000, 17000, 20500, 25000
    ]

    let currentLevelXP = 0
    let nextLevelXP = levelThresholds[1]

    for (let i = 0; i < levelThresholds.length - 1; i++) {
      if (totalXP >= levelThresholds[i]) {
        currentLevelXP = levelThresholds[i]
        nextLevelXP = levelThresholds[i + 1] || levelThresholds[i] + 5000
      } else {
        break
      }
    }

    const xpInCurrentLevel = totalXP - currentLevelXP

    return NextResponse.json({
      level: levelData.level,
      title: levelData.title,
      currentXP: xpInCurrentLevel,
      nextLevelXP: nextLevelXP - currentLevelXP,
      totalXP,
      progress: levelData.progress,
    })
  } catch (error) {
    console.error('Error fetching level:', error)
    return NextResponse.json(
      { error: 'Failed to fetch level data' },
      { status: 500 }
    )
  }
}

