import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/metrics - Fetch user's body metrics
export async function GET(request: Request) {
  try {
    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const metrics = await prisma.bodyMetric.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 50, // Last 50 entries
    })

    return NextResponse.json(metrics)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/metrics - Create new body metric entry
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if entry exists for this date
    const existingMetric = await prisma.bodyMetric.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: new Date(new Date(body.date).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(body.date).setHours(23, 59, 59, 999)),
        }
      }
    })

    let metric

    if (existingMetric) {
      // Update existing entry
      metric = await prisma.bodyMetric.update({
        where: { id: existingMetric.id },
        data: {
          ...body,
          date: new Date(body.date),
        }
      })
    } else {
      // Create new entry
      metric = await prisma.bodyMetric.create({
        data: {
          userId: user.id,
          ...body,
          date: new Date(body.date),
        }
      })
    }

    // Check for achievements (weight milestones, body fat goals, etc.)
    if (body.weight) {
      const previousMetrics = await prisma.bodyMetric.findMany({
        where: {
          userId: user.id,
          date: { lt: new Date(body.date) }
        },
        orderBy: { date: 'desc' },
        take: 1,
      })

      if (previousMetrics.length > 0) {
        const weightChange = body.weight - (previousMetrics[0].weight || body.weight)
        
        // Check for weight loss achievement
        if (weightChange < -5) {
          await prisma.achievement.create({
            data: {
              userId: user.id,
              type: 'transformation',
              title: 'Weight Loss Milestone',
              description: `Lost ${Math.abs(weightChange).toFixed(1)}kg!`,
              metadata: { weight: body.weight, previousWeight: previousMetrics[0].weight }
            }
          })
        }
        
        // Check for weight gain achievement (for bulking)
        if (weightChange > 5) {
          await prisma.achievement.create({
            data: {
              userId: user.id,
              type: 'transformation',
              title: 'Weight Gain Milestone',
              description: `Gained ${weightChange.toFixed(1)}kg!`,
              metadata: { weight: body.weight, previousWeight: previousMetrics[0].weight }
            }
          })
        }
      }
    }

    return NextResponse.json(metric)
  } catch (error) {
    return handleApiError(error)
  }
}
