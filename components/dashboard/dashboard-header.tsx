'use client'

/**
 * Dashboard Header Component
 * Shows user stats and greeting at the top of dashboard
 */

import React from 'react'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  userName?: string
  currentStreak?: number
  weeklyWorkouts?: number
  totalTimeThisWeek?: number // in minutes
  className?: string
}

export function DashboardHeader({
  userName = 'Athlete',
  currentStreak = 0,
  weeklyWorkouts = 0,
  totalTimeThisWeek = 0,
  className,
}: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className={cn('bg-gradient-to-r from-astral-dark via-astral-gray to-astral-dark rounded-xl p-6 border border-astral-light shadow-lg', className)}>
      {/* Greeting */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-1">
          {getGreeting()}, {userName}! 👋
        </h1>
        <p className="text-gray-400">Ready to crush your goals today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Current Streak */}
        <div className="bg-astral-gray/50 rounded-lg p-4 border border-astral-light/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xs text-gray-400 uppercase font-semibold">Streak</span>
          </div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
            {currentStreak} days
          </div>
        </div>

        {/* Weekly Workouts */}
        <div className="bg-astral-gray/50 rounded-lg p-4 border border-astral-light/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💪</span>
            <span className="text-xs text-gray-400 uppercase font-semibold">This Week</span>
          </div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {weeklyWorkouts} workouts
          </div>
        </div>

        {/* Total Time */}
        <div className="bg-astral-gray/50 rounded-lg p-4 border border-astral-light/30 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⏱️</span>
            <span className="text-xs text-gray-400 uppercase font-semibold">Training Time</span>
          </div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {formatTime(totalTimeThisWeek)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
