/**
 * Dashboard Layout
 * Main layout wrapper for authenticated app pages with sidebar and header
 */

import React from 'react'
import { Sidebar } from '@/components/navigation/sidebar'
import { Header } from '@/components/navigation/header'
import { MobileNav } from '@/components/navigation/mobile-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-astral-dark">
      {/* Desktop Sidebar - Hidden on mobile */}
      <Sidebar className="hidden lg:block" />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileNav className="lg:hidden" />
    </div>
  )
}
