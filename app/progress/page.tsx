'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ProgressPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [volumeData, setVolumeData] = useState<any[]>([])
  const [exercises, setExercises] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [strengthData, setStrengthData] = useState<any[]>([])
  const [muscleVolumeData, setMuscleVolumeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgressData()
  }, [])

  useEffect(() => {
    if (selectedExercise) {
      loadStrengthData(selectedExercise)
    }
  }, [selectedExercise])

  const loadProgressData = async () => {
    try {
      const [statsRes, sessionsRes, volumeRes, exercisesRes, muscleVolumeRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/sessions?limit=10'),
        fetch('/api/progress/volume'),
        fetch('/api/exercises'),
        fetch('/api/progress/muscle-volume'),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setRecentSessions(sessionsData)
      }

      if (volumeRes.ok) {
        const volume = await volumeRes.json()
        setVolumeData(volume)
      }

      if (exercisesRes.ok) {
        const exs = await exercisesRes.json()
        setExercises(exs)
        if (exs.length > 0) {
          setSelectedExercise(exs[0].id)
        }
      }

      if (muscleVolumeRes.ok) {
        const muscleData = await muscleVolumeRes.json()
        setMuscleVolumeData(muscleData)
      }
    } catch (error) {
      console.error('Failed to load progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStrengthData = async (exerciseId: string) => {
    try {
      const response = await fetch(`/api/progress/strength?exerciseId=${exerciseId}`)
      if (response.ok) {
        const data = await response.json()
        setStrengthData(data)
      }
    } catch (error) {
      console.error('Failed to load strength data:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading progress...</div>
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
          <h1 className="text-3xl font-bold">Your Progress</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <div className="text-4xl font-bold text-astral-blue mb-2">
              {stats?.totalWorkouts || 0}
            </div>
            <div className="text-sm text-gray-400">Total Workouts</div>
          </div>

          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <div className="text-4xl font-bold text-astral-purple mb-2">
              {stats?.totalVolume || '0'}k
            </div>
            <div className="text-sm text-gray-400">Total Volume (kg)</div>
          </div>

          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <div className="text-4xl font-bold text-astral-blue mb-2">
              {stats?.prs || 0}
            </div>
            <div className="text-sm text-gray-400">Personal Records</div>
          </div>

          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <div className="text-4xl font-bold text-astral-purple mb-2">
              {recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0)}
            </div>
            <div className="text-sm text-gray-400">Total Minutes</div>
          </div>
        </div>

        {/* Volume Over Time Chart */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Volume Over Time (Last 30 Days)</h2>
          {volumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
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
                <Bar dataKey="volume" fill="#3B82F6" name="Volume (kg)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No workout data yet. Complete some workouts to see your volume progress!
            </div>
          )}
        </div>

        {/* Muscle Group Volume Distribution */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Volume by Muscle Group</h2>
          {muscleVolumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={muscleVolumeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="muscleGroup" type="category" stroke="#9CA3AF" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#8B5CF6" name="Volume (kg)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No workout data yet. Complete some workouts to see your muscle group distribution!
            </div>
          )}
          {muscleVolumeData.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {muscleVolumeData.slice(0, 4).map((muscle) => (
                <div key={muscle.muscleGroup} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">{muscle.muscleGroup}</div>
                  <div className="text-lg font-bold text-astral-purple">{muscle.sets} sets</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strength Progression Chart */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Strength Progression</h2>
            {exercises.length > 0 && (
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
              >
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            )}
          </div>
          
          {strengthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={strengthData}>
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
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  name="Weight (kg)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="estimated1RM" 
                  stroke="#8B5CF6" 
                  name="Est. 1RM (kg)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              {selectedExercise ? 'No data for this exercise yet. Complete a workout!' : 'No exercises found.'}
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
          {recentSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No workout history yet</p>
              <Link
                href="/workout/session"
                className="mt-4 inline-block px-6 py-2 bg-astral-blue rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Your First Workout
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(session.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{session.exercises} exercises</div>
                    <div className="text-sm text-gray-400">
                      {session.sets} sets • {session.duration || 0} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Analytics Link */}
        <Link
          href="/progress/analytics"
          className="block bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">📊 Advanced Analytics</h3>
              <p className="text-gray-100">Training frequency, RPE trends, duration analysis & more</p>
            </div>
            <span className="text-4xl">→</span>
          </div>
        </Link>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Training Frequency</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Last 7 days</span>
                <span className="font-semibold">
                  {recentSessions.filter(s => {
                    const date = new Date(s.date)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return date >= weekAgo
                  }).length} workouts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last 30 days</span>
                <span className="font-semibold">
                  {recentSessions.filter(s => {
                    const date = new Date(s.date)
                    const monthAgo = new Date()
                    monthAgo.setDate(monthAgo.getDate() - 30)
                    return date >= monthAgo
                  }).length} workouts
                </span>
              </div>
            </div>
          </div>

          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Average Session</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="font-semibold">
                  {recentSessions.length > 0
                    ? Math.round(
                        recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0) /
                          recentSessions.length
                      )
                    : 0}{' '}
                  min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Exercises</span>
                <span className="font-semibold">
                  {recentSessions.length > 0
                    ? Math.round(
                        recentSessions.reduce((sum, s) => sum + s.exercises, 0) /
                          recentSessions.length
                      )
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sets</span>
                <span className="font-semibold">
                  {recentSessions.length > 0
                    ? Math.round(
                        recentSessions.reduce((sum, s) => sum + s.sets, 0) / recentSessions.length
                      )
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

