'use client'

/**
 * QUICK STATS WIDGET - Phase 2
 * Circular progress rings showing key metrics
 * Gaming-style stat display with animations
 */

import { useEffect, useState } from 'react'
import { Dumbbell, Flame, Trophy } from 'lucide-react'

interface Stat {
  label: string
  value: number
  max: number
  icon: React.ReactNode
  color: string
  unit?: string
}

interface QuickStatsProps {
  weeklyWorkouts?: number
  weeklyGoal?: number
  currentStreak?: number
  achievements?: number
  totalAchievements?: number
  className?: string
}

export function QuickStats({
  weeklyWorkouts = 4,
  weeklyGoal = 5,
  currentStreak = 12,
  achievements = 38,
  totalAchievements = 100,
  className = ''
}: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const stats: Stat[] = [
    {
      label: 'Weekly Progress',
      value: weeklyWorkouts,
      max: weeklyGoal,
      icon: <Dumbbell className="w-5 h-5" />,
      color: '#3b82f6', // blue
      unit: 'workouts'
    },
    {
      label: 'Current Streak',
      value: currentStreak,
      max: 30,
      icon: <Flame className="w-5 h-5" />,
      color: '#fb923c', // orange
      unit: 'days'
    },
    {
      label: 'Achievements',
      value: achievements,
      max: totalAchievements,
      icon: <Trophy className="w-5 h-5" />,
      color: '#fbbf24', // amber
      unit: 'unlocked'
    },
  ]

  const getCircleProps = (value: number, max: number) => {
    const percentage = Math.min((value / max) * 100, 100)
    const circumference = 2 * Math.PI * 40 // radius = 40
    const offset = circumference - (percentage / 100) * circumference
    
    return { circumference, offset, percentage }
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const { circumference, offset, percentage } = getCircleProps(stat.value, stat.max)
        
        return (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              {/* Background Circle */}
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="64"
                  cy="64"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                {/* Progress Circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="40"
                  stroke={stat.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={animated ? offset : circumference}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                  style={{ filter: `drop-shadow(0 0 8px ${stat.color}80)` }}
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="p-2 rounded-lg mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">
                  / {stat.max}
                </div>
              </div>

              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ backgroundColor: stat.color }}
              />
            </div>

            {/* Label & Percentage */}
            <div className="text-center">
              <div className="text-sm font-semibold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400">
                {percentage.toFixed(0)}% • {stat.unit}
              </div>
            </div>

            {/* Progress Bar (Linear) */}
            <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${percentage}%` : '0%',
                  backgroundColor: stat.color,
                  boxShadow: `0 0 10px ${stat.color}80`
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
