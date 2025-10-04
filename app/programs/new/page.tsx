'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProgramPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [exercises, setExercises] = useState<any[]>([])
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      if (response.ok) {
        const data = await response.json()
        setExercises(data)
      }
    } catch (error) {
      console.error('Failed to load exercises:', error)
    }
  }

  const addExercise = (exercise: any) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: 3,
        reps: 10,
        targetRPE: 7.5,
        restSeconds: 90,
        order: selectedExercises.length,
      },
    ])
  }

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: string, value: any) => {
    const updated = [...selectedExercises]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedExercises(updated)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a program name')
      return
    }

    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          exercises: selectedExercises,
          active: true,
        }),
      })

      if (response.ok) {
        router.push('/programs')
      } else {
        alert('Failed to save program')
      }
    } catch (error) {
      console.error('Failed to save program:', error)
      alert('Failed to save program')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/programs" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Programs
          </Link>
          <h1 className="text-3xl font-bold">Create New Program</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Program Details */}
          <div className="space-y-6">
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Program Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Program Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Push Day, Pull Day, Legs"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your program..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
                  />
                </div>
              </div>
            </div>

            {/* Exercise Library */}
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Exercise Library</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => addExercise(exercise)}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-400">
                      {exercise.muscleGroup} • {exercise.equipment}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Exercises */}
          <div>
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Program Exercises ({selectedExercises.length})</h2>

              {selectedExercises.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No exercises added yet</p>
                  <p className="text-sm mt-2">Select exercises from the library</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedExercises.map((exercise, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="font-medium">{exercise.exerciseName}</div>
                        <button
                          onClick={() => removeExercise(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Sets</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                            min="1"
                            className="w-full px-3 py-2 bg-gray-600 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Reps</label>
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                            min="1"
                            className="w-full px-3 py-2 bg-gray-600 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Target RPE</label>
                          <input
                            type="number"
                            value={exercise.targetRPE}
                            onChange={(e) => updateExercise(index, 'targetRPE', parseFloat(e.target.value))}
                            min="6"
                            max="10"
                            step="0.5"
                            className="w-full px-3 py-2 bg-gray-600 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Rest (sec)</label>
                          <input
                            type="number"
                            value={exercise.restSeconds}
                            onChange={(e) => updateExercise(index, 'restSeconds', parseInt(e.target.value))}
                            min="0"
                            step="15"
                            className="w-full px-3 py-2 bg-gray-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim() || selectedExercises.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Program'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

