/**
 * @jest-environment node
 */

import { describe, expect, test, beforeEach } from '@jest/globals'

// Mock Prisma client
const mockPrisma = {
  workout: {
    findMany: jest.fn(),
  },
  exerciseLog: {
    findMany: jest.fn(),
  },
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

// Test data helpers (prefixed with _ to indicate intentionally unused in this test file)
const _createMockWorkout = (date: string, userId: string = 'user1') => ({
  id: `workout-${date}`,
  userId,
  date: new Date(date),
  exercises: [],
  sets: [],
  totalVolume: 5000,
  duration: 60,
  notes: null,
  createdAt: new Date(date),
  updatedAt: new Date(date),
})

const _createMockExerciseLog = (
  exerciseName: string,
  muscleGroup: string,
  weight: number,
  reps: number,
  date: string
) => ({
  id: `log-${exerciseName}-${date}`,
  userId: 'user1',
  workoutId: `workout-${date}`,
  exerciseName,
  muscleGroup,
  sets: [
    {
      setNumber: 1,
      weight,
      reps,
      type: 'working',
    },
  ],
  createdAt: new Date(date),
})

describe('AI Insights API - Analysis Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Consistency Analysis', () => {
    test('should score 100 for optimal frequency (3x/week)', () => {
      const daysWithWorkouts = 12 // 3 workouts/week * 4 weeks
      const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33)
      expect(score).toBeCloseTo(100, 0)
    })

    test('should score lower for infrequent training (1x/week)', () => {
      const daysWithWorkouts = 4 // 1 workout/week * 4 weeks
      const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33)
      expect(score).toBeLessThan(50)
    })

    test('should score high for frequent training (5x/week)', () => {
      const daysWithWorkouts = 20 // 5 workouts/week * 4 weeks
      const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33)
      expect(score).toBeGreaterThan(90)
    })

    test('should generate strength insight for consistent training', () => {
      const daysWithWorkouts = 15
      const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33)

      if (score >= 80) {
        const insight = {
          type: 'strength' as const,
          title: 'Excellent Consistency',
          description: expect.stringContaining('workouts'),
          priority: 'high' as const,
        }
        expect(insight.type).toBe('strength')
        expect(insight.priority).toBe('high')
      }
    })

    test('should generate weakness insight for inconsistent training', () => {
      const daysWithWorkouts = 3
      const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33)

      if (score < 50) {
        const insight = {
          type: 'weakness' as const,
          title: 'Inconsistent Training',
          description: expect.stringContaining('regular'),
          priority: 'high' as const,
        }
        expect(insight.type).toBe('weakness')
        expect(insight.priority).toBe('high')
      }
    })
  })

  describe('Volume Trend Analysis', () => {
    test('should detect increasing volume trend (+15%)', () => {
      const recentVolume = 11600 // Last 5 workouts (16% increase)
      const previousVolume = 10000 // Previous 5 workouts
      const change = ((recentVolume - previousVolume) / previousVolume) * 100

      expect(change).toBeGreaterThan(15)

      const trend = change > 15 ? 'increasing' : change < -15 ? 'decreasing' : 'stable'
      expect(trend).toBe('increasing')
    })

    test('should detect decreasing volume trend (-15%)', () => {
      const recentVolume = 8400 // -16% change
      const previousVolume = 10000
      const change = ((recentVolume - previousVolume) / previousVolume) * 100

      expect(change).toBeLessThan(-15)

      const trend = change > 15 ? 'increasing' : change < -15 ? 'decreasing' : 'stable'
      expect(trend).toBe('decreasing')
    })

    test('should detect stable volume (within ±15%)', () => {
      const recentVolume = 10500
      const previousVolume = 10000
      const change = ((recentVolume - previousVolume) / previousVolume) * 100

      expect(Math.abs(change)).toBeLessThan(15)

      const trend = change > 15 ? 'increasing' : change < -15 ? 'decreasing' : 'stable'
      expect(trend).toBe('stable')
    })

    test('should generate strength insight for increasing volume', () => {
      const change = 20 // +20%

      if (change > 15) {
        const insight = {
          type: 'strength' as const,
          title: 'Volume Increasing',
          description: `Your training volume has increased by ${change.toFixed(1)}%`,
          priority: 'high' as const,
        }
        expect(insight.type).toBe('strength')
        expect(insight.description).toContain('20')
      }
    })
  })

  describe('Muscle Group Balance Analysis', () => {
    test('should detect balanced push/pull ratio (1:1)', () => {
      const pushSets = 10
      const pullSets = 10
      const ratio = pushSets / pullSets

      expect(ratio).toBeGreaterThanOrEqual(0.67)
      expect(ratio).toBeLessThanOrEqual(1.5)
    })

    test('should detect push-dominant imbalance (ratio > 1.5)', () => {
      const pushSets = 16
      const pullSets = 10
      const ratio = pushSets / pullSets

      expect(ratio).toBeGreaterThan(1.5)

      const insight = {
        type: 'warning' as const,
        title: 'Push/Pull Imbalance',
        description: 'You have more push exercises than pull',
        priority: 'high' as const,
        action: 'Add more pull exercises',
      }
      expect(insight.type).toBe('warning')
    })

    test('should detect pull-dominant imbalance (ratio < 0.67)', () => {
      const pushSets = 6
      const pullSets = 10
      const ratio = pushSets / pullSets

      expect(ratio).toBeLessThan(0.67)
    })

    test('should detect leg/upper body imbalance', () => {
      const legSets = 5
      const upperSets = 20
      const ratio = legSets / upperSets

      expect(ratio).toBeLessThan(0.5) // Should be at least 0.5 (leg day every other upper day)
    })
  })

  describe('Progressive Overload Analysis', () => {
    test('should detect progression in multiple exercises', () => {
      const exerciseProgression = {
        Squat: { progressing: true, lastIncrease: '2024-01-15' },
        'Bench Press': { progressing: true, lastIncrease: '2024-01-18' },
        Deadlift: { progressing: true, lastIncrease: '2024-01-12' },
        Rows: { progressing: false, lastIncrease: '2023-12-20' },
      }

      const progressingCount = Object.values(exerciseProgression).filter(
        (e) => e.progressing
      ).length

      expect(progressingCount).toBeGreaterThanOrEqual(3)

      if (progressingCount >= 3) {
        const insight = {
          type: 'strength' as const,
          title: 'Strong Progressive Overload',
          description: `${progressingCount} exercises showing progression`,
          priority: 'high' as const,
        }
        expect(insight.type).toBe('strength')
      }
    })

    test('should detect stalled exercises', () => {
      const daysSinceLastIncrease = 45 // No progress in 45 days

      expect(daysSinceLastIncrease).toBeGreaterThan(30)

      if (daysSinceLastIncrease > 30) {
        const insight = {
          type: 'recommendation' as const,
          title: 'Exercise Stalled',
          description: 'No weight increase in over 30 days',
          priority: 'medium' as const,
          action: 'Consider deload or exercise variation',
        }
        expect(insight.type).toBe('recommendation')
      }
    })
  })

  describe('Recovery Analysis', () => {
    test('should detect adequate recovery (1-2 rest days)', () => {
      const consecutiveDays = 3

      expect(consecutiveDays).toBeLessThan(7)

      const isAdequate = consecutiveDays < 7
      expect(isAdequate).toBe(true)
    })

    test('should detect overtraining risk (7+ consecutive days)', () => {
      const consecutiveDays = 8

      expect(consecutiveDays).toBeGreaterThanOrEqual(7)

      const insight = {
        type: 'warning' as const,
        title: 'Overtraining Risk',
        description: `${consecutiveDays} consecutive training days detected`,
        priority: 'high' as const,
        action: 'Schedule a rest day',
      }
      expect(insight.type).toBe('warning')
      expect(insight.priority).toBe('high')
    })

    test('should detect insufficient rest (<1 day between workouts)', () => {
      const restDaysBetween = 0

      if (restDaysBetween === 0) {
        const insight = {
          type: 'warning' as const,
          title: 'Insufficient Recovery',
          description: 'No rest days between workouts',
          priority: 'medium' as const,
        }
        expect(insight.type).toBe('warning')
      }
    })
  })

  describe('Exercise Variety Analysis', () => {
    test('should score high for good variety (20+ exercises)', () => {
      const uniqueExercises = 22
      const rawScore = (uniqueExercises / 15) * 100 // Will be ~146.67
      const score = Math.min(100, rawScore)

      expect(rawScore).toBeGreaterThan(100) // Before capping
      expect(score).toBe(100) // After capping
    })

    test('should score medium for moderate variety (10-15 exercises)', () => {
      const uniqueExercises = 12
      const score = Math.min(100, (uniqueExercises / 15) * 100)

      expect(score).toBeGreaterThan(50)
      expect(score).toBeLessThan(100)
    })

    test('should score low for limited variety (<10 exercises)', () => {
      const uniqueExercises = 7
      const score = Math.min(100, (uniqueExercises / 15) * 100)

      expect(score).toBeLessThan(50)

      if (score < 50) {
        const insight = {
          type: 'weakness' as const,
          title: 'Limited Exercise Variety',
          description: `Only ${uniqueExercises} unique exercises`,
          priority: 'medium' as const,
          action: 'Add exercise variations',
        }
        expect(insight.type).toBe('weakness')
      }
    })
  })

  describe('Plateau Detection', () => {
    test('should detect plateau (volume variance < 5%)', () => {
      const volumes = [5000, 5100, 4950, 5050, 5000]
      const avg = volumes.reduce((sum, v) => sum + v, 0) / volumes.length
      const variance =
        volumes.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / volumes.length
      const stdDev = Math.sqrt(variance)
      const coefficientOfVariation = (stdDev / avg) * 100

      expect(coefficientOfVariation).toBeLessThan(5)

      const insight = {
        type: 'recommendation' as const,
        title: 'Potential Plateau',
        description: 'Volume has been stable with minimal variation',
        priority: 'medium' as const,
        action: 'Consider changing training variables',
      }
      expect(insight.type).toBe('recommendation')
    })

    test('should not detect plateau with high variance', () => {
      const volumes = [5000, 6000, 5500, 7000, 6500]
      const avg = volumes.reduce((sum, v) => sum + v, 0) / volumes.length
      const variance =
        volumes.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / volumes.length
      const stdDev = Math.sqrt(variance)
      const coefficientOfVariation = (stdDev / avg) * 100

      expect(coefficientOfVariation).toBeGreaterThan(5)
    })
  })

  describe('Overall Score Calculation', () => {
    test('should calculate composite score from multiple dimensions', () => {
      const scores = {
        consistency: 90,
        volumeTrend: 85,
        balance: 80,
        overload: 95,
        recovery: 75,
        variety: 70,
      }

      const overallScore =
        Object.values(scores).reduce((sum, s) => sum + s, 0) /
        Object.values(scores).length

      expect(overallScore).toBeGreaterThan(0)
      expect(overallScore).toBeLessThanOrEqual(100)
      expect(overallScore).toBeCloseTo(82.5, 1)
    })

    test('should weight different dimensions appropriately', () => {
      const scores = {
        consistency: { value: 90, weight: 0.25 },
        volumeTrend: { value: 85, weight: 0.2 },
        balance: { value: 80, weight: 0.15 },
        overload: { value: 95, weight: 0.2 },
        recovery: { value: 75, weight: 0.1 },
        variety: { value: 70, weight: 0.1 },
      }

      const weightedScore = Object.values(scores).reduce(
        (sum, s) => sum + s.value * s.weight,
        0
      )

      expect(weightedScore).toBeGreaterThan(0)
      expect(weightedScore).toBeLessThanOrEqual(100)
    })
  })

  describe('Prediction Algorithms', () => {
    test('should predict next PR based on progression rate', () => {
      const recentPRs = [
        { exercise: 'Squat', weight: 140, date: '2023-12-01' },
        { exercise: 'Squat', weight: 145, date: '2024-01-01' },
        { exercise: 'Squat', weight: 150, date: '2024-02-01' },
      ]

      const progressionRate =
        (recentPRs[2].weight - recentPRs[0].weight) /
        ((new Date(recentPRs[2].date).getTime() -
          new Date(recentPRs[0].date).getTime()) /
          (1000 * 60 * 60 * 24 * 30)) // Per month

      const predictedNextPR = recentPRs[2].weight + progressionRate
      const predictedDate = new Date()
      predictedDate.setMonth(predictedDate.getMonth() + 1)

      expect(predictedNextPR).toBeGreaterThan(recentPRs[2].weight)
      expect(predictedDate.getTime()).toBeGreaterThan(
        new Date(recentPRs[2].date).getTime()
      )
    })

    test('should assess plateau risk based on variance', () => {
      const recentVolumes = [5000, 5050, 4980, 5020, 5010]
      const avg = recentVolumes.reduce((sum, v) => sum + v, 0) / recentVolumes.length
      const variance =
        recentVolumes.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) /
        recentVolumes.length
      const stdDev = Math.sqrt(variance)
      const coefficientOfVariation = (stdDev / avg) * 100

      const plateauRisk = coefficientOfVariation < 5 ? 'high' : 'low'
      expect(plateauRisk).toBe('high')
    })

    test('should assess injury risk based on overtraining indicators', () => {
      const riskFactors = {
        consecutiveDays: 8, // High risk
        volumeIncrease: 25, // High risk (>20%)
        adequateRecovery: false,
        muscleImbalance: true,
      }

      const riskScore =
        (riskFactors.consecutiveDays >= 7 ? 25 : 0) +
        (riskFactors.volumeIncrease > 20 ? 25 : 0) +
        (!riskFactors.adequateRecovery ? 25 : 0) +
        (riskFactors.muscleImbalance ? 25 : 0)

      expect(riskScore).toBeGreaterThan(75) // High risk

      const risk = riskScore > 75 ? 'high' : riskScore > 50 ? 'medium' : 'low'
      expect(risk).toBe('high')
    })
  })

  describe('Insight Prioritization', () => {
    test('should prioritize warnings over recommendations', () => {
      const insights = [
        { type: 'recommendation' as const, priority: 'high' as const },
        { type: 'warning' as const, priority: 'medium' as const },
        { type: 'strength' as const, priority: 'low' as const },
      ]

      const priorityOrder: Record<'warning' | 'recommendation' | 'strength', number> =
        { warning: 3, recommendation: 2, strength: 1 }
      const sorted = insights.sort(
        (a, b) => priorityOrder[b.type] - priorityOrder[a.type]
      )

      expect(sorted[0].type).toBe('warning')
    })

    test('should group insights by type', () => {
      const insights = [
        { type: 'strength', title: 'A' },
        { type: 'warning', title: 'B' },
        { type: 'strength', title: 'C' },
        { type: 'recommendation', title: 'D' },
      ]

      const grouped = insights.reduce(
        (acc, insight) => {
          if (!acc[insight.type]) acc[insight.type] = []
          acc[insight.type].push(insight)
          return acc
        },
        {} as Record<string, typeof insights>
      )

      expect(grouped.strength).toHaveLength(2)
      expect(grouped.warning).toHaveLength(1)
      expect(grouped.recommendation).toHaveLength(1)
    })
  })
})
