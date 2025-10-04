'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [program, setProgram] = useState<any>(null)
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

  const handleStartWorkout = async () => {
    // This program becomes the next workout
    router.push('/workout/session')
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${program?.name || 'this program'}"? This action cannot be undone.`
    )
    
    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`/api/programs/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/programs')
      } else {
        alert('Failed to delete program')
      }
    } catch (error) {
      console.error('Failed to delete program:', error)
      alert('Failed to delete program')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading program...</div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <Link href="/programs" className="text-astral-blue hover:underline">
            Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  const plan = typeof program.plan === 'string' ? JSON.parse(program.plan) : program.plan
  const exercises = plan?.exercises || []

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/programs" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Programs
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{program.name || 'Unnamed Program'}</h1>
              {program.notes && (
                <p className="text-gray-400">{program.notes}</p>
              )}
            </div>
            {!program.completed && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                Active
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
              {exercises.reduce((sum: number, ex: any) => sum + (ex.sets || 0), 0)}
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
                      {exercise.sets} × {exercise.reps || exercise.targetReps || '?'} reps
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

