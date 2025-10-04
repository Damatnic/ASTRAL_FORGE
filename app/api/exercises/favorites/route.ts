import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/exercises/favorites - Get favorite exercises
export async function GET(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const favorites = await prisma.exerciseRating.findMany({
      where: {
        userId: user.id,
        isFavorite: true,
      },
      include: {
        exercise: true,
      },
      orderBy: {
        rating: 'desc',
      },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    return handleApiError(error)
  }
}
