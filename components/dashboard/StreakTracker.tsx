'use client'

/**
 * STREAK TRACKER - Phase 1
 * Visual calendar showing workout streak with fire animations
 * Displays last 7 days with active/inactive indicators
 */

import { Flame, Calendar } from 'lucide-react'

interface StreakDay {
  date: Date
  completed: boolean
  isToday: boolean
}

interface StreakTrackerProps {
  currentStreak: number
  longestStreak: number
  recentDays?: StreakDay[]
  className?: string
}

export function StreakTracker({ 
  currentStreak, 
  longestStreak,
  recentDays = [],
  className = '' 
}: StreakTrackerProps) {
  // Generate last 7 days if not provided
  const days = recentDays.length > 0 ? recentDays : generateLast7Days()

  return (
    <div className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
          <h3 className="text-xl font-bold text-white">Workout Streak</h3>
        </div>
        <Calendar className="w-5 h-5 text-gray-500" />
      </div>

      {/* Current Streak Display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
          <div className="relative text-6xl font-black bg-gradient-to-br from-orange-400 to-red-500 text-transparent bg-clip-text">
            {currentStreak}
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {currentStreak === 1 ? 'Day' : 'Days'} in a row!
        </p>
      </div>

      {/* Last 7 Days Visual */}
      <div className="space-y-3 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Last 7 Days</p>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div 
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  day.completed 
                    ? 'bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/50' 
                    : 'bg-gray-800/50 border-gray-700'
                } ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}`}
              >
                {day.completed && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {day.date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div>
          <p className="text-xs text-gray-500">Longest Streak</p>
          <p className="text-lg font-bold text-orange-400">{longestStreak} days</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Keep it up!</p>
          <p className="text-sm text-gray-400">
            {currentStreak >= longestStreak ? '🔥 New Record!' : `${longestStreak - currentStreak} to beat`}
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate last 7 days
function generateLast7Days(): StreakDay[] {
  const days: StreakDay[] = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    days.push({
      date,
      completed: Math.random() > 0.3, // Mock data
      isToday: i === 0
    })
  }
  
  return days
}
