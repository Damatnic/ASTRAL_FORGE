'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ExerciseIntelligence } from '@/lib/exercise-intelligence'

export default function ExerciseSubstitutesPage() {
  const params = useParams()
  const exerciseId = params?.id as string

  const [exercise, setExercise] = useState<any>(null)
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([
    'Barbell',
    'Dumbbells',
    'Bodyweight',
    'Resistance Bands',
    'Kettlebells',
    'Machines'
  ])
  const [substitutes, setSubstitutes] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExercise()
  }, [exerciseId])

  useEffect(() => {
    if (exerciseId) {
      const intelligence = new ExerciseIntelligence()
      const subs = intelligence.getExerciseSubstitutions(exerciseId, availableEquipment)
      setSubstitutes(subs)
    }
  }, [exerciseId, availableEquipment])

  const loadExercise = async () => {
    try {
      const res = await fetch(`/api/exercises/${exerciseId}`)
      if (res.ok) {
        const data = await res.json()
        setExercise(data)
      }
    } catch (error) {
      console.error('Failed to load exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleEquipment = (equipment: string) => {
    setAvailableEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easier':
        return 'text-green-400'
      case 'Same':
        return 'text-blue-400'
      case 'Harder':
        return 'text-orange-400'
      default:
        return 'text-gray-400'
    }
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-green-400'
    if (similarity >= 80) return 'text-blue-400'
    if (similarity >= 70) return 'text-yellow-400'
    return 'text-orange-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading substitutes...</div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">Exercise not found</div>
          <Link href="/exercises" className="text-astral-blue hover:underline">
            Back to Exercises
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href={`/exercises/${exerciseId}`} className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to {exercise.name}
          </Link>
          <h1 className="text-3xl font-bold mb-2">Exercise Substitutions</h1>
          <p className="text-gray-400">Find alternatives based on your available equipment</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Equipment Selector */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">🏋️ What equipment do you have?</h2>
          <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
          <div className="flex flex-wrap gap-3">
            {['Barbell', 'Dumbbells', 'Bodyweight', 'Resistance Bands', 'Kettlebells', 'Machines'].map(equip => (
              <button
                key={equip}
                onClick={() => toggleEquipment(equip)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  availableEquipment.includes(equip)
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {equip}
              </button>
            ))}
          </div>
        </div>

        {/* Original Exercise Info */}
        <div className="bg-gradient-to-br from-astral-blue/10 to-astral-purple/10 border border-astral-blue/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Original Exercise</h2>
          <div className="text-2xl font-bold mb-2">{exercise.name}</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-astral-blue/20 text-astral-blue rounded-full text-sm">
              {exercise.muscleGroup}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              {exercise.category}
            </span>
            {exercise.equipment && (
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                {exercise.equipment}
              </span>
            )}
          </div>
        </div>

        {/* Substitutes */}
        {substitutes && substitutes.substitutes.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              📋 Found {substitutes.substitutes.length} Substitute{substitutes.substitutes.length !== 1 ? 's' : ''}
            </h2>
            <div className="space-y-4">
              {substitutes.substitutes.map((sub: any, index: number) => (
                <div
                  key={index}
                  className="bg-astral-gray border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{sub.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {sub.equipment}
                        </span>
                        <span className={`px-3 py-1 bg-gray-700 rounded-full text-sm ${getDifficultyColor(sub.difficulty)}`}>
                          {sub.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getSimilarityColor(sub.musclesSimilarity)}`}>
                        {sub.musclesSimilarity}%
                      </div>
                      <div className="text-xs text-gray-400">Similarity</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-300 mb-2 font-medium">💡 Notes:</div>
                    <p className="text-gray-300">{sub.notes}</p>
                  </div>

                  {/* Similarity breakdown */}
                  <div className="mt-4">
                    <div className="text-xs text-gray-400 mb-2">Muscle Activation Match</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          sub.musclesSimilarity >= 90
                            ? 'bg-green-500'
                            : sub.musclesSimilarity >= 80
                            ? 'bg-blue-500'
                            : sub.musclesSimilarity >= 70
                            ? 'bg-yellow-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${sub.musclesSimilarity}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🤷</div>
            <h3 className="text-xl font-bold mb-2">No Substitutes Found</h3>
            <p className="text-gray-300 mb-4">
              Try selecting more equipment options above, or this exercise may not have programmed substitutions yet.
            </p>
            <Link
              href="/exercises"
              className="inline-block px-6 py-3 bg-astral-blue rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse All Exercises
            </Link>
          </div>
        )}

        {/* General Tips */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">💪 Substitution Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Match muscle groups:</strong> Choose exercises that work the same primary muscles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Adjust volume:</strong> If using an easier variation, increase sets or reps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Progress gradually:</strong> Start conservative with new exercises</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Track performance:</strong> Monitor if substitutes are working for you</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
