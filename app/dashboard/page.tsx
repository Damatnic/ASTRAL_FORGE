'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Dumbbell, 
  Target, 
  Trophy,
  Heart,
  BarChart3,
  Sparkles,
  Flame,
  Calendar,
} from 'lucide-react'
import { AppLayout, PageContainer } from '@/components/layout'
import { TrainingStatusWidget } from '@/components/dashboard/training-status-widget'

interface DashboardStats {
  totalWorkouts: number
  currentStreak: number
  level: number
  currentXP: number
  requiredXP: number
  achievements: number
  weeklyWorkouts: number
  weeklyGoal: number
  totalVolume?: number
  personalRecords?: number
}

interface SessionData {
  id: string
  name: string
  date: string
  duration: number
  exercises: number
  sets: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentSessions, setRecentSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [xpAnimated, setXpAnimated] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Trigger XP bar animation after stats load
  useEffect(() => {
    if (stats) {
      setTimeout(() => setXpAnimated(true), 100)
    }
  }, [stats])

  const loadDashboardData = async () => {
    try {
      // Fetch real stats from API
      const statsRes = await fetch('/api/stats').catch(() => null)
      const sessionsRes = await fetch('/api/sessions?limit=10').catch(() => null)
      
      let totalWorkouts = 0
      let totalVolume = 0
      let personalRecords = 0
      
      // Parse stats response
      if (statsRes?.ok) {
        const statsData = await statsRes.json()
        totalWorkouts = statsData.totalWorkouts || 0
        totalVolume = parseFloat(statsData.totalVolume || '0') * 1000 // Convert K back to kg
        personalRecords = statsData.prs || 0
      }
      
      // Calculate XP based on real workouts
      // XP formula: 100 XP per workout, 500 XP per PR
      const totalXP = (totalWorkouts * 100) + (personalRecords * 500)
      const level = Math.floor(totalXP / 1000) + 1
      const currentXP = totalXP % 1000
      const requiredXP = 1000
      
      // Calculate streak (mock for now - would need date comparison logic)
      const currentStreak = 12
      
      // Calculate weekly workouts (count sessions from last 7 days)
      let weeklyWorkouts = 0
      if (sessionsRes?.ok) {
        const sessions: SessionData[] = await sessionsRes.json()
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        
        weeklyWorkouts = sessions.filter((s: SessionData) => 
          new Date(s.date) >= oneWeekAgo
        ).length
        
        // Store recent 3 sessions for display
        setRecentSessions(sessions.slice(0, 3))
      }
      
      setStats({
        totalWorkouts,
        currentStreak,
        level,
        currentXP,
        requiredXP,
        achievements: personalRecords, // Use PRs as achievements for now
        weeklyWorkouts,
        weeklyGoal: 5,
        totalVolume,
        personalRecords,
      })
    } catch (_error) {
      // Fallback to mock data if API fails
      setStats({
        totalWorkouts: 0,
        currentStreak: 0,
        level: 1,
        currentXP: 0,
        requiredXP: 1000,
        achievements: 0,
        weeklyWorkouts: 0,
        weeklyGoal: 5,
        totalVolume: 0,
        personalRecords: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const xpPercentage = stats ? (stats.currentXP / stats.requiredXP) * 100 : 0
  const isNearLevelUp = stats ? (stats.requiredXP - stats.currentXP) <= 200 : false

  if (loading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent animate-spin"></div>
              <div className="text-neutral-400 font-light">Loading your stats...</div>
            </div>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        {/* Hero Section - Compact */}
        <section className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Level & XP Card */}
            <div className="lg:col-span-2 bg-neutral-900 border-2 border-amber-800/30 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <h1 className="text-2xl font-black tracking-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                        LEVEL {stats?.level || 1}
                      </span>
                      <span className="text-amber-100 ml-2">WARRIOR</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/50 border-2 border-amber-800/50">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-lg font-bold text-amber-400">{stats?.currentStreak || 0}</span>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Day</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400 font-light">{stats?.totalWorkouts || 0} Battles Won</span>
                    <span className="text-amber-400 font-bold tracking-wider">
                      {stats?.currentXP?.toLocaleString() || 0} / {stats?.requiredXP?.toLocaleString() || 10000} XP
                    </span>
                  </div>
                  <div className="relative h-3 bg-neutral-950 border-2 border-neutral-800 overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 transition-all duration-1000 ease-out ${isNearLevelUp ? 'animate-pulse' : ''}`}
                      style={{ width: xpAnimated ? `${xpPercentage}%` : '0%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
              <h3 className="text-sm font-bold text-neutral-400 mb-3 uppercase tracking-wider">This Week</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Battles</span>
                  <span className="text-lg font-bold text-amber-400">{stats?.weeklyWorkouts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Volume</span>
                  <span className="text-lg font-bold text-amber-400">{(stats?.totalVolume || 0).toLocaleString()} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">PRs</span>
                  <span className="text-lg font-bold text-amber-400">{stats?.personalRecords || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Training Status - Takes 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <TrainingStatusWidget
              programName="5x5 Strength Program"
              nextWorkout={{
                name: "Squat Day",
                exercises: 5,
                estimatedTime: 60,
                scheduledDate: "Today"
              }}
              programProgress={{
                current: 8,
                total: 12
              }}
            />
          </div>

          {/* Sidebar - Quick Actions & Recent */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
              <h3 className="text-sm font-bold text-neutral-400 mb-3 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  href="/programs" 
                  className="block w-full py-2 px-3 bg-amber-950/50 hover:bg-amber-950/70 border-2 border-amber-700 hover:border-amber-600 font-bold text-center text-sm transition-all duration-200 text-amber-400 uppercase tracking-wider"
                >
                  Engage Battle
                </Link>
                <Link 
                  href="/history" 
                  className="block w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 hover:border-amber-700 font-bold text-center text-sm transition-colors text-neutral-300 hover:text-amber-400 uppercase tracking-wider"
                >
                  Log Victory
                </Link>
              </div>
            </div>

            {/* Recent Activity Compact */}
            <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Recent Battles</h3>
                <Link href="/history" className="text-xs text-amber-400 hover:text-amber-300 uppercase tracking-wider">View All</Link>
              </div>
              <div className="space-y-2">
                {recentSessions.slice(0, 3).length > 0 ? (
                  recentSessions.slice(0, 3).map((workout) => {
                    const workoutDate = new Date(workout.date)
                    const now = new Date()
                    const diffHours = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60))
                    const diffDays = Math.floor(diffHours / 24)
                    
                    let timeAgo = ''
                    if (diffHours < 1) {
                      timeAgo = 'Just now'
                    } else if (diffHours < 24) {
                      timeAgo = `${diffHours}h ago`
                    } else if (diffDays === 1) {
                      timeAgo = 'Yesterday'
                    } else {
                      timeAgo = `${diffDays}d ago`
                    }
                    
                    return (
                      <div key={workout.id} className="flex items-center gap-2 p-2 bg-neutral-950 border-2 border-neutral-800">
                        <Dumbbell className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-neutral-300 uppercase">{workout.name}</p>
                          <p className="text-xs text-neutral-500">{timeAgo}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-neutral-500 text-center py-4">No recent battles</p>
                )}
              </div>
            </div>

            {/* Achievements Compact */}
            <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Trophies</h3>
                <Link href="/achievements" className="text-xs text-amber-400 hover:text-amber-300 uppercase tracking-wider">View All</Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '💯', name: '100 Battles' },
                  { icon: '🔥', name: '10 Day Streak' },
                  { icon: '🏆', name: 'First PR' }
                ].map((achievement, i) => (
                  <div 
                    key={i}
                    className="aspect-square bg-neutral-950 border-2 border-neutral-800 flex flex-col items-center justify-center p-2 hover:border-amber-700 transition-colors cursor-pointer group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{achievement.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Links - Compact Grid */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Link href="/analytics" className="group bg-neutral-900 border-2 border-neutral-800 p-3 hover:border-amber-700 transition-all text-center">
              <BarChart3 className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">Analytics</p>
            </Link>
            
            <Link href="/programs" className="group bg-neutral-900 border-2 border-neutral-800 p-3 hover:border-amber-700 transition-all text-center">
              <Dumbbell className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">Campaigns</p>
            </Link>
            
            <Link href="/goals" className="group bg-neutral-900 border-2 border-neutral-800 p-3 hover:border-amber-700 transition-all text-center">
              <Target className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">Goals</p>
            </Link>
            
            <Link href="/achievements" className="group bg-neutral-900 border-2 border-neutral-800 p-3 hover:border-amber-700 transition-all text-center">
              <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">Trophies</p>
            </Link>
            
            <Link href="/health" className="group bg-neutral-900 border-2 border-neutral-800 p-3 hover:border-amber-700 transition-all text-center">
              <Heart className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">Health</p>
            </Link>
            
            <Link href="/templates" className="group bg-neutral-900 border-2 border-neutral-800 p-3 hover:border-amber-700 transition-all text-center">
              <Calendar className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">Templates</p>
            </Link>
          </div>
        </section>
      </PageContainer>
    </AppLayout>
  )
}
