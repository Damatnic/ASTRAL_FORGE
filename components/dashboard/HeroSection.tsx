'use client'

/**
 * HERO SECTION - Phase 2
 * Dynamic banner featuring next workout or highlighted content
 * Gaming-style presentation with quick action buttons
 */

import { useState } from 'react'
import Link from 'next/link'
import { Play, Calendar, Trophy, TrendingUp, ChevronRight } from 'lucide-react'

interface Workout {
  id: string
  name: string
  type: string
  duration: number
  exercises: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  scheduledFor?: Date
}

interface HeroSectionProps {
  nextWorkout?: Workout
  suggestedWorkout?: Workout
  className?: string
}

export function HeroSection({ 
  nextWorkout, 
  suggestedWorkout,
  className = '' 
}: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine which workout to display
  const featuredWorkout = nextWorkout || suggestedWorkout

  if (!featuredWorkout) {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-gray-700 p-8 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">💪</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">No scheduled workouts. Let&apos;s create one!</p>
          <Link 
            href="/programs"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            <Calendar className="w-5 h-5" />
            Browse Programs
          </Link>
        </div>
      </div>
    )
  }

  const difficultyColors = {
    beginner: 'text-green-400 bg-green-500/20 border-green-500/50',
    intermediate: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
    advanced: 'text-red-400 bg-red-500/20 border-red-500/50',
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border-2 border-blue-500/30 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-75" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Workout Info */}
          <div className="flex-1">
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 rounded-full px-3 py-1">
                <Play className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">
                  {nextWorkout ? 'SCHEDULED' : 'SUGGESTED'}
                </span>
              </div>
              {featuredWorkout.scheduledFor && (
                <span className="text-sm text-gray-400">
                  {featuredWorkout.scheduledFor.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>

            {/* Workout Name */}
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
              {featuredWorkout.name}
            </h2>

            {/* Workout Details */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-sm font-medium">{featuredWorkout.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-sm font-medium">{featuredWorkout.duration} min</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                <span className="text-sm font-medium">{featuredWorkout.exercises} exercises</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${difficultyColors[featuredWorkout.difficulty]}`}>
                <span className="text-xs font-bold uppercase">{featuredWorkout.difficulty}</span>
              </div>
            </div>

            {/* Quick Stats Preview */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>+50 XP</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Chest & Triceps</span>
              </div>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex flex-col items-stretch lg:items-end gap-3">
            <Link
              href={`/workout/${featuredWorkout.id}`}
              className="group relative"
            >
              {/* Button Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              
              {/* Button */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform">
                <Play className="w-6 h-6" />
                <span>Start Workout</span>
                <ChevronRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
              </div>
            </Link>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <Link
                href={`/workout/${featuredWorkout.id}/preview`}
                className="flex-1 bg-gray-800/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700/50 transition-colors text-center"
              >
                Preview
              </Link>
              <Link
                href="/programs"
                className="flex-1 bg-gray-800/50 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700/50 transition-colors text-center"
              >
                Change
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
    </div>
  )
}
