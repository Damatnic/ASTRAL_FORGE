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
  Package,
  ListChecks,
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Dumbbell, label: 'Programs', href: '/programs' },
  { icon: ListChecks, label: 'Exercises', href: '/exercises' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: Trophy, label: 'Achievements', href: '/achievements' },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
  { icon: Heart, label: 'Health', href: '/health' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-neutral-900 border-b-2 border-neutral-800">
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
                  flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider whitespace-nowrap
                  transition-all duration-200 border-2
                  ${isActive 
                    ? 'bg-amber-950/50 text-amber-500 border-amber-700' 
                    : 'text-neutral-400 hover:text-amber-400 border-transparent hover:border-neutral-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{item.label}</span>
              </Link>
            )
          })}
          
          {/* Settings - always at the end */}
          <Link
            href="/settings"
            className="ml-auto flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-amber-400 border-2 border-transparent hover:border-neutral-700 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
