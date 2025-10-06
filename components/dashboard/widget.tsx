'use client'

/**
 * Dashboard Widget Base Component
 * Reusable card component for dashboard widgets with consistent styling
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface WidgetProps {
  title?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  loading?: boolean
  error?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'surface'
  headerClassName?: string
}

export function Widget({
  title,
  icon,
  actions,
  loading = false,
  error,
  children,
  className,
  variant = 'default',
  headerClassName,
}: WidgetProps) {
  const baseStyles = 'rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl'
  
  const variantStyles = {
    default: 'bg-astral-gray border border-astral-light',
    gradient: 'bg-gradient-to-br from-astral-gray via-astral-gray to-astral-dark border border-astral-light',
    surface: 'bg-astral-dark border border-astral-light/50',
  }

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {/* Header */}
      {(title || icon || actions) && (
        <div className={cn('flex items-center justify-between mb-4', headerClassName)}>
          <div className="flex items-center gap-2">
            {icon && <div className="text-2xl">{icon}</div>}
            {title && (
              <h3 className="text-lg font-bold text-white">{title}</h3>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-astral-blue"></div>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : (
        <div className="text-gray-300">{children}</div>
      )}
    </div>
  )
}

export default Widget
