'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/toast'

interface ProgramExercise {
  id: string
  exerciseId: string
  dayOfWeek: number
  weekNumber: number | null
  orderIndex: number
  sets: number
  repsMin: number | null
  repsMax: number | null
  repsTarget: number | null
  weightPct: number | null
  rpe: number | null
  restSeconds: number | null
  notes: string | null
}

interface WorkoutProgram {
  id: string
  name: string
  description: string | null
  category: string
  difficulty: string
  daysPerWeek: number
  weeksTotal: number | null
  progressionType: string
  trainingMaxPct: number | null
  deloadWeek: number | null
  isActive: boolean
  isPublic: boolean
  tags: string[]
  exercises: ProgramExercise[]
  createdAt: string
  updatedAt: string
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [program, setProgram] = useState<WorkoutProgram | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgram()
  }, [params.id])

  const loadProgram = async () => {
    try {
      const response = await fetch(`/api/programs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProgram(data)
      }
    } catch (error) {
      console.error('Failed to load program:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!program) return

    try {
      const response = await fetch(`/api/programs/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !program.isActive }),
      })

      if (response.ok) {
        const updated = await response.json()
        setProgram(updated)
        success(updated.isActive ? 'Program activated!' : 'Program deactivated')
      } else {
        showError('Failed to update program')
      }
    } catch (error: any) {
      console.error('Failed to toggle program:', error)
      showError('Failed to update program')
    }
  }

  const handleStartWorkout = () => {
    // Navigate to workout session with this program
    router.push(`/workout/session?programId=${params.id}`)
  }

  const handleDelete = async () => {
    if (!program) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${program.name}"? This action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      const response = await fetch(`/api/programs/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        success('Program deleted successfully')
        setTimeout(() => router.push('/programs'), 1000)
      } else {
        showError('Failed to delete program')
      }
    } catch (err: any) {
      console.error('Failed to delete program:', err)
      showError('Failed to delete program')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading program...</div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <Link href="/programs" className="text-purple-400 hover:text-purple-300 transition">
            ← Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  // Group exercises by day of week
  const exercisesByDay = program.exercises.reduce((acc, exercise) => {
    if (!acc[exercise.dayOfWeek]) {
      acc[exercise.dayOfWeek] = []
    }
    acc[exercise.dayOfWeek].push(exercise)
    return acc
  }, {} as Record<number, ProgramExercise[]>)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-purple-500/20 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/programs" className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2 transition">
            <span>←</span> Back to Programs
          </Link>
          <div className="flex items-start justify-between mt-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {program.name}
                </h1>
                {program.isActive && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                    ✓ Active
                  </span>
                )}
              </div>
              {program.description && (
                <p className="text-gray-400 text-lg">{program.description}</p>
              )}
            </div>
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="text-sm text-gray-400">Category</div>
              <div className="text-lg font-bold text-purple-400 capitalize">{program.category}</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="text-sm text-gray-400">Difficulty</div>
              <div className="text-lg font-bold text-blue-400 capitalize">{program.difficulty}</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-sm text-gray-400">Days/Week</div>
              <div className="text-lg font-bold text-green-400">{program.daysPerWeek}</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="text-sm text-gray-400">Progression</div>
              <div className="text-lg font-bold text-amber-400 capitalize">{program.progressionType.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Tags */}
          {program.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {program.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleStartWorkout}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg font-semibold transition shadow-lg shadow-purple-500/20"
            >
              🚀 Start Workout
            </button>
            <button
              onClick={handleActivate}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                program.isActive
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              {program.isActive ? 'Deactivate' : 'Set as Active'}
            </button>
            <Link
              href={`/programs/${params.id}/edit`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
            >
              ✏️ Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </header>

      {/* Workout Days */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Workout Schedule</h2>
        
        <div className="space-y-6">
          {Object.entries(exercisesByDay)
            .sort(([dayA], [dayB]) => Number(dayA) - Number(dayB))
            .map(([day, exercises]) => (
              <div key={day} className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-400">
                  {DAYS_OF_WEEK[Number(day) - 1]}
                </h3>
                
                <div className="space-y-3">
                  {exercises.map((exercise, idx) => (
                    <div
                      key={exercise.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500/30 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 font-mono">#{idx + 1}</span>
                            <h4 className="font-semibold text-lg capitalize">
                              {exercise.exerciseId.replace(/-/g, ' ')}
                            </h4>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="text-blue-400">
                              {exercise.sets} sets
                            </span>
                            {exercise.repsTarget ? (
                              <span className="text-green-400">
                                {exercise.repsTarget} reps
                              </span>
                            ) : (
                              <span className="text-green-400">
                                {exercise.repsMin}-{exercise.repsMax} reps
                              </span>
                            )}
                            {exercise.weightPct && (
                              <span className="text-amber-400">
                                {(exercise.weightPct * 100).toFixed(0)}% TM
                              </span>
                            )}
                            {exercise.rpe && (
                              <span className="text-purple-400">
                                RPE {exercise.rpe}
                              </span>
                            )}
                            {exercise.restSeconds && (
                              <span className="text-gray-400">
                                Rest: {Math.floor(exercise.restSeconds / 60)}:{(exercise.restSeconds % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>

                          {exercise.notes && (
                            <p className="mt-2 text-sm text-gray-400 italic">
                              💡 {exercise.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Program Info */}
        {(program.trainingMaxPct || program.deloadWeek || program.weeksTotal) && (
          <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Program Details</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {program.trainingMaxPct && (
                <div>
                  <span className="text-gray-400">Training Max:</span>
                  <span className="ml-2 text-purple-400 font-semibold">
                    {(program.trainingMaxPct * 100).toFixed(0)}% of 1RM
                  </span>
                </div>
              )}
              {program.deloadWeek && (
                <div>
                  <span className="text-gray-400">Deload Week:</span>
                  <span className="ml-2 text-blue-400 font-semibold">
                    Every {program.deloadWeek} weeks
                  </span>
                </div>
              )}
              {program.weeksTotal && (
                <div>
                  <span className="text-gray-400">Program Length:</span>
                  <span className="ml-2 text-green-400 font-semibold">
                    {program.weeksTotal} weeks
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Program Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-astral-blue mb-1">
              {exercises.length}
            </div>
            <div className="text-sm text-gray-400">Exercises</div>
          </div>
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-astral-purple mb-1">
              {exercises.reduce((sum: number, ex: any) => sum + (Array.isArray(ex.sets) ? ex.sets.length : (ex.sets || 0)), 0)}
            </div>
            <div className="text-sm text-gray-400">Total Sets</div>
          </div>
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-astral-blue mb-1">
              ~{exercises.length * 10}
            </div>
            <div className="text-sm text-gray-400">Minutes</div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Exercises</h2>
          <div className="space-y-3">
            {exercises.map((exercise: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-astral-blue/20 text-astral-blue rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-400">
                      {Array.isArray(exercise.sets) ? exercise.sets.length : exercise.sets} × {exercise.reps || exercise.targetReps || (Array.isArray(exercise.sets) && exercise.sets[0] ? exercise.sets[0].reps : '?')} reps
                      {exercise.targetRPE && ` @ RPE ${exercise.targetRPE}`}
                    </div>
                  </div>
                </div>
                {exercise.restSeconds && (
                  <div className="text-sm text-gray-400">
                    Rest: {exercise.restSeconds}s
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleStartWorkout}
            className="flex-1 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start This Workout
          </button>
          <Link
            href={`/programs/${params.id}/edit`}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-900/50 text-red-400 hover:bg-red-900 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

