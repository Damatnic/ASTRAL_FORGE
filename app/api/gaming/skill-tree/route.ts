import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SkillTreeSystem } from '@/lib/skill-tree-system'
import { ProgressionSystem } from '@/lib/progression-system'
import { RPGStatsSystem } from '@/lib/rpg-stats-system'

/**
 * GET /api/gaming/skill-tree
 * Get skill trees with user progress
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

    // Calculate user level
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

    const workoutXP = completedWorkouts * 50
    const volumeXP = setEntries * 5
    const prXP = prs * 100
    const streakXP = (streakData?.current || 0) * 10
    const achievementXP = achievements * 50
    const totalXP = workoutXP + volumeXP + prXP + streakXP + achievementXP

    const levelData = ProgressionSystem.getLevelFromXP(totalXP)

    // Calculate user stats
    const stats = await RPGStatsSystem.calculateStats(prisma, user.id, 0)

    // Get skill trees with progress
    const trees = await SkillTreeSystem.calculateUserProgress(
      prisma,
      user.id,
      levelData.level,
      stats
    )

    // Calculate totals
    const summary = {
      strength: {
        unlocked: trees.strength.filter((n) => n.isUnlocked).length,
        available: trees.strength.filter((n) => n.isAvailable).length,
        total: trees.strength.length,
      },
      endurance: {
        unlocked: trees.endurance.filter((n) => n.isUnlocked).length,
        available: trees.endurance.filter((n) => n.isAvailable).length,
        total: trees.endurance.length,
      },
      agility: {
        unlocked: trees.agility.filter((n) => n.isUnlocked).length,
        available: trees.agility.filter((n) => n.isAvailable).length,
        total: trees.agility.length,
      },
      flexibility: {
        unlocked: trees.flexibility.filter((n) => n.isUnlocked).length,
        available: trees.flexibility.filter((n) => n.isAvailable).length,
        total: trees.flexibility.length,
      },
      power: {
        unlocked: trees.power.filter((n) => n.isUnlocked).length,
        available: trees.power.filter((n) => n.isAvailable).length,
        total: trees.power.length,
      },
    }

    return NextResponse.json({
      trees,
      summary,
      userLevel: levelData.level,
      userStats: {
        strength: stats.strength,
        endurance: stats.endurance,
        agility: stats.agility,
        flexibility: stats.flexibility,
        power: stats.power,
      },
    })
  } catch (error) {
    console.error('Error fetching skill tree:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill tree' },
      { status: 500 }
    )
  }
}

