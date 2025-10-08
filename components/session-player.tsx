'use client'

import { useState, useEffect, useCallback } from 'react'
import { AutoregulationSystem } from '@/lib/agents/autoregulation'
import { PlateCalculator } from '@/components/plate-calculator'
import { ExerciseIntelligence } from '@/lib/exercise-intelligence'
import { WorkoutNotes } from '@/components/workout-notes'
import { SetNotes } from '@/components/set-notes'
import { FailureIndicator } from '@/components/failure-indicator'
import { WarmupToggle } from '@/components/warmup-toggle'
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
  
  // Sprint 4: Enhanced set tracking
  const [setNotes, setSetNotes] = useState('')
  const [isFailure, setIsFailure] = useState(false)
  const [isWarmup, setIsWarmup] = useState(false)
  
  // New features
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [lastTimeData, setLastTimeData] = useState<any>({})
  const [showPlateCalc, setShowPlateCalc] = useState(false)

  const autoregulation = new AutoregulationSystem()
  const intelligence = new ExerciseIntelligence()
  const currentExercise = workout.exercises[currentExerciseIdx]
  const currentSet = currentExercise?.sets[currentSetIdx]
  const lastTime = lastTimeData[currentExercise?.id]
  const technique = currentExercise ? intelligence.getExerciseTechnique(currentExercise.id) : null

  // Load initial weights and last time data
  useEffect(() => {
    if (currentSet) {
      setCurrentWeight(currentSet.weight)
      setCurrentReps(currentSet.reps)
      setCurrentRPE(null)
      setAdjustmentNotice(null)
      // Reset set-specific tracking
      setSetNotes('')
      setIsFailure(false)
      setIsWarmup(currentSetIdx === 0) // Auto-mark first set as potential warmup
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
      notes: setNotes,
      isFailure: isFailure,
      isWarmup: isWarmup,
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
          notes: setNotes,
          isFailure: isFailure,
          isWarmup: isWarmup,
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
      <div className="bg-astral-gray border-b-2 border-neutral-800 p-3 sm:p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/dashboard"
                className="text-neutral-400 hover:text-white transition-colors text-lg sm:text-base touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Back to Dashboard"
              >
                ← <span className="hidden sm:inline ml-1">Back</span>
              </a>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400 truncate">{workout.name}</h2>
            </div>
            <span className="text-xs sm:text-sm text-neutral-400 flex-shrink-0 uppercase tracking-wider font-bold">
              Technique {currentExerciseIdx + 1} of {workout.exercises.length}
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-2 border-2 border-neutral-900">
            <div
              className="bg-amber-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Rest Timer (shown when resting) */}
        {isResting && (
          <div className="bg-gradient-to-r from-astral-blue to-astral-purple rounded-xl p-6 sm:p-8 text-center animate-pulse">
            <div className="text-6xl sm:text-7xl font-bold mb-2 sm:mb-4">
              {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-lg sm:text-xl mb-3 sm:mb-4">Rest Time Remaining</div>
            <button
              onClick={skipRest}
              className="px-5 sm:px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold touch-manipulation min-h-[48px] text-sm sm:text-base"
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{currentExercise.name}</h1>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 sm:px-3 py-1 bg-amber-950/50 text-amber-400 border-2 border-amber-800/50 text-xs sm:text-sm uppercase tracking-wider font-bold">
              Set {currentSetIdx + 1} of {currentExercise.sets.length}
            </span>
            {lastTime && (
              <span className="px-2 sm:px-3 py-1 bg-neutral-900 border-2 border-neutral-800 text-neutral-300 text-xs sm:text-sm uppercase tracking-wider font-bold">
                Last: {lastTime.weight}kg × {lastTime.reps} @ RPE {lastTime.rpe || '?'}
              </span>
            )}
            {technique && (
              <span className={`px-2 sm:px-3 py-1 border-2 text-xs sm:text-sm uppercase tracking-wider font-bold ${
                technique.difficulty === 'beginner' ? 'bg-amber-950/50 border-amber-500 text-amber-400' :
                technique.difficulty === 'intermediate' ? 'bg-amber-950/50 border-amber-600 text-amber-400' :
                'bg-amber-950/50 border-amber-700 text-amber-400'
              }`}>
                {technique.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Form Reminders */}
        {technique && currentSetIdx === 0 && (
          <div className="bg-gradient-to-r from-amber-950/10 to-amber-900/10 border-2 border-amber-700/30 p-3 sm:p-4">
            <h3 className="font-black mb-2 text-amber-400 text-sm sm:text-base uppercase tracking-wider">⚡ Form Reminders</h3>
            <ul className="space-y-1 text-xs sm:text-sm">
              {intelligence.getFormCheckReminders(currentExercise.id).map((reminder, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-amber-400">✓</span>
                  <span className="text-neutral-300 uppercase tracking-wider font-bold">{reminder}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Warning */}
        {technique && (() => {
          const safetyCheck = intelligence.getSafetyCheck(
            currentExercise.id, 
            currentSetIdx + 1, 
            currentRPE || 7
          )
          return safetyCheck ? (
            <div className="bg-amber-950/20 border-2 border-amber-700 p-4">
              <p className="text-sm text-amber-400 uppercase tracking-wider font-bold">{safetyCheck}</p>
            </div>
          ) : null
        })()}

        {/* Weight & Reps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-astral-gray border-2 border-neutral-800 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-neutral-400 uppercase tracking-wider font-bold">Weight (kg)</p>
              <button
                onClick={() => setShowPlateCalc(true)}
                className="text-xs px-2 py-1 bg-amber-950/50 border-2 border-amber-800/50 text-amber-400 hover:bg-amber-900/50 transition-colors touch-manipulation min-h-[32px] uppercase tracking-wider font-bold"
              >
                🏋️ Plates
              </button>
            </div>
            <p className="text-4xl sm:text-5xl font-black mb-3 sm:mb-4">{currentWeight}</p>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              <button
                onClick={() => adjustWeight(-2.5)}
                className="py-3 sm:py-3.5 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base font-bold uppercase tracking-wider"
              >
                -2.5
              </button>
              <button
                onClick={() => adjustWeight(-1.25)}
                className="py-3 sm:py-3.5 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base font-bold uppercase tracking-wider"
              >
                -1.25
              </button>
              <button
                onClick={() => adjustWeight(1.25)}
                className="py-3 sm:py-3.5 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base font-bold uppercase tracking-wider"
              >
                +1.25
              </button>
              <button
                onClick={() => adjustWeight(2.5)}
                className="py-3 sm:py-3.5 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base font-bold uppercase tracking-wider"
              >
                +2.5
              </button>
            </div>
          </div>

          <div className="bg-astral-gray border-2 border-neutral-800 p-4 sm:p-5 md:p-6">
            <p className="text-xs sm:text-sm text-neutral-400 mb-2 uppercase tracking-wider font-bold">Reps</p>
            <input
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(Number(e.target.value))}
              className="text-4xl sm:text-5xl font-black bg-transparent w-full focus:outline-none mb-3 sm:mb-4 touch-manipulation"
              min="0"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                className="py-3 sm:py-3.5 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base font-bold uppercase tracking-wider"
              >
                -1
              </button>
              <button
                onClick={() => setCurrentReps(currentReps + 1)}
                className="py-3 sm:py-3.5 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base font-bold uppercase tracking-wider"
              >
                +1
              </button>
            </div>
          </div>
        </div>

        {/* RPE Scale */}
        <div className="bg-astral-gray border-2 border-neutral-800 p-4 sm:p-5 md:p-6">
          <label className="block text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3 sm:mb-4">
            Rate of Perceived Exertion (RPE)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((val) => {
              const interpretation = autoregulation.interpretRPE(val, currentReps)
              return (
                <button
                  key={val}
                  onClick={() => setCurrentRPE(val)}
                  className={`p-3 sm:p-4 transition-all touch-manipulation min-h-[60px] sm:min-h-[70px] ${
                    currentRPE === val
                      ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400'
                      : 'bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <div className="text-xl sm:text-2xl font-black uppercase tracking-wider">{val}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-400 mt-1 font-bold uppercase tracking-wider">
                    {interpretation.rir} {interpretation.rir === 1 ? 'rep' : 'reps'} left
                  </div>
                </button>
              )
            })}
          </div>
          {currentRPE !== null && (
            <div className="mt-3 sm:mt-4 p-3 bg-neutral-900 border-2 border-neutral-800">
              <p className="text-xs sm:text-sm text-neutral-300 font-bold uppercase tracking-wider">
                {autoregulation.interpretRPE(currentRPE, currentReps).description}
              </p>
            </div>
          )}
        </div>

        {/* Sprint 4: Enhanced Set Tracking */}
        <div className="space-y-4">
          {/* Warmup Toggle */}
          <WarmupToggle
            initialValue={isWarmup}
            onChange={setIsWarmup}
          />

          {/* Failure Indicator (only show if not warmup) */}
          {!isWarmup && (
            <FailureIndicator
              initialValue={isFailure}
              onChange={setIsFailure}
            />
          )}

          {/* Set Notes */}
          <SetNotes
            initialNotes={setNotes}
            onSave={setSetNotes}
            placeholder={`Notes for set ${currentSetIdx + 1}...`}
          />
        </div>

        {/* Previous Sets (if any) */}
        {completedSets.filter(s => s.exerciseId === currentExercise.id).length > 0 && (
          <div className="bg-astral-gray border-2 border-neutral-800 p-4 sm:p-5 md:p-6">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-400 mb-3 uppercase tracking-wider">Previous Sets</h3>
            <div className="space-y-2">
              {completedSets
                .filter(s => s.exerciseId === currentExercise.id)
                .map((set, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs sm:text-sm p-2 bg-neutral-900 border-2 border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 uppercase tracking-wider font-bold">Set {set.setNumber}</span>
                      {set.isWarmup && (
                        <span className="text-xs px-2 py-0.5 bg-amber-950/50 border-2 border-amber-800/50 text-amber-400 uppercase tracking-wider font-bold">Warmup</span>
                      )}
                      {set.isFailure && (
                        <span className="text-xs px-2 py-0.5 bg-amber-950/50 border-2 border-amber-700 text-amber-400 uppercase tracking-wider font-bold">Failure</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold uppercase tracking-wider">
                        {set.weight}kg × {set.reps} @ RPE {set.rpe}
                      </div>
                      {set.notes && (
                        <div className="text-xs text-neutral-400 mt-1 max-w-[200px] truncate">
                          {set.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleSetComplete}
            disabled={currentRPE === null || isResting}
            className="flex-1 py-4 sm:py-4 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 text-base sm:text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[56px] font-black uppercase tracking-wider"
          >
            {isResting ? 'Recovering...' : 'Complete Set'}
          </button>
          <button
            onClick={handleSkipSet}
            className="px-6 py-4 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 transition-colors touch-manipulation min-h-[56px] text-base sm:text-lg font-bold uppercase tracking-wider"
          >
            Skip
          </button>
        </div>

        {/* Coaching Feedback */}
        {currentRPE !== null && !isResting && (
          <div className="bg-astral-purple/10 border border-astral-purple/30 rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-300">
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

        {/* Workout Notes */}
        {workout.id && (
          <WorkoutNotes sessionId={workout.id} />
        )}
      </div>

      {/* Plate Calculator Modal */}
      {showPlateCalc && (
        <PlateCalculator
          targetWeight={currentWeight}
          barWeight={20}
          onClose={() => setShowPlateCalc(false)}
        />
      )}
    </div>
  )
}

