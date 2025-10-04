import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PvPSystem, DuelType } from '@/lib/pvp-system'

/**
 * GET /api/gaming/pvp
 * Get user's PvP data (rank, active duels, history)
 */
export async function GET(request: Request) {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get PvP rank
    const rank = await PvPSystem.getUserPvPRank(prisma, user.id)

    // Get active duels
    const activeDuels = await PvPSystem.getUserDuels(prisma, user.id, 'active')
    const pendingDuels = await PvPSystem.getUserDuels(prisma, user.id, 'pending')

    // Get PvP leaderboard (top 10)
    const leaderboard = await PvPSystem.getPvPLeaderboard(prisma, 10)

    return NextResponse.json({
      rank,
      activeDuels,
      pendingDuels,
      leaderboard,
    })
  } catch (error) {
    console.error('Error fetching PvP data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PvP data' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/gaming/pvp
 * Create a new duel challenge
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { opponentId, type, duration } = body

    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const result = await PvPSystem.createDuel(
      prisma,
      user.id,
      opponentId,
      type as DuelType,
      duration
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.duel, { status: 201 })
  } catch (error) {
    console.error('Error creating duel:', error)
    return NextResponse.json(
      { error: 'Failed to create duel' },
      { status: 500 }
    )
  }
}

