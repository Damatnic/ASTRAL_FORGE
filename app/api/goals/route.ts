import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

export const dynamic = 'force-dynamic'

// GET /api/goals
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const whereClause: any = { userId: user.id }
    if (status) {
      whereClause.status = status
    }

    const goals = await prisma.goal.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(goals)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/goals
export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, goalType, targetValue, currentValue, unit, deadline } = body

    if (!title || !goalType) {
      return NextResponse.json(
        { error: 'Title and goal type are required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        goalType,
        targetValue: targetValue || null,
        currentValue: currentValue || 0,
        unit: unit || null,
        deadline: deadline ? new Date(deadline) : null,
        milestones: [],
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/goals?id=[id]
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('id')

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    const body = await request.json()
    const { currentValue, status, milestones } = body

    const updateData: any = {}
    if (currentValue !== undefined) updateData.currentValue = currentValue
    if (status) {
      updateData.status = status
      if (status === 'completed') {
        updateData.completedAt = new Date()
      }
    }
    if (milestones) updateData.milestones = milestones

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
    })

    return NextResponse.json(goal)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/goals?id=[id]
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('id')

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    await prisma.goal.delete({
      where: { id: goalId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
