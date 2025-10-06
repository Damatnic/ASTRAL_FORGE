'use client'

/**
 * Challenge System Demo Page
 * 
 * Showcases the new professional challenge system
 * without fantasy elements.
 */

import { useState } from 'react'
import { ChallengeBoard } from '@/components/challenge-board'
import { Challenge, ChallengeSystem } from '@/lib/challenge-system'

export default function ChallengesDemo() {
  // Sample user stats
  const sampleUserStats = {
    totalWorkouts: 42,
    currentStreak: 7,
    totalVolume: 125000,
    weeklyWorkouts: 4,
    monthlyWorkouts: 16,
    tier: 'Intermediate',
    bodyweight: 80,
    benchPR: 100,
    squatPR: 140,
    deadliftPR: 180,
  }

  // Generate sample challenges
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const daily = ChallengeSystem.generateDailyChallenges(sampleUserStats)
    const weekly = ChallengeSystem.generateWeeklyChallenges(sampleUserStats)
    const progression = ChallengeSystem.generateProgressionChallenges(sampleUserStats)
    const advanced = ChallengeSystem.generateAdvancedChallenges(sampleUserStats)

    // Simulate some progress
    const allChallenges = [...daily, ...weekly, ...progression, ...advanced]
    
    // Add some progress to first daily challenge
    if (allChallenges[0]) {
      allChallenges[0] = ChallengeSystem.updateChallengeProgress(allChallenges[0], {
        workoutCompleted: true,
      })
    }

    // Add progress to volume challenge
    if (allChallenges[1]) {
      allChallenges[1] = ChallengeSystem.updateChallengeProgress(allChallenges[1], {
        totalVolume: 1200,
      })
    }

    // Complete a progression challenge
    if (allChallenges[6]) {
      allChallenges[6] = ChallengeSystem.updateChallengeProgress(allChallenges[6], {
        prSet: true,
      })
    }

    // Mark one as active
    if (allChallenges[3]) {
      allChallenges[3] = ChallengeSystem.activateChallenge(allChallenges[3])
    }

    return allChallenges
  })

  // Simulate workout completion
  const handleCompleteWorkout = () => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.type === 'daily'
          ? ChallengeSystem.updateChallengeProgress(c, { workoutCompleted: true })
          : c
      )
    )
  }

  // Simulate volume addition
  const handleAddVolume = () => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.category === 'volume'
          ? ChallengeSystem.updateChallengeProgress(c, { totalVolume: 500 })
          : c
      )
    )
  }

  // Simulate high RPE set
  const handleHighRPESet = () => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.category === 'strength'
          ? ChallengeSystem.updateChallengeProgress(c, { highRPESets: 1 })
          : c
      )
    )
  }

  // Simulate PR
  const handleSetPR = () => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === 'progression-pr'
          ? ChallengeSystem.updateChallengeProgress(c, { prSet: true })
          : c
      )
    )
  }

  // Handle reward claim
  const handleRewardClaim = (challengeId: string) => {
    alert(`Claimed rewards for challenge: ${challengeId}`)
    // In production, this would call the API and update state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
            Challenge System Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Professional training challenges without fantasy elements
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl mb-1">💪</div>
            <div className="text-sm text-gray-400">Tier</div>
            <div className="text-xl font-bold text-white">{sampleUserStats.tier}</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm text-gray-400">Streak</div>
            <div className="text-xl font-bold text-orange-400">
              {sampleUserStats.currentStreak} days
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-400">Total Volume</div>
            <div className="text-xl font-bold text-blue-400">
              {(sampleUserStats.totalVolume / 1000).toFixed(0)}k kg
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm text-gray-400">Total Workouts</div>
            <div className="text-xl font-bold text-green-400">
              {sampleUserStats.totalWorkouts}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">
            🎮 Test Controls (Simulate Progress)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={handleCompleteWorkout}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              ✅ Complete Workout
            </button>
            <button
              onClick={handleAddVolume}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              📊 Add 500kg Volume
            </button>
            <button
              onClick={handleHighRPESet}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              🔥 High RPE Set
            </button>
            <button
              onClick={handleSetPR}
              className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
            >
              🏆 Set PR
            </button>
          </div>
        </div>

        {/* Challenge Board */}
        <ChallengeBoard challenges={challenges} onRewardClaim={handleRewardClaim} />

        {/* Info Section */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">
            ✨ What&apos;s Different?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-red-400 mb-3">❌ Old (Fantasy)</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• &quot;⚔️ RAID: Full Body Domination&quot;</li>
                <li>• &quot;👹 BOSS: The Iron Giant&quot;</li>
                <li>• Quest lore and fantasy descriptions</li>
                <li>• &quot;Nightmare&quot; difficulty</li>
                <li>• Gold rewards and mystery loot</li>
                <li>• Reroll mechanics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-3">
                ✅ New (Professional)
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>• &quot;Complete Full Body Training Week&quot;</li>
                <li>• &quot;Set a Personal Record&quot;</li>
                <li>• Clear, realistic descriptions</li>
                <li>• Beginner/Intermediate/Advanced/Elite</li>
                <li>• Progress points and unlocks</li>
                <li>• Metrics-based progression</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Features */}
        <div className="mt-8 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">🔧 System Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-3xl mb-2">📅</div>
              <h4 className="font-bold text-white mb-2">Time-Based Resets</h4>
              <p className="text-sm text-gray-400">
                Daily challenges reset at midnight, weekly on Monday
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-white mb-2">Progress Tracking</h4>
              <p className="text-sm text-gray-400">
                Real-time progress updates based on workout data
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-white mb-2">Clear Objectives</h4>
              <p className="text-sm text-gray-400">
                Every challenge has specific, measurable goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
