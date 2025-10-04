'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExerciseIntelligence } from '@/lib/exercise-intelligence'
import { ExerciseRating } from '@/components/exercise-rating'
import { ExerciseNotes } from '@/components/exercise-notes'

export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const [exercise, setExercise] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'technique' | 'notes'>('overview')

  // Initialize Exercise Intelligence
  const intelligence = new ExerciseIntelligence()
  const technique = intelligence.getExerciseTechnique(params.id)

  useEffect(() => {
    loadExerciseData()
  }, [params.id])

  const loadExerciseData = async () => {
    try {
      const [exerciseRes, historyRes] = await Promise.all([
        fetch(`/api/exercises/${params.id}`),
        fetch(`/api/exercises/${params.id}/history`),
      ])

      if (exerciseRes.ok) {
        const exerciseData = await exerciseRes.json()
        setExercise(exerciseData)
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setHistory(historyData)
      }
    } catch (error) {
      console.error('Failed to load exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading exercise...</div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Exercise Not Found</h1>
          <Link href="/exercises" className="text-astral-blue hover:underline">
            Back to Exercise Library
          </Link>
        </div>
      </div>
    )
  }

  const bestSet = history.length > 0
    ? history.reduce((best, set) => (set.weight > best.weight ? set : best), history[0])
    : null

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/exercises" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Exercise Library
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {technique ? technique.exerciseName : exercise.name}
          </h1>
          <div className="flex gap-2">
            {technique && (
              <span className={`px-3 py-1 rounded-lg text-sm ${
                technique.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                technique.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {technique.difficulty}
              </span>
            )}
            <span className="px-3 py-1 bg-astral-blue/20 text-astral-blue rounded-lg text-sm">
              {exercise.category}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
              {exercise.muscleGroup}
            </span>
            {exercise.equipment && (
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                {exercise.equipment}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Tab Navigation */}
        {technique && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-2 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Overview & History
              </button>
              <button
                onClick={() => setActiveTab('technique')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'technique'
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Form & Technique
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'notes'
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                📝 My Notes
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            {(exercise.description || technique) && (
              <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-300">{exercise.description}</p>
                {technique && (
                  <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Primary Muscles:</span>
                      <span className="ml-2">{technique.primaryMuscles.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Secondary Muscles:</span>
                      <span className="ml-2">{technique.secondaryMuscles.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Personal Records */}
            {bestSet && (
              <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Your Best</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-astral-blue mb-1">
                      {bestSet.weight}kg
                    </div>
                    <div className="text-sm text-gray-400">Max Weight</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-astral-purple mb-1">
                      {bestSet.reps}
                    </div>
                    <div className="text-sm text-gray-400">Reps</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-astral-blue mb-1">
                      {(bestSet.weight * bestSet.reps).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-400">Volume</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent History */}
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Recent History</h2>
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No history yet for this exercise</p>
                  <p className="text-sm mt-2">Complete a workout to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 10).map((set, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div className="text-sm text-gray-400">
                        {new Date(set.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="font-medium">
                        {set.weight}kg × {set.reps} reps
                      </div>
                      {set.rpe && (
                        <div className="text-sm text-gray-400">RPE {set.rpe}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            {history.length > 0 && (
              <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Times Performed</div>
                    <div className="text-xl font-bold">{history.length} sets</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Total Volume</div>
                    <div className="text-xl font-bold">
                      {history.reduce((sum, set) => sum + set.weight * set.reps, 0).toFixed(0)}kg
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Average Weight</div>
                    <div className="text-xl font-bold">
                      {(history.reduce((sum, set) => sum + set.weight, 0) / history.length).toFixed(1)}kg
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Average Reps</div>
                    <div className="text-xl font-bold">
                      {(history.reduce((sum, set) => sum + set.reps, 0) / history.length).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technique Tab */}
        {activeTab === 'technique' && technique && (
          <div className="space-y-6">
            {/* Quick Form Check */}
            <div className="bg-gradient-to-r from-astral-blue to-astral-purple p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">⚡ Quick Form Check</h3>
              <ul className="space-y-2">
                {intelligence.getFormCheckReminders(params.id).map((reminder, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-white">✓</span>
                    <span className="text-white">{reminder}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercise Info */}
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-astral-blue">Exercise Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="ml-2 capitalize">{technique.category}</span>
                </div>
                <div>
                  <span className="text-gray-400">Difficulty:</span>
                  <span className={`ml-2 capitalize font-medium ${
                    technique.difficulty === 'beginner' ? 'text-green-400' :
                    technique.difficulty === 'intermediate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {technique.difficulty}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Equipment:</span>
                  <span className="ml-2">{technique.equipment.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-400">Breathing:</span>
                  <span className="ml-2">{technique.breathingPattern}</span>
                </div>
                {technique.tempo && (
                  <div>
                    <span className="text-gray-400">Tempo:</span>
                    <span className="ml-2">{technique.tempo}</span>
                  </div>
                )}
                {technique.warmupSets && (
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Warm-up:</span>
                    <span className="ml-2">{technique.warmupSets}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Setup */}
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-astral-blue">Setup</h3>
              <ol className="space-y-2">
                {technique.setup.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-astral-purple font-bold">{idx + 1}.</span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Execution */}
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-astral-blue">Execution</h3>
              <ol className="space-y-2">
                {technique.execution.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-astral-purple font-bold">{idx + 1}.</span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Form Cues */}
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-astral-blue">⚡ Key Form Cues</h3>
              <ul className="space-y-2">
                {technique.formCues.map((cue, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {technique.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-red-400">✕</span>
                    <span className="text-gray-300">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">🛡️ Safety Tips</h3>
              <ul className="space-y-2">
                {technique.safetyTips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-yellow-400">•</span>
                    <span className="text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Variations & Alternatives */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-astral-blue">Variations</h3>
                <ul className="space-y-2">
                  {technique.variations.map((variation, idx) => (
                    <li key={idx} className="text-gray-300">• {variation}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-astral-blue">Alternatives</h3>
                <ul className="space-y-2">
                  {technique.alternatives.map((alternative, idx) => (
                    <li key={idx} className="text-gray-300">• {alternative}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <ExerciseNotes exerciseId={params.id} />
          </div>
        )}
      </div>
    </div>
  )
}