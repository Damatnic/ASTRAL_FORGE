'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePvPChallenges } from '@/hooks/use-data'
import { Sword, Trophy, Target, Clock, TrendingUp, Shield, Crown, Swords } from 'lucide-react'

interface PvPChallenge {
  id: string
  type: 'volume' | 'reps' | 'time' | 'pr' | 'streak'
  status: 'pending' | 'active' | 'completed'
  challenger: {
    userId: string
    username: string
    level: number
    powerLevel: number
    currentValue: number
    targetValue: number
  }
  opponent: {
    userId: string
    username: string
    level: number
    powerLevel: number
    currentValue: number
    targetValue: number
  }
  goal: {
    description: string
    targetValue: number
    unit: string
  }
  duration: number
  startTime?: string
  endTime?: string
  rewards: {
    xp: number
    rank: number
  }
}

interface PvPRank {
  rank: number
  tier: string
  points: number
  pointsForNextRank: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export default function PvPPage() {
  const { data, loading, error } = usePvPChallenges()
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active')

  const challenges: PvPChallenge[] = data?.challenges || []
  const userRank: PvPRank | null = data?.rank || null

  const filteredChallenges = challenges.filter(c => c.status === activeTab)

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'legend': return 'from-amber-500 to-yellow-400'
      case 'master': return 'from-purple-500 to-pink-400'
      case 'diamond': return 'from-blue-400 to-cyan-300'
      case 'platinum': return 'from-slate-300 to-slate-100'
      case 'gold': return 'from-yellow-500 to-amber-400'
      case 'silver': return 'from-slate-400 to-slate-300'
      default: return 'from-amber-600 to-amber-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'volume': return <TrendingUp className="w-5 h-5" />
      case 'reps': return <Target className="w-5 h-5" />
      case 'time': return <Clock className="w-5 h-5" />
      case 'pr': return <Trophy className="w-5 h-5" />
      case 'streak': return <Crown className="w-5 h-5" />
      default: return <Sword className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-3">
              <Swords className="w-10 h-10 text-amber-500" />
              PVP ARENA
            </h1>
            <p className="text-neutral-400 uppercase tracking-wider font-bold">
              Challenge warriors and prove your strength
            </p>
          </div>
          <Link 
            href="/compete" 
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider border-2 border-amber-600 transition-colors"
            aria-label="Back to Competition Hub"
          >
            ← Back
          </Link>
        </div>

        {/* User Rank Card */}
        {userRank && (
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-amber-600 p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Shield className="w-12 h-12 text-amber-500" />
                <div>
                  <div className={`text-2xl font-black bg-gradient-to-r ${getTierColor(userRank.tier)} bg-clip-text text-transparent uppercase`}>
                    {userRank.tier}
                  </div>
                  <div className="text-neutral-400 font-bold">RANK #{userRank.rank}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-green-400">{userRank.wins}</div>
                  <div className="text-xs text-neutral-500 uppercase font-bold">Victories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-red-400">{userRank.losses}</div>
                  <div className="text-xs text-neutral-500 uppercase font-bold">Defeats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-400">{userRank.draws}</div>
                  <div className="text-xs text-neutral-500 uppercase font-bold">Draws</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-amber-400">{userRank.winRate.toFixed(1)}%</div>
                  <div className="text-xs text-neutral-500 uppercase font-bold">Win Rate</div>
                </div>
              </div>

              <div className="w-full mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-400 font-bold">{userRank.points} POINTS</span>
                  <span className="text-neutral-400 font-bold">{userRank.pointsForNextRank} FOR NEXT RANK</span>
                </div>
                <div className="h-3 bg-neutral-700 border-2 border-amber-600 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500"
                    style={{ width: `${(userRank.points / userRank.pointsForNextRank) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b-2 border-amber-600 pb-2">
          {(['active', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-black uppercase tracking-wider border-2 transition-colors ${
                activeTab === tab
                  ? 'bg-amber-500 text-black border-amber-600'
                  : 'bg-neutral-800 text-amber-500 border-neutral-700 hover:border-amber-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
            <p className="mt-4 text-neutral-400 font-bold uppercase">Loading battles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950 border-2 border-red-600 p-8 text-center">
            <p className="text-red-400 font-bold uppercase">Failed to load PVP challenges</p>
            <p className="text-neutral-400 mt-2">{error.message}</p>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="bg-neutral-900 border-2 border-amber-600 p-12 text-center">
            <Sword className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 font-bold uppercase text-xl">No {activeTab} battles</p>
            <p className="text-neutral-500 mt-2">Challenge another warrior to begin</p>
            <button className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider border-2 border-amber-600 transition-colors">
              Find Opponent
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-amber-600 p-6 hover:border-amber-500 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500 border-2 border-amber-600">
                      {getTypeIcon(challenge.type)}
                    </div>
                    <div>
                      <div className="text-lg font-black text-amber-500 uppercase tracking-wider">
                        {challenge.type} CHALLENGE
                      </div>
                      <div className="text-sm text-neutral-400 font-bold">
                        {challenge.goal.description}
                      </div>
                    </div>
                  </div>
                  
                  {challenge.status === 'active' && challenge.endTime && (
                    <div className="text-right">
                      <div className="text-xs text-neutral-500 uppercase font-bold">Time Remaining</div>
                      <div className="text-lg font-black text-amber-500">
                        {Math.max(0, Math.ceil((new Date(challenge.endTime).getTime() - Date.now()) / 60000))}m
                      </div>
                    </div>
                  )}
                </div>

                {/* Duel Status */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Challenger */}
                  <div className="bg-neutral-950 border-2 border-blue-600 p-4">
                    <div className="text-xs text-blue-400 uppercase font-bold mb-2">Challenger</div>
                    <div className="font-black text-white uppercase">{challenge.challenger.username}</div>
                    <div className="text-sm text-neutral-400">Level {challenge.challenger.level} • Power {challenge.challenger.powerLevel}</div>
                    <div className="mt-3">
                      <div className="text-2xl font-black text-blue-400">
                        {challenge.challenger.currentValue} / {challenge.goal.targetValue}
                      </div>
                      <div className="text-xs text-neutral-500 uppercase">{challenge.goal.unit}</div>
                    </div>
                  </div>

                  {/* Opponent */}
                  <div className="bg-neutral-950 border-2 border-red-600 p-4">
                    <div className="text-xs text-red-400 uppercase font-bold mb-2">Opponent</div>
                    <div className="font-black text-white uppercase">{challenge.opponent.username}</div>
                    <div className="text-sm text-neutral-400">Level {challenge.opponent.level} • Power {challenge.opponent.powerLevel}</div>
                    <div className="mt-3">
                      <div className="text-2xl font-black text-red-400">
                        {challenge.opponent.currentValue} / {challenge.goal.targetValue}
                      </div>
                      <div className="text-xs text-neutral-500 uppercase">{challenge.goal.unit}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  {challenge.status === 'active' && (
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider border-2 border-amber-600 transition-colors">
                      Log Progress
                    </button>
                  )}
                  <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-500 font-black uppercase tracking-wider border-2 border-amber-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
