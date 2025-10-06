import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PvPSystemDB } from '@/lib/pvp-system-db'
import { DuelType, DuelStatus } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'rank': {
        const rank = await PvPSystemDB.getUserPvPRank(prisma, user.id)
        return NextResponse.json(rank)
      }

      case 'leaderboard': {
        const limit = parseInt(searchParams.get('limit') || '100')
        const leaderboard = await PvPSystemDB.getPvPLeaderboard(prisma, limit)
        return NextResponse.json(leaderboard)
      }

      case 'duels': {
        const statusParam = searchParams.get('status')
        const status = statusParam ? (statusParam as DuelStatus) : undefined
        const duels = await PvPSystemDB.getUserDuels(prisma, user.id, status)
        return NextResponse.json(duels)
      }

      case 'duel': {
        const duelId = searchParams.get('duelId')
        if (!duelId) {
          return NextResponse.json({ error: 'Duel ID required' }, { status: 400 })
        }
        const duel = await PvPSystemDB.getDuelById(prisma, duelId)
        return NextResponse.json(duel)
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('PvP API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'challenge': {
        const result = await PvPSystemDB.createDuel(
          prisma,
          user.id,
          body.opponentId,
          body.type as DuelType,
          body.customGoal
        )
        return NextResponse.json(result)
      }

      case 'accept': {
        const result = await PvPSystemDB.acceptDuel(prisma, body.duelId, user.id)
        return NextResponse.json(result)
      }

      case 'decline': {
        const result = await PvPSystemDB.declineDuel(prisma, body.duelId, user.id)
        return NextResponse.json(result)
      }

      case 'update': {
        const result = await PvPSystemDB.updateDuelProgress(prisma, body.duelId, user.id, body.currentValue)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('PvP POST API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
