import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get the most recent incomplete workout session or create one
    const session = await prisma.workoutSession.findFirst({
      where: {
        completed: false,
      },
      orderBy: {
        date: 'desc',
      },
    })

    if (!session) {
      return NextResponse.json({ 
        error: 'No workout found',
        message: 'Create a workout program to get started!'
      }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching next workout:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    )
  }
}

