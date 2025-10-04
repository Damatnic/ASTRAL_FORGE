'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast'

interface Template {
  id: string
  name: string
  description: string
  durationMinutes: number
  difficulty: string
  exercises: any[]
  tags: string[]
}

export default function TemplatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [maxDuration, setMaxDuration] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<string>('')

  useEffect(() => {
    loadTemplates()
  }, [maxDuration, difficulty])

  const loadTemplates = async () => {
    try {
      let url = '/api/templates'
      const params = new URLSearchParams()
      if (maxDuration) params.append('duration', maxDuration.toString())
      if (difficulty) params.append('difficulty', difficulty)
      if (params.toString()) url += `?${params.toString()}`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const startWorkout = async (template: Template) => {
    toast('success', `Starting ${template.name}!`)
    // In a real implementation, create a workout session from template
    router.push('/workout/session')
  }

  const getDifficultyColor = (diff: string) => {
    if (diff === 'beginner') return 'text-green-400 bg-green-900/30'
    if (diff === 'intermediate') return 'text-yellow-400 bg-yellow-900/30'
    return 'text-red-400 bg-red-900/30'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading templates...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Quick Workout Templates</h1>
          <p className="text-gray-400">Pre-designed workouts for when you're short on time</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Filters */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Filter Templates</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Max Duration
              </label>
              <select
                value={maxDuration || ''}
                onChange={(e) => setMaxDuration(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              >
                <option value="">Any Duration</option>
                <option value="15">15 minutes or less</option>
                <option value="30">30 minutes or less</option>
                <option value="45">45 minutes or less</option>
                <option value="60">60 minutes or less</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">No Templates Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => {
                setMaxDuration(null)
                setDifficulty('')
              }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-astral-gray border border-gray-800 rounded-xl p-6 hover:border-astral-blue transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{template.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{template.durationMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💪</span>
                    <span>{Array.isArray(template.exercises) ? template.exercises.length : 0} exercises</span>
                  </div>
                </div>

                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => startWorkout(template)}
                  className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Workout
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">⚡ Quick Template Benefits</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Perfect for busy days when you have limited time</li>
            <li>• Pre-planned exercise selection and rep schemes</li>
            <li>• Balanced workouts designed by training principles</li>
            <li>• Start immediately - no planning required</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
