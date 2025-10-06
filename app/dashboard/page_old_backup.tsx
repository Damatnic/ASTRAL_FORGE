'use client'

/**
 * MAIN FORGE DASHBOARD - Gaming-Inspired Command Center
 * Phase 1: Foundation with layout, header, XP bar, and streak tracker
 * Phase 2: Hero section, activity feed, and quick stats
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  DashboardLayout,
  DashboardHeader,
  XPProgressBar,
  StreakTracker,
  HeroSection,
  ActivityFeed,
  QuickStats,
} from '@/components/dashboard'
import { 
  Dumbbell, 
  Target, 
  Trophy, 
  TrendingUp, 
  Users, 
  Zap,
  Award,
  Swords,
  Heart,
} from 'lucide-react'

export default function ForgeDashboard() {
  const [stats, setStats] = useState<{
    totalWorkouts?: number
    currentStreak?: number
    longestStreak?: number
    level?: number
    currentXP?: number
    requiredXP?: number
    achievements?: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/stats').catch(() => null)

      if (statsRes?.ok) {
        const statsData = await statsRes.json()
        setStats({
          ...statsData,
          longestStreak: statsData.longestStreak || statsData.currentStreak || 0,
          currentXP: statsData.currentXP || 8450,
          requiredXP: statsData.requiredXP || 10000,
        })
      } else {
        // Default mock data
        setStats({
          totalWorkouts: 127,
          currentStreak: 12,
          longestStreak: 15,
          level: 42,
          currentXP: 8450,
          requiredXP: 10000,
          achievements: 38,
        })
      }
    } catch (_error) {
      // Silent fail - show mock data
      setStats({
        totalWorkouts: 127,
        currentStreak: 12,
        longestStreak: 15,
        level: 42,
        currentXP: 8450,
        requiredXP: 10000,
        achievements: 38,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🔨</div>
            <div className="text-xl text-white font-bold animate-pulse">Loading The Forge...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <DashboardHeader 
          level={stats?.level || 1}
          currentStreak={stats?.currentStreak || 0}
        />

        {/* XP Progress Bar */}
        <XPProgressBar
          currentXP={stats?.currentXP || 0}
          requiredXP={stats?.requiredXP || 10000}
          level={stats?.level || 1}
          className="mb-8"
        />

        {/* Streak Tracker */}
        <StreakTracker
          currentStreak={stats?.currentStreak || 0}
          longestStreak={stats?.longestStreak || 0}
          className="mb-8"
        />

        {/* Phase 2 Components */}
        
        {/* Hero Section - Featured Workout */}
        <HeroSection
          nextWorkout={{
            id: 'demo-workout-1',
            name: 'Push Day Domination',
            type: 'Strength Training',
            duration: 60,
            exercises: 8,
            difficulty: 'intermediate',
            scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 2) // 2 hours from now
          }}
          className="mb-8"
        />

        {/* Quick Stats Rings */}
        <QuickStats
          weeklyWorkouts={4}
          weeklyGoal={5}
          currentStreak={stats?.currentStreak || 0}
          achievements={stats?.achievements || 0}
          totalAchievements={100}
          className="mb-8"
        />

        {/* Two Column Layout: Activity Feed + Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Feed - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>

          {/* Quick Navigation - Takes 1 column */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/programs"
                  className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Dumbbell className="w-5 h-5" />
                  <span className="font-medium">Browse Programs</span>
                </Link>
                <Link
                  href="/goals"
                  className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-3 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Set New Goal</span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">View Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Training Hub */}
          <Link href="/programs" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-astral-blue transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Dumbbell className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Training Programs</h3>
                  <p className="text-sm text-gray-400">Design your path</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Create and follow structured workout programs</p>
            </div>
          </Link>

          {/* Workout Session */}
          <Link href="/exercises" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-green-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Start Workout</h3>
                  <p className="text-sm text-gray-400">Train now</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Begin a workout session and track progress</p>
            </div>
          </Link>

          {/* Goals & Targets */}
          <Link href="/goals" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-purple-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Goals</h3>
                  <p className="text-sm text-gray-400">Track targets</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Set and achieve fitness milestones</p>
            </div>
          </Link>

          {/* Progress Analytics */}
          <Link href="/analytics" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Analytics</h3>
                  <p className="text-sm text-gray-400">Track progress</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">View detailed stats and insights</p>
            </div>
          </Link>

          {/* Achievements */}
          <Link href="/achievements" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-amber-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Achievements</h3>
                  <p className="text-sm text-gray-400">Earn rewards</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Unlock badges and milestones</p>
            </div>
          </Link>

          {/* Guild System */}
          <Link href="/guild" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-red-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                  <Users className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Guilds</h3>
                  <p className="text-sm text-gray-400">Join forces</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Team up with other warriors</p>
            </div>
          </Link>

          {/* PvP/Compete */}
          <Link href="/compete" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-orange-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                  <Swords className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">PvP Arena</h3>
                  <p className="text-sm text-gray-400">Challenge others</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Compete in duels and leaderboards</p>
            </div>
          </Link>

          {/* Skills & Progression */}
          <Link href="/skills" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-cyan-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                  <Award className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Skill Tree</h3>
                  <p className="text-sm text-gray-400">Level up</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Unlock abilities and milestones</p>
            </div>
          </Link>

          {/* Health Hub */}
          <Link href="/health" className="group">
            <div className="bg-gradient-to-br from-astral-gray to-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-pink-500 transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors">
                  <Heart className="w-8 h-8 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Health Hub</h3>
                  <p className="text-sm text-gray-400">Track vitals</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Monitor recovery and wellness</p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-astral-gray/50 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-astral-blue">{stats.totalWorkouts || 0}</div>
              <div className="text-sm text-gray-400">Total Workouts</div>
            </div>
            <div className="bg-astral-gray/50 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{stats.currentStreak || 0}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
            <div className="bg-astral-gray/50 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.level || 1}</div>
              <div className="text-sm text-gray-400">Level</div>
            </div>
            <div className="bg-astral-gray/50 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{stats.achievements || 0}</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>Your journey to greatness starts here. Every rep, every set, every day counts.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
