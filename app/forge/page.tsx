'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LevelProgressCard } from '@/components/level-progress-card'
import { GamingStatsCard } from '@/components/gaming-stats-card'
import { AchievementShowcase } from '@/components/achievement-showcase'
import { DailyQuests } from '@/components/daily-quests'

/**
 * THE FORGE - Main Gaming Dashboard
 * Complete RPG-style interface with all features
 */

export default function TheForge() {
  const [levelData, setLevelData] = useState<any>(null)
  const [statsData, setStatsData] = useState<any>(null)
  const [questsData, setQuestsData] = useState<any>(null)
  const [achievementsData, setAchievementsData] = useState<any>(null)
  const [nextWorkout, setNextWorkout] = useState<any>(null)
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'home' | 'train' | 'arsenal' | 'progress'>('home')
  const router = useRouter()

  useEffect(() => {
    loadForgeData()
  }, [])

  const loadForgeData = async () => {
    try {
      const [levelRes, statsRes, questsRes, achievementsRes, workoutRes, sessionsRes] = await Promise.all([
        fetch('/api/gaming/level'),
        fetch('/api/gaming/stats'),
        fetch('/api/gaming/quests'),
        fetch('/api/accountability/achievements?userId=demo-user-id&recent=true'),
        fetch('/api/workout/next'),
        fetch('/api/sessions?limit=5'),
      ])

      const [level, stats, quests, achievements, workout, sessions] = await Promise.all([
        levelRes.json(),
        statsRes.json(),
        questsRes.json(),
        achievementsRes.json(),
        workoutRes.json(),
        sessionsRes.json(),
      ])

      setLevelData(!level.error ? level : null)
      setStatsData(!stats.error ? stats : null)
      setQuestsData(!quests.error ? quests : null)
      setAchievementsData(!achievements.error ? achievements : null)
      setNextWorkout(!workout.error ? workout : null)
      setRecentSessions(Array.isArray(sessions) ? sessions : [])
    } catch (error) {
      console.error('Failed to load Forge data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestClaim = (questId: string) => {
    console.log('Claimed quest:', questId)
    loadForgeData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔨</div>
          <div className="text-xl text-white font-bold">Entering The Forge...</div>
        </div>
      </div>
    )
  }

  // Mock achievements
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
      <header className="relative bg-gray-900/80 backdrop-blur-sm border-b-2 border-yellow-600 p-4 shadow-2xl shadow-yellow-600/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                🔨 THE FORGE
              </span>
            </h1>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs font-medium"
              >
                Classic View
              </Link>
              <Link
                href="/settings"
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs"
              >
                ⚙️
              </Link>
              <Link
                href="/"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-xs font-medium"
              >
                Sign Out
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              🏠 Command Center
            </button>
            <button
              onClick={() => setActiveTab('train')}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                activeTab === 'train'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              ⚔️ Training Ground
            </button>
            <button
              onClick={() => setActiveTab('arsenal')}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                activeTab === 'arsenal'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              📚 Arsenal
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                activeTab === 'progress'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              📊 War Room
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto p-6">
        {/* HOME TAB - Command Center */}
        {activeTab === 'home' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Level & Stats */}
            <div className="lg:col-span-2 space-y-6">
              {levelData && (
                <LevelProgressCard
                  level={levelData.level}
                  title={levelData.title}
                  currentXP={levelData.currentXP}
                  nextLevelXP={levelData.nextLevelXP}
                  totalXP={levelData.totalXP}
                />
              )}

              {statsData && <GamingStatsCard stats={statsData} />}

              {/* Today's Mission */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-green-600 shadow-2xl shadow-green-600/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    ⚔️ Today's Mission
                  </h2>
                  <span className="px-3 py-1 bg-green-600 rounded-full text-xs font-bold">READY</span>
                </div>

                {nextWorkout && !nextWorkout.error ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {(() => {
                        const plan = typeof nextWorkout.plan === 'string' 
                          ? JSON.parse(nextWorkout.plan) 
                          : nextWorkout.plan
                        return (plan?.exercises || []).slice(0, 4).map((exercise: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500 transition-colors">
                            <div className="text-3xl">
                              {idx === 0 ? '⚔️' : idx === 1 ? '🛡️' : idx === 2 ? '💪' : '🔥'}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-lg">{exercise.name}</div>
                              <div className="text-sm text-gray-400">
                                {Array.isArray(exercise.sets) ? exercise.sets.length : exercise.sets} sets × {exercise.targetReps || (Array.isArray(exercise.sets) && exercise.sets[0] ? exercise.sets[0].reps : exercise.reps)} reps
                                {((Array.isArray(exercise.sets) && exercise.sets[0] ? exercise.sets[0].weight : exercise.weight) > 0) && ` @ ${Array.isArray(exercise.sets) && exercise.sets[0] ? exercise.sets[0].weight : exercise.weight}kg`}
                              </div>
                            </div>
                            <div className="px-3 py-1 bg-blue-600 rounded-lg text-sm font-bold">
                              RPE {exercise.targetRPE || 7.5}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>

                    <Link
                      href="/workout/session"
                      className="block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl text-center hover:opacity-90 transition-opacity shadow-lg"
                    >
                      🏋️ DEPLOY TO TRAINING GROUND
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-400 mb-4">No mission assigned</p>
                    <Link
                      href="/programs"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                      Select Training Program
                    </Link>
                  </div>
                )}
              </div>

              {questsData && (
                <DailyQuests
                  dailyQuests={questsData.dailyQuests}
                  weeklyQuests={questsData.weeklyQuests}
                  onClaimReward={handleQuestClaim}
                />
              )}
            </div>

            {/* Right Column - Achievements & Quick Actions */}
            <div className="space-y-6">
              <AchievementShowcase
                achievements={allAchievements}
                recentAchievements={achievementsData || []}
              />

              {/* Quick Arsenal Access */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>⚡</span>
                  <span>Quick Access</span>
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/exercises"
                    className="block w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
                  >
                    📚 Exercise Library
                  </Link>
                  <Link
                    href="/programs"
                    className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
                  >
                    📋 Training Programs
                  </Link>
                  <Link
                    href="/progress"
                    className="block w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
                  >
                    📊 Battle Stats
                  </Link>
                  <Link
                    href="/metrics"
                    className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
                  >
                    📈 Body Metrics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRAIN TAB - Training Ground */}
        {activeTab === 'train' && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🏋️</div>
            <h2 className="text-4xl font-bold text-white mb-4">Training Ground</h2>
            <p className="text-gray-400 mb-8 text-lg">Full workout session interface coming here</p>
            <Link
              href="/workout/session"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl hover:opacity-90 transition-opacity"
            >
              Launch Workout Session
            </Link>
          </div>
        )}

        {/* ARSENAL TAB */}
        {activeTab === 'arsenal' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/exercises"
              className="group bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-2xl p-8 border-2 border-blue-600 hover:border-blue-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">Exercise Library</h3>
              <p className="text-gray-300">53 exercises with videos & form cues</p>
            </Link>

            <Link
              href="/programs"
              className="group bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-2xl p-8 border-2 border-purple-600 hover:border-purple-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-2">Training Programs</h3>
              <p className="text-gray-300">7 complete workout templates</p>
            </Link>

            <Link
              href="/exercises/create"
              className="group bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-2xl p-8 border-2 border-green-600 hover:border-green-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">Custom Exercises</h3>
              <p className="text-gray-300">Create your own movements</p>
            </Link>

            <Link
              href="/templates"
              className="group bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 rounded-2xl p-8 border-2 border-orange-600 hover:border-orange-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2">Quick Templates</h3>
              <p className="text-gray-300">Time-constrained workouts</p>
            </Link>
          </div>
        )}

        {/* PROGRESS TAB - War Room */}
        {activeTab === 'progress' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/progress"
              className="group bg-gradient-to-br from-orange-900 via-red-800 to-orange-900 rounded-2xl p-8 border-2 border-orange-600 hover:border-orange-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-300">Charts, trends, and insights</p>
            </Link>

            <Link
              href="/metrics"
              className="group bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 rounded-2xl p-8 border-2 border-indigo-600 hover:border-indigo-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-2">Body Metrics</h3>
              <p className="text-gray-300">Weight, measurements, photos</p>
            </Link>

            <Link
              href="/goals"
              className="group bg-gradient-to-br from-pink-900 via-pink-800 to-pink-900 rounded-2xl p-8 border-2 border-pink-600 hover:border-pink-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2">Goals & Milestones</h3>
              <p className="text-gray-300">Track your objectives</p>
            </Link>

            <Link
              href="/progress/photos"
              className="group bg-gradient-to-br from-cyan-900 via-blue-800 to-cyan-900 rounded-2xl p-8 border-2 border-cyan-600 hover:border-cyan-400 transition-all shadow-2xl hover:scale-105"
            >
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-bold mb-2">Progress Photos</h3>
              <p className="text-gray-300">Visual transformation tracking</p>
            </Link>
          </div>
        )}
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

