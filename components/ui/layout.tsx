/**
 * Base Layout Primitives
 * Reusable layout components for consistent spacing and structure
 */

import React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// Container - Centers content with max-width constraints
// ============================================================================

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  children: React.ReactNode
}

export function Container({ 
  size = 'xl', 
  className, 
  children, 
  ...props 
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  return (
    <div 
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 w-full',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Stack - Vertical layout with consistent spacing
// ============================================================================

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  children: React.ReactNode
}

export function Stack({ 
  spacing = 'md', 
  align = 'stretch',
  className, 
  children, 
  ...props 
}: StackProps) {
  const spacingClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
    '3xl': 'gap-16',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  return (
    <div 
      className={cn(
        'flex flex-col',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Inline - Horizontal layout with consistent spacing
// ============================================================================

interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  children: React.ReactNode
}

export function Inline({ 
  spacing = 'md', 
  align = 'center',
  justify = 'start',
  wrap = false,
  className, 
  children, 
  ...props 
}: InlineProps) {
  const spacingClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  return (
    <div 
      className={cn(
        'flex',
        wrap && 'flex-wrap',
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Grid - Responsive grid layout
// ============================================================================

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12
    md?: 1 | 2 | 3 | 4 | 6 | 12
    lg?: 1 | 2 | 3 | 4 | 6 | 12
    xl?: 1 | 2 | 3 | 4 | 6 | 12
  }
  children: React.ReactNode
}

export function Grid({ 
  cols = 1,
  gap = 'md',
  responsive,
  className, 
  children, 
  ...props 
}: GridProps) {
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  }

  const responsiveClasses = responsive ? [
    responsive.sm && `sm:grid-cols-${responsive.sm}`,
    responsive.md && `md:grid-cols-${responsive.md}`,
    responsive.lg && `lg:grid-cols-${responsive.lg}`,
    responsive.xl && `xl:grid-cols-${responsive.xl}`,
  ].filter(Boolean).join(' ') : ''

  return (
    <div 
      className={cn(
        'grid',
        colsClasses[cols],
        gapClasses[gap],
        responsiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Section - Page section with consistent spacing
// ============================================================================

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  as?: 'section' | 'div' | 'main' | 'article'
  children: React.ReactNode
}

export function Section({ 
  spacing = 'lg',
  as: Component = 'section',
  className, 
  children, 
  ...props 
}: SectionProps) {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  }

  return (
    <Component 
      className={cn(
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// ============================================================================
// Card - Surface container with consistent styling
// ============================================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  children: React.ReactNode
}

export function Card({ 
  variant = 'default',
  padding = 'md',
  hover = false,
  className, 
  children, 
  ...props 
}: CardProps) {
  const variantClasses = {
    default: 'bg-astral-gray',
    bordered: 'bg-astral-gray border border-astral-light',
    elevated: 'bg-astral-gray shadow-lg',
    glass: 'bg-astral-gray/50 backdrop-blur-sm',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  }

  return (
    <div 
      className={cn(
        'rounded-xl',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Divider - Visual separator
// ============================================================================

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
}

export function Divider({ 
  orientation = 'horizontal',
  spacing = 'md',
  className, 
  ...props 
}: DividerProps) {
  const spacingClasses = {
    horizontal: {
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-8',
    },
    vertical: {
      sm: 'mx-2',
      md: 'mx-4',
      lg: 'mx-8',
    },
  }

  if (orientation === 'vertical') {
    return (
      <div 
        className={cn(
          'w-px bg-astral-light',
          spacingClasses.vertical[spacing],
          className
        )}
        {...props}
      />
    )
  }

  return (
    <hr 
      className={cn(
        'border-0 border-t border-astral-light',
        spacingClasses.horizontal[spacing],
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// Center - Centers content horizontally and/or vertically
// ============================================================================

interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  axis?: 'horizontal' | 'vertical' | 'both'
  children: React.ReactNode
}

export function Center({ 
  axis = 'both',
  className, 
  children, 
  ...props 
}: CenterProps) {
  const axisClasses = {
    horizontal: 'flex justify-center',
    vertical: 'flex items-center',
    both: 'flex justify-center items-center',
  }

  return (
    <div 
      className={cn(
        axisClasses[axis],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Box - Generic container with padding and spacing control
// ============================================================================

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  p?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  m?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export function Box({ 
  p,
  m,
  className, 
  children, 
  ...props 
}: BoxProps) {
  const paddingClasses = p ? {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }[p] : ''

  const marginClasses = m ? {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
  }[m] : ''

  return (
    <div 
      className={cn(
        paddingClasses,
        marginClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
