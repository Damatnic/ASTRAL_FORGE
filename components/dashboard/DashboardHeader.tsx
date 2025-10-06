'use client'

/**
 * DASHBOARD HEADER - Professional Gaming UI
 * Clean navigation bar following Xbox/PlayStation design principles
 * Focused on usability and information hierarchy
 */

import { useSession } from 'next-auth/react'
import { Sparkles, Flame, Menu, Search, Bell, User } from 'lucide-react'

interface DashboardHeaderProps {
  level?: number
  currentStreak?: number
}

export function DashboardHeader({ level = 1, currentStreak = 0 }: DashboardHeaderProps) {
  const { data: session } = useSession()
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Greeting */}
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-slate-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">⚔️</div>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-500 font-medium">{getGreeting()}</p>
                <h2 className="text-sm font-semibold text-white">
                  {session?.user?.name || 'Warrior'}
                </h2>
              </div>
            </div>
          </div>

          {/* Center: Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search workouts, exercises, goals..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Right: Stats & Actions */}
          <div className="flex items-center gap-3">
            {/* Streak Indicator */}
            {currentStreak > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold text-orange-400">{currentStreak}d</span>
              </div>
            )}

            {/* Level Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">Lv {level}</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
              <User className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
