'use client'

import { useQuests, usePet, useInventory, usePvPChallenges, useSeasonalEvents, usePrestige } from '@/hooks/use-data'
import { useRouter } from 'next/navigation'

export default function AdvancedPage() {
  const router = useRouter()
  const { data: questsData } = useQuests('all')
  const { data: petData } = usePet()
  const { data: inventoryData } = useInventory()
  const { data: pvpData } = usePvPChallenges()
  const { data: eventsData } = useSeasonalEvents()
  const { data: prestigeData } = usePrestige()

  const quests = questsData || { active: [], completed: [] }
  const pet = petData?.pet
  const inventory = inventoryData || { items: [], gold: 0 }
  const pvp = pvpData?.challenges || []
  const events = eventsData?.events || []
  const prestige = prestigeData || { level: 0, tokens: 0 }

  const activeQuests = quests.active?.length || 0
  const activePvPChallenges = pvp.filter((c: any) => c.status === 'active').length
  const activeEvents = events.filter((e: any) => e.isActive).length

  const features = [
    {
      id: 'quests',
      icon: '📖',
      title: 'Quest Board',
      description: 'Complete daily and weekly quests for rewards',
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
      hoverColor: 'hover:border-yellow-500/50',
      stats: [
        { label: 'Active Quests', value: activeQuests, color: 'text-yellow-400' }
      ],
      route: '/quests'
    },
    {
      id: 'pets',
      icon: '🐾',
      title: 'Pet Companions',
      description: 'Adopt, feed, and evolve your loyal companions',
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      hoverColor: 'hover:border-green-500/50',
      stats: [
        { label: 'Active Pet', value: pet?.name || 'None', color: 'text-green-400' },
        { label: 'Level', value: pet?.level || 0, color: 'text-white' }
      ],
      route: '/pets'
    },
    {
      id: 'marketplace',
      icon: '🛒',
      title: 'Marketplace',
      description: 'Buy, sell, and craft powerful items',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      hoverColor: 'hover:border-purple-500/50',
      stats: [
        { label: 'Your Gold', value: inventory.gold.toLocaleString(), color: 'text-yellow-400' },
        { label: 'Items', value: inventory.items.length, color: 'text-white' }
      ],
      route: '/marketplace'
    },
    {
      id: 'pvp',
      icon: '⚔️',
      title: 'PvP Arena',
      description: 'Challenge friends and compete for glory',
      color: 'from-red-500/20 to-orange-500/20 border-red-500/30',
      hoverColor: 'hover:border-red-500/50',
      stats: [
        { label: 'Active Challenges', value: activePvPChallenges, color: 'text-red-400' }
      ],
      route: '/pvp'
    },
    {
      id: 'events',
      icon: '🎉',
      title: 'Seasonal Events',
      description: 'Participate in limited-time events for exclusive rewards',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
      hoverColor: 'hover:border-cyan-500/50',
      stats: [
        { label: 'Active Events', value: activeEvents, color: 'text-cyan-400' }
      ],
      route: '/events'
    },
    {
      id: 'prestige',
      icon: '⭐',
      title: 'Prestige System',
      description: 'Reset your progress for permanent bonuses',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      hoverColor: 'hover:border-purple-500/50',
      stats: [
        { label: 'Prestige Level', value: prestige.level, color: 'text-purple-400' },
        { label: 'Tokens', value: prestige.tokens, color: 'text-yellow-400' }
      ],
      route: '/prestige'
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-3">
          Advanced Features
        </h1>
        <p className="text-slate-400 text-lg">
          Unlock powerful abilities and compete with others
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Active Quests</div>
          <div className="text-3xl font-bold text-yellow-400">{activeQuests}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Pet Level</div>
          <div className="text-3xl font-bold text-green-400">{pet?.level || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Total Gold</div>
          <div className="text-3xl font-bold text-yellow-400">{inventory.gold}</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">PvP Rating</div>
          <div className="text-3xl font-bold text-cyan-400">1500</div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => router.push(feature.route)}
            className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.hoverColor} rounded-xl p-6 text-left transition-all hover:scale-105 hover:shadow-2xl`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-6xl">{feature.icon}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{feature.title}</h2>
            <p className="text-slate-300 text-sm mb-4">{feature.description}</p>

            <div className="space-y-2">
              {feature.stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">{stat.label}:</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="text-sm font-semibold text-white flex items-center justify-between">
                <span>Explore</span>
                <span>→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Feature Highlights */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">✨ What's New</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <div className="font-bold text-white mb-1">Daily Quests</div>
              <div className="text-sm text-slate-300">
                New quests reset every 24 hours with fresh rewards
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-3xl">🐾</span>
            <div>
              <div className="font-bold text-white mb-1">Pet Evolution</div>
              <div className="text-sm text-slate-300">
                Evolve your pets up to 3 times for powerful abilities
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-3xl">🔨</span>
            <div>
              <div className="font-bold text-white mb-1">Crafting System</div>
              <div className="text-sm text-slate-300">
                Combine materials to create legendary equipment
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚔️</span>
            <div>
              <div className="font-bold text-white mb-1">PvP Challenges</div>
              <div className="text-sm text-slate-300">
                Challenge friends in 4 different competition types
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <div className="font-bold text-white mb-1">Seasonal Events</div>
              <div className="text-sm text-slate-300">
                Compete in time-limited events for exclusive rewards
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <div className="font-bold text-white mb-1">Prestige Perks</div>
              <div className="text-sm text-slate-300">
                Unlock permanent bonuses that stack infinitely
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">🚀 Getting Started</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 flex-shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-white mb-1">Complete Daily Quests</div>
              <div className="text-sm text-slate-300">
                Start by completing your daily quests to earn XP and gold
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 flex-shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-white mb-1">Adopt a Pet Companion</div>
              <div className="text-sm text-slate-300">
                Visit the pet page and adopt your first companion to help you on your journey
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 flex-shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-white mb-1">Gear Up at the Marketplace</div>
              <div className="text-sm text-slate-300">
                Spend your gold on powerful items and craft legendary equipment
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 flex-shrink-0">
              4
            </div>
            <div>
              <div className="font-bold text-white mb-1">Challenge Friends</div>
              <div className="text-sm text-slate-300">
                Test your skills in PvP challenges and compete in seasonal events
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 flex-shrink-0">
              5
            </div>
            <div>
              <div className="font-bold text-white mb-1">Prestige for Power</div>
              <div className="text-sm text-slate-300">
                When you reach the XP cap, prestige to unlock permanent bonuses
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
