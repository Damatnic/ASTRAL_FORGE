import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// POST /api/sessions/[id]/notes - Add notes to a workout session
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    const body = await request.json()
    
    // Get the session to find the user
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Create workout note
    const note = await prisma.workoutNote.create({
      data: {
        sessionId,
        userId: session.userId,
        content: body.content || '',
        energyLevel: body.energyLevel || null,
        sleepQuality: body.sleepQuality || null,
        stress: body.stress || null,
        nutrition: body.nutrition || null,
      }
    })

    // Update fatigue metrics based on the notes
    if (body.energyLevel || body.sleepQuality || body.stress) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const existingMetric = await prisma.fatigueMetric.findFirst({
        where: {
          userId: session.userId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          }
        }
      })

      if (existingMetric) {
        await prisma.fatigueMetric.update({
          where: { id: existingMetric.id },
          data: {
            sleepQuality: body.sleepQuality || existingMetric.sleepQuality,
            stress: body.stress || existingMetric.stress,
          }
        })
      } else {
        await prisma.fatigueMetric.create({
          data: {
            userId: session.userId,
            date: new Date(),
            sleepQuality: body.sleepQuality,
            stress: body.stress,
          }
        })
      }
    }

    return NextResponse.json(note)
  } catch (error) {
    return handleApiError(error)
  }
}

// GET /api/sessions/[id]/notes - Get notes for a workout session
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    
    const notes = await prisma.workoutNote.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(notes)
  } catch (error) {
    return handleApiError(error)
  }
}
