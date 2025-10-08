'use client'

import { useState } from 'react'
import { Link, Unlink, ChevronDown, ChevronUp } from 'lucide-react'
import { ExerciseData } from './enhanced-set-log'

interface SupersetGroupProps {
  exercises: ExerciseData[]
  onBreakGroup: () => void
  onStartRestTimer: (duration: number) => void
  children: React.ReactNode
}

export function SupersetGroup({
  exercises,
  onBreakGroup,
  onStartRestTimer,
  children
}: SupersetGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Calculate superset stats
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  const completedSets = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.isCompleted).length,
    0
  )
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0

  return (
    <div className="relative mb-6">
      {/* Superset Bracket - Left Side */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600" />
      <div className="absolute left-0 top-4 w-4 h-0.5 bg-amber-600" />
      <div className="absolute left-0 bottom-4 w-4 h-0.5 bg-amber-600" />

      <div className="ml-6 border-2 border-amber-700/30 bg-neutral-950 backdrop-blur-sm overflow-hidden">
        {/* Superset Header */}
        <div className="bg-amber-950/30 border-b-2 border-amber-700/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center">
                <Link className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">Superset</h3>
                  <span className="px-2 py-0.5 bg-amber-950/30 border-2 border-amber-700 text-amber-400 text-xs font-black uppercase tracking-wider">
                    {exercises.length} exercises
                  </span>
                </div>
                <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
                  Complete all exercises before recovering
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-black text-white uppercase tracking-wider">
                    {completedSets}/{totalSets} sets
                  </div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold">
                    {progress.toFixed(0)}% complete
                  </div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="transform -rotate-90" width="64" height="64">
                    {/* Background circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-neutral-800"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#d97706"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                      className="transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-3 py-2 bg-neutral-900 border-2 border-neutral-800 hover:bg-neutral-800 text-neutral-400 transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={onBreakGroup}
                  className="px-3 py-2 bg-neutral-900 border-2 border-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-2"
                  title="Break Superset"
                >
                  <Unlink className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider font-bold">Break</span>
                </button>

                {progress === 100 && (
                  <button
                    onClick={() => onStartRestTimer(120)} // 2 minute rest for supersets
                    className="px-4 py-2 bg-amber-950/50 border-2 border-amber-700 hover:bg-amber-900/50 text-amber-400 font-black transition-all shadow-lg shadow-amber-500/50 uppercase tracking-wider"
                  >
                    Start Recovery Timer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-neutral-900 border-2 border-neutral-800 overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Superset Exercises */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            {children}
          </div>
        )}

        {/* Collapsed View */}
        {!isExpanded && (
          <div className="p-4">
            <div className="text-center text-neutral-400 text-sm uppercase tracking-wider font-bold">
              {exercises.map(ex => ex.name).join(' + ')}
            </div>
          </div>
        )}

        {/* Instructions */}
        {isExpanded && (
          <div className="px-4 pb-4">
            <div className="bg-amber-950/20 border-2 border-amber-700/30 p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-amber-950/30 border-2 border-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-xs font-black">ℹ</span>
                </div>
                <div className="text-sm text-amber-300">
                  <strong className="font-black uppercase tracking-wider">Superset Instructions:</strong>
                  <p className="mt-1 text-amber-400/80 uppercase tracking-wider font-bold">
                    Complete one set from each exercise in order, then recover. This increases
                    training intensity and saves time. Recovery timer will activate after all
                    exercises are completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
