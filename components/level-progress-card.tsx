'use client'

import { useEffect, useState } from 'react'

/**
 * RPG-Style Level & XP Display
 * With animated progress bars and level-up effects
 */

interface LevelProgressCardProps {
  level: number
  title: string
  currentXP: number
  nextLevelXP: number
  totalXP: number
}

export function LevelProgressCard({
  level,
  title,
  currentXP,
  nextLevelXP,
  totalXP,
}: LevelProgressCardProps) {
  const [isLevelUp, setIsLevelUp] = useState(false)
  const [displayLevel, setDisplayLevel] = useState(level)

  const progress = (currentXP / nextLevelXP) * 100

  useEffect(() => {
    if (level > displayLevel) {
      setIsLevelUp(true)
      setTimeout(() => {
        setDisplayLevel(level)
        setTimeout(() => setIsLevelUp(false), 2000)
      }, 500)
    }
  }, [level, displayLevel])

  const getTitleColor = (title: string) => {
    if (title.includes('Legend') || title.includes('Master') || title.includes('Grandmaster'))
      return 'from-yellow-400 via-orange-500 to-red-500'
    if (title.includes('Expert') || title.includes('Veteran'))
      return 'from-purple-400 via-pink-500 to-red-400'
    if (title.includes('Advanced') || title.includes('Proficient'))
      return 'from-blue-400 via-cyan-500 to-teal-400'
    if (title.includes('Intermediate') || title.includes('Apprentice'))
      return 'from-green-400 via-emerald-500 to-cyan-400'
    return 'from-gray-400 to-gray-500'
  }

  return (
    <div className="relative">
      {/* Level Up Animation */}
      {isLevelUp && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-level-up">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              LEVEL UP!
            </div>
            <div className="text-2xl text-center mt-2 text-white animate-bounce">
              🎉 Level {level} 🎉
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 rounded-2xl p-6 border-2 border-indigo-500 shadow-2xl relative overflow-hidden">
        {/* Background animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-astral-blue/10 via-transparent to-astral-purple/10 animate-pulse-slow" />

        <div className="relative z-10">
          {/* Level Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* Level Badge */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/50">
                  <div className="text-3xl font-bold text-white">{displayLevel}</div>
                </div>
                {/* Rotating border effect */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 border-r-orange-500 animate-spin-slow" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">Level {displayLevel}</div>
                <div className={`text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r ${getTitleColor(title)}`}>
                  {title}
                </div>
              </div>
            </div>

            {/* Total XP */}
            <div className="text-right">
              <div className="text-sm text-gray-400">Total XP</div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {totalXP.toLocaleString()}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-medium">
                {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
              </span>
              <span className="text-astral-blue font-bold">{Math.round(progress)}%</span>
            </div>

            {/* Main Progress Bar */}
            <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-700 shadow-inner">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-astral-blue/20 to-astral-purple/20" />
              
              {/* Progress fill */}
              <div
                className="relative h-full bg-gradient-to-r from-astral-blue via-cyan-400 to-astral-purple transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer" />
                
                {/* Progress text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {currentXP > 0 && `${Math.round(progress)}%`}
                  </span>
                </div>
              </div>

              {/* Pulsing edge effect */}
              {progress > 90 && (
                <div className="absolute right-0 inset-y-0 w-4 bg-gradient-to-l from-yellow-400 to-transparent animate-pulse" />
              )}
            </div>

            {/* XP Needed */}
            <div className="text-center text-xs text-gray-400">
              <span className="text-astral-purple font-semibold">
                {(nextLevelXP - currentXP).toLocaleString()}
              </span>{' '}
              XP to next level
            </div>
          </div>

          {/* XP Sources */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700">
              <div className="text-gray-400">Workouts</div>
              <div className="text-green-400 font-bold">+10 XP</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700">
              <div className="text-gray-400">Volume</div>
              <div className="text-blue-400 font-bold">+1/1k kg</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700">
              <div className="text-gray-400">PRs</div>
              <div className="text-purple-400 font-bold">+50 XP</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes level-up {
          0% {
            transform: scale(0.5) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-level-up {
          animation: level-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

