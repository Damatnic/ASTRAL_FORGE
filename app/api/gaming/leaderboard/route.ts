import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeaderboardSystem, LeaderboardCategory } from '@/lib/leaderboard-system'

/**
 * GET /api/gaming/leaderboard
 * Get leaderboard by category
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = (searchParams.get('category') || 'power') as LeaderboardCategory
    const type = searchParams.get('type') || 'global'
    const limit = parseInt(searchParams.get('limit') || '100')

    let leaderboard

    switch (type) {
      case 'guild':
        const guildId = searchParams.get('guildId')
        if (!guildId) {
          return NextResponse.json({ error: 'Guild ID required' }, { status: 400 })
        }
        leaderboard = await LeaderboardSystem.getGuildLeaderboard(prisma, guildId, category)
        break
      
      case 'friends':
        const user = await prisma.user.findUnique({
          where: { email: 'demo@astralforge.app' },
        })
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        leaderboard = await LeaderboardSystem.getFriendsLeaderboard(prisma, user.id, category)
        break
      
      case 'seasonal':
        const season = LeaderboardSystem.getCurrentSeason()
        leaderboard = await LeaderboardSystem.getSeasonalLeaderboard(prisma, season.id, category)
        break
      
      default:
        leaderboard = await LeaderboardSystem.getGlobalLeaderboard(prisma, category, limit)
    }

    // Get current season
    const season = LeaderboardSystem.getCurrentSeason()

    // Get user rank
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })
    
    let userRank
    if (user) {
      userRank = await LeaderboardSystem.getUserRank(prisma, user.id, category)
    }

    return NextResponse.json({
      leaderboard,
      season,
      userRank,
      category,
      type,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

