'use client'

/**
 * XP PROGRESS BAR - Phase 1
 * Shows current XP progress to next level with gaming-style animations
 * Features glow effects, percentage display, and smooth transitions
 */

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

interface XPProgressBarProps {
  currentXP: number
  requiredXP: number
  level: number
  className?: string
}

export function XPProgressBar({ 
  currentXP, 
  requiredXP, 
  level,
  className = '' 
}: XPProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const percentage = Math.min((currentXP / requiredXP) * 100, 100)

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header with Level & XP Numbers */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300 font-medium">
            Level {level} Progress
          </span>
        </div>
        <span className="text-gray-400 font-mono">
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background Track */}
        <div className="h-8 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden backdrop-blur-sm">
          {/* Animated Fill */}
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 blur-sm" />
          </div>

          {/* Percentage Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow-lg z-10">
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Glow Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-sm -z-10 opacity-75" />
      </div>

      {/* XP Remaining */}
      <div className="text-right">
        <span className="text-xs text-gray-500">
          {(requiredXP - currentXP).toLocaleString()} XP to Level {level + 1}
        </span>
      </div>
    </div>
  )
}
