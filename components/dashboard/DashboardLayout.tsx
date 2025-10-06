'use client'

/**
 * DASHBOARD LAYOUT - Professional Gaming UI
 * Clean, minimal container following Xbox/PlayStation design principles
 * Focus on content hierarchy and usability
 */

import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className = '' }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Grid Background - Xbox Series X Style */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(100, 116, 139, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(100, 116, 139, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      
      {/* Gradient overlay - professional and clean */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
      
      {/* Main Content Container */}
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  )
}
