'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LevelProgressCard } from '@/components/level-progress-card'
import { GamingStatsCard } from '@/components/gaming-stats-card'
import { AchievementShowcase } from '@/components/achievement-showcase'
import { DailyQuests } from '@/components/daily-quests'
import { ParticleBackground } from '@/components/particle-background'

/**
 * THE FORGE - Ultimate Gaming Dashboard Command Center
 * Immersive RPG-style interface with forge-themed particles, epic animations,
 * and complete gaming dashboard experience
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-orange-950 flex items-center justify-center relative overflow-hidden">
        {/* Forge Loading Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)] animate-pulse" />
        <div className="text-center z-10">
          <div className="relative">
            <div className="text-8xl mb-6 animate-bounce">🔨</div>
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl animate-pulse" />
          </div>
          <div className="text-2xl text-white font-bold mb-2 animate-pulse">
            Entering The Forge...
          </div>
          <div className="text-orange-400 text-sm">
            Stoking the flames • Heating the anvil • Preparing your arsenal
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-orange-950 relative overflow-hidden">
      {/* Epic Forge-Themed Particle Background */}
      <ParticleBackground
        particleCount={80}
        colors={['#fb923c', '#f97316', '#ea580c', '#c2410c']}
        speed={0.3}
        connectionDistance={120}
      />

      {/* Animated forge embers/sparks */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-ember"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-5%',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              boxShadow: '0 0 8px rgba(251, 146, 60, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Dramatic glow effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Epic Header with Forge Theming */}
      <header className="relative bg-gradient-to-r from-gray-900/90 via-red-950/90 to-gray-900/90 backdrop-blur-md border-b-4 border-orange-600 p-6 shadow-2xl shadow-orange-600/30 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="text-5xl animate-forge-glow">🔨</div>
                <div className="absolute inset-0 bg-orange-500/30 blur-2xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 drop-shadow-[0_0_20px_rgba(251,146,60,0.5)]">
                    THE FORGE
                  </span>
                </h1>
                <p className="text-orange-400 text-sm font-bold tracking-wider">
                  COMMAND CENTER • WHERE LEGENDS ARE FORGED
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all hover:scale-105 border border-gray-700 hover:border-orange-500"
              >
                <span className="text-xl">⚙️</span>
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all font-bold text-sm hover:scale-105 shadow-lg shadow-red-600/30"
              >
                Sign Out
              </Link>
            </div>
          </div>

          {/* Enhanced Navigation Tabs with Epic Styling */}
          <nav className="flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('home')}
              className={`group px-8 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black shadow-xl shadow-orange-500/50 border-2 border-yellow-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-orange-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🏠</span>
                <span>COMMAND CENTER</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('train')}
              className={`group px-8 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'train'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/50 border-2 border-green-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-green-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚔️</span>
                <span>TRAINING GROUND</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('arsenal')}
              className={`group px-8 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'arsenal'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl shadow-blue-500/50 border-2 border-blue-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-blue-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <span>ARSENAL</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`group px-8 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'progress'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/50 border-2 border-purple-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <span>WAR ROOM</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Quick Stats Banner - Always Visible */}
      <div className="relative bg-gradient-to-r from-gray-900/80 via-orange-950/80 to-gray-900/80 backdrop-blur-sm border-b-2 border-orange-600/30 py-4 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Power Level */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-4 border border-yellow-600/30 hover:border-yellow-500 transition-all hover:scale-105">
              <div className="text-xs text-yellow-400 font-bold mb-1">POWER LEVEL</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {levelData?.level ? levelData.level * 1000 + (levelData.currentXP || 0) : '9001'}
              </div>
            </div>

            {/* Total Workouts */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-600/30 hover:border-green-500 transition-all hover:scale-105">
              <div className="text-xs text-green-400 font-bold mb-1">BATTLES WON</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {statsData?.totalWorkouts || '0'}
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-xl p-4 border border-red-600/30 hover:border-red-500 transition-all hover:scale-105">
              <div className="text-xs text-red-400 font-bold mb-1">STREAK 🔥</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                {statsData?.currentStreak || '0'} days
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4 border border-purple-600/30 hover:border-purple-500 transition-all hover:scale-105">
              <div className="text-xs text-purple-400 font-bold mb-1">LEVEL {levelData?.level || '1'}</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {levelData ? Math.floor((levelData.currentXP / levelData.nextLevelXP) * 100) : '0'}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto p-6">
        {/* HOME TAB - Command Center */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Epic Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/workout/session"
                className="group relative bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border-2 border-green-400 hover:border-green-300 transition-all hover:scale-105 shadow-xl hover:shadow-green-500/50"
              >
                <div className="absolute inset-0 bg-green-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative text-center">
                  <div className="text-5xl mb-2">⚔️</div>
                  <div className="font-black text-lg">START</div>
                  <div className="font-black text-lg">WORKOUT</div>
                </div>
              </Link>

              <Link
                href="/programs"
                className="group relative bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl p-6 border-2 border-blue-400 hover:border-blue-300 transition-all hover:scale-105 shadow-xl hover:shadow-blue-500/50"
              >
                <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative text-center">
                  <div className="text-5xl mb-2">📋</div>
                  <div className="font-black text-lg">VIEW</div>
                  <div className="font-black text-lg">PROGRAMS</div>
                </div>
              </Link>

              <Link
                href="/progress"
                className="group relative bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 border-2 border-purple-400 hover:border-purple-300 transition-all hover:scale-105 shadow-xl hover:shadow-purple-500/50"
              >
                <div className="absolute inset-0 bg-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative text-center">
                  <div className="text-5xl mb-2">📊</div>
                  <div className="font-black text-lg">TRACK</div>
                  <div className="font-black text-lg">PROGRESS</div>
                </div>
              </Link>

              <Link
                href="/dashboard/gaming"
                className="group relative bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl p-6 border-2 border-yellow-400 hover:border-yellow-300 transition-all hover:scale-105 shadow-xl hover:shadow-yellow-500/50"
              >
                <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative text-center">
                  <div className="text-5xl mb-2">🏆</div>
                  <div className="font-black text-lg">VIEW</div>
                  <div className="font-black text-lg">ACHIEVEMENTS</div>
                </div>
              </Link>
            </div>

            {/* Main Content Grid */}
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

