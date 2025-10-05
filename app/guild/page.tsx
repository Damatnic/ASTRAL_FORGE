'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ParticleBackground } from '@/components/particle-background'

/**
 * GUILD HALL - Epic Social Hub
 * Complete social features with guild roster, team challenges, leaderboards,
 * guild chat, achievements, and member management
 */

interface GuildMember {
  id: string
  name: string
  level: number
  rank: 'Leader' | 'Officer' | 'Elite' | 'Member' | 'Recruit'
  powerLevel: number
  totalWorkouts: number
  weeklyContribution: number
  joinedAt: Date
  lastActive: Date
  avatar?: string
  status: 'online' | 'offline' | 'training'
}

interface GuildChallenge {
  id: string
  title: string
  description: string
  goal: number
  progress: number
  type: 'workouts' | 'volume' | 'streak' | 'exercises'
  reward: string
  expiresAt: Date
  participants: number
}

interface GuildAchievement {
  id: string
  title: string
  description: string
  unlockedAt?: Date
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

interface ActivityFeedItem {
  id: string
  memberName: string
  action: string
  timestamp: Date
  type: 'join' | 'achievement' | 'challenge' | 'workout' | 'level'
  icon: string
}

export default function GuildHall() {
  const [activeTab, setActiveTab] = useState<'roster' | 'challenges' | 'leaderboard' | 'achievements'>('roster')
  const [guild, setGuild] = useState<any>(null)
  const [members, setMembers] = useState<GuildMember[]>([])
  const [challenges, setChallenges] = useState<GuildChallenge[]>([])
  const [achievements, setAchievements] = useState<GuildAchievement[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasGuild, setHasGuild] = useState(false)

  useEffect(() => {
    loadGuildData()
  }, [])

  const loadGuildData = async () => {
    setLoading(true)
    
    // Mock data - replace with actual API calls
    const mockGuild = {
      id: 'guild-1',
      name: 'Iron Legion',
      emblem: '⚔️',
      level: 15,
      memberCount: 47,
      maxMembers: 50,
      totalPower: 892450,
      weeklyWorkouts: 234,
      createdAt: new Date('2024-01-15'),
      description: 'Elite warriors pushing limits together. No pain, no gain!',
      color: 'purple',
    }

    const mockMembers: GuildMember[] = [
      {
        id: '1',
        name: 'IronWolf',
        level: 42,
        rank: 'Leader',
        powerLevel: 45200,
        totalWorkouts: 423,
        weeklyContribution: 12,
        joinedAt: new Date('2024-01-15'),
        lastActive: new Date(),
        status: 'online',
      },
      {
        id: '2',
        name: 'ThunderFist',
        level: 38,
        rank: 'Officer',
        powerLevel: 41300,
        totalWorkouts: 387,
        weeklyContribution: 10,
        joinedAt: new Date('2024-01-20'),
        lastActive: new Date(),
        status: 'training',
      },
      {
        id: '3',
        name: 'PhoenixRise',
        level: 35,
        rank: 'Elite',
        powerLevel: 38900,
        totalWorkouts: 312,
        weeklyContribution: 9,
        joinedAt: new Date('2024-02-01'),
        lastActive: new Date(Date.now() - 3600000),
        status: 'online',
      },
      {
        id: '4',
        name: 'SteelHeart',
        level: 33,
        rank: 'Elite',
        powerLevel: 36400,
        totalWorkouts: 289,
        weeklyContribution: 8,
        joinedAt: new Date('2024-02-10'),
        lastActive: new Date(Date.now() - 7200000),
        status: 'offline',
      },
      {
        id: '5',
        name: 'DragonSlayer',
        level: 30,
        rank: 'Member',
        powerLevel: 33100,
        totalWorkouts: 245,
        weeklyContribution: 7,
        joinedAt: new Date('2024-03-01'),
        lastActive: new Date(Date.now() - 86400000),
        status: 'offline',
      },
    ]

    const mockChallenges: GuildChallenge[] = [
      {
        id: 'ch-1',
        title: 'Thousand Rep Challenge',
        description: 'Complete 1,000 total reps as a guild this week',
        goal: 1000,
        progress: 742,
        type: 'volume',
        reward: '500 XP per member + Legendary Badge',
        expiresAt: new Date(Date.now() + 172800000),
        participants: 23,
      },
      {
        id: 'ch-2',
        title: 'Perfect Week',
        description: 'All active members complete at least 3 workouts',
        goal: 47,
        progress: 31,
        type: 'workouts',
        reward: '300 XP + Guild Banner Upgrade',
        expiresAt: new Date(Date.now() + 259200000),
        participants: 31,
      },
      {
        id: 'ch-3',
        title: 'Exercise Master',
        description: 'Collectively perform 50 different exercises',
        goal: 50,
        progress: 38,
        type: 'exercises',
        reward: 'Epic Loot Chest',
        expiresAt: new Date(Date.now() + 432000000),
        participants: 18,
      },
    ]

    const mockAchievements: GuildAchievement[] = [
      {
        id: 'ach-1',
        title: 'Founded',
        description: 'Established the guild',
        unlockedAt: new Date('2024-01-15'),
        icon: '🏰',
        rarity: 'common',
      },
      {
        id: 'ach-2',
        title: 'Growing Strong',
        description: 'Reached 25 members',
        unlockedAt: new Date('2024-02-20'),
        icon: '👥',
        rarity: 'uncommon',
      },
      {
        id: 'ach-3',
        title: 'Power House',
        description: 'Guild total power exceeded 500,000',
        unlockedAt: new Date('2024-03-15'),
        icon: '⚡',
        rarity: 'rare',
      },
      {
        id: 'ach-4',
        title: 'Challenge Champions',
        description: 'Completed 10 guild challenges',
        unlockedAt: new Date('2024-04-01'),
        icon: '🏆',
        rarity: 'epic',
      },
      {
        id: 'ach-5',
        title: 'Legendary Status',
        description: 'Achieve guild level 15',
        icon: '👑',
        rarity: 'legendary',
      },
    ]

    const mockActivity: ActivityFeedItem[] = [
      {
        id: 'act-1',
        memberName: 'PhoenixRise',
        action: 'completed a workout (+250 XP)',
        timestamp: new Date(Date.now() - 300000),
        type: 'workout',
        icon: '🏋️',
      },
      {
        id: 'act-2',
        memberName: 'ThunderFist',
        action: 'unlocked achievement "Consistency King"',
        timestamp: new Date(Date.now() - 600000),
        type: 'achievement',
        icon: '🏆',
      },
      {
        id: 'act-3',
        memberName: 'NewWarrior',
        action: 'joined the guild',
        timestamp: new Date(Date.now() - 900000),
        type: 'join',
        icon: '🎉',
      },
      {
        id: 'act-4',
        memberName: 'IronWolf',
        action: 'reached level 42',
        timestamp: new Date(Date.now() - 1200000),
        type: 'level',
        icon: '⬆️',
      },
      {
        id: 'act-5',
        memberName: 'SteelHeart',
        action: 'contributed to "Thousand Rep Challenge"',
        timestamp: new Date(Date.now() - 1800000),
        type: 'challenge',
        icon: '🎯',
      },
    ]

    setGuild(mockGuild)
    setMembers(mockMembers)
    setChallenges(mockChallenges)
    setAchievements(mockAchievements)
    setActivityFeed(mockActivity)
    setHasGuild(true)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-cyan-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse" />
        <div className="text-center z-10">
          <div className="relative">
            <div className="text-8xl mb-6 animate-bounce">🏰</div>
            <div className="absolute inset-0 bg-purple-500/20 blur-3xl animate-pulse" />
          </div>
          <div className="text-2xl text-white font-bold mb-2 animate-pulse">
            Entering Guild Hall...
          </div>
          <div className="text-purple-400 text-sm">
            Gathering warriors • Loading challenges • Preparing leaderboards
          </div>
        </div>
      </div>
    )
  }

  if (!hasGuild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-cyan-950 relative overflow-hidden">
        <ParticleBackground
          particleCount={60}
          colors={['#a855f7', '#8b5cf6', '#06b6d4', '#0891b2']}
          speed={0.25}
          connectionDistance={130}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-8">🏰</div>
            <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Join a Guild
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Team up with fellow warriors to conquer challenges, earn exclusive rewards, and dominate the leaderboards!
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border-2 border-purple-500 hover:border-purple-400 transition-all hover:scale-105">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">Find a Guild</h3>
                <p className="text-gray-400 mb-4">Browse active guilds and join one that fits your style</p>
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  Browse Guilds
                </button>
              </div>

              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-2xl p-8 border-2 border-cyan-500 hover:border-cyan-400 transition-all hover:scale-105">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold mb-2">Create Your Own</h3>
                <p className="text-gray-400 mb-4">Found your own guild and build a legendary team</p>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  Create Guild
                </button>
              </div>
            </div>

            <Link
              href="/forge"
              className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              ← Back to The Forge
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getRankColor = (rank: GuildMember['rank']) => {
    switch (rank) {
      case 'Leader': return 'text-yellow-400'
      case 'Officer': return 'text-purple-400'
      case 'Elite': return 'text-cyan-400'
      case 'Member': return 'text-green-400'
      case 'Recruit': return 'text-gray-400'
      default: return 'text-white'
    }
  }

  const getRankBadge = (rank: GuildMember['rank']) => {
    switch (rank) {
      case 'Leader': return '👑'
      case 'Officer': return '⭐'
      case 'Elite': return '💎'
      case 'Member': return '🛡️'
      case 'Recruit': return '🔰'
      default: return ''
    }
  }

  const getStatusColor = (status: GuildMember['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'training': return 'bg-yellow-500 animate-pulse'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getRarityColor = (rarity: GuildAchievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-600 to-orange-600 border-yellow-400'
      case 'epic': return 'from-purple-600 to-pink-600 border-purple-400'
      case 'rare': return 'from-blue-600 to-cyan-600 border-blue-400'
      case 'uncommon': return 'from-green-600 to-emerald-600 border-green-400'
      case 'common': return 'from-gray-600 to-gray-700 border-gray-400'
      default: return 'from-gray-600 to-gray-700 border-gray-400'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const formatTimeRemaining = (date: Date) => {
    const seconds = Math.floor((date.getTime() - Date.now()) / 1000)
    if (seconds < 0) return 'Expired'
    const days = Math.floor(seconds / 86400)
    if (days > 0) return `${days}d remaining`
    const hours = Math.floor(seconds / 3600)
    if (hours > 0) return `${hours}h remaining`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m remaining`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-cyan-950 relative overflow-hidden">
      {/* Epic Guild-Themed Particle Background */}
      <ParticleBackground
        particleCount={60}
        colors={['#a855f7', '#8b5cf6', '#06b6d4', '#0891b2']}
        speed={0.25}
        connectionDistance={130}
      />

      {/* Animated glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Epic Header */}
      <header className="relative bg-gradient-to-r from-gray-900/90 via-purple-950/90 to-gray-900/90 backdrop-blur-md border-b-4 border-purple-600 p-6 shadow-2xl shadow-purple-600/30 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="text-6xl">{guild.emblem}</div>
                <div className="absolute inset-0 bg-purple-500/30 blur-2xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    {guild.name}
                  </span>
                </h1>
                <p className="text-purple-400 text-sm font-bold tracking-wider">
                  LEVEL {guild.level} GUILD • {guild.memberCount}/{guild.maxMembers} WARRIORS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/forge"
                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all hover:scale-105 border border-gray-700 hover:border-purple-500"
              >
                ← The Forge
              </Link>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all font-bold text-sm hover:scale-105 shadow-lg shadow-purple-600/30">
                Guild Settings
              </button>
            </div>
          </div>

          {/* Guild Stats Banner */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4 border border-purple-600/30">
              <div className="text-xs text-purple-400 font-bold mb-1">TOTAL POWER</div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {guild.totalPower.toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-4 border border-cyan-600/30">
              <div className="text-xs text-cyan-400 font-bold mb-1">WEEKLY WORKOUTS</div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {guild.weeklyWorkouts}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-4 border border-yellow-600/30">
              <div className="text-xs text-yellow-400 font-bold mb-1">GUILD LEVEL</div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {guild.level}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'roster'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/50 border-2 border-purple-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-purple-500'
              }`}
            >
              👥 ROSTER
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'challenges'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl shadow-cyan-500/50 border-2 border-cyan-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-cyan-500'
              }`}
            >
              🎯 CHALLENGES
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-xl shadow-yellow-500/50 border-2 border-yellow-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-yellow-500'
              }`}
            >
              🏆 LEADERBOARD
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                activeTab === 'achievements'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/50 border-2 border-green-400'
                  : 'bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-700 hover:border-green-500'
              }`}
            >
              ⭐ ACHIEVEMENTS
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto p-6 z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ROSTER TAB */}
            {activeTab === 'roster' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Guild Roster</h2>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-sm transition-colors">
                    + Invite Member
                  </button>
                </div>

                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-purple-500 transition-all hover:scale-[1.02] shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
                            {member.name[0]}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-gray-900`} />
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{member.name}</h3>
                            <span className="text-xl">{getRankBadge(member.rank)}</span>
                            <span className={`text-sm font-bold ${getRankColor(member.rank)}`}>
                              {member.rank}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>Level {member.level}</span>
                            <span>•</span>
                            <span>Power: {member.powerLevel.toLocaleString()}</span>
                            <span>•</span>
                            <span>Last active: {formatTimeAgo(member.lastActive)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="text-2xl font-black text-purple-400">
                          {member.weeklyContribution}
                        </div>
                        <div className="text-xs text-gray-400">This week</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Total Workouts</span>
                        <span>{member.totalWorkouts}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((member.totalWorkouts / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CHALLENGES TAB */}
            {activeTab === 'challenges' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Active Challenges</h2>

                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-cyan-700 hover:border-cyan-500 transition-all shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                        <p className="text-gray-400 text-sm">{challenge.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-cyan-600 rounded-full text-xs font-bold">
                        {formatTimeRemaining(challenge.expiresAt)}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-bold text-cyan-400">
                          {challenge.progress} / {challenge.goal}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                          style={{ width: `${Math.min((challenge.progress / challenge.goal) * 100, 100)}%` }}
                        >
                          <span className="text-xs font-bold">
                            {Math.floor((challenge.progress / challenge.goal) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">🎁</span>
                        <span className="text-sm text-gray-300">{challenge.reward}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {challenge.participants} participating
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Top Contributors</h2>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-yellow-700 shadow-lg">
                  {members
                    .sort((a, b) => b.weeklyContribution - a.weeklyContribution)
                    .map((member, index) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between py-4 ${
                          index < members.length - 1 ? 'border-b border-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className={`w-8 text-center text-2xl font-black ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-gray-400' : 
                            index === 2 ? 'text-orange-600' : 
                            'text-gray-500'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>

                          {/* Avatar & Name */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
                            {member.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white">{member.name}</div>
                            <div className="text-sm text-gray-400">Level {member.level}</div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right">
                          <div className="text-xl font-black text-yellow-400">
                            {member.weeklyContribution} workouts
                          </div>
                          <div className="text-xs text-gray-400">
                            {member.powerLevel.toLocaleString()} power
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ACHIEVEMENTS TAB */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Guild Achievements</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-2xl p-6 border-2 ${
                        achievement.unlockedAt ? 'shadow-lg' : 'opacity-50 grayscale'
                      } transition-all hover:scale-105`}
                    >
                      <div className="text-5xl mb-3">{achievement.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
                      <div className="text-xs font-bold uppercase tracking-wide">
                        {achievement.unlockedAt ? (
                          <span className="text-yellow-400">
                            ✓ Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">🔒 Locked</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Guild Info Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-purple-700 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                <span>Guild Info</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Founded</span>
                  <span className="text-white font-bold">
                    {guild.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Members</span>
                  <span className="text-white font-bold">
                    {guild.memberCount}/{guild.maxMembers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Level</span>
                  <span className="text-white font-bold">{guild.level}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm italic">"{guild.description}"</p>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-cyan-700 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📰</span>
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {activityFeed.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-white">
                        <span className="font-bold">{item.memberName}</span>{' '}
                        <span className="text-gray-400">{item.action}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(item.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-2">
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  💬 Guild Chat
                </button>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  📊 View Stats
                </button>
                <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  🎯 Start Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8b5cf6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a78bfa;
        }
      `}</style>
    </div>
  )
}
