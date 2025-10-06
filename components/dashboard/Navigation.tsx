'use client'

/**
 * MAIN NAVIGATION - Professional Gaming UI
 * Xbox/PlayStation-style horizontal navigation tabs
 * Clean, organized, and highly usable
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Dumbbell, 
  Trophy, 
  Target,
  TrendingUp,
  Users,
  Heart,
  Swords,
  Award,
  Settings,
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Dumbbell, label: 'Workouts', href: '/forge' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: Trophy, label: 'Achievements', href: '/achievements' },
  { icon: TrendingUp, label: 'Progress', href: '/metrics' },
  { icon: Users, label: 'Guild', href: '/guild' },
  { icon: Swords, label: 'Compete', href: '/compete' },
  { icon: Heart, label: 'Health', href: '/health' },
  { icon: Award, label: 'Skills', href: '/skills' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
          
          {/* Settings - always at the end */}
          <Link
            href="/settings"
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
