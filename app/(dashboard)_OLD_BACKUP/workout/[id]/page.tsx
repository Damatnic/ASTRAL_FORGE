'use client'

/**
 * Workout Session Interface
 * In-workout real-time tracking with rest timer, RPE, and progress validation
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Stack, Card, Inline } from '@/components/ui/layout'
import {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Mic,
  Plus,
  Minus,
  AlertCircle,
  Trophy,
  Flame,
} from 'lucide-react'

// Mock workout data
const mockWorkout = {
  id: 1,
  programName: 'Starting Strength',
  workoutName: 'Workout A - Week 1',
  exercises: [
    {
      id: 1,
      name: 'Barbell Squat',
      sets: [
        { setNumber: 1, targetReps: 5, completedReps: 0, weight: 135, rpe: 0, completed: false },
        { setNumber: 2, targetReps: 5, completedReps: 0, weight: 135, rpe: 0, completed: false },
        { setNumber: 3, targetReps: 5, completedReps: 0, weight: 135, rpe: 0, completed: false },
      ],
      notes: '',
    },
    {
      id: 2,
      name: 'Bench Press',
      sets: [
        { setNumber: 1, targetReps: 5, completedReps: 0, weight: 95, rpe: 0, completed: false },
        { setNumber: 2, targetReps: 5, completedReps: 0, weight: 95, rpe: 0, completed: false },
        { setNumber: 3, targetReps: 5, completedReps: 0, weight: 95, rpe: 0, completed: false },
      ],
      notes: '',
    },
    {
      id: 3,
      name: 'Deadlift',
      sets: [
        { setNumber: 1, targetReps: 5, completedReps: 0, weight: 185, rpe: 0, completed: false },
      ],
      notes: '',
    },
  ],
}

export default function WorkoutSessionPage() {
  const router = useRouter()
  const [workout, setWorkout] = useState(mockWorkout)
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
  const [currentSetIdx, setCurrentSetIdx] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [startTime] = useState(new Date())
  const [elapsedTime, setElapsedTime] = useState(0)

  const currentExercise = workout.exercises[currentExerciseIdx]
  const currentSet = currentExercise.sets[currentSetIdx]

  // Elapsed time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  // Rest timer countdown
  useEffect(() => {
    if (isResting && restTimer > 0) {
      const interval = setInterval(() => {
        setRestTimer(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(interval)
    } else if (restTimer === 0) {
      setIsResting(false)
    }
  }, [isResting, restTimer])

  const handleCompleteSet = () => {
    const updatedExercises = [...workout.exercises]
    updatedExercises[currentExerciseIdx].sets[currentSetIdx].completed = true
    setWorkout({ ...workout, exercises: updatedExercises })

    // Move to next set or exercise
    if (currentSetIdx < currentExercise.sets.length - 1) {
      setCurrentSetIdx(currentSetIdx + 1)
      // Start rest timer (90 seconds default)
      setRestTimer(90)
      setIsResting(true)
    } else if (currentExerciseIdx < workout.exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1)
      setCurrentSetIdx(0)
      setRestTimer(120) // Longer rest between exercises
      setIsResting(true)
    }
  }

  const updateSetReps = (delta: number) => {
    const updatedExercises = [...workout.exercises]
    const currentReps = updatedExercises[currentExerciseIdx].sets[currentSetIdx].completedReps
    updatedExercises[currentExerciseIdx].sets[currentSetIdx].completedReps = Math.max(0, currentReps + delta)
    setWorkout({ ...workout, exercises: updatedExercises })
  }

  const updateSetWeight = (delta: number) => {
    const updatedExercises = [...workout.exercises]
    const currentWeight = updatedExercises[currentExerciseIdx].sets[currentSetIdx].weight
    updatedExercises[currentExerciseIdx].sets[currentSetIdx].weight = Math.max(0, currentWeight + delta)
    setWorkout({ ...workout, exercises: updatedExercises })
  }

  const updateSetRPE = (rpe: number) => {
    const updatedExercises = [...workout.exercises]
    updatedExercises[currentExerciseIdx].sets[currentSetIdx].rpe = rpe
    setWorkout({ ...workout, exercises: updatedExercises })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isWorkoutComplete = workout.exercises.every(ex => 
    ex.sets.every(set => set.completed)
  )

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  const completedSets = workout.exercises.reduce((sum, ex) => 
    sum + ex.sets.filter(set => set.completed).length, 0
  )

  return (
    <div className="min-h-screen bg-astral-dark pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-astral-gray/95 backdrop-blur-sm border-b border-astral-light">
        <Container size="2xl">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="p-2 hover:bg-astral-light rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="text-center">
              <h2 className="text-heading-sm text-white">{workout.workoutName}</h2>
              <p className="text-body-sm text-gray-400">{formatTime(elapsedTime)}</p>
            </div>

            <button
              onClick={() => router.push('/workout/summary')}
              disabled={!isWorkoutComplete}
              className="px-4 py-2 bg-success rounded-lg text-white text-body-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Finish
            </button>
          </div>
        </Container>
      </div>

      <Container size="2xl" className="py-6">
        <Stack spacing="lg">
          {/* Progress Overview */}
          <Card padding="md" variant="bordered">
            <Stack spacing="sm">
              <Inline justify="between" align="center">
                <span className="text-body-sm text-gray-400">Workout Progress</span>
                <span className="text-body-sm text-white font-medium">
                  {completedSets}/{totalSets} sets
                </span>
              </Inline>
              <div className="h-2 bg-astral-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-astral-blue to-astral-purple transition-all"
                  style={{ width: `${(completedSets / totalSets) * 100}%` }}
                />
              </div>
            </Stack>
          </Card>

          {/* Rest Timer */}
          {isResting && (
            <Card padding="lg" variant="elevated" className="bg-gradient-to-r from-astral-blue/20 to-astral-purple/20">
              <Stack spacing="md" align="center">
                <div className="text-display-md text-white font-mono">
                  {formatTime(restTimer)}
                </div>
                <p className="text-body-md text-gray-300">Rest Period</p>
                <Inline spacing="sm">
                  <button
                    onClick={() => setRestTimer(prev => prev + 30)}
                    className="px-4 py-2 bg-astral-gray rounded-lg text-white hover:bg-astral-light transition-colors"
                  >
                    +30s
                  </button>
                  <button
                    onClick={() => {
                      setIsResting(false)
                      setRestTimer(0)
                    }}
                    className="px-6 py-2 bg-white text-astral-dark rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Skip Rest
                  </button>
                </Inline>
              </Stack>
            </Card>
          )}

          {/* Current Exercise */}
          <Card padding="lg" variant="elevated">
            <Stack spacing="lg">
              {/* Exercise Header */}
              <div>
                <Inline justify="between" align="center" className="mb-2">
                  <h3 className="text-heading-lg text-white">{currentExercise.name}</h3>
                  <span className="px-3 py-1 bg-astral-light rounded-full text-body-sm text-gray-400">
                    Exercise {currentExerciseIdx + 1}/{workout.exercises.length}
                  </span>
                </Inline>
                <p className="text-body-md text-gray-400">
                  Set {currentSetIdx + 1} of {currentExercise.sets.length}
                </p>
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-body-sm text-gray-400 mb-2">Weight (lbs)</label>
                <Inline spacing="sm" align="center">
                  <button
                    onClick={() => updateSetWeight(-5)}
                    className="p-3 bg-astral-gray rounded-lg hover:bg-astral-light transition-colors"
                  >
                    <Minus className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-display-sm text-white font-bold">
                      {currentSet.weight}
                    </span>
                  </div>
                  <button
                    onClick={() => updateSetWeight(5)}
                    className="p-3 bg-astral-gray rounded-lg hover:bg-astral-light transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </Inline>
              </div>

              {/* Reps Input */}
              <div>
                <label className="block text-body-sm text-gray-400 mb-2">
                  Reps (Target: {currentSet.targetReps})
                </label>
                <Inline spacing="sm" align="center">
                  <button
                    onClick={() => updateSetReps(-1)}
                    className="p-3 bg-astral-gray rounded-lg hover:bg-astral-light transition-colors"
                  >
                    <Minus className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-display-sm text-white font-bold">
                      {currentSet.completedReps}
                    </span>
                  </div>
                  <button
                    onClick={() => updateSetReps(1)}
                    className="p-3 bg-astral-gray rounded-lg hover:bg-astral-light transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </Inline>
              </div>

              {/* RPE Selection */}
              <div>
                <label className="block text-body-sm text-gray-400 mb-2">
                  Rate of Perceived Exertion (RPE)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[6, 7, 8, 9, 10].map((rpe) => (
                    <button
                      key={rpe}
                      onClick={() => updateSetRPE(rpe)}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        currentSet.rpe === rpe
                          ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                          : 'bg-astral-gray text-gray-400 hover:bg-astral-light'
                      }`}
                    >
                      {rpe}
                    </button>
                  ))}
                </div>
                <p className="text-body-xs text-gray-500 mt-2">
                  6 = Very Easy • 10 = Maximum Effort
                </p>
              </div>

              {/* Complete Set Button */}
              <button
                onClick={handleCompleteSet}
                disabled={currentSet.completedReps === 0}
                className="w-full py-4 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg text-white font-medium text-heading-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-6 h-6" />
                Complete Set
              </button>
            </Stack>
          </Card>

          {/* All Sets Overview */}
          <div>
            <h4 className="text-heading-md text-white mb-4">All Exercises</h4>
            <Stack spacing="sm">
              {workout.exercises.map((exercise, exIdx) => (
                <Card key={exercise.id} padding="md" variant="bordered">
                  <Stack spacing="sm">
                    <Inline justify="between" align="center">
                      <h5 className="text-heading-sm text-white">{exercise.name}</h5>
                      <span className="text-body-sm text-gray-400">
                        {exercise.sets.filter(s => s.completed).length}/{exercise.sets.length} sets
                      </span>
                    </Inline>
                    <div className="grid grid-cols-1 gap-1">
                      {exercise.sets.map((set, setIdx) => (
                        <div
                          key={setIdx}
                          className={`p-2 rounded text-body-sm ${
                            set.completed
                              ? 'bg-success/20 text-success'
                              : exIdx === currentExerciseIdx && setIdx === currentSetIdx
                              ? 'bg-astral-blue/20 text-astral-blue'
                              : 'bg-astral-dark text-gray-400'
                          }`}
                        >
                          <Inline justify="between">
                            <span>Set {set.setNumber}</span>
                            <span>
                              {set.completed ? `${set.completedReps} reps × ${set.weight} lbs` : `${set.targetReps} reps target`}
                            </span>
                          </Inline>
                        </div>
                      ))}
                    </div>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </div>
        </Stack>
      </Container>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <Card padding="lg" className="max-w-md w-full">
            <Stack spacing="lg">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div className="text-center">
                <h3 className="text-heading-lg text-white mb-2">Exit Workout?</h3>
                <p className="text-body-md text-gray-400">
                  Your progress will be lost if you exit now. Are you sure?
                </p>
              </div>
              <Inline spacing="sm" className="mt-4">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 bg-astral-gray rounded-lg text-white hover:bg-astral-light transition-colors"
                >
                  Continue Workout
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 bg-error rounded-lg text-white hover:bg-red-600 transition-colors"
                >
                  Exit
                </button>
              </Inline>
            </Stack>
          </Card>
        </div>
      )}
    </div>
  )
}
