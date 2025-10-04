'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrainingHeatmap } from '@/components/training-heatmap'

export default function AnalyticsPage() {
  const [rpeTrends, setRpeTrends] = useState<any[]>([])
  const [durationTrends, setDurationTrends] = useState<any[]>([])
  const [exercises, setExercises] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'heatmap' | 'rpe' | 'duration'>('heatmap')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedExercise) {
      loadRPETrends(selectedExercise)
    }
  }, [selectedExercise])

  const loadData = async () => {
    try {
      const [exercisesRes, durationRes, rpeRes] = await Promise.all([
        fetch('/api/exercises'),
        fetch('/api/progress/duration-trends?days=30'),
        fetch('/api/progress/rpe-trends?days=30'),
      ])

      if (exercisesRes.ok) {
        const exs = await exercisesRes.json()
        setExercises(exs)
        if (exs.length > 0) {
          setSelectedExercise(exs[0].id)
        }
      }

      if (durationRes.ok) {
        const dur = await durationRes.json()
        setDurationTrends(dur)
      }

      if (rpeRes.ok) {
        const rpe = await rpeRes.json()
        setRpeTrends(rpe)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRPETrends = async (exerciseId: string) => {
    try {
      const res = await fetch(`/api/progress/rpe-trends?exerciseId=${exerciseId}&days=30`)
      if (res.ok) {
        const data = await res.json()
        setRpeTrends(data)
      }
    } catch (error) {
      console.error('Failed to load RPE trends:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/progress" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Progress
          </Link>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-400 mt-2">Deep dive into your training patterns</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Tab Navigation */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'heatmap'
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              📅 Training Frequency
            </button>
            <button
              onClick={() => setActiveTab('rpe')}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'rpe'
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              💪 RPE Trends
            </button>
            <button
              onClick={() => setActiveTab('duration')}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'duration'
                  ? 'bg-gradient-to-r from-astral-blue to-astral-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              ⏱️ Duration Trends
            </button>
          </div>
        </div>

        {/* Training Frequency Heatmap */}
        {activeTab === 'heatmap' && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <TrainingHeatmap />
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">💡 Insights</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Consistency is key - aim for 3-5 workouts per week</li>
                <li>• Rest days are crucial for recovery and growth</li>
                <li>• Dark green days = peak training volume</li>
                <li>• Watch for overtraining: too many consecutive dark greens</li>
              </ul>
            </div>
          </div>
        )}

        {/* RPE Trends */}
        {activeTab === 'rpe' && (
          <div className="space-y-6">
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">RPE Trends</h2>
                {exercises.length > 0 && (
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  >
                    <option value="">All Exercises</option>
                    {exercises.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {rpeTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rpeTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9CA3AF" domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgRPE" 
                      stroke="#8B5CF6" 
                      name="Average RPE"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No RPE data yet. Start logging your RPE during workouts!
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {rpeTrends.length > 0 && (
                  <>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-400">
                        {(rpeTrends.reduce((sum, d) => sum + d.avgRPE, 0) / rpeTrends.length).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Avg RPE</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-400">
                        {Math.max(...rpeTrends.map(d => d.maxWeight))}kg
                      </div>
                      <div className="text-xs text-gray-400">Peak Weight</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">
                        {rpeTrends.reduce((sum, d) => sum + d.totalReps, 0)}
                      </div>
                      <div className="text-xs text-gray-400">Total Reps</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-orange-400">
                        {rpeTrends.reduce((sum, d) => sum + d.sets, 0)}
                      </div>
                      <div className="text-xs text-gray-400">Total Sets</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">📊 RPE Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">6-7:</span>
                  <span className="text-gray-300">Light work, easy recovery</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">7-8:</span>
                  <span className="text-gray-300">Moderate, sustainable effort</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">8-9:</span>
                  <span className="text-gray-300">Hard, near-failure training</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">9-10:</span>
                  <span className="text-gray-300">Maximal effort, use sparingly</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Duration Trends */}
        {activeTab === 'duration' && (
          <div className="space-y-6">
            <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Workout Duration Trends</h2>

              {durationTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={durationTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Bar dataKey="duration" fill="#3B82F6" name="Duration (min)" />
                    <Line 
                      type="monotone" 
                      dataKey="movingAvg" 
                      stroke="#8B5CF6" 
                      name="3-day avg"
                      strokeWidth={2}
                      dot={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No duration data yet. Complete some workouts!
                </div>
              )}

              {durationTrends.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-400">
                      {Math.round(durationTrends.reduce((sum, d) => sum + d.duration, 0) / durationTrends.length)}
                    </div>
                    <div className="text-xs text-gray-400">Avg Duration (min)</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.max(...durationTrends.map(d => d.duration))}
                    </div>
                    <div className="text-xs text-gray-400">Longest (min)</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-400">
                      {Math.round(durationTrends.reduce((sum, d) => sum + d.volume, 0) / durationTrends.length)}
                    </div>
                    <div className="text-xs text-gray-400">Avg Volume (kg)</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-400">
                      {Math.round(durationTrends.reduce((sum, d) => sum + d.sets, 0) / durationTrends.length)}
                    </div>
                    <div className="text-xs text-gray-400">Avg Sets</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">⏱️ Duration Tips</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Optimal workout: 45-90 minutes for most goals</li>
                <li>• Shorter workouts (30-45min) work great for maintenance</li>
                <li>• Longer workouts (90+min) = watch for fatigue accumulation</li>
                <li>• Consistency > duration - better to do 45min regularly than 2hr sporadically</li>
              </ul>
            </div>
          </div>
        )}

        {/* Quick Link to Photo Progress */}
        <Link
          href="/progress/photos"
          className="block bg-gradient-to-r from-astral-blue to-astral-purple rounded-xl p-6 hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">📸 Progress Photos</h3>
              <p className="text-gray-200">Track your transformation visually</p>
            </div>
            <span className="text-4xl">→</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
