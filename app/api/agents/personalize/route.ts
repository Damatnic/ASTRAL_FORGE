import { NextRequest, NextResponse } from 'next/server'
import { ProgressiveOverloadEngine } from '@/lib/agents/progressive-overload'
import { FatigueManager } from '@/lib/agents/fatigue-management'
import { prisma } from '@/lib/prisma'

/**
 * Agent: Personalization Engine
 * 
 * This endpoint runs daily to generate personalized workouts for all users
 * based on their history, fatigue levels, and progression algorithms.
 * 
 * Intended to be called by cron job at 6 AM daily.
 */
export async function POST(request: NextRequest) {
  try {
    const engine = new ProgressiveOverloadEngine(prisma)
    const fatigueManager = new FatigueManager(prisma)

    // Get all active users
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    })

    const results = []

    for (const user of users) {
      try {
        // Assess readiness
        const readiness = await fatigueManager.assessReadiness(user.id)
        
        // Calculate next workout
        const workout = await engine.calculateNextWorkout(user.id)
        
        // Apply global adjustment if needed
        if (readiness.adjustmentFactor < 1.0) {
          workout.globalAdjustment = readiness.adjustmentFactor
          workout.notes.push(`Global adjustment: ${Math.round((1 - readiness.adjustmentFactor) * 100)}% reduction due to fatigue`)
        }
        
        // Create workout session
        await prisma.workoutSession.create({
          data: {
            userId: user.id,
            name: 'Today\'s Workout',
            plan: workout as any,
            date: new Date(),
            completed: false,
            globalAdjustment: workout.globalAdjustment,
          },
        })

        results.push({
          userId: user.id,
          status: 'success',
          readiness: readiness.score,
          exerciseCount: workout.exercises.length,
        })
      } catch (error) {
        console.error(`Failed to generate workout for user ${user.id}:`, error)
        results.push({
          userId: user.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: users.length,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Personalization agent error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

