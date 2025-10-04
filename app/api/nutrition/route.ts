import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/nutrition
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(logs)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/nutrition
export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { date, calories, protein, carbs, fats, waterMl, notes } = body

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const log = await prisma.nutritionLog.create({
      data: {
        userId: user.id,
        date: new Date(date),
        calories: calories || null,
        protein: protein || null,
        carbs: carbs || null,
        fats: fats || null,
        waterMl: waterMl || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    return handleApiError(error)
  }
}
