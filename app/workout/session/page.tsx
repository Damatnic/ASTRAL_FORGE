'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SessionPlayer } from '@/components/session-player'

export default function WorkoutSession() {
  const router = useRouter()
  const [workoutComplete, setWorkoutComplete] = useState(false)
  const [workout, setWorkout] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch REAL workout from database
  useEffect(() => {
    async function loadWorkout() {
      try {
        const response = await fetch('/api/workout/next')
        
        if (!response.ok) {
          const data = await response.json()
          setError(data.message || 'No workout found')
          setLoading(false)
          return
        }

        const data = await response.json()
        
        // Parse the workout plan and prepare it for the session player
        const plan = typeof data.plan === 'string' ? JSON.parse(data.plan) : data.plan
        
        if (!plan || !plan.exercises) {
          setError('Invalid workout format')
          setLoading(false)
          return
        }

        // Transform to expected format
        const formattedWorkout = {
          id: data.id,
          name: data.name || 'Workout',
          exercises: plan.exercises.map((ex: any) => ({
            id: ex.id,
            name: ex.name,
            sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: ex.weight || 0,
              reps: ex.reps || 10,
              targetRPE: ex.targetRPE || 7.5,
            })),
          })),
        }

        setWorkout(formattedWorkout)
        setLoading(false)
      } catch (err) {
        console.error('Error loading workout:', err)
        setError('Failed to load workout')
        setLoading(false)
      }
    }

    loadWorkout()
  }, [])

  const handleWorkoutComplete = async () => {
    if (!workout) return

    try {
      // Mark workout as complete
      const response = await fetch(`/api/sessions/${workout.id}/complete`, {
        method: 'POST',
      })

      if (response.ok) {
        setWorkoutComplete(true)
        
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh() // Refresh to show updated stats
        }, 3000)
      }
    } catch (err) {
      console.error('Error completing workout:', err)
      // Still redirect even if API call fails
      setWorkoutComplete(true)
      setTimeout(() => router.push('/dashboard'), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block w-16 h-16 border-4 border-astral-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading your workout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold text-white">No Workout Found</h1>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-astral-blue rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (workoutComplete) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center p-6">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-8xl">🎉</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-astral-blue to-astral-purple bg-clip-text text-transparent">
            Workout Complete!
          </h1>
          <p className="text-xl text-gray-400">
            Great job! Updating your streak...
          </p>
          <div className="inline-block w-16 h-16 border-4 border-astral-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!workout) {
    return null
  }

  return (
    <SessionPlayer
      workout={workout}
      userId="demo-user-id"
      onComplete={handleWorkoutComplete}
    />
  )
}

