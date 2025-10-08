'use client'

/**
 * ACHIEVEMENT MODAL COMPONENT
 * 
 * Epic achievement detail popup with rarity-based styling, progress visualization,
 * unlock requirements, rewards, and sharing functionality.
 * 
 * Features:
 * - Rarity-based gradient borders and glows
 * - Animated entrance/exit
 * - Progress ring for locked achievements
 * - Requirements checklist with completion status
 * - Reward showcase
 * - Share functionality
 * - Keyboard navigation (ESC to close)
 * - Click outside to close
 */

import { useEffect } from 'react'
import { X, Share2, Lock, CheckCircle, Circle, Trophy, Sparkles, Crown, Star } from 'lucide-react'
import { Achievement, AchievementRarity } from './achievement-gallery'

interface AchievementModalProps {
  achievement: Achievement | null
  isOpen: boolean
  onClose: () => void
}

export function AchievementModal({ achievement, isOpen, onClose }: AchievementModalProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !achievement) return null

  // Get rarity colors and effects
  const getRarityColor = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case 'common': return '#9ca3af'
      case 'rare': return '#3b82f6'
      case 'epic': return '#a855f7'
      case 'legendary': return '#f59e0b'
      case 'mythic': return '#ec4899'
      default: return '#6b7280'
    }
  }

  const getRarityGradient = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'rare': return 'from-blue-500 to-cyan-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'legendary': return 'from-amber-500 to-orange-500'
      case 'mythic': return 'from-pink-500 via-purple-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRarityBorderGlow = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/50'
      case 'rare': return 'shadow-blue-500/50'
      case 'epic': return 'shadow-purple-500/50'
      case 'legendary': return 'shadow-amber-500/50'
      case 'mythic': return 'shadow-pink-500/50'
      default: return 'shadow-gray-500/50'
    }
  }

  const getRarityName = (rarity: AchievementRarity): string => {
    return rarity.toUpperCase()
  }

  const getRarityIcon = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />
      case 'rare': return <Sparkles className="w-4 h-4" />
      case 'epic': return <Trophy className="w-4 h-4" />
      case 'legendary': return <Crown className="w-4 h-4" />
      case 'mythic': return <Crown className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const progressPercentage = achievement.unlocked 
    ? 100 
    : (achievement.progress / achievement.maxProgress) * 100

  const handleShare = () => {
    const text = `I just unlocked "${achievement.name}" in Astral Forge! ${achievement.description}`
    if (navigator.share) {
      navigator.share({
        title: achievement.name,
        text: text,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(text)
      })
    } else {
      navigator.clipboard.writeText(text)
      // Could show a toast notification here
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="pointer-events-auto w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="relative p-6 border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Icon and Title Section */}
            <div className="text-center space-y-4">
              {/* Achievement Icon with rarity glow */}
              <div className="relative inline-block">
                <div 
                  className={`absolute inset-0 rounded-full blur-2xl opacity-50 bg-gradient-to-r ${getRarityGradient(achievement.rarity)} animate-pulse`}
                />
                <div 
                  className={`relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getRarityGradient(achievement.rarity)} p-1 shadow-2xl ${getRarityBorderGlow(achievement.rarity)}`}
                >
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                    <span className="text-6xl">{achievement.icon}</span>
                  </div>
                </div>
                
                {/* Lock icon for locked achievements */}
                {!achievement.unlocked && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Rarity Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-full">
                <div style={{ color: getRarityColor(achievement.rarity) }}>
                  {getRarityIcon(achievement.rarity)}
                </div>
                <span 
                  className="text-sm font-bold tracking-wider"
                  style={{ color: getRarityColor(achievement.rarity) }}
                >
                  {getRarityName(achievement.rarity)}
                </span>
              </div>

              {/* Achievement Name */}
              <h2 className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {achievement.name}
              </h2>

              {/* Description */}
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                {achievement.description}
              </p>

              {/* Unlock Date (if unlocked) */}
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Section (for locked achievements) */}
            {!achievement.unlocked && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-semibold">
                    {achievement.progress} / {achievement.maxProgress}
                  </span>
                </div>
                <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getRarityGradient(achievement.rarity)} transition-all duration-500`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Requirements Checklist */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Requirements
              </h3>
              <div className="space-y-2 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                {achievement.requirements.map((req, index) => {
                  const isComplete = achievement.unlocked || (achievement.progress >= achievement.maxProgress)
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                    >
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={isComplete ? 'text-gray-300' : 'text-gray-500'}>
                        {req}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reward Section */}
            {achievement.reward && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Reward
                </h3>
                <div className={`p-4 rounded-xl bg-gradient-to-r ${getRarityGradient(achievement.rarity)} bg-opacity-10 border border-slate-700`}>
                  <p className="text-center text-white font-semibold text-lg">
                    {achievement.reward}
                  </p>
                </div>
              </div>
            )}

            {/* Category Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Category:</span>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg capitalize">
                {achievement.category}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-800 flex gap-3">
            {achievement.unlocked && (
              <button
                onClick={handleShare}
                className="flex-1 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl text-blue-400 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Achievement
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-gray-300 font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
