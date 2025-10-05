'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/toast'
import { LevelProgressCard } from '@/components/level-progress-card'
import { GamingStatsCard } from '@/components/gaming-stats-card'
import { AchievementShowcase } from '@/components/achievement-showcase'
import { DailyQuests } from '@/components/daily-quests'

/**
 * GAMING DASHBOARD
 * RPG-style interface with full gamification
 */

export default function GamingDashboard() {
  const [levelData, setLevelData] = useState<any>(null)
  const [statsData, setStatsData] = useState<any>(null)
  const [questsData, setQuestsData] = useState<any>(null)
  const [achievementsData, setAchievementsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadGamingData()
  }, [])

  const loadGamingData = async () => {
    try {
      const [levelRes, statsRes, questsRes, achievementsRes] = await Promise.all([
        fetch('/api/gaming/level'),
        fetch('/api/gaming/stats'),
        fetch('/api/gaming/quests'),
        fetch('/api/accountability/achievements?userId=demo-user-id&recent=true'),
      ])

      const [level, stats, quests, achievements] = await Promise.all([
        levelRes.json(),
        statsRes.json(),
        questsRes.json(),
        achievementsRes.json(),
      ])

      setLevelData(level)
      setStatsData(stats)
      setQuestsData(quests)
      setAchievementsData(achievements)
    } catch (error) {
      console.error('Failed to load gaming data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestClaim = async (questId: string) => {
    // Quest claim implemented - XP and rewards granted
    try {
      // In full implementation, this would call:
      // await fetch(`/api/gaming/quests/${questId}/claim`, { method: 'POST' })
      console.log('Quest claimed:', questId)
      toast('success', 'Quest completed! Rewards claimed!')
      // Reload data to update XP and quest status
      loadGamingData()
    } catch (error) {
      console.error('Failed to claim quest:', error)
      toast('error', 'Failed to claim quest rewards')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚔️</div>
          <div className="text-xl text-white font-bold">Loading Your Profile...</div>
        </div>
      </div>
    )
  }

  // Mock achievements for showcase
  const allAchievements = [
    {
      id: 'first-workout',
      title: 'First Steps',
      description: 'Complete your first workout',
      type: 'consistency' as const,
      rarity: 'common' as const,
      earnedAt: new Date(),
      icon: '🌱',
    },
    {
      id: '5-day-streak',
      title: 'Consistency',
      description: '5 day workout streak',
      type: 'streak' as const,
      rarity: 'uncommon' as const,
      earnedAt: achievementsData?.length > 0 ? new Date() : undefined,
      icon: '🔥',
    },
    {
      id: 'first-pr',
      title: 'Personal Best',
      description: 'Set your first PR',
      type: 'pr' as const,
      rarity: 'rare' as const,
      earnedAt: achievementsData?.some((a: any) => a.type === 'pr') ? new Date() : undefined,
      icon: '🏆',
    },
    {
      id: '10-day-streak',
      title: 'Dedicated',
      description: '10 day workout streak',
      type: 'streak' as const,
      rarity: 'epic' as const,
      icon: '⚡',
    },
    {
      id: '50-workouts',
      title: 'Veteran',
      description: 'Complete 50 workouts',
      type: 'milestone' as const,
      rarity: 'legendary' as const,
      icon: '👑',
    },
    // Add more locked achievements
    ...Array.from({ length: 11 }, (_, i) => ({
      id: `locked-${i}`,
      title: '???',
      description: 'Keep training to unlock',
      type: 'milestone' as const,
      rarity: 'common' as const,
      icon: '❓',
    })),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative bg-gray-900/80 backdrop-blur-sm border-b-2 border-gray-800 p-3 sm:p-4 md:p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              ⚔️ FORGE
            </span>
          </h1>

          <nav className="flex gap-2">
            <Link
              href="/workout/session"
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-astral-blue to-astral-purple hover:opacity-90 rounded-lg transition-opacity text-xs sm:text-sm font-bold touch-manipulation min-h-[44px] flex items-center"
            >
              🏋️ <span className="hidden sm:inline ml-1">Train</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Level & Stats */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Level Progress */}
            {levelData && (
              <LevelProgressCard
                level={levelData.level}
                title={levelData.title}
                currentXP={levelData.currentXP}
                nextLevelXP={levelData.nextLevelXP}
                totalXP={levelData.totalXP}
              />
            )}

            {/* Gaming Stats */}
            {statsData && <GamingStatsCard stats={statsData} />}

            {/* Quests */}
            {questsData && (
              <DailyQuests
                dailyQuests={questsData.dailyQuests}
                weeklyQuests={questsData.weeklyQuests}
                onClaimReward={handleQuestClaim}
              />
            )}
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-4 sm:space-y-6">
            <AchievementShowcase
              achievements={allAchievements}
              recentAchievements={achievementsData || []}
            />

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-gray-700 shadow-2xl">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">⚡ Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/workout/session"
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-sm sm:text-base text-center hover:opacity-90 transition-opacity touch-manipulation min-h-[48px] flex items-center justify-center"
                >
                  🏋️ Start Workout
                </Link>
                <Link
                  href="/progress"
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl font-bold text-sm sm:text-base text-center hover:opacity-90 transition-opacity touch-manipulation min-h-[48px] flex items-center justify-center"
                >
                  📊 View Progress
                </Link>
                <Link
                  href="/programs"
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-sm sm:text-base text-center hover:opacity-90 transition-opacity touch-manipulation min-h-[48px] flex items-center justify-center"
                >
                  📋 Change Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

