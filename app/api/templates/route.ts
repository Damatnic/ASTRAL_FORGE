import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/templates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const duration = searchParams.get('duration')
    const difficulty = searchParams.get('difficulty')

    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const whereClause: any = {
      OR: [
        { userId: user.id },
        { isPublic: true },
      ],
    }

    if (duration) {
      const maxDuration = parseInt(duration)
      whereClause.durationMinutes = { lte: maxDuration }
    }

    if (difficulty) {
      whereClause.difficulty = difficulty
    }

    const templates = await prisma.workoutTemplate.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/templates
export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, durationMinutes, difficulty, exercises, tags, isPublic } = body

    if (!name || !durationMinutes || !difficulty || !exercises) {
      return NextResponse.json(
        { error: 'Name, duration, difficulty, and exercises are required' },
        { status: 400 }
      )
    }

    const template = await prisma.workoutTemplate.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        durationMinutes,
        difficulty,
        exercises,
        tags: tags || [],
        isPublic: isPublic || false,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/templates?id=[id]
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('id')

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 })
    }

    await prisma.workoutTemplate.delete({
      where: { id: templateId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
