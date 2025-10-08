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
    { name: 'Social', href: '/social' },
    { name: 'Challenges', href: '/challenges' },
    { name: 'Achievements', href: '/achievements' },
    { name: 'Progress', href: '/progress' },
    { name: 'Guild', href: '/social/guilds' },
    { name: 'Compete', href: '/compete' },
    { name: 'Health', href: '/health' },
    { name: 'Skills', href: '/skills' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-neutral-900 border-b-2 border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Greeting */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-400 hover:text-amber-400 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="text-2xl">⚔️</div>
                <span className="hidden sm:block text-sm text-neutral-400 font-light">
                  Welcome, <span className="text-amber-400 font-bold tracking-wide">{userName}</span>
                </span>
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search workouts, exercises..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 focus:border-amber-700 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Badges + Actions */}
            <div className="flex items-center space-x-3">
              {/* Streak Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-amber-950/50 border-2 border-amber-800/50">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">7 Day</span>
              </div>

              {/* Level Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-neutral-900 border-2 border-neutral-700">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Lvl 12</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-neutral-400 hover:text-amber-400 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-amber-600 rounded-full"></span>
              </button>

              {/* Profile */}
              <Link href="/profile">
                <div className="h-8 w-8 border-2 border-amber-700 bg-amber-950/50 flex items-center justify-center text-xs font-black text-amber-500 cursor-pointer hover:border-amber-600 transition-all">
                  {userName.charAt(0)}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="hidden lg:block border-t-2 border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2
                      ${
                        isActive
                          ? 'bg-amber-950/50 text-amber-500 border-amber-700'
                          : 'text-neutral-400 hover:text-amber-400 border-transparent hover:border-neutral-700'
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
        <div className="lg:hidden fixed inset-0 z-40 bg-neutral-950/98 pt-16">
          <nav className="flex flex-col space-y-1 p-4">
            {/* Search Bar (Mobile) */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search workouts, exercises..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 focus:border-amber-700 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors"
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
                    px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border-2
                    ${
                      isActive
                        ? 'bg-amber-950/50 text-amber-500 border-amber-700'
                        : 'text-neutral-400 hover:text-amber-400 border-transparent hover:border-neutral-700'
                    }
                  `}
                >
                  {item.name}
                </Link>
              )
            })}

            {/* Mobile Badges */}
            <div className="flex items-center space-x-3 pt-4 border-t-2 border-neutral-800 mt-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-amber-950/50 border-2 border-amber-800/50">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">7 Day</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-neutral-900 border-2 border-neutral-700">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Lvl 12</span>
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
