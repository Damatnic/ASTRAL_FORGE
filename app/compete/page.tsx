'use client'

import Link from 'next/link'
import { Trophy, Swords, Target, Users, Award, Flame } from 'lucide-react'

export default function CompetePage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Competition Hub
          </h1>
          <p className="text-gray-400">
            Challenge yourself and compete with others
          </p>
        </div>

        {/* Competition Modes */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* PVP Challenges */}
          <Link 
            href="/compete/pvp"
            className="group bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 rounded-xl p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Swords className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                  PVP Challenges
                </h2>
                <p className="text-gray-400">
                  Challenge other users to direct competition
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-sm text-gray-500">Active Challenges</span>
              <span className="text-orange-400 font-semibold">View →</span>
            </div>
          </Link>

          {/* Leaderboards */}
          <Link 
            href="/(dashboard)/social/leaderboards"
            className="group bg-slate-900/50 border border-slate-800 hover:border-yellow-500/50 rounded-xl p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                  Leaderboards
                </h2>
                <p className="text-gray-400">
                  See how you rank against the community
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-sm text-gray-500">Global Rankings</span>
              <span className="text-yellow-400 font-semibold">View →</span>
            </div>
          </Link>

          {/* Challenges */}
          <Link 
            href="/challenges"
            className="group bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  Daily Challenges
                </h2>
                <p className="text-gray-400">
                  Complete daily and weekly challenges
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-sm text-gray-500">Available Today</span>
              <span className="text-blue-400 font-semibold">View →</span>
            </div>
          </Link>

          {/* Guild Competitions */}
          <Link 
            href="/(dashboard)/social/guilds"
            className="group bg-slate-900/50 border border-slate-800 hover:border-green-500/50 rounded-xl p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                  Guild Wars
                </h2>
                <p className="text-gray-400">
                  Compete with your guild against others
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-sm text-gray-500">Team Competition</span>
              <span className="text-green-400 font-semibold">View →</span>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Your Competition Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-400">Wins</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-gray-400">Rank</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-400">Active Challenges</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Flame className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-400">Win Streak</div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">More Competition Modes Coming Soon</h3>
          <p className="text-gray-400">
            Boss battles, seasonal events, and tournament brackets are in development
          </p>
        </div>
      </div>
    </div>
  )
}
