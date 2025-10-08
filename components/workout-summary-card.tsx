'use client'

import { Trophy, TrendingUp, Zap, Clock, Dumbbell, Target } from 'lucide-react'
import { ExerciseData } from './enhanced-set-log'

interface WorkoutSummaryCardProps {
  exercises: ExerciseData[]
  duration: number // in seconds
  onSave: () => void
  onDiscard: () => void
}

export function WorkoutSummaryCard({
  exercises,
  duration,
  onSave,
  onDiscard
}: WorkoutSummaryCardProps) {
  // Calculate total volume (weight × reps)
  const totalVolume = exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((exTotal, set) => {
        return exTotal + ((set.weight || 0) * (set.reps || 0))
      }, 0)
    )
  }, 0)

  // Calculate total sets completed
  const totalSets = exercises.reduce((total, exercise) => {
    return total + exercise.sets.filter((s) => s.isCompleted).length
  }, 0)

  // Calculate average RPE
  const completedSetsWithRPE = exercises.flatMap((ex) =>
    ex.sets.filter((s) => s.isCompleted && s.rpe)
  )
  const averageRPE =
    completedSetsWithRPE.length > 0
      ? completedSetsWithRPE.reduce((sum, s) => sum + (s.rpe || 0), 0) / completedSetsWithRPE.length
      : 0

  // Count failure sets
  const failureSets = exercises.reduce((total, exercise) => {
    return total + exercise.sets.filter((s) => s.isToFailure && s.isCompleted).length
  }, 0)

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  // Estimated calories (rough estimate: 5 cal per kg lifted)
  const estimatedCalories = Math.round((totalVolume * 0.453592) * 5) // Convert lbs to kg, then multiply by 5

  // Get muscle groups worked (simplified)
  const muscleGroups = exercises.reduce((groups, exercise) => {
    // Simple categorization based on exercise name
    const name = exercise.name.toLowerCase()
    if (name.includes('bench') || name.includes('chest') || name.includes('press')) {
      groups.chest = (groups.chest || 0) + exercise.sets.filter(s => s.isCompleted).length
    }
    if (name.includes('row') || name.includes('pull') || name.includes('lat')) {
      groups.back = (groups.back || 0) + exercise.sets.filter(s => s.isCompleted).length
    }
    if (name.includes('squat') || name.includes('leg') || name.includes('lunge')) {
      groups.legs = (groups.legs || 0) + exercise.sets.filter(s => s.isCompleted).length
    }
    if (name.includes('curl') || name.includes('bicep')) {
      groups.arms = (groups.arms || 0) + exercise.sets.filter(s => s.isCompleted).length
    }
    if (name.includes('shoulder') || name.includes('lateral') || name.includes('overhead')) {
      groups.shoulders = (groups.shoulders || 0) + exercise.sets.filter(s => s.isCompleted).length
    }
    return groups
  }, {} as Record<string, number>)

  const maxSets = Math.max(...Object.values(muscleGroups), 1)

  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-amber-950/50 border-2 border-amber-700 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider">Battle Summary</h2>
          <p className="text-neutral-400 text-sm">Victorious! Here's what you conquered</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {/* Duration */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Duration</span>
          </div>
          <p className="text-2xl font-bold">{formatDuration(duration)}</p>
        </div>

        {/* Total Volume */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Volume</span>
          </div>
          <p className="text-2xl font-bold">{totalVolume.toLocaleString()} lbs</p>
        </div>

        {/* Total Sets */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Sets</span>
          </div>
          <p className="text-2xl font-bold">{totalSets}</p>
        </div>

        {/* Average RPE */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Avg RPE</span>
          </div>
          <p className="text-2xl font-bold">{averageRPE.toFixed(1)}</p>
        </div>

        {/* Failure Sets */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">To Failure</span>
          </div>
          <p className="text-2xl font-bold">{failureSets}</p>
        </div>

        {/* Calories */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Calories</span>
          </div>
          <p className="text-2xl font-bold">~{estimatedCalories}</p>
        </div>
      </div>

      {/* Muscle Groups */}
      {Object.keys(muscleGroups).length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-neutral-300 uppercase tracking-wider">Muscle Groups Engaged</h3>
          <div className="space-y-2">
            {Object.entries(muscleGroups).map(([muscle, sets]) => (
              <div key={muscle}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="capitalize text-neutral-400 font-bold">{muscle}</span>
                  <span className="text-neutral-500">{sets} sets</span>
                </div>
                <div className="w-full bg-neutral-950 border-2 border-neutral-900 h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-700 to-amber-600 h-2 transition-all duration-500"
                    style={{ width: `${(sets / maxSets) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-3 text-neutral-300 uppercase tracking-wider">Techniques Executed</h3>
        <div className="space-y-2">
          {exercises.map((exercise) => {
            const completedSets = exercise.sets.filter((s) => s.isCompleted).length
            return (
              <div
                key={exercise.id}
                className="flex items-center justify-between bg-neutral-950 border-2 border-neutral-900 p-3"
              >
                <span className="font-bold uppercase tracking-wider">{exercise.name}</span>
                <span className="text-sm text-neutral-400">
                  {completedSets} / {exercise.sets.length} sets
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          className="flex-1 px-6 py-3 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-black uppercase tracking-wider transition-all"
        >
          Save Battle
        </button>
        <button
          onClick={onDiscard}
          className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 font-bold uppercase tracking-wider transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  )
}
