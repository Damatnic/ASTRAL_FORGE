import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProgressionSystem, XP_VALUES } from '@/lib/progression-system'

/**
 * GET /api/gaming/level
 * Calculate user level and XP using full 100-level progression system
 */
export async function GET() {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get XP sources
    const [completedWorkouts, setEntries, prs, achievements, streakData] = await Promise.all([
      prisma.workoutSession.count({
        where: { userId: user.id, completed: true },
      }),
      prisma.setEntry.count({
        where: { session: { userId: user.id } },
      }),
      prisma.achievement.count({
        where: { userId: user.id, type: 'pr' },
      }),
      prisma.achievement.count({
        where: { userId: user.id },
      }),
      prisma.streak.findUnique({
        where: { userId: user.id },
        select: { current: true },
      }),
    ])

    // Calculate XP from various sources
    const workoutXP = completedWorkouts * XP_VALUES.WORKOUT_COMPLETE
    const volumeXP = setEntries * XP_VALUES.SET_COMPLETE
    const prXP = prs * XP_VALUES.WORKOUT_PR
    const streakXP = (streakData?.current || 0) * XP_VALUES.DAILY_STREAK_BONUS
    const achievementXP = achievements * XP_VALUES.ACHIEVEMENT_COMMON

    const totalXP = workoutXP + volumeXP + prXP + streakXP + achievementXP

    // Calculate level using progression system
    const levelData = ProgressionSystem.getLevelFromXP(totalXP)
    const progress = (levelData.currentXP / levelData.xpForNextLevel) * 100

    // Get next milestone
    const nextMilestone = ProgressionSystem.getNextMilestone(levelData.level)

    // Check if can prestige
    const canPrestige = ProgressionSystem.canPrestige(levelData.level)
    const prestigeRewards = canPrestige ? ProgressionSystem.getPrestigeRewards(0) : []

    return NextResponse.json({
      level: levelData.level,
      currentXP: levelData.currentXP,
      xpForNextLevel: levelData.xpForNextLevel,
      totalXP: levelData.totalXP,
      progress,
      title: levelData.title,
      tier: levelData.tier,
      prestige: levelData.prestige,
      paragonLevel: levelData.paragonLevel,
      breakdown: {
        workouts: workoutXP,
        volume: volumeXP,
        prs: prXP,
        streak: streakXP,
        achievements: achievementXP,
      },
      nextMilestone,
      canPrestige,
      prestigeRewards,
    })
  } catch (error) {
    console.error('Error fetching level:', error)
    return NextResponse.json(
      { error: 'Failed to fetch level data' },
      { status: 500 }
    )
  }
}
