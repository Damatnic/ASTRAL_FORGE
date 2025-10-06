'use client'

/**
 * MILESTONE TRACKER COMPONENT
 * 
 * Professional UI for displaying training milestones and achievements.
 * Shows progress, completion status, and suggests next goals.
 * 
 * Features:
 * - Badge showcase for earned milestones
 * - Progress tracking for incomplete milestones
 * - "Next Goals" section (3-5 nearest achievements)
 * - Category filters (strength/volume/consistency/endurance/technique)
 * - Sort options (closest/recently earned/difficulty)
 */

import React, { useState } from 'react'
import {
  TrainingMilestone,
  MilestoneCategory,
  MilestoneTier,
} from '@/lib/milestone-system'

interface MilestoneTrackerProps {
  milestones: TrainingMilestone[]
  nextGoals?: TrainingMilestone[]
  recentlyEarned?: TrainingMilestone[]
  onMilestoneClick?: (milestone: TrainingMilestone) => void
}

type FilterCategory = MilestoneCategory | 'all'
type SortOption = 'progress' | 'tier' | 'category' | 'recent'

export function MilestoneTracker({
  milestones,
  nextGoals = [],
  recentlyEarned = [],
  onMilestoneClick,
}: MilestoneTrackerProps) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [sortBy, setSortBy] = useState<SortOption>('progress')
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false)

  /**
   * Get color scheme for milestone tier
   */
  const getTierColor = (tier: MilestoneTier): { bg: string; border: string; text: string; glow: string } => {
    switch (tier) {
      case 'beginner':
        return {
          bg: 'from-green-900/20 to-green-800/20',
          border: 'border-green-500/30',
          text: 'text-green-400',
          glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
        }
      case 'novice':
        return {
          bg: 'from-blue-900/20 to-blue-800/20',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
        }
      case 'intermediate':
        return {
          bg: 'from-purple-900/20 to-purple-800/20',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
        }
      case 'advanced':
        return {
          bg: 'from-orange-900/20 to-orange-800/20',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]',
        }
      case 'elite':
        return {
          bg: 'from-red-900/20 to-red-800/20',
          border: 'border-red-500/30',
          text: 'text-red-400',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
        }
      case 'world-class':
        return {
          bg: 'from-amber-900/20 to-yellow-800/20',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
        }
    }
  }

  /**
   * Get category icon and color
   */
  const getCategoryInfo = (category: MilestoneCategory): { icon: string; color: string; label: string } => {
    switch (category) {
      case 'strength':
        return { icon: '💪', color: 'text-orange-400', label: 'Strength' }
      case 'volume':
        return { icon: '📊', color: 'text-blue-400', label: 'Volume' }
      case 'consistency':
        return { icon: '🔥', color: 'text-red-400', label: 'Consistency' }
      case 'technique':
        return { icon: '🎯', color: 'text-green-400', label: 'Technique' }
      case 'endurance':
        return { icon: '🏃', color: 'text-purple-400', label: 'Endurance' }
      case 'body-recomp':
        return { icon: '📈', color: 'text-pink-400', label: 'Body Recomp' }
    }
  }

  /**
   * Filter and sort milestones
   */
  const getFilteredMilestones = () => {
    let filtered = milestones

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(m => m.category === filterCategory)
    }

    // Filter by completion status
    if (showOnlyIncomplete) {
      filtered = filtered.filter(m => !m.isCompleted)
    }

    // Sort
    switch (sortBy) {
      case 'progress':
        filtered = [...filtered].sort((a, b) => {
          // Completed last, then by progress descending
          if (a.isCompleted && !b.isCompleted) return 1
          if (!a.isCompleted && b.isCompleted) return -1
          return b.progress - a.progress
        })
        break
      case 'tier':
        const tierOrder: MilestoneTier[] = ['beginner', 'novice', 'intermediate', 'advanced', 'elite', 'world-class']
        filtered = [...filtered].sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier))
        break
      case 'category':
        filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category))
        break
      case 'recent':
        filtered = [...filtered].sort((a, b) => {
          if (!a.dateEarned || !b.dateEarned) return 0
          return b.dateEarned.getTime() - a.dateEarned.getTime()
        })
        break
    }

    return filtered
  }

  /**
   * Render individual milestone card
   */
  const renderMilestoneCard = (milestone: TrainingMilestone) => {
    const tierColors = getTierColor(milestone.tier)
    const categoryInfo = getCategoryInfo(milestone.category)
    const isLocked = milestone.progress === 0 && !milestone.isCompleted

    return (
      <div
        key={milestone.id}
        onClick={() => onMilestoneClick?.(milestone)}
        className={`
          relative rounded-xl p-6 border-2 
          bg-gradient-to-br ${tierColors.bg}
          ${tierColors.border}
          ${tierColors.glow}
          transition-all duration-300
          ${onMilestoneClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
          ${isLocked ? 'opacity-50 grayscale' : ''}
          ${milestone.isCompleted ? 'ring-2 ring-green-500/30' : ''}
        `}
      >
        {/* Completion Badge */}
        {milestone.isCompleted && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <span className="text-xs font-bold text-green-400">✓ EARNED</span>
            </div>
          </div>
        )}

        {/* Category Icon */}
        <div className="absolute top-3 left-3">
          <div className={`text-2xl ${categoryInfo.color}`}>
            {categoryInfo.icon}
          </div>
        </div>

        {/* Tier Badge */}
        <div className="flex justify-end mb-2">
          <div className={`px-2 py-1 rounded-full ${tierColors.bg} border ${tierColors.border}`}>
            <span className={`text-xs font-bold uppercase ${tierColors.text}`}>
              {milestone.tier}
            </span>
          </div>
        </div>

        {/* Milestone Badge & Name */}
        <div className="text-center mb-3 mt-6">
          <div className="text-5xl mb-2">{milestone.badge}</div>
          <h3 className="text-xl font-bold text-white mb-1">
            {milestone.name}
          </h3>
          <p className="text-sm text-gray-400">
            {milestone.description}
          </p>
        </div>

        {/* Progress Bar */}
        {!milestone.isCompleted && milestone.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{milestone.progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${
                  milestone.progress >= 80 ? 'from-green-500 to-emerald-500' :
                  milestone.progress >= 50 ? 'from-blue-500 to-cyan-500' :
                  'from-gray-500 to-gray-400'
                } transition-all duration-500`}
                style={{ width: `${milestone.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Requirement Details */}
        <div className="mb-4 p-3 bg-black/30 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Requirement</div>
          <div className="text-sm text-white">
            {renderRequirement(milestone.requirement)}
          </div>
        </div>

        {/* Unlocks */}
        {milestone.unlocks.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-1">Unlocks</div>
            <div className="flex flex-wrap gap-1">
              {milestone.unlocks.map((unlock, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300"
                >
                  {unlock}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Points */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            {categoryInfo.label}
          </span>
          <span className="font-bold text-amber-400">
            +{milestone.points} pts
          </span>
        </div>

        {/* Date Earned */}
        {milestone.isCompleted && milestone.dateEarned && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Earned {milestone.dateEarned.toLocaleDateString()}
          </div>
        )}
      </div>
    )
  }

  /**
   * Render requirement description
   */
  const renderRequirement = (req: TrainingMilestone['requirement']): string => {
    switch (req.type) {
      case 'absolute-strength':
        return `${req.exercise}: ${req.weight}kg for ${req.reps} reps`
      case 'relative-strength':
        return `${req.exercise}: ${req.ratio}x bodyweight for ${req.reps} reps`
      case 'volume':
        return `Total volume: ${req.totalKg.toLocaleString()}kg`
      case 'consistency':
        return `${req.streakDays} consecutive days with workouts`
      case 'endurance':
        return `${req.exercise}: ${req.reps} unbroken reps`
      case 'technique':
        return `${req.exercise}: ${req.criteria}`
      case 'body-recomp':
        return `${req.metric}: ${req.amount}kg in ${req.timeframe} days`
    }
  }

  const filteredMilestones = getFilteredMilestones()
  const completedCount = milestones.filter(m => m.isCompleted).length
  const completionPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl p-6 border-2 border-purple-500/30">
          <div className="text-3xl font-black text-white mb-1">
            {completedCount}/{milestones.length}
          </div>
          <div className="text-sm text-gray-400">Milestones Earned</div>
          <div className="mt-2 text-xs text-purple-400">
            {completionPercentage.toFixed(1)}% Complete
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl p-6 border-2 border-blue-500/30">
          <div className="text-3xl font-black text-white mb-1">
            {milestones.filter(m => m.progress > 0 && !m.isCompleted).length}
          </div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 rounded-xl p-6 border-2 border-orange-500/30">
          <div className="text-3xl font-black text-white mb-1">
            {nextGoals.length}
          </div>
          <div className="text-sm text-gray-400">Next Goals</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl p-6 border-2 border-green-500/30">
          <div className="text-3xl font-black text-white mb-1">
            {milestones.reduce((sum, m) => sum + (m.isCompleted ? m.points : 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Points</div>
        </div>
      </div>

      {/* Next Goals Section */}
      {nextGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🎯 Next Goals
            <span className="text-sm font-normal text-gray-400">
              (Closest to completion)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nextGoals.map(milestone => renderMilestoneCard(milestone))}
          </div>
        </div>
      )}

      {/* Recently Earned Section */}
      {recentlyEarned.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            ⭐ Recently Earned
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyEarned.map(milestone => renderMilestoneCard(milestone))}
          </div>
        </div>
      )}

      {/* Filters & Controls */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="strength">💪 Strength</option>
              <option value="volume">📊 Volume</option>
              <option value="consistency">🔥 Consistency</option>
              <option value="endurance">🏃 Endurance</option>
              <option value="technique">🎯 Technique</option>
              <option value="body-recomp">📈 Body Recomp</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="progress">Progress</option>
              <option value="tier">Difficulty Tier</option>
              <option value="category">Category</option>
              <option value="recent">Recently Earned</option>
            </select>
          </div>

          {/* Show Only Incomplete Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyIncomplete}
              onChange={(e) => setShowOnlyIncomplete(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-400">Show only incomplete</span>
          </label>
        </div>
      </div>

      {/* All Milestones Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          All Milestones ({filteredMilestones.length})
        </h2>
        
        {filteredMilestones.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400">No milestones match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMilestones.map(milestone => renderMilestoneCard(milestone))}
          </div>
        )}
      </div>
    </div>
  )
}
