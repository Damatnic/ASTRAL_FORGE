'use client'

import { useState, useEffect, useCallback } from 'react'
import { AutoregulationSystem } from '@/lib/agents/autoregulation'
import type { PlannedSet, AdjustedSet } from '@/lib/types'

interface Exercise {
  id: string
  name: string
  sets: PlannedSet[]
  restSeconds?: number
}

interface Workout {
  id: string
  name: string
  exercises: Exercise[]
}

interface SessionPlayerProps {
  workout: Workout
  userId: string
  onComplete: () => void
}

export function SessionPlayer({ workout, userId, onComplete }: SessionPlayerProps) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
  const [currentSetIdx, setCurrentSetIdx] = useState(0)
  const [currentWeight, setCurrentWeight] = useState(0)
  const [currentReps, setCurrentReps] = useState(0)
  const [currentRPE, setCurrentRPE] = useState<number | null>(null)
  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null)
  const [completedSets, setCompletedSets] = useState<any[]>([])
  
  // New features
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [lastTimeData, setLastTimeData] = useState<any>({})

  const autoregulation = new AutoregulationSystem()
  const currentExercise = workout.exercises[currentExerciseIdx]
  const currentSet = currentExercise?.sets[currentSetIdx]
  const lastTime = lastTimeData[currentExercise?.id]

  // Load initial weights and last time data
  useEffect(() => {
    if (currentSet) {
      setCurrentWeight(currentSet.weight)
      setCurrentReps(currentSet.reps)
      setCurrentRPE(null)
      setAdjustmentNotice(null)
    }
  }, [currentExerciseIdx, currentSetIdx, currentSet])

  // Load last time data for current exercise
  useEffect(() => {
    if (currentExercise?.id && !lastTimeData[currentExercise.id]) {
      loadLastTimeData(currentExercise.id)
    }
  }, [currentExercise])

  // Rest timer countdown
  useEffect(() => {
    if (isResting && restTimer > 0) {
      const interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false)
            // Play notification sound (optional)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isResting, restTimer])

  const loadLastTimeData = async (exerciseId: string) => {
    try {
      const response = await fetch(`/api/exercises/${exerciseId}/last`)
      if (response.ok) {
        const data = await response.json()
        setLastTimeData((prev: any) => ({ ...prev, [exerciseId]: data }))
      }
    } catch (error) {
      console.error('Failed to load last time data:', error)
    }
  }

  const startRestTimer = useCallback((seconds: number) => {
    setRestTimer(seconds)
    setIsResting(true)
  }, [])

  const skipRest = useCallback(() => {
    setIsResting(false)
    setRestTimer(0)
  }, [])

  const handleSetComplete = async () => {
    if (currentRPE === null) {
      alert('Please rate your RPE before completing the set')
      return
    }

    // Log the set
    const setData = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      setNumber: currentSetIdx + 1,
      weight: currentWeight,
      reps: currentReps,
      rpe: currentRPE,
    }

    setCompletedSets([...completedSets, setData])

    try {
      // Save set to database
      const response = await fetch('/api/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: workout.id,
          exerciseId: currentExercise.id,
          setNumber: currentSetIdx + 1,
          weight: currentWeight,
          reps: currentReps,
          rpe: currentRPE,
        }),
      })

      if (!response.ok) {
        console.error('Failed to save set:', await response.text())
      } else {
        const result = await response.json()
        
        // Show PR notification if achieved
        if (result.achievement) {
          setAdjustmentNotice(`🏆 New PR: ${result.achievement.title}!`)
          setTimeout(() => setAdjustmentNotice(null), 5000)
        }
      }
    } catch (error) {
      console.error('Failed to log set:', error)
      alert('Failed to save set. Please try again.')
      return // Don't proceed if save failed
    }

    // Determine if we should start rest timer
    const isLastSetOfExercise = currentSetIdx >= currentExercise.sets.length - 1
    const isLastExercise = currentExerciseIdx >= workout.exercises.length - 1
    const shouldRest = !isLastSetOfExercise || !isLastExercise

    // Get autoregulation adjustment for next set
    if (currentSetIdx < currentExercise.sets.length - 1) {
      const adjustment: AdjustedSet = await autoregulation.adjustWorkoutInRealtime(
        currentExercise.sets,
        currentSetIdx + 1,
        currentRPE,
        currentReps
      )

      if (adjustment.adjusted && adjustment.note) {
        setAdjustmentNotice(adjustment.note)
        setTimeout(() => setAdjustmentNotice(null), 5000)
      }

      // Start rest timer
      if (shouldRest) {
        const restSeconds = currentExercise.restSeconds || 120
        startRestTimer(restSeconds)
      }

      // Move to next set
      setCurrentSetIdx(currentSetIdx + 1)
      if (adjustment.adjusted) {
        setCurrentWeight(adjustment.weight)
        setCurrentReps(adjustment.reps)
      }
    } else if (currentExerciseIdx < workout.exercises.length - 1) {
      // Start rest timer before next exercise
      if (shouldRest) {
        const restSeconds = currentExercise.restSeconds || 180 // Longer rest between exercises
        startRestTimer(restSeconds)
      }
      
      // Move to next exercise
      setCurrentExerciseIdx(currentExerciseIdx + 1)
      setCurrentSetIdx(0)
    } else {
      // Workout complete!
      onComplete()
    }
  }

  const adjustWeight = (amount: number) => {
    setCurrentWeight(Math.max(0, currentWeight + amount))
  }

  const handleSkipSet = () => {
    if (currentSetIdx < currentExercise.sets.length - 1) {
      setCurrentSetIdx(currentSetIdx + 1)
    } else if (currentExerciseIdx < workout.exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1)
      setCurrentSetIdx(0)
    } else {
      onComplete()
    }
  }

  if (!currentExercise) {
    return <div>Loading...</div>
  }

  const progress = ((currentExerciseIdx * 100) + ((currentSetIdx + 1) / currentExercise.sets.length * 100)) / workout.exercises.length

  return (
    <div className="min-h-screen bg-astral-dark text-white pb-20">
      {/* Header */}
      <div className="bg-astral-gray border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                ← Back
              </a>
              <h2 className="text-sm font-medium text-gray-400">{workout.name}</h2>
            </div>
            <span className="text-sm text-gray-400">
              Exercise {currentExerciseIdx + 1} of {workout.exercises.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-astral-blue to-astral-purple h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Rest Timer (shown when resting) */}
        {isResting && (
          <div className="bg-gradient-to-r from-astral-blue to-astral-purple rounded-xl p-8 text-center animate-pulse">
            <div className="text-7xl font-bold mb-2">
              {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-xl mb-4">Rest Time Remaining</div>
            <button
              onClick={skipRest}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold"
            >
              Skip Rest ⏭️
            </button>
          </div>
        )}

        {/* Adjustment Notice */}
        {adjustmentNotice && (
          <div className="bg-astral-blue/20 border border-astral-blue rounded-lg p-4 animate-slide-up">
            <p className="text-sm text-astral-blue font-medium">⚡ {adjustmentNotice}</p>
          </div>
        )}

        {/* Exercise Info */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{currentExercise.name}</h1>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-astral-blue/20 text-astral-blue rounded-lg text-sm">
              Set {currentSetIdx + 1} of {currentExercise.sets.length}
            </span>
            {lastTime && (
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                Last: {lastTime.weight}kg × {lastTime.reps} @ RPE {lastTime.rpe || '?'}
              </span>
            )}
          </div>
        </div>

        {/* Weight & Reps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Weight (kg)</p>
            <p className="text-5xl font-bold mb-4">{currentWeight}</p>
            <div className="flex gap-2">
              <button
                onClick={() => adjustWeight(-2.5)}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                -2.5
              </button>
              <button
                onClick={() => adjustWeight(-1.25)}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                -1.25
              </button>
              <button
                onClick={() => adjustWeight(1.25)}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                +1.25
              </button>
              <button
                onClick={() => adjustWeight(2.5)}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                +2.5
              </button>
            </div>
          </div>

          <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Reps</p>
            <input
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(Number(e.target.value))}
              className="text-5xl font-bold bg-transparent w-full focus:outline-none mb-4"
              min="0"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                -1
              </button>
              <button
                onClick={() => setCurrentReps(currentReps + 1)}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                +1
              </button>
            </div>
          </div>
        </div>

        {/* RPE Scale */}
        <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
          <label className="block text-sm font-medium text-gray-400 mb-4">
            Rate of Perceived Exertion (RPE)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((val) => {
              const interpretation = autoregulation.interpretRPE(val, currentReps)
              return (
                <button
                  key={val}
                  onClick={() => setCurrentRPE(val)}
                  className={`p-4 rounded-lg transition-all ${
                    currentRPE === val
                      ? 'bg-gradient-to-r from-astral-blue to-astral-purple ring-2 ring-astral-blue'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-2xl font-bold">{val}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {interpretation.rir} {interpretation.rir === 1 ? 'rep' : 'reps'} left
                  </div>
                </button>
              )
            })}
          </div>
          {currentRPE !== null && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                {autoregulation.interpretRPE(currentRPE, currentReps).description}
              </p>
            </div>
          )}
        </div>

        {/* Previous Sets (if any) */}
        {completedSets.filter(s => s.exerciseId === currentExercise.id).length > 0 && (
          <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Previous Sets</h3>
            <div className="space-y-2">
              {completedSets
                .filter(s => s.exerciseId === currentExercise.id)
                .map((set, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400">Set {set.setNumber}</span>
                    <span className="text-white font-medium">
                      {set.weight}kg × {set.reps} @ RPE {set.rpe}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSetComplete}
            disabled={currentRPE === null || isResting}
            className="flex-1 py-4 bg-gradient-to-r from-astral-blue to-astral-purple rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResting ? 'Resting...' : 'Complete Set'}
          </button>
          <button
            onClick={handleSkipSet}
            className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Coaching Feedback */}
        {currentRPE !== null && !isResting && (
          <div className="bg-astral-purple/10 border border-astral-purple/30 rounded-xl p-4">
            <p className="text-sm text-gray-300">
              {autoregulation.analyzeSetPerformance(
                currentSet.weight,
                currentWeight,
                currentSet.reps,
                currentReps,
                currentRPE
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

