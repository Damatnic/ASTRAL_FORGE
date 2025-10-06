import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

export const dynamic = 'force-dynamic'

// GET /api/injuries
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

    const injuries = await prisma.injury.findMany({
      where: whereClause,
      orderBy: {
        dateOccurred: 'desc',
      },
    })

    return NextResponse.json(injuries)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/injuries
export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, bodyPart, severity, dateOccurred, notes, affectedExercises } = body

    if (!name || !bodyPart || !severity || !dateOccurred) {
      return NextResponse.json(
        { error: 'Name, body part, severity, and date are required' },
        { status: 400 }
      )
    }

    const injury = await prisma.injury.create({
      data: {
        userId: user.id,
        name,
        bodyPart,
        severity,
        dateOccurred: new Date(dateOccurred),
        notes: notes || null,
        affectedExercises: affectedExercises || [],
      },
    })

    return NextResponse.json(injury)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/injuries?id=[id]
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const injuryId = searchParams.get('id')

    if (!injuryId) {
      return NextResponse.json({ error: 'Injury ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { status, dateHealed, notes } = body

    const injury = await prisma.injury.update({
      where: { id: injuryId },
      data: {
        status: status || undefined,
        dateHealed: dateHealed ? new Date(dateHealed) : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    })

    return NextResponse.json(injury)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/injuries?id=[id]
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const injuryId = searchParams.get('id')

    if (!injuryId) {
      return NextResponse.json({ error: 'Injury ID required' }, { status: 400 })
    }

    await prisma.injury.delete({
      where: { id: injuryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

