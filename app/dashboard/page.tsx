'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountabilityDashboard } from '@/components/accountability-dashboard'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [nextWorkout, setNextWorkout] = useState<any>(null)
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // For demo purposes, using a default user ID
      // In production, get this from session
      const userId = 'demo-user-id'
      
      const [userRes, workoutRes, sessionsRes, statsRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/workout/next'),
        fetch('/api/sessions?limit=5'),
        fetch('/api/stats'),
      ])

      const userData = await userRes.json()
      const workoutData = await workoutRes.json()
      const sessionsData = await sessionsRes.json()
      const statsData = await statsRes.json()

      setUser(userData)
      setNextWorkout(workoutData)
      setRecentSessions(sessionsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      {/* Header */}
      <header className="bg-astral-gray border-b border-gray-800 p-3 sm:p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-astral-blue to-astral-purple bg-clip-text text-transparent">
            🔨 Astral Forge
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/forge"
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 rounded-lg transition-opacity text-xs sm:text-sm font-bold text-black shadow-lg shadow-yellow-500/30 touch-manipulation min-h-[44px] flex items-center"
            >
              <span className="hidden sm:inline">🔨 </span>THE FORGE
            </Link>
            <nav className="hidden lg:flex gap-2">
              <Link
                href="/exercises"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm min-h-[44px] flex items-center"
              >
                Exercises
              </Link>
              <Link
                href="/programs"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm min-h-[44px] flex items-center"
              >
                Programs
              </Link>
              <Link
                href="/progress"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm min-h-[44px] flex items-center"
              >
                Progress
              </Link>
              <Link
                href="/metrics"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm min-h-[44px] flex items-center"
              >
                Metrics
              </Link>
              <Link
                href="/goals"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm min-h-[44px] flex items-center"
              >
                Goals
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm min-h-[44px] flex items-center"
              >
                Settings
              </Link>
            </nav>
            <Link
              href="/"
              className="hidden sm:inline-flex px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-xs sm:text-sm min-h-[44px] items-center touch-manipulation"
            >
              Sign Out
            </Link>
            {/* Mobile Menu Button - Shows on small screens */}
            <button className="lg:hidden px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation">
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column: Quick Actions & Next Workout */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <div className="bg-astral-gray rounded-xl p-3 sm:p-4 md:p-6 border border-gray-800 touch-manipulation">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-astral-blue">{stats?.totalWorkouts || 0}</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Total Workouts</div>
              </div>
              <div className="bg-astral-gray rounded-xl p-3 sm:p-4 md:p-6 border border-gray-800 touch-manipulation">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-astral-purple">{stats?.totalVolume || '0'}k</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Total Volume (kg)</div>
              </div>
              <div className="bg-astral-gray rounded-xl p-3 sm:p-4 md:p-6 border border-gray-800 touch-manipulation">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-astral-blue">{stats?.prs || 0}</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Personal Records</div>
              </div>
            </div>

            {/* Next Workout Card */}
            <div className="bg-astral-gray rounded-xl p-4 sm:p-5 md:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Today's Workout</h2>
                <span className="text-xs sm:text-sm text-gray-400">Ready to train</span>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {nextWorkout && !nextWorkout.error ? (
                  <>
                    {(() => {
                      const plan = typeof nextWorkout.plan === 'string' 
                        ? JSON.parse(nextWorkout.plan) 
                        : nextWorkout.plan
                      return plan?.exercises?.slice(0, 3).map((exercise: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gray-700/50 rounded-lg touch-manipulation min-h-[60px]">
                          <div>
                            <div className="font-medium text-sm sm:text-base">{exercise.name}</div>
                            <div className="text-xs sm:text-sm text-gray-400">
                              {Array.isArray(exercise.sets) ? exercise.sets.length : exercise.sets}x{exercise.targetReps || (Array.isArray(exercise.sets) && exercise.sets[0] ? exercise.sets[0].reps : exercise.reps)}
                              {((Array.isArray(exercise.sets) && exercise.sets[0] ? exercise.sets[0].weight : exercise.weight) > 0) && ` @ ${Array.isArray(exercise.sets) && exercise.sets[0] ? exercise.sets[0].weight : exercise.weight}kg`}
                            </div>
                          </div>
                          <div className="text-sm text-astral-blue">
                            RPE {exercise.targetRPE || 7.5}
                          </div>
                        </div>
                      ))
                    })()}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="mb-4">No workout scheduled</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Create a workout program to get started!
                    </p>
                  </div>
                )}
              </div>

              {nextWorkout && !nextWorkout.error && (
                <Link
                  href="/workout/session"
                  className="block w-full py-3 sm:py-4 bg-gradient-to-r from-astral-blue to-astral-purple rounded-xl font-semibold text-sm sm:text-base text-center hover:opacity-90 transition-opacity touch-manipulation min-h-[48px]"
                >
                  Start {nextWorkout.name || 'Workout'}
                </Link>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="bg-astral-gray rounded-xl p-4 sm:p-5 md:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Workouts</h2>
              {recentSessions.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {recentSessions.map((session: any) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer touch-manipulation min-h-[60px]"
                    >
                      <div>
                        <div className="font-medium text-sm sm:text-base">{session.name}</div>
                        <div className="text-xs sm:text-sm text-gray-400">
                          {new Date(session.date).toLocaleDateString()} · {session.duration} min
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-medium text-astral-blue">{session.exercises} exercises</div>
                        <div className="text-xs text-gray-400">{session.sets} sets</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
                  <p>No workout history yet. Start your first workout above!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Accountability */}
          <div>
            <AccountabilityDashboard userId="demo-user-id" />
          </div>
        </div>
      </div>
    </div>
  )
}

