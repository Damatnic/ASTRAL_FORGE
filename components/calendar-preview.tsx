'use client'

import { Calendar } from 'lucide-react'

interface WorkoutDay {
  day: string
  type?: 'strength' | 'cardio' | 'rest' | 'upper' | 'lower' | 'push' | 'pull' | 'legs' | 'fullbody'
  exercises?: string[]
  focus?: string
}

interface CalendarPreviewProps {
  workouts: WorkoutDay[]
  variant?: 'compact' | 'full'
  showLegend?: boolean
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WORKOUT_TYPES = {
  strength: {
    label: 'Strength',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    icon: '💪'
  },
  cardio: {
    label: 'Cardio',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    icon: '🏃'
  },
  rest: {
    label: 'Rest',
    color: 'from-gray-500 to-slate-500',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30',
    textColor: 'text-gray-400',
    icon: '😴'
  },
  upper: {
    label: 'Upper Body',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    icon: '💪'
  },
  lower: {
    label: 'Lower Body',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    icon: '🦵'
  },
  push: {
    label: 'Push',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    icon: '⬆️'
  },
  pull: {
    label: 'Pull',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    icon: '⬇️'
  },
  legs: {
    label: 'Legs',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    icon: '🦵'
  },
  fullbody: {
    label: 'Full Body',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-400',
    icon: '🔥'
  }
}

export default function CalendarPreview({ 
  workouts, 
  variant = 'compact',
  showLegend = false 
}: CalendarPreviewProps) {
  // Create a map of day to workout for easy lookup
  const workoutMap = new Map<string, WorkoutDay>()
  workouts.forEach(workout => {
    workoutMap.set(workout.day, workout)
  })

  // Get unique workout types for legend
  const uniqueTypes = new Set(workouts.map(w => w.type).filter(Boolean))

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map(day => {
            const workout = workoutMap.get(day)
            const type = workout?.type || 'rest'
            const config = WORKOUT_TYPES[type]

            return (
              <div
                key={day}
                className={`
                  relative rounded-lg border transition-all
                  ${config.bgColor} ${config.borderColor}
                  ${workout ? 'hover:scale-105 cursor-pointer' : ''}
                  p-2 text-center group
                `}
              >
                <div className="text-xs font-medium text-gray-400 mb-1">
                  {day}
                </div>
                <div className="text-lg">
                  {config.icon}
                </div>
                
                {/* Tooltip on hover */}
                {workout && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                      <div className={`font-medium ${config.textColor} mb-1`}>
                        {config.label}
                      </div>
                      {workout.focus && (
                        <div className="text-gray-400">
                          {workout.focus}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {showLegend && uniqueTypes.size > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
            {Array.from(uniqueTypes).map(type => {
              const config = WORKOUT_TYPES[type as keyof typeof WORKOUT_TYPES]
              return (
                <div
                  key={type}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <span>{config.icon}</span>
                  <span className={config.textColor}>{config.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Full variant with more details
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-blue-400" />
        <h4 className="text-sm font-medium text-white">Weekly Schedule</h4>
      </div>

      <div className="space-y-2">
        {DAYS_OF_WEEK.map(day => {
          const workout = workoutMap.get(day)
          const type = workout?.type || 'rest'
          const config = WORKOUT_TYPES[type]

          return (
            <div
              key={day}
              className={`
                rounded-lg border p-3 transition-all
                ${config.bgColor} ${config.borderColor}
                ${workout ? 'hover:scale-[1.02]' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {config.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {day}
                    </div>
                    <div className={`text-xs ${config.textColor}`}>
                      {config.label}
                    </div>
                  </div>
                </div>

                {workout?.focus && (
                  <div className="text-xs text-gray-400">
                    {workout.focus}
                  </div>
                )}
              </div>

              {workout?.exercises && workout.exercises.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-700/50">
                  <div className="flex flex-wrap gap-1">
                    {workout.exercises.slice(0, 3).map((exercise, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-slate-800/50 rounded text-gray-400"
                      >
                        {exercise}
                      </span>
                    ))}
                    {workout.exercises.length > 3 && (
                      <span className="text-xs px-2 py-0.5 text-gray-500">
                        +{workout.exercises.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
