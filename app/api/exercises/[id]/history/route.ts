import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralpower.app' },
    })

    if (!user) {
      return NextResponse.json([])
    }

    // Get all sets for this exercise
    const sets = await prisma.setEntry.findMany({
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
      take: 50, // Last 50 sets
    })

    return NextResponse.json(sets)
  } catch (error) {
    console.error('Error fetching exercise history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exercise history' },
      { status: 500 }
    )
  }
}

