import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GuildSystemDB } from '@/lib/guild-system-db'
import { GuildRank } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'leaderboard': {
        const sortBy = (searchParams.get('sortBy') as 'xp' | 'level' | 'members' | 'volume') || 'xp'
        const limit = parseInt(searchParams.get('limit') || '100')
        const guilds = await GuildSystemDB.getGuildLeaderboard(prisma, sortBy, limit)
        return NextResponse.json(guilds)
      }

      case 'browse': {
        const minLevel = searchParams.get('minLevel') ? parseInt(searchParams.get('minLevel')!) : undefined
        const maxLevel = searchParams.get('maxLevel') ? parseInt(searchParams.get('maxLevel')!) : undefined
        const rank = searchParams.get('rank') as GuildRank | undefined
        const isPublic = searchParams.get('isPublic') === 'true'

        const guilds = await GuildSystemDB.getAllGuilds(prisma, {
          minLevel,
          maxLevel,
          rank,
          isPublic,
        })
        return NextResponse.json(guilds)
      }

      case 'get': {
        const guildId = searchParams.get('guildId')
        if (!guildId) {
          return NextResponse.json({ error: 'Guild ID required' }, { status: 400 })
        }
        const guild = await GuildSystemDB.getGuildById(prisma, guildId)
        return NextResponse.json(guild)
      }

      case 'activity': {
        const guildId = searchParams.get('guildId')
        const limit = parseInt(searchParams.get('limit') || '50')
        if (!guildId) {
          return NextResponse.json({ error: 'Guild ID required' }, { status: 400 })
        }
        const activity = await GuildSystemDB.getGuildActivity(prisma, guildId, limit)
        return NextResponse.json(activity)
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Guild API error:', error)
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
      case 'create': {
        const result = await GuildSystemDB.createGuild(prisma, user.id, {
          name: body.name,
          tag: body.tag,
          description: body.description,
          motto: body.motto,
          isPublic: body.isPublic ?? true,
          minLevelRequired: body.minLevelRequired ?? 1,
        })
        return NextResponse.json(result)
      }

      case 'join': {
        const result = await GuildSystemDB.addMember(prisma, body.guildId, user.id)
        return NextResponse.json(result)
      }

      case 'leave': {
        const result = await GuildSystemDB.removeMember(prisma, body.guildId, user.id)
        return NextResponse.json(result)
      }

      case 'contribute': {
        const result = await GuildSystemDB.contributeToGuild(prisma, body.guildId, user.id, {
          xp: body.xp,
          volume: body.volume,
          workouts: body.workouts,
        })
        return NextResponse.json(result)
      }

      case 'updateRole': {
        const result = await GuildSystemDB.updateMemberRole(prisma, body.guildId, body.userId, body.role)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Guild POST API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
