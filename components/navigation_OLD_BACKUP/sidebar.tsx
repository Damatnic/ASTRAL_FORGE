'use client'

/**
 * Primary Sidebar Navigation
 * Collapsible sidebar with grouped navigation items
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  TrendingUp,
  Target,
  User,
  Users,
  Trophy,
  Heart,
  Settings,
  ChevronRight,
  Menu,
  X,
  Calculator,
  BookOpen,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navigationGroups: NavGroup[] = [
  {
    label: 'Command Center',
    items: [
      { label: 'The Forge', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Training',
    items: [
      { label: 'Programs', href: '/programs', icon: Calendar },
      { label: 'Exercises', href: '/exercises', icon: Dumbbell },
      { label: 'Exercise Library', href: '/exercises/library', icon: Dumbbell },
      { label: 'History', href: '/history', icon: Calendar },
    ],
  },
  {
    label: 'Progress',
    items: [
      { label: 'Analytics', href: '/analytics', icon: TrendingUp },
      { label: 'Goals', href: '/goals', icon: Target },
      { label: 'Measurements', href: '/measurements', icon: TrendingUp },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Plate Calculator', href: '/tools/plate-calculator', icon: Calculator },
      { label: 'Workout Templates', href: '/templates/browser', icon: BookOpen },
    ],
  },
  {
    label: 'Profile',
    items: [
      { label: 'Athlete Profile', href: '/profile', icon: User },
      { label: 'Milestones', href: '/skills', icon: Target },
      { label: 'Achievements', href: '/achievements', icon: Trophy },
    ],
  },
  {
    label: 'Social',
    items: [
      { label: 'Guilds', href: '/guild', icon: Users },
      { label: 'Compete', href: '/compete', icon: Trophy },
    ],
  },
  {
    label: 'Health',
    items: [
      { label: 'Health Hub', href: '/health', icon: Heart },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-astral-gray border-r border-astral-light transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-astral-light">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">�</span>
              <span className="font-bold text-heading-md bg-gradient-to-r from-astral-blue to-astral-purple bg-clip-text text-transparent">
                Astral Forge
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-full">
              <span className="text-2xl">�</span>
            </Link>
          )}
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 hover:bg-astral-light rounded"
          >
            <ChevronRight
              className={cn(
                'w-5 h-5 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-astral-light rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navigationGroups.map((group) => (
            <div key={group.label} className="mb-6">
              {!collapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.label}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          isActive
                            ? 'bg-gradient-to-r from-astral-blue/20 to-astral-purple/20 text-white'
                            : 'text-gray-400 hover:bg-astral-light hover:text-white',
                          collapsed && 'justify-center'
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="text-body-md">{item.label}</span>
                        )}
                        {!collapsed && isActive && (
                          <div className="ml-auto w-1 h-1 rounded-full bg-astral-blue" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Section - Bottom */}
        {!collapsed && (
          <div className="p-4 border-t border-astral-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-astral-blue to-astral-purple flex items-center justify-center text-white font-bold">
                L5
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Warrior</p>
                <p className="text-xs text-gray-400">Level 5</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-astral-gray rounded-lg border border-astral-light"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  )
}
