import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ChallengeSystem } from '@/lib/challenge-system'

/**
 * GET /api/challenges
 * Fetch user's active challenges
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user stats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate user stats for challenge generation
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get actual workout statistics
    const totalWorkouts = await prisma.workoutSession.count({
      where: { userId: session.user.id }
    })

    const weeklyWorkouts = await prisma.workoutSession.count({
      where: {
        userId: session.user.id,
        date: { gte: weekAgo }
      }
    })

    const monthlyWorkouts = await prisma.workoutSession.count({
      where: {
        userId: session.user.id,
        date: { gte: monthAgo }
      }
    })

    // Calculate total volume from sets across all workouts
    const sets = await prisma.setEntry.findMany({
      where: {
        session: {
          userId: session.user.id
        }
      },
      select: {
        weight: true,
        reps: true
      }
    })

    const totalVolume = sets.reduce((sum, set) => {
      return sum + ((set.weight || 0) * (set.reps || 0))
    }, 0)

    // Calculate current streak based on workout dates
    const sessions = await prisma.workoutSession.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 30,
      select: { date: true }
    })

    let currentStreak = 0
    if (sessions.length > 0) {
      let lastDate = new Date(sessions[0].date)
      lastDate.setHours(0, 0, 0, 0)
      
      for (const session of sessions) {
        const sessionDate = new Date(session.date)
        sessionDate.setHours(0, 0, 0, 0)
        const daysDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000))
        
        if (daysDiff <= 1) {
          currentStreak++
          lastDate = sessionDate
        } else {
          break
        }
      }
    }

    // Get user profile for tier and bodyweight
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: { level: true }
    })

    const userStats = {
      totalWorkouts,
      currentStreak,
      totalVolume: Math.round(totalVolume),
      weeklyWorkouts,
      monthlyWorkouts,
      tier: (profile?.level || 'beginner').charAt(0).toUpperCase() + (profile?.level || 'beginner').slice(1),
      bodyweight: 80, // TODO: Add bodyweight field to user profile
    }

    // Generate challenges
    const dailyChallenges = ChallengeSystem.generateDailyChallenges(userStats)
    const weeklyChallenges = ChallengeSystem.generateWeeklyChallenges(userStats)
    const progressionChallenges = ChallengeSystem.generateProgressionChallenges(userStats)
    const advancedChallenges = ChallengeSystem.generateAdvancedChallenges(userStats)

    const allChallenges = [
      ...dailyChallenges,
      ...weeklyChallenges,
      ...progressionChallenges,
      ...advancedChallenges,
    ]

    return NextResponse.json({
      success: true,
      challenges: allChallenges,
      userStats,
    })
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/challenges
 * Update challenge progress
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { challengeId, workoutData: _workoutData } = body

    // In a real implementation, you would:
    // 1. Load the challenge from database or generate it
    // 2. Update progress using ChallengeSystem.updateChallengeProgress()
    // 3. Save updated challenge to database
    // 4. Check if completed and award rewards

    return NextResponse.json({
      success: true,
      message: 'Challenge progress updated',
      challengeId,
    })
  } catch (error) {
    console.error('Error updating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    )
  }
}
