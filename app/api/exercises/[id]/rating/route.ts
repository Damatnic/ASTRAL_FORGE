import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/exercises/[id]/rating
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralpower.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rating = await prisma.exerciseRating.findUnique({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: params.id,
        },
      },
    })

    return NextResponse.json(rating || { rating: 0, isFavorite: false })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/exercises/[id]/rating
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralpower.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { rating, isFavorite, notes } = body

    const exerciseRating = await prisma.exerciseRating.upsert({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: params.id,
        },
      },
      update: {
        rating: rating !== undefined ? rating : undefined,
        isFavorite: isFavorite !== undefined ? isFavorite : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      create: {
        userId: user.id,
        exerciseId: params.id,
        rating: rating || 3,
        isFavorite: isFavorite || false,
        notes: notes || null,
      },
    })

    return NextResponse.json(exerciseRating)
  } catch (error) {
    return handleApiError(error)
  }
}
