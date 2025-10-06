/**
 * Progressive Overload Agent
 * 
 * Implements research-backed progressive overload algorithms:
 * - Linear Progression: Add weight when all sets completed at target RPE
 * - Undulating Periodization: Vary intensity/volume daily or weekly
 * - Autoregulated Progression: Based on RPE/RIR feedback
 * 
 * Key principles:
 * - If avg RPE ≤ 7: Increase load by 2.5-5%
 * - If RPE 7-8: Maintain load, add reps
 * - If RPE > 8.5: Maintain or deload 5-10%
 */

import { PrismaClient } from '@prisma/client'
import type {
  WorkoutHistory,
  FatigueState,
  UserProfile,
  ProgressionPlan,
  WorkoutPlan,
  LoadPrescription,
} from '../types'

export class ProgressiveOverloadEngine {
  constructor(private prisma: PrismaClient) {}

  async calculateNextWorkout(userId: string): Promise<WorkoutPlan> {
    const history = await this.getRecentHistory(userId, 10)
    const fatigue = await this.assessBasicFatigue(userId)
    const profile = await this.getUserProfile(userId)

    // Get user's current training split
    const exercises = await this.selectExercises(userId, history)
    
    const prescriptions: LoadPrescription[] = []
    const notes: string[] = []

    for (const exercise of exercises) {
      const exerciseHistory = this.getExerciseHistory(history, exercise.id)
      const progression = this.determineProgression(
        exerciseHistory,
        fatigue,
        profile,
        exercise
      )

      const prescription = this.generatePrescription(
        exercise,
        exerciseHistory,
        progression
      )

      prescriptions.push(prescription)
      
      if (progression.reasoning) {
        notes.push(`${exercise.name}: ${progression.reasoning}`)
      }
    }

    // Calculate global adjustment based on fatigue
    const globalAdjustment = fatigue.adjustmentFactor

    return {
      exercises: prescriptions,
      globalAdjustment,
      expectedDuration: prescriptions.length * 15, // ~15 min per exercise
      notes,
    }
  }

  private determineProgression(
    exerciseHistory: any[],
    fatigue: FatigueState,
    profile: UserProfile,
    exercise: any
  ): ProgressionPlan {
    if (exerciseHistory.length === 0) {
      // First time doing exercise - use conservative starting weights
      return {
        method: 'maintain',
        reasoning: 'First session - establish baseline',
      }
    }

    const lastSession = exerciseHistory[0]
    const avgRPE = this.calculateAverageRPE(lastSession.sets)
    const completedAllReps = this.checkRepCompletion(lastSession.sets)

    // High fatigue override
    if (fatigue.level === 'high') {
      return {
        method: 'deload',
        factor: 0.90,
        reasoning: 'Deload due to high fatigue - prioritizing recovery',
      }
    }

    // Core progression logic based on RPE
    if (avgRPE <= 7 && completedAllReps && fatigue.level === 'low') {
      // Ready to progress weight
      const increment = this.getProgressionIncrement(exercise, profile)
      return {
        method: 'increase_load',
        factor: 1 + increment,
        reasoning: `Low RPE (${avgRPE}) - increasing weight`,
      }
    } else if (avgRPE <= 8 && completedAllReps) {
      // Add reps before adding weight
      const currentReps = lastSession.sets[0].reps
      return {
        method: 'increase_volume',
        reps: currentReps + 1,
        reasoning: `Moderate RPE (${avgRPE}) - adding reps`,
      }
    } else if (avgRPE > 8.5) {
      // Too hard, maintain or deload slightly
      if (avgRPE > 9) {
        return {
          method: 'deload',
          factor: 0.95,
          reasoning: `High RPE (${avgRPE}) - reducing weight`,
        }
      }
      return {
        method: 'maintain',
        reasoning: `High RPE (${avgRPE}) - maintaining weight`,
      }
    }

    return {
      method: 'maintain',
      reasoning: 'Continuing current protocol',
    }
  }

  private getProgressionIncrement(exercise: any, profile: UserProfile): number {
    // Compound lifts progress faster for beginners
    const isCompound = exercise.category === 'compound'
    
    if (profile.level === 'beginner') {
      return isCompound ? 0.05 : 0.025 // 5% or 2.5%
    } else if (profile.level === 'intermediate') {
      return isCompound ? 0.025 : 0.0125 // 2.5% or 1.25%
    } else {
      return isCompound ? 0.0125 : 0.00625 // 1.25% or 0.625%
    }
  }

  private calculateAverageRPE(sets: any[]): number {
    const rpeSets = sets.filter(s => s.rpe !== null && s.rpe !== undefined)
    if (rpeSets.length === 0) return 7.5 // Default moderate RPE
    
    const sum = rpeSets.reduce((acc, set) => acc + set.rpe, 0)
    return sum / rpeSets.length
  }

  private checkRepCompletion(sets: any[]): boolean {
    // Check if user completed all planned reps
    // For simplicity, we assume completion if last set was within 1 rep of first set
    if (sets.length === 0) return false
    
    const firstSetReps = sets[0].reps
    const lastSetReps = sets[sets.length - 1].reps
    
    return lastSetReps >= firstSetReps - 1
  }

  private generatePrescription(
    exercise: any,
    history: any[],
    progression: ProgressionPlan
  ): LoadPrescription {
    let weight = 60 // Default starting weight
    let reps = 8
    let sets = 3

    if (history.length > 0) {
      const lastSession = history[0]
      weight = lastSession.sets[0].weight
      reps = lastSession.sets[0].reps
      sets = lastSession.sets.length
    }

    // Apply progression
    switch (progression.method) {
      case 'increase_load':
        weight = Math.round(weight * (progression.factor || 1) * 2) / 2 // Round to nearest 0.5
        break
      case 'increase_volume':
        reps = progression.reps || reps + 1
        break
      case 'deload':
        weight = Math.round(weight * (progression.factor || 0.9) * 2) / 2
        break
    }

    return {
      exerciseId: exercise.id,
      weight,
      sets,
      reps,
      rpe: 7.5, // Target RPE
      adjustments: progression.reasoning ? [progression.reasoning] : [],
    }
  }

  private async getRecentHistory(userId: string, limit: number): Promise<WorkoutHistory[]> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId, completed: true },
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        sets: {
          include: {
            exercise: true,
          },
        },
      },
    })

    return sessions.map(session => ({
      sessionId: session.id,
      date: session.date,
      exercises: this.groupSetsByExercise(session.sets),
      avgRPE: this.calculateSessionRPE(session.sets),
      totalVolume: this.calculateVolume(session.sets),
      duration: session.duration || undefined,
    }))
  }

  private groupSetsByExercise(sets: any[]) {
    const grouped = new Map()
    
    for (const set of sets) {
      if (!grouped.has(set.exerciseId)) {
        grouped.set(set.exerciseId, {
          exerciseId: set.exerciseId,
          exerciseName: set.exercise.name,
          sets: [],
        })
      }
      grouped.get(set.exerciseId).sets.push({
        setNumber: set.setNumber,
        weight: set.weight,
        reps: set.reps,
        rpe: set.rpe,
        rir: set.rir,
        velocity: set.velocity,
      })
    }
    
    return Array.from(grouped.values())
  }

  private calculateSessionRPE(sets: any[]): number {
    return this.calculateAverageRPE(sets)
  }

  private calculateVolume(sets: any[]): number {
    return sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
  }

  private async assessBasicFatigue(userId: string): Promise<FatigueState> {
    const recent = await this.prisma.fatigueMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    })

    if (!recent || !recent.acuteChronic) {
      return {
        level: 'low',
        score: 0.8,
        acuteChronic: 1.0,
        muscleGroupRecovery: {},
        recommendation: 'proceed',
        adjustmentFactor: 1.0,
      }
    }

    const acuteChronic = recent.acuteChronic
    let level: FatigueState['level']
    let recommendation: FatigueState['recommendation']
    let adjustmentFactor: number

    if (acuteChronic > 1.5) {
      level = 'high'
      recommendation = 'deload'
      adjustmentFactor = 0.85
    } else if (acuteChronic > 1.3) {
      level = 'moderate'
      recommendation = 'light'
      adjustmentFactor = 0.95
    } else if (acuteChronic < 0.8) {
      level = 'low'
      recommendation = 'proceed'
      adjustmentFactor = 1.0
    } else {
      level = 'low'
      recommendation = 'proceed'
      adjustmentFactor = 1.0
    }

    return {
      level,
      score: Math.max(0, Math.min(1, 1.5 - acuteChronic)),
      acuteChronic,
      muscleGroupRecovery: {},
      recommendation,
      adjustmentFactor,
    }
  }

  private async getUserProfile(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      throw new Error('User profile not found')
    }

    return {
      userId,
      level: profile.level as any,
      goals: profile.goals as any,
      preferences: profile.preferences as any,
    }
  }

  private async selectExercises(userId: string, history: WorkoutHistory[]) {
    // For now, get all exercises - in production, implement smart exercise selection
    return this.prisma.exercise.findMany({
      take: 5,
      orderBy: { name: 'asc' },
    })
  }

  private getExerciseHistory(history: WorkoutHistory[], exerciseId: string) {
    const exerciseData: any[] = []
    
    for (const session of history) {
      const exercise = session.exercises.find(e => e.exerciseId === exerciseId)
      if (exercise) {
        exerciseData.push({
          date: session.date,
          sets: exercise.sets,
        })
      }
    }
    
    return exerciseData
  }
}


