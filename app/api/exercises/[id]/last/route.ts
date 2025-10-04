import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json(null)
    }

    // Get the most recent set for this exercise
    const lastSet = await prisma.setEntry.findFirst({
      where: {
        exerciseId: params.id,
        session: {
          userId: user.id,
          completed: true,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      select: {
        weight: true,
        reps: true,
        rpe: true,
      },
    })

    return NextResponse.json(lastSet)
  } catch (error) {
    console.error('Error fetching last set:', error)
    return NextResponse.json(null)
  }
}

