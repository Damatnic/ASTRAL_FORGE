import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { handleApiError } from '@/lib/error-handler'

export const dynamic = 'force-dynamic'

// GET /api/progress/rpe-trends - RPE trends over time
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get('exerciseId')
    const days = parseInt(searchParams.get('days') || '30')

    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Build query
    const whereClause: any = {
      session: {
        userId: user.id,
        completed: true,
        startedAt: {
          gte: startDate,
        },
      },
      rpe: {
        not: null,
      },
    }

    if (exerciseId) {
      whereClause.exerciseId = exerciseId
    }

    const sets = await prisma.setEntry.findMany({
      where: whereClause,
      include: {
        exercise: {
          select: {
            name: true,
          },
        },
        session: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    })

    // Group by date and calculate average RPE
    const rpeByDate: Record<string, { total: number; count: number; weight: number; reps: number }> = {}

    sets.forEach(set => {
      const dateStr = set.session.date.toISOString().split('T')[0]
      if (!rpeByDate[dateStr]) {
        rpeByDate[dateStr] = { total: 0, count: 0, weight: 0, reps: 0 }
      }
      rpeByDate[dateStr].total += set.rpe || 0
      rpeByDate[dateStr].count++
      rpeByDate[dateStr].weight = Math.max(rpeByDate[dateStr].weight, set.weight)
      rpeByDate[dateStr].reps += set.reps
    })

    const result = Object.entries(rpeByDate).map(([date, data]) => ({
      date,
      avgRPE: Math.round((data.total / data.count) * 10) / 10,
      maxWeight: data.weight,
      totalReps: data.reps,
      sets: data.count,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
