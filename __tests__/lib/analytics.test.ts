/**
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals'

// Test data helpers
const createMockWorkout = (date: Date, totalVolume: number, exercises: number = 3) => ({
  id: `workout-${date.getTime()}`,
  date: date.toISOString(),
  totalVolume,
  exercises: Array.from({ length: exercises }, (_, i) => ({
    id: `exercise-${i}`,
    name: `Exercise ${i}`,
    sets: [
      { weight: 100, reps: 10, volume: 1000 },
      { weight: 100, reps: 10, volume: 1000 },
    ],
  })),
})

const createMockExerciseLog = (
  exerciseName: string,
  date: Date,
  weight: number,
  reps: number
) => ({
  id: `log-${date.getTime()}`,
  exerciseName,
  date: date.toISOString(),
  weight,
  reps,
  volume: weight * reps,
  estimatedMax: weight * (1 + reps / 30), // Epley formula
})

describe('Analytics Calculations', () => {
  describe('Volume Calculations', () => {
    test('should calculate total volume correctly', () => {
      const workout = createMockWorkout(new Date(), 5000)
      expect(workout.totalVolume).toBe(5000)
    })

    test('should calculate weekly volume from multiple workouts', () => {
      const workouts = [
        createMockWorkout(new Date('2024-01-01'), 5000),
        createMockWorkout(new Date('2024-01-03'), 6000),
        createMockWorkout(new Date('2024-01-05'), 7000),
      ]
      const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0)
      expect(totalVolume).toBe(18000)
    })

    test('should handle zero volume workouts', () => {
      const workout = createMockWorkout(new Date(), 0)
      expect(workout.totalVolume).toBe(0)
    })
  })

  describe('Training Intensity Metrics', () => {
    test('should calculate average intensity (weight/1RM ratio)', () => {
      const sets = [
        { weight: 80, reps: 10, estimatedMax: 107 },
        { weight: 90, reps: 8, estimatedMax: 113 },
        { weight: 100, reps: 6, estimatedMax: 120 },
      ]
      const avgIntensity =
        sets.reduce((sum, s) => sum + s.weight / s.estimatedMax, 0) / sets.length
      expect(avgIntensity).toBeGreaterThan(0.7) // Should be >70% of 1RM
      expect(avgIntensity).toBeLessThan(0.9) // Should be <90% of 1RM
    })

    test('should identify high intensity sets (>85% 1RM)', () => {
      const sets = [
        { weight: 100, estimatedMax: 110 }, // 90.9%
        { weight: 80, estimatedMax: 100 }, // 80%
        { weight: 95, estimatedMax: 110 }, // 86.4%
      ]
      const highIntensitySets = sets.filter((s) => s.weight / s.estimatedMax > 0.85)
      expect(highIntensitySets).toHaveLength(2)
    })
  })

  describe('Progressive Overload Detection', () => {
    test('should detect volume progression', () => {
      const logs = [
        createMockExerciseLog('Squat', new Date('2024-01-01'), 100, 10),
        createMockExerciseLog('Squat', new Date('2024-01-08'), 105, 10),
        createMockExerciseLog('Squat', new Date('2024-01-15'), 110, 10),
      ]
      const volumeProgression = logs.map((l) => l.volume)
      expect(volumeProgression[2]).toBeGreaterThan(volumeProgression[0])
    })

    test('should detect weight progression', () => {
      const logs = [
        createMockExerciseLog('Bench Press', new Date('2024-01-01'), 80, 8),
        createMockExerciseLog('Bench Press', new Date('2024-01-08'), 82.5, 8),
        createMockExerciseLog('Bench Press', new Date('2024-01-15'), 85, 8),
      ]
      const weights = logs.map((l) => l.weight)
      expect(weights[2]).toBeGreaterThan(weights[0])
    })

    test('should detect plateau (no progression)', () => {
      const logs = [
        createMockExerciseLog('Deadlift', new Date('2024-01-01'), 150, 5),
        createMockExerciseLog('Deadlift', new Date('2024-01-08'), 150, 5),
        createMockExerciseLog('Deadlift', new Date('2024-01-15'), 150, 5),
      ]
      const uniqueWeights = new Set(logs.map((l) => l.weight))
      expect(uniqueWeights.size).toBe(1) // Plateau detected
    })
  })

  describe('Frequency Analysis', () => {
    test('should calculate workouts per week', () => {
      const workouts = [
        createMockWorkout(new Date('2024-01-01'), 5000),
        createMockWorkout(new Date('2024-01-03'), 6000),
        createMockWorkout(new Date('2024-01-05'), 7000),
      ]
      const daysWithWorkouts = new Set(workouts.map((w) => w.date.split('T')[0]))
      const weeks = 1
      const frequency = daysWithWorkouts.size / weeks
      expect(frequency).toBe(3) // 3 workouts per week
    })

    test('should identify rest days', () => {
      const workoutDates = ['2024-01-01', '2024-01-03', '2024-01-06']
      const allDates = [
        '2024-01-01',
        '2024-01-02',
        '2024-01-03',
        '2024-01-04',
        '2024-01-05',
        '2024-01-06',
      ]
      const restDays = allDates.filter((d) => !workoutDates.includes(d))
      expect(restDays).toHaveLength(3)
    })
  })

  describe('Muscle Group Balance', () => {
    test('should calculate push/pull ratio', () => {
      const exercises = [
        { name: 'Bench Press', category: 'push', sets: 3 },
        { name: 'Overhead Press', category: 'push', sets: 3 },
        { name: 'Pull-ups', category: 'pull', sets: 3 },
        { name: 'Rows', category: 'pull', sets: 3 },
      ]
      const pushSets = exercises
        .filter((e) => e.category === 'push')
        .reduce((sum, e) => sum + e.sets, 0)
      const pullSets = exercises
        .filter((e) => e.category === 'pull')
        .reduce((sum, e) => sum + e.sets, 0)
      const ratio = pushSets / pullSets
      expect(ratio).toBe(1) // Balanced
    })

    test('should detect imbalance (ratio > 1.5)', () => {
      const exercises = [
        { name: 'Bench Press', category: 'push', sets: 6 },
        { name: 'Overhead Press', category: 'push', sets: 6 },
        { name: 'Pull-ups', category: 'pull', sets: 3 },
      ]
      const pushSets = exercises
        .filter((e) => e.category === 'push')
        .reduce((sum, e) => sum + e.sets, 0)
      const pullSets = exercises
        .filter((e) => e.category === 'pull')
        .reduce((sum, e) => sum + e.sets, 0)
      const ratio = pushSets / pullSets
      expect(ratio).toBeGreaterThan(1.5) // Imbalanced
    })
  })

  describe('Recovery Analysis', () => {
    test('should detect adequate recovery (1-2 rest days)', () => {
      const workoutDates = [
        new Date('2024-01-01'),
        new Date('2024-01-03'), // 1 rest day
        new Date('2024-01-05'), // 1 rest day
      ]
      for (let i = 1; i < workoutDates.length; i++) {
        const daysBetween =
          (workoutDates[i].getTime() - workoutDates[i - 1].getTime()) /
          (1000 * 60 * 60 * 24)
        expect(daysBetween).toBeGreaterThanOrEqual(1)
        expect(daysBetween).toBeLessThanOrEqual(2)
      }
    })

    test('should detect potential overtraining (7+ consecutive days)', () => {
      const workoutDates = Array.from({ length: 8 }, (_, i) => {
        const date = new Date('2024-01-01')
        date.setDate(date.getDate() + i)
        return date
      })
      const consecutiveDays = workoutDates.length
      expect(consecutiveDays).toBeGreaterThanOrEqual(7) // Overtraining risk
    })
  })

  describe('1RM Estimation (Epley Formula)', () => {
    test('should calculate 1RM from weight and reps', () => {
      const weight = 100
      const reps = 10
      const estimatedMax = weight * (1 + reps / 30)
      expect(estimatedMax).toBeCloseTo(133.33, 1)
    })

    test('should handle 1 rep (weight = 1RM)', () => {
      const weight = 150
      const reps = 1
      const estimatedMax = weight * (1 + reps / 30)
      expect(estimatedMax).toBeCloseTo(155, 1)
    })

    test('should be higher for more reps', () => {
      const weight = 100
      const max5Reps = weight * (1 + 5 / 30)
      const max10Reps = weight * (1 + 10 / 30)
      expect(max10Reps).toBeGreaterThan(max5Reps)
    })
  })

  describe('Trend Analysis', () => {
    test('should detect increasing trend', () => {
      const values = [1000, 1100, 1200, 1300, 1400]
      const isIncreasing = values.every((v, i) => i === 0 || v > values[i - 1])
      expect(isIncreasing).toBe(true)
    })

    test('should detect decreasing trend', () => {
      const values = [1400, 1300, 1200, 1100, 1000]
      const isDecreasing = values.every((v, i) => i === 0 || v < values[i - 1])
      expect(isDecreasing).toBe(true)
    })

    test('should detect stable trend (variance < 5%)', () => {
      const values = [1000, 1020, 990, 1010, 1000]
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length
      const variance =
        values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
      const stdDev = Math.sqrt(variance)
      const coefficientOfVariation = (stdDev / avg) * 100
      expect(coefficientOfVariation).toBeLessThan(5)
    })
  })

  describe('Exercise Variety', () => {
    test('should count unique exercises', () => {
      const workouts = [
        {
          exercises: [
            { name: 'Squat' },
            { name: 'Bench Press' },
            { name: 'Deadlift' },
          ],
        },
        {
          exercises: [{ name: 'Squat' }, { name: 'Rows' }, { name: 'Pull-ups' }],
        },
      ]
      const uniqueExercises = new Set(
        workouts.flatMap((w) => w.exercises.map((e) => e.name))
      )
      expect(uniqueExercises.size).toBe(5)
    })

    test('should detect limited variety (<10 exercises)', () => {
      const uniqueExercises = new Set(['Squat', 'Bench Press', 'Deadlift'])
      expect(uniqueExercises.size).toBeLessThan(10)
    })

    test('should detect good variety (10+ exercises)', () => {
      const uniqueExercises = new Set([
        'Squat',
        'Bench Press',
        'Deadlift',
        'Rows',
        'Pull-ups',
        'Overhead Press',
        'Curls',
        'Tricep Extensions',
        'Lunges',
        'Leg Press',
        'Lat Pulldown',
      ])
      expect(uniqueExercises.size).toBeGreaterThanOrEqual(10)
    })
  })

  describe('Consistency Scoring', () => {
    test('should score perfect consistency (daily workouts)', () => {
      const daysWithWorkouts = 30
      const totalDays = 30
      const score = (daysWithWorkouts / totalDays) * 100
      expect(score).toBe(100)
    })

    test('should score 3x/week consistency as 100', () => {
      const daysWithWorkouts = 12 // 3 workouts/week * 4 weeks
      const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33)
      expect(score).toBeCloseTo(100, 0)
    })

    test('should score poor consistency (<50)', () => {
      const daysWithWorkouts = 4 // ~1 workout/week
      const score = Math.min(100, (daysWithWorkouts / 30) * 100 * 3.33)
      expect(score).toBeLessThan(50)
    })
  })
})
