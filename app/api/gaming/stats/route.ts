import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RPGStatsSystem } from '@/lib/rpg-stats-system'

/**
 * GET /api/gaming/stats
 * Calculate RPG-style stats using full stats system
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

    // Calculate full RPG stats
    const stats = await RPGStatsSystem.calculateStats(prisma, user.id, 0)

    // Get recommendations
    const recommendations = RPGStatsSystem.getStatRecommendations(stats)

    return NextResponse.json({
      strength: stats.strength,
      endurance: stats.endurance,
      agility: stats.agility,
      flexibility: stats.flexibility,
      power: stats.power,
      breakdown: stats.breakdown,
      ranks: stats.ranks,
      recommendations,
    })
  } catch (error) {
    console.error('Error fetching gaming stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
