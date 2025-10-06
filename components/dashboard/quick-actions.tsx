'use client'

/**
 * Quick Actions Component
 * Fast access buttons for common dashboard actions
 */

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface QuickAction {
  label: string
  href: string
  icon: string
  color: string
  description?: string
}

const quickActions: QuickAction[] = [
  {
    label: 'Start Workout',
    href: '/programs',
    icon: '🏋️',
    color: 'from-blue-500 to-cyan-600',
    description: 'Begin your training session',
  },
  {
    label: 'Log Session',
    href: '/history',
    icon: '📝',
    color: 'from-green-500 to-emerald-600',
    description: 'Record a completed workout',
  },
  {
    label: 'Track Progress',
    href: '/analytics',
    icon: '📊',
    color: 'from-purple-500 to-pink-600',
    description: 'View your stats and trends',
  },
  {
    label: 'Set Goals',
    href: '/goals',
    icon: '🎯',
    color: 'from-orange-500 to-red-600',
    description: 'Define your targets',
  },
]

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      {quickActions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={cn(
            'group relative overflow-hidden rounded-xl p-4 transition-all duration-200',
            'bg-gradient-to-br border border-white/10 hover:border-white/20',
            'hover:scale-105 hover:shadow-lg active:scale-95',
            action.color
          )}
        >
          {/* Icon */}
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
            {action.icon}
          </div>

          {/* Label */}
          <div className="font-bold text-white text-sm mb-1">
            {action.label}
          </div>

          {/* Description - hidden on mobile */}
          {action.description && (
            <div className="text-xs text-white/80 hidden md:block">
              {action.description}
            </div>
          )}

          {/* Hover effect */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
        </Link>
      ))}
    </div>
  )
}

export default QuickActions
