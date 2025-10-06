// Core TypeScript types for Astral Power

export interface WorkoutHistory {
  sessionId: string
  date: Date
  exercises: ExerciseHistory[]
  avgRPE: number
  totalVolume: number
  duration?: number
}

export interface ExerciseHistory {
  exerciseId: string
  exerciseName: string
  sets: SetHistory[]
}

export interface SetHistory {
  setNumber: number
  weight: number
  reps: number
  rpe?: number
  rir?: number
  velocity?: number
}

export interface FatigueState {
  level: 'low' | 'moderate' | 'high'
  score: number // 0-1 scale
  acuteChronic: number
  muscleGroupRecovery: Record<string, 'recovered' | 'fatigued' | 'overtrained'>
  recommendation: 'proceed' | 'light' | 'deload' | 'rest'
  adjustmentFactor: number // 0.7-1.2 multiplier
}

export interface UserProfile {
  userId: string
  level: 'beginner' | 'intermediate' | 'advanced'
  goals: {
    primary: 'strength' | 'hypertrophy' | 'endurance'
    secondary?: string
  }
  preferences: {
    units: 'kg' | 'lbs'
    notifications: boolean
  }
}

export interface ProgressionPlan {
  method: 'increase_load' | 'increase_volume' | 'maintain' | 'deload'
  factor?: number // Weight multiplier (e.g., 1.05 = +5%)
  reps?: number // New rep target
  sets?: number // New set target
  reasoning?: string
}

export interface LoadPrescription {
  exerciseId: string
  weight: number
  sets: number
  reps: number
  rpe: number
  adjustments: string[]
}

export interface WorkoutPlan {
  exercises: LoadPrescription[]
  globalAdjustment: number
  expectedDuration: number
  notes: string[]
}

export interface PlannedSet {
  setNumber: number
  weight: number
  reps: number
  targetRPE: number
}

export interface AdjustedSet extends PlannedSet {
  note?: string
  adjusted: boolean
}

export interface ReadinessAssessment {
  score: number // 0-1 scale
  fatigueLevel: FatigueState['level']
  recommendation: string
  adjustmentFactor: number
}

export interface RPEInterpretation {
  rir: number
  percentMax: number
  fatigueLevel: 'low' | 'moderate' | 'high'
  description: string
}

export interface StreakData {
  current: number
  longest: number
  lastWorkout: Date | null
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: Date
}

export interface Achievement {
  id: string
  type: 'pr' | 'streak' | 'volume' | 'consistency'
  title: string
  description: string
  earnedAt: Date
  metadata?: Record<string, any>
}

export interface Milestone {
  description: string
  progress: number
  target: number
  type: string
}


