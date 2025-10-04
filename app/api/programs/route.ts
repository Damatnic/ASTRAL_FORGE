import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json([])
    }

    // For now, return programs from workout sessions that could be templates
    // In future, we'd have a proper WorkoutProgram table
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
      },
      take: 10,
      orderBy: {
        date: 'desc',
      },
    })

    // Format as programs
    const programs = sessions.map(session => ({
      id: session.id,
      name: session.name || 'Unnamed Program',
      description: session.notes || '',
      exerciseCount: typeof session.plan === 'string' 
        ? JSON.parse(session.plan).exercises?.length || 0
        : session.plan?.exercises?.length || 0,
      active: !session.completed,
      schedule: {},
    }))

    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, description, exercises, active } = data

    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create a workout session that serves as a program template
    const program = await prisma.workoutSession.create({
      data: {
        userId: user.id,
        name,
        notes: description,
        completed: false,
        plan: {
          exercises: exercises.map((ex: any) => ({
            id: ex.exerciseId,
            name: ex.exerciseName,
            sets: ex.sets,
            reps: ex.reps,
            targetRPE: ex.targetRPE,
            restSeconds: ex.restSeconds,
            weight: 0,
          })),
        },
      },
    })

    return NextResponse.json({
      success: true,
      program,
    })
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    )
  }
}

