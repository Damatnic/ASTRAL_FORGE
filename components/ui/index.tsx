/**
 * UI Component Library - Unified Design System
 * 
 * Shared components following the Astral Power design system v2.0
 */

import { ReactNode } from 'react'

// ============================================================================
// CARD COMPONENTS
// ============================================================================

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'surface' | 'accent' | 'glass'
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', variant = 'surface', hover = true, onClick }: CardProps) {
  const baseStyles = 'rounded-xl transition-all duration-200'
  
  const variants = {
    surface: `
      bg-gradient-to-br from-astral-gray to-astral-gray/80
      border border-white/10
      ${hover ? 'hover:border-white/20 hover:shadow-lg' : ''}
    `,
    accent: `
      bg-gradient-to-br from-astral-gray to-astral-dark
      border-2 border-astral-blue/30
      ${hover ? 'hover:border-astral-blue/50 hover:shadow-lg hover:shadow-astral-blue/20' : ''}
    `,
    glass: `
      bg-astral-gray/60
      backdrop-blur-xl
      border border-white/10
    `
  }

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

export function StatCard({ label, value, icon, trend, trendValue, variant = 'default' }: StatCardProps) {
  const variants = {
    default: 'from-astral-gray to-astral-gray/80 text-white',
    primary: 'from-astral-blue/20 to-astral-purple/20 border-astral-blue/30 text-astral-blue',
    success: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400',
    error: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400'
  }

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  }

  return (
    <div className={`bg-gradient-to-br ${variants[variant]} border border-white/10 rounded-xl p-6 hover:border-white/20 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {trend && trendValue && (
        <p className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-400' : 
          trend === 'down' ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {trendIcons[trend]} {trendValue}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: `
      bg-gradient-to-r from-astral-blue to-astral-purple
      hover:from-astral-blue/90 hover:to-astral-purple/90
      text-white
      shadow-lg shadow-astral-blue/20
      hover:shadow-xl hover:shadow-astral-blue/30
    `,
    secondary: `
      bg-astral-gray
      border border-white/10
      hover:border-astral-blue/50
      hover:bg-astral-gray/80
      text-white
    `,
    ghost: `
      bg-transparent
      hover:bg-white/5
      text-gray-400 hover:text-white
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-500/90 hover:to-red-600/90
      text-white
      shadow-lg shadow-red-500/20
    `
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// ============================================================================
// ICON BUTTON COMPONENT
// ============================================================================

interface IconButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'primary'
}

export function IconButton({ children, onClick, className = '', variant = 'default' }: IconButtonProps) {
  const variants = {
    default: 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20',
    primary: 'bg-astral-blue/20 hover:bg-astral-blue/30 border-astral-blue/30 hover:border-astral-blue/50'
  }

  return (
    <button
      onClick={onClick}
      className={`p-3 border rounded-lg transition-all duration-200 active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// ============================================================================
// BADGE COMPONENTS
// ============================================================================

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs'
  }

  const variants = {
    default: 'bg-gray-700 text-gray-300',
    common: 'bg-gray-700 text-gray-300',
    uncommon: 'bg-green-500/20 text-green-400 border border-green-500/30',
    rare: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    epic: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    legendary: 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-400 border border-yellow-400/30',
    primary: 'bg-astral-blue/20 text-astral-blue border border-astral-blue/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30'
  }

  return (
    <span className={`inline-block rounded-full font-medium ${sizes[size]} ${variants[variant]}`}>
      {children}
    </span>
  )
}

// ============================================================================
// PROGRESS BAR COMPONENT
// ============================================================================

interface ProgressBarProps {
  progress: number // 0-100
  label?: string
  showPercentage?: boolean
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({ 
  progress, 
  label, 
  showPercentage = false,
  variant = 'default',
  size = 'md'
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const variants = {
    default: 'bg-astral-blue',
    primary: 'bg-astral-blue',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    gradient: 'bg-gradient-to-r from-astral-blue to-astral-purple'
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showPercentage && <span className="text-sm font-medium text-white">{clampedProgress}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`${sizes[size]} ${variants[variant]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}

// ============================================================================
// GRADIENT TEXT COMPONENT
// ============================================================================

interface GradientTextProps {
  children: ReactNode
  variant?: 'primary' | 'gold' | 'success'
  className?: string
}

export function GradientText({ children, variant = 'primary', className = '' }: GradientTextProps) {
  const variants = {
    primary: 'from-astral-blue to-astral-purple',
    gold: 'from-yellow-400 to-orange-500',
    success: 'from-green-400 to-green-600'
  }

  return (
    <span className={`bg-gradient-to-r ${variants[variant]} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}

// ============================================================================
// LOADING SKELETON COMPONENT
// ============================================================================

interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export function LoadingSkeleton({ className = 'h-4 w-full', count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg ${className}`}
        />
      ))}
    </>
  )
}
