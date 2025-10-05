import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

export const dynamic = 'force-dynamic'

// GET /api/custom-exercises
export async function GET(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const customExercises = await prisma.customExercise.findMany({
      where: {
        OR: [
          { userId: user.id },
          { isPublic: true },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(customExercises)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/custom-exercises
export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, category, muscleGroup, equipment, description, videoUrl, customInstructions, isPublic } = body

    if (!name || !category || !muscleGroup) {
      return NextResponse.json(
        { error: 'Name, category, and muscle group are required' },
        { status: 400 }
      )
    }

    const exercise = await prisma.customExercise.create({
      data: {
        userId: user.id,
        name,
        category,
        muscleGroup,
        equipment: equipment || null,
        description: description || null,
        videoUrl: videoUrl || null,
        customInstructions: customInstructions || null,
        isPublic: isPublic || false,
      },
    })

    return NextResponse.json(exercise)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/custom-exercises?id=[id]
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get('id')

    if (!exerciseId) {
      return NextResponse.json({ error: 'Exercise ID required' }, { status: 400 })
    }

    await prisma.customExercise.delete({
      where: { id: exerciseId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
