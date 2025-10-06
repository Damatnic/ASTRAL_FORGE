import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/error-handler'

// GET /api/progress/muscle-volume - Get volume distribution by muscle group
export async function GET(request: Request) {
  try {
    // For demo, using hardcoded user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@astralforge.app' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all completed sets with exercise info
    const sets = await prisma.setEntry.findMany({
      where: {
        session: {
          userId: user.id,
          completed: true,
        }
      },
      include: {
        exercise: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 1000, // Last 1000 sets for analysis
    })

    // Group by muscle group and calculate volume
    const muscleGroupVolume: Record<string, number> = {}
    
    sets.forEach(set => {
      const muscleGroup = set.exercise.muscleGroup
      const volume = set.weight * set.reps
      
      if (muscleGroupVolume[muscleGroup]) {
        muscleGroupVolume[muscleGroup] += volume
      } else {
        muscleGroupVolume[muscleGroup] = volume
      }
    })

    // Convert to array format for charts
    const data = Object.entries(muscleGroupVolume)
      .map(([muscleGroup, volume]) => ({
        muscleGroup,
        volume: Math.round(volume),
        sets: sets.filter(s => s.exercise.muscleGroup === muscleGroup).length,
      }))
      .sort((a, b) => b.volume - a.volume) // Sort by volume descending

    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

