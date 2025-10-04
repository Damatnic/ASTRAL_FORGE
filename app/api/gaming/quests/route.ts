import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuestSystem } from '@/lib/quest-system'
import { ProgressionSystem } from '@/lib/progression-system'
import { RPGStatsSystem } from '@/lib/rpg-stats-system'

/**
 * GET /api/gaming/quests
 * Get all available quests for the user
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

    // Get all quests
    const allQuests = await QuestSystem.getAllQuests(prisma, user.id, levelData.level, stats)

    // Separate by type
    const daily = allQuests.filter((q) => q.type === 'daily')
    const weekly = allQuests.filter((q) => q.type === 'weekly')
    const raids = allQuests.filter((q) => q.type === 'raid')
    const bosses = allQuests.filter((q) => q.type === 'boss')

    // Calculate overall progress
    const totalQuests = allQuests.length
    const completedQuests = allQuests.filter((q) => q.status === 'completed').length
    const activeQuests = allQuests.filter((q) => q.status === 'active').length

    return NextResponse.json({
      dailyQuests: daily || [],
      weeklyQuests: weekly || [],
      raids: raids || [],
      bosses: bosses || [],
      summary: {
        total: totalQuests,
        completed: completedQuests,
        active: activeQuests,
        available: totalQuests - completedQuests - activeQuests,
      },
    })
  } catch (error) {
    console.error('Error fetching quests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch quests',
        dailyQuests: [],
        weeklyQuests: [],
        raids: [],
        bosses: [],
      },
      { status: 500 }
    )
  }
}
