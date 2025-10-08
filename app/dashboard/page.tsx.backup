'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Dumbbell, 
  Target, 
  Trophy, 
  Award,
  Heart,
  ChevronRight,
  Users,
  Swords,
  Zap,
  Flame,
} from 'lucide-react'
import { AppLayout, PageContainer } from '@/components/layout'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/stats').catch(() => null)
      if (statsRes?.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      } else {
        setStats({
          totalWorkouts: 127,
          currentStreak: 12,
          level: 42,
          currentXP: 8450,
          requiredXP: 10000,
          achievements: 38,
          weeklyWorkouts: 4,
          weeklyGoal: 5,
        })
      }
    } catch (error) {
      setStats({
        totalWorkouts: 127,
        currentStreak: 12,
        level: 42,
        currentXP: 8450,
        requiredXP: 10000,
        achievements: 38,
        weeklyWorkouts: 4,
        weeklyGoal: 5,
      })
    } finally {
      setLoading(false)
    }
  }

  const xpPercentage = stats ? (stats.currentXP / stats.requiredXP) * 100 : 0

  if (loading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading dashboard...</div>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Experience Points</h3>
                <span className="text-sm text-blue-400">{stats?.currentXP || 0} / {stats?.requiredXP || 10000} XP</span>
              </div>
              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${xpPercentage}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{Math.round((stats?.requiredXP || 10000) - (stats?.currentXP || 0))} XP to Level {(stats?.level || 1) + 1}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Current Streak</h3>
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400">{stats?.currentStreak || 0} Days</div>
              <p className="text-xs text-gray-500 mt-2">Keep it going!</p>
            </div>
          </div>
        </section>
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Continue Training</h2>
            <Link href="/programs" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
          </div>
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Push Day Domination</h3>
                <p className="text-sm text-gray-400">Strength Training  60 min  8 exercises</p>
              </div>
              <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold rounded-lg">INTERMEDIATE</span>
            </div>
            <Link href="/workout/session" className="block w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-center transition-all">Start Workout</Link>
          </div>
        </section>
        <section className="mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
              <Dumbbell className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-2xl font-bold">{stats?.totalWorkouts || 0}</div>
              <div className="text-sm text-gray-400">Total Workouts</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
              <Award className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-2xl font-bold">{stats?.achievements || 0}</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-green-500/50 transition-colors">
              <Target className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-2xl font-bold">{stats?.weeklyWorkouts || 0}/{stats?.weeklyGoal || 5}</div>
              <div className="text-sm text-gray-400">This Week</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
              <Trophy className="w-8 h-8 text-orange-400 mb-3" />
              <div className="text-2xl font-bold">Level {stats?.level || 1}</div>
              <div className="text-sm text-gray-400">Current Level</div>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <Link href="/progress" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Completed Push Day</h4>
                        <p className="text-sm text-gray-400">8 exercises  45 min</p>
                      </div>
                      <div className="text-xs text-gray-500">2h ago</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
              <div className="space-y-3">
                <Link href="/programs" className="block bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Browse Programs</h4>
                      <p className="text-xs text-gray-400">Find challenges</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
                <Link href="/goals" className="block bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-purple-500/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Set New Goal</h4>
                      <p className="text-xs text-gray-400">Track progress</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-4">All Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/guild" className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-medium text-sm mb-1">Guild Hall</h3>
              <p className="text-xs text-gray-400">Train together</p>
            </Link>
            <Link href="/compete" className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors text-center">
              <Swords className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-medium text-sm mb-1">Compete</h3>
              <p className="text-xs text-gray-400">Challenge others</p>
            </Link>
            <Link href="/skills" className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-green-500/50 transition-colors text-center">
              <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-medium text-sm mb-1">Skills</h3>
              <p className="text-xs text-gray-400">Unlock abilities</p>
            </Link>
            <Link href="/health" className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-colors text-center">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="font-medium text-sm mb-1">Health</h3>
              <p className="text-xs text-gray-400">Track wellness</p>
            </Link>
          </div>
        </section>
      </PageContainer>
    </AppLayout>
  )
}
