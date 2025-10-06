'use client'

import React from 'react'
import { TrendingUp, Trophy, Target, CheckCircle2 } from 'lucide-react'
import {
  calculateUserTier,
  getTierBadge,
  getTierProgressionRecommendations,
  TIER_DEFINITIONS,
} from '@/lib/training-tiers'

interface TierProgressCardProps {
  stats: {
    bodyweight: number
    benchPress1RM?: number
    squat1RM?: number
    deadlift1RM?: number
    totalWorkouts: number
    trainingMonths: number
    consistencyRate: number
    currentStreak?: number
  }
  className?: string
}

export default function TierProgressCard({ stats, className = '' }: TierProgressCardProps) {
  const tierData = calculateUserTier(stats)
  const badge = getTierBadge(tierData.currentTier)
  const tierInfo = TIER_DEFINITIONS[tierData.currentTier]
  const recommendations = getTierProgressionRecommendations(tierData, stats)

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Training Tier</h3>
        <Trophy className="w-5 h-5 text-yellow-400" />
      </div>

      {/* Current Tier Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r ${badge.gradient}`}>
          <span className="text-3xl">{badge.icon}</span>
          <div>
            <div className="text-xl font-bold text-white">{badge.name}</div>
            <div className="text-sm text-white/80">{tierInfo.duration}</div>
          </div>
        </div>
        <p className="mt-3 text-gray-400 text-sm">{tierInfo.description}</p>
      </div>

      {/* Progress to Next Tier */}
      {tierData.nextTier && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Progress to {TIER_DEFINITIONS[tierData.nextTier].name}
            </span>
            <span className="text-sm font-semibold text-purple-400">
              {tierData.tierProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
              style={{ width: `${tierData.tierProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tier Benefits */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          Current Tier Benefits
        </h4>
        <ul className="space-y-1">
          {tierInfo.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            Next Steps
          </h4>
          <ul className="space-y-2">
            {recommendations.slice(0, 3).map((rec, index) => (
              <li
                key={index}
                className="text-sm text-gray-400 flex items-start gap-2 p-2 bg-gray-900 rounded"
              >
                <TrendingUp className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Master Tier Message */}
      {!tierData.nextTier && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Master Tier Achieved!</span>
          </div>
          <p className="text-sm text-gray-300">
            You&apos;ve reached the highest training tier. Continue maintaining your strength and
            consider mentoring others in their fitness journey.
          </p>
        </div>
      )}
    </div>
  )
}
