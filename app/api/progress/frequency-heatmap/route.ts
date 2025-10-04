import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/progress/frequency-heatmap - Training frequency heatmap data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const weeks = parseInt(searchParams.get('weeks') || '12')

    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get completed sessions for the last N weeks
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (weeks * 7))

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
        completed: true,
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        duration: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Create heatmap data: array of { date: 'YYYY-MM-DD', count: number, duration: number }
    const heatmapData: Record<string, { count: number; duration: number }> = {}

    sessions.forEach(session => {
      const dateStr = session.date.toISOString().split('T')[0]
      if (!heatmapData[dateStr]) {
        heatmapData[dateStr] = { count: 0, duration: 0 }
      }
      heatmapData[dateStr].count++
      heatmapData[dateStr].duration += session.duration || 0
    })

    // Convert to array and fill in missing dates
    const result = []
    for (let i = 0; i < weeks * 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
      const weekNumber = Math.floor(i / 7)

      result.push({
        date: dateStr,
        dayOfWeek,
        weekNumber,
        count: heatmapData[dateStr]?.count || 0,
        duration: heatmapData[dateStr]?.duration || 0,
        intensity: heatmapData[dateStr]?.count || 0, // 0-3 scale for color coding
      })
    }

    return NextResponse.json(result.reverse())
  } catch (error) {
    return handleApiError(error)
  }
}
