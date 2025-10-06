/**
 * TRAINING MILESTONES PAGE
 * 
 * Professional training milestone tracking system.
 * Replaces fantasy RPG skill trees with real fitness benchmarks.
 * 
 * Features:
 * - Strength milestones (bench/squat/deadlift)
 * - Volume achievements (100k, 1M, 10M kg)
 * - Consistency streaks (7/30/90/365 days)
 * - Endurance goals (pull-ups, push-ups)
 * - Technique certifications
 */

import { MilestoneSystem, UserStats } from '@/lib/milestone-system'
import { MilestoneTracker } from '@/components/milestone-tracker'
import { ParticleBackground } from '@/components/particle-background'

export const metadata = {
  title: 'Training Milestones | Astral Power',
  description: 'Track your fitness milestones and achievements',
}

export default async function MilestonesPage() {
  // Sample user stats for demonstration
  // In production, this would come from your database
  const userStats: UserStats = {
    userId: 'demo-user',
    bodyweight: 80, // kg
    totalVolume: 750000, // Total kg lifted
    currentStreak: 12, // Current workout streak (days)
    maxStreak: 42, // Longest streak ever
    totalWorkouts: 156, // Total workouts completed
    personalRecords: {
      'Bench Press': { weight: 87.5, reps: 5, date: new Date('2025-12-01') },
      'Squat': { weight: 120, reps: 5, date: new Date('2025-12-03') },
      'Deadlift': { weight: 150, reps: 5, date: new Date('2025-11-28') },
      'Pull-ups': { weight: 0, reps: 12, date: new Date('2025-12-04') },
      'Push-ups': { weight: 0, reps: 45, date: new Date('2025-12-02') },
    },
    exerciseMastery: {
      'Squat': 'mastered',
      'Bench Press': 'proficient',
      'Deadlift': 'proficient',
    },
    weightHistory: [],
  }

  // Generate all milestones with progress
  const allMilestones = MilestoneSystem.generateMilestones(userStats)
  const nextGoals = MilestoneSystem.getNextMilestones(userStats, 5)
  const recentlyEarned = MilestoneSystem.getRecentlyEarned(userStats, 5)
  const completionStats = MilestoneSystem.getCompletionStats(userStats)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 sm:p-6 relative overflow-hidden">
      <ParticleBackground particleCount={30} />

      {/* Page Header */}
      <div className="relative max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            TRAINING MILESTONES
          </span>
        </h1>
        <p className="text-center text-purple-200/80 text-lg max-w-2xl mx-auto">
          Track your strength benchmarks, volume achievements, and training consistency
        </p>
      </div>

      {/* Stats Overview */}
      <div className="relative max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl p-6 border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <div className="text-sm text-purple-300 mb-1">Overall Progress</div>
            <div className="text-3xl font-black text-white mb-2">
              {completionStats.completionPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">
              {completionStats.completed} / {completionStats.total} milestones
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-6 border-2 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="text-sm text-blue-300 mb-1">In Progress</div>
            <div className="text-3xl font-black text-white mb-2">
              {completionStats.inProgress}
            </div>
            <div className="text-xs text-gray-400">Active milestones</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-xl p-6 border-2 border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <div className="text-sm text-orange-300 mb-1">Total Points</div>
            <div className="text-3xl font-black text-white mb-2">
              {allMilestones
                .filter(m => m.isCompleted)
                .reduce((sum, m) => sum + m.points, 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">From completed milestones</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl p-6 border-2 border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <div className="text-sm text-green-300 mb-1">Next Goal</div>
            <div className="text-3xl font-black text-white mb-2">
              {nextGoals.length > 0 ? `${nextGoals[0].progress.toFixed(0)}%` : 'N/A'}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {nextGoals.length > 0 ? nextGoals[0].name : 'Keep training!'}
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Tracker Component */}
      <div className="relative max-w-7xl mx-auto">
        <MilestoneTracker
          milestones={allMilestones}
          nextGoals={nextGoals}
          recentlyEarned={recentlyEarned}
        />
      </div>
    </div>
  )
}
