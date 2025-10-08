'use client'

/**
 * ACHIEVEMENTS PAGE
 * 
 * Epic achievement showcase with rarity-based collection system.
 * Features filterable gallery, unlock notifications, and milestone rewards.
 */

import { useState } from 'react'
import { AppLayout, PageContainer, PageHeader } from '@/components/layout'
import { AchievementGallery, Achievement, AchievementRarity } from '@/components/achievement-gallery'
import { AchievementModal } from '@/components/achievement-modal'
import { Trophy, Award, Star, Crown } from 'lucide-react'

export default function AchievementsPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Mock achievements data (in real app, fetch from database)
  const [achievements] = useState<Achievement[]>([
    // COMBAT ACHIEVEMENTS
    {
      id: 'first-blood',
      name: 'First Blood',
      description: 'Complete your first workout session',
      icon: '⚔️',
      rarity: 'common',
      category: 'combat',
      unlocked: true,
      unlockedAt: new Date('2024-09-15'),
      progress: 1,
      maxProgress: 1,
      requirements: ['Complete 1 workout'],
      reward: '+100 XP'
    },
    {
      id: 'warrior',
      name: 'Warrior',
      description: 'Complete 10 workout sessions',
      icon: '🛡️',
      rarity: 'common',
      category: 'combat',
      unlocked: true,
      unlockedAt: new Date('2024-09-20'),
      progress: 10,
      maxProgress: 10,
      requirements: ['Complete 10 workouts'],
      reward: '+500 XP'
    },
    {
      id: 'champion',
      name: 'Champion',
      description: 'Complete 50 workout sessions',
      icon: '👑',
      rarity: 'rare',
      category: 'combat',
      unlocked: true,
      unlockedAt: new Date('2024-09-28'),
      progress: 50,
      maxProgress: 50,
      requirements: ['Complete 50 workouts'],
      reward: '+2,500 XP, Epic Weapon'
    },
    {
      id: 'legend',
      name: 'Legend',
      description: 'Complete 100 workout sessions',
      icon: '⚡',
      rarity: 'epic',
      category: 'combat',
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      requirements: ['Complete 100 workouts'],
      reward: '+10,000 XP, Legendary Armor'
    },
    {
      id: 'immortal',
      name: 'Immortal Warrior',
      description: 'Complete 500 workout sessions',
      icon: '💀',
      rarity: 'legendary',
      category: 'combat',
      unlocked: false,
      progress: 67,
      maxProgress: 500,
      requirements: ['Complete 500 workouts'],
      reward: '+50,000 XP, Mythic Title'
    },

    // TRAINING ACHIEVEMENTS
    {
      id: 'strength-novice',
      name: 'Strength Novice',
      description: 'Lift 10,000 lbs total',
      icon: '💪',
      rarity: 'common',
      category: 'training',
      unlocked: true,
      unlockedAt: new Date('2024-09-16'),
      progress: 10000,
      maxProgress: 10000,
      requirements: ['Lift 10,000 lbs cumulative'],
      reward: '+250 XP'
    },
    {
      id: 'iron-lifter',
      name: 'Iron Lifter',
      description: 'Lift 100,000 lbs total',
      icon: '🏋️',
      rarity: 'rare',
      category: 'training',
      unlocked: true,
      unlockedAt: new Date('2024-09-25'),
      progress: 100000,
      maxProgress: 100000,
      requirements: ['Lift 100,000 lbs cumulative'],
      reward: '+5,000 XP'
    },
    {
      id: 'titan-strength',
      name: 'Titan Strength',
      description: 'Lift 1,000,000 lbs total',
      icon: '🦾',
      rarity: 'epic',
      category: 'training',
      unlocked: false,
      progress: 340500,
      maxProgress: 1000000,
      requirements: ['Lift 1,000,000 lbs cumulative'],
      reward: '+25,000 XP, Strength Boost'
    },
    {
      id: 'perfect-form',
      name: 'Perfect Form',
      description: 'Complete 50 workouts with 5-star rating',
      icon: '⭐',
      rarity: 'epic',
      category: 'training',
      unlocked: false,
      progress: 12,
      maxProgress: 50,
      requirements: ['Get 5-star rating on 50 workouts'],
      reward: '+15,000 XP, Technique Mastery'
    },

    // SOCIAL ACHIEVEMENTS
    {
      id: 'guild-member',
      name: 'Guild Member',
      description: 'Join a guild',
      icon: '🛡️',
      rarity: 'common',
      category: 'social',
      unlocked: true,
      unlockedAt: new Date('2024-09-17'),
      progress: 1,
      maxProgress: 1,
      requirements: ['Join any guild'],
      reward: '+100 XP'
    },
    {
      id: 'team-player',
      name: 'Team Player',
      description: 'Complete 10 guild challenges',
      icon: '👥',
      rarity: 'rare',
      category: 'social',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
      requirements: ['Complete 10 guild challenges'],
      reward: '+3,000 XP, Guild Badge'
    },
    {
      id: 'guild-master',
      name: 'Guild Master',
      description: 'Reach rank 1 in your guild',
      icon: '👑',
      rarity: 'legendary',
      category: 'social',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      requirements: ['Become rank 1 in guild leaderboard'],
      reward: '+30,000 XP, Guild Master Title'
    },

    // EXPLORATION ACHIEVEMENTS
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Try 10 different exercises',
      icon: '🗺️',
      rarity: 'common',
      category: 'exploration',
      unlocked: true,
      unlockedAt: new Date('2024-09-18'),
      progress: 10,
      maxProgress: 10,
      requirements: ['Complete 10 unique exercises'],
      reward: '+200 XP'
    },
    {
      id: 'pathfinder',
      name: 'Pathfinder',
      description: 'Try 50 different exercises',
      icon: '🧭',
      rarity: 'rare',
      category: 'exploration',
      unlocked: false,
      progress: 24,
      maxProgress: 50,
      requirements: ['Complete 50 unique exercises'],
      reward: '+4,000 XP, Explorer Badge'
    },
    {
      id: 'master-explorer',
      name: 'Master Explorer',
      description: 'Complete all exercise categories',
      icon: '🌟',
      rarity: 'epic',
      category: 'exploration',
      unlocked: false,
      progress: 4,
      maxProgress: 8,
      requirements: ['Complete exercises in all 8 categories'],
      reward: '+20,000 XP, Versatility Bonus'
    },

    // MASTERY ACHIEVEMENTS
    {
      id: 'streak-starter',
      name: 'Streak Starter',
      description: 'Train 7 days in a row',
      icon: '🔥',
      rarity: 'common',
      category: 'mastery',
      unlocked: true,
      unlockedAt: new Date('2024-09-22'),
      progress: 7,
      maxProgress: 7,
      requirements: ['7 day workout streak'],
      reward: '+500 XP'
    },
    {
      id: 'unstoppable',
      name: 'Unstoppable',
      description: 'Train 30 days in a row',
      icon: '♾️',
      rarity: 'rare',
      category: 'mastery',
      unlocked: true,
      unlockedAt: new Date('2024-09-30'),
      progress: 30,
      maxProgress: 30,
      requirements: ['30 day workout streak'],
      reward: '+5,000 XP, Consistency Badge'
    },
    {
      id: 'iron-will',
      name: 'Iron Will',
      description: 'Train 100 days in a row',
      icon: '💎',
      rarity: 'legendary',
      category: 'mastery',
      unlocked: false,
      progress: 45,
      maxProgress: 100,
      requirements: ['100 day workout streak'],
      reward: '+40,000 XP, Iron Will Title, Special Aura'
    },
    {
      id: 'pr-crusher',
      name: 'PR Crusher',
      description: 'Set 25 personal records',
      icon: '📈',
      rarity: 'epic',
      category: 'mastery',
      unlocked: false,
      progress: 8,
      maxProgress: 25,
      requirements: ['Set 25 personal records'],
      reward: '+15,000 XP, PR Tracker'
    },

    // SPECIAL ACHIEVEMENTS
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete a workout before 6 AM',
      icon: '🌅',
      rarity: 'rare',
      category: 'special',
      unlocked: true,
      unlockedAt: new Date('2024-09-19'),
      progress: 1,
      maxProgress: 1,
      requirements: ['Workout before 6:00 AM'],
      reward: '+2,000 XP'
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Complete a workout after 10 PM',
      icon: '🦉',
      rarity: 'rare',
      category: 'special',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      requirements: ['Workout after 10:00 PM'],
      reward: '+2,000 XP'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete a workout in under 20 minutes',
      icon: '⚡',
      rarity: 'epic',
      category: 'special',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      requirements: ['Finish workout in <20 minutes'],
      reward: '+10,000 XP, Speed Boost'
    },
    {
      id: 'collector',
      name: 'The Collector',
      description: 'Unlock 50% of all achievements',
      icon: '🏆',
      rarity: 'legendary',
      category: 'special',
      unlocked: false,
      progress: 10,
      maxProgress: 12, // 50% of 24 achievements
      requirements: ['Unlock 12 achievements'],
      reward: '+35,000 XP, Collector Title'
    },
    {
      id: 'completionist',
      name: 'Completionist',
      description: 'Unlock ALL achievements',
      icon: '💫',
      rarity: 'mythic',
      category: 'special',
      unlocked: false,
      progress: 10,
      maxProgress: 24,
      requirements: ['Unlock all 24 achievements'],
      reward: '+100,000 XP, Mythic Aura, Ultimate Title'
    }
  ])

  // Handle achievement click
  function handleAchievementClick(achievement: Achievement) {
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  // Calculate stats
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const completionRate = Math.round((unlockedCount / totalCount) * 100)

  // Calculate milestone progress
  const milestones = [
    { percentage: 25, count: 6, reward: '5,000 XP + Rare Loot Box', unlocked: unlockedCount >= 6 },
    { percentage: 50, count: 12, reward: '15,000 XP + Epic Loot Box', unlocked: unlockedCount >= 12 },
    { percentage: 75, count: 18, reward: '30,000 XP + Legendary Loot Box', unlocked: unlockedCount >= 18 },
    { percentage: 100, count: 24, reward: '100,000 XP + Mythic Reward', unlocked: unlockedCount >= 24 }
  ]

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Achievements"
          description="Unlock epic rewards and track your legendary journey"
        />

        {/* Stats Overview - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Progress with Circle */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 hover:border-amber-700 transition-colors duration-300">
            <div className="flex flex-col items-center">
              {/* Progress Circle */}
              <div className="relative w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-neutral-800"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient-gold)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionRate / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent mb-1">
                {unlockedCount}/{totalCount}
              </div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Total Unlocked</div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 hover:border-amber-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  {completionRate}%
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Complete</div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-neutral-950 border-2 border-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-700 to-amber-600 transition-all duration-1000 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Legendary Count */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 hover:border-amber-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  {achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Legendary</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-500 font-medium">
              {achievements.filter(a => a.rarity === 'legendary').length} available
            </div>
          </div>

          {/* Rarity Breakdown */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6 hover:border-amber-700 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div className="text-sm font-bold uppercase tracking-wider text-amber-100">Rarity Mix</div>
            </div>
            <div className="space-y-2">
              {['common', 'rare', 'epic', 'legendary', 'mythic'].map(rarity => {
                const count = achievements.filter(a => a.rarity === rarity && a.unlocked).length
                const total = achievements.filter(a => a.rarity === rarity).length
                const rarityColors: Record<string, string> = {
                  common: '#9ca3af',
                  rare: '#3b82f6',
                  epic: '#a855f7',
                  legendary: '#f59e0b',
                  mythic: '#ec4899'
                }
                return (
                  <div key={rarity} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rarityColors[rarity] }}
                    />
                    <div className="text-xs text-gray-400 flex-1">{rarity}</div>
                    <div className="text-xs font-semibold text-white">{count}/{total}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Milestone Rewards */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Crown className="w-7 h-7 text-amber-400" />
            <span>Milestone Rewards</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative rounded-xl p-4 border-2 transition-all ${
                  milestone.unlocked
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                {/* Checkmark for unlocked */}
                {milestone.unlocked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    ✓
                  </div>
                )}

                <div className="text-center">
                  <div className={`text-3xl font-black mb-2 ${
                    milestone.unlocked ? 'text-amber-400' : 'text-gray-600'
                  }`}>
                    {milestone.percentage}%
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {milestone.count}/{achievements.length} achievements
                  </div>
                  <div className={`text-xs font-semibold ${
                    milestone.unlocked ? 'text-amber-400' : 'text-gray-500'
                  }`}>
                    {milestone.reward}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{
                      width: `${Math.min((unlockedCount / milestone.count) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Gallery */}
        <div className="mb-8">
          <AchievementGallery
            achievements={achievements}
            onAchievementClick={handleAchievementClick}
          />
        </div>

        {/* Rarity Legend */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-400" />
            <span>Rarity Tiers</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { rarity: 'common' as AchievementRarity, name: 'Common', icon: '⚪', description: 'Basic achievements', color: '#9ca3af' },
              { rarity: 'rare' as AchievementRarity, name: 'Rare', icon: '🔵', description: 'Requires dedication', color: '#3b82f6' },
              { rarity: 'epic' as AchievementRarity, name: 'Epic', icon: '🟣', description: 'For skilled warriors', color: '#a855f7' },
              { rarity: 'legendary' as AchievementRarity, name: 'Legendary', icon: '🟡', description: 'Elite status', color: '#f59e0b' },
              { rarity: 'mythic' as AchievementRarity, name: 'Mythic', icon: '🌈', description: 'Ultimate glory', color: '#ec4899' }
            ].map(tier => (
              <div 
                key={tier.rarity} 
                className="bg-slate-800/50 rounded-xl p-4 border-2 border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className="text-4xl mb-2 text-center">{tier.icon}</div>
                <div className="text-center">
                  <div className="font-bold text-white mb-1">{tier.name}</div>
                  <div className="text-xs text-gray-400 mb-2">{tier.description}</div>
                  <div className="text-sm font-bold" style={{ color: tier.color }}>
                    {achievements.filter(a => a.rarity === tier.rarity && a.unlocked).length}/
                    {achievements.filter(a => a.rarity === tier.rarity).length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAchievement(null)
        }}
      />
    </AppLayout>
  )
}
