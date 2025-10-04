import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GuildSystem } from '@/lib/guild-system'

/**
 * GET /api/gaming/guilds
 * Get all guilds or guild leaderboard
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') as any || 'xp'

    const guilds = await GuildSystem.getGuildLeaderboard(prisma, sortBy)

    return NextResponse.json({
      guilds,
      total: guilds.length,
    })
  } catch (error) {
    console.error('Error fetching guilds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guilds' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/gaming/guilds
 * Create a new guild
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, tag, description, motto, isPublic, minLevelRequired } = body

    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const result = await GuildSystem.createGuild(prisma, user.id, {
      name,
      tag,
      description,
      motto,
      isPublic,
      minLevelRequired,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.guild, { status: 201 })
  } catch (error) {
    console.error('Error creating guild:', error)
    return NextResponse.json(
      { error: 'Failed to create guild' },
      { status: 500 }
    )
  }
}

