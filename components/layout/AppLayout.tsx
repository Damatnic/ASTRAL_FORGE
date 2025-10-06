'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, Menu, X } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  userName?: string
}

export function AppLayout({ children, userName = 'Warrior' }: AppLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Workouts', href: '/programs' },
    { name: 'Goals', href: '/goals' },
    { name: 'Achievements', href: '/achievements' },
    { name: 'Progress', href: '/progress' },
    { name: 'Guild', href: '/guild' },
    { name: 'Compete', href: '/compete' },
    { name: 'Health', href: '/health' },
    { name: 'Skills', href: '/skills' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Greeting */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="text-2xl">⚡</div>
                <span className="hidden sm:block text-sm text-gray-400">
                  Welcome back, <span className="text-white font-semibold">{userName}</span>
                </span>
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search workouts, exercises..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Badges + Actions */}
            <div className="flex items-center space-x-3">
              {/* Streak Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-semibold text-orange-400">7 Day Streak</span>
              </div>

              {/* Level Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-semibold text-blue-400">Level 12</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <Link href="/profile">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold cursor-pointer hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                  {userName.charAt(0)}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="hidden lg:block border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                      ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/98 backdrop-blur-xl pt-16">
          <nav className="flex flex-col space-y-1 p-4">
            {/* Search Bar (Mobile) */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search workouts, exercises..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  {item.name}
                </Link>
              )
            })}

            {/* Mobile Badges */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-800 mt-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-semibold text-orange-400">7 Day Streak</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-semibold text-blue-400">Level 12</span>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-8">
        {children}
      </main>
    </div>
  )
}
