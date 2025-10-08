'use client'

import Link from 'next/link'
import { Trophy, Swords, Target, Users, Award, Flame } from 'lucide-react'

export default function CompetePage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider">
            COMPETITION HUB
            </h1>
            <div>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider border-2 border-amber-600" aria-label="Back to dashboard">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
          <p className="text-neutral-400 uppercase tracking-wider font-bold">
            Challenge yourself and compete with others
          </p>
        </div>

        {/* Competition Modes */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* PVP Challenges */}
          <Link 
            href="/compete/pvp"
            className="group bg-neutral-900/50 border-2 border-neutral-800 hover:border-amber-500/50 p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
                <Swords className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-2 group-hover:text-amber-400 transition-colors">
                  PVP CHALLENGES
                </h2>
                <p className="text-neutral-400">
                  Challenge other users to direct competition
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-800">
              <span className="text-sm text-neutral-500 uppercase tracking-wider font-bold">ACTIVE CHALLENGES</span>
              <span className="text-amber-400 font-black uppercase tracking-wider">VIEW →</span>
            </div>
          </Link>

          {/* Leaderboards */}
          <Link 
            href="/social/leaderboards"
            className="group bg-neutral-900/50 border-2 border-neutral-800 hover:border-amber-500/50 p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-2 group-hover:text-amber-400 transition-colors">
                  LEADERBOARDS
                </h2>
                <p className="text-neutral-400">
                  See how you rank against the community
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-800">
              <span className="text-sm text-neutral-500 uppercase tracking-wider font-bold">GLOBAL RANKINGS</span>
              <span className="text-amber-400 font-black uppercase tracking-wider">VIEW →</span>
            </div>
          </Link>

          {/* Challenges */}
          <Link 
            href="/challenges"
            className="group bg-neutral-900/50 border-2 border-neutral-800 hover:border-amber-500/50 p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
                <Target className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-2 group-hover:text-amber-400 transition-colors">
                  DAILY CHALLENGES
                </h2>
                <p className="text-neutral-400">
                  Complete daily and weekly challenges
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-800">
              <span className="text-sm text-neutral-500 uppercase tracking-wider font-bold">AVAILABLE TODAY</span>
              <span className="text-amber-400 font-black uppercase tracking-wider">VIEW →</span>
            </div>
          </Link>

          {/* Guild Competitions */}
          <Link 
            href="/social/guilds"
            className="group bg-neutral-900/50 border-2 border-neutral-800 hover:border-amber-500/50 p-8 transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-2 group-hover:text-amber-400 transition-colors">
                  GUILD WARS
                </h2>
                <p className="text-neutral-400">
                  Compete with your guild against others
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-800">
              <span className="text-sm text-neutral-500 uppercase tracking-wider font-bold">TEAM COMPETITION</span>
              <span className="text-amber-400 font-black uppercase tracking-wider">VIEW →</span>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
          <h2 className="text-xl font-black uppercase tracking-wider mb-6">YOUR COMPETITION STATS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black">0</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">WINS</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black">-</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">RANK</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black">0</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">ACTIVE CHALLENGES</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black">0</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">WIN STREAK</div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 border-2 border-amber-700/20 p-8 text-center">
          <h3 className="text-xl font-black uppercase tracking-wider mb-2">MORE COMPETITION MODES COMING SOON</h3>
          <p className="text-neutral-400">
            Boss battles, seasonal events, and tournament brackets are in development
          </p>
        </div>
      </div>
    </div>
  )
}
