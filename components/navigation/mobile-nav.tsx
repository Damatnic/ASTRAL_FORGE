'use client'

/**
 * Mobile Navigation
 * Bottom tab bar for mobile with gesture support
 */

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Trophy,
  User,
} from 'lucide-react'

interface MobileNavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mobileNavItems: MobileNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Training', href: '/programs', icon: Dumbbell },
  { label: 'Progress', href: '/analytics', icon: TrendingUp },
  { label: 'Challenges', href: '/challenges', icon: Trophy },
  { label: 'Profile', href: '/profile', icon: User },
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-astral-gray/95 backdrop-blur-sm border-t border-astral-light',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]',
                isActive
                  ? 'text-astral-blue'
                  : 'text-gray-400'
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  'w-6 h-6 transition-all',
                  isActive && 'scale-110'
                )} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-astral-blue" />
                )}
              </div>
              <span className={cn(
                'text-xs font-medium transition-all',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
