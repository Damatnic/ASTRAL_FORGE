import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/rest-timers?exerciseId=[id]
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get('exerciseId')

    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (exerciseId) {
      const timer = await prisma.exerciseRestTimer.findUnique({
        where: {
          userId_exerciseId: {
            userId: user.id,
            exerciseId,
          },
        },
      })
      return NextResponse.json(timer || { restSeconds: 90 }) // Default 90s
    }

    const timers = await prisma.exerciseRestTimer.findMany({
      where: {
        userId: user.id,
      },
    })

    return NextResponse.json(timers)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/rest-timers
export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { exerciseId, restSeconds } = body

    if (!exerciseId || !restSeconds) {
      return NextResponse.json(
        { error: 'Exercise ID and rest seconds are required' },
        { status: 400 }
      )
    }

    const timer = await prisma.exerciseRestTimer.upsert({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId,
        },
      },
      update: {
        restSeconds,
      },
      create: {
        userId: user.id,
        exerciseId,
        restSeconds,
      },
    })

    return NextResponse.json(timer)
  } catch (error) {
    return handleApiError(error)
  }
}
