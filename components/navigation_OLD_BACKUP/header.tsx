'use client'

/**
 * Enhanced Top Bar / Header
 * Status indicators, notifications, quick actions, profile menu
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Bell,
  Search,
  Plus,
  Zap,
  Heart,
  Flame,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 bg-astral-gray/95 backdrop-blur-sm border-b border-astral-light">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search exercises, programs..."
              className="w-full pl-10 pr-4 py-2 bg-astral-light border border-astral-light rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-astral-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section - Status & Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Status Indicators - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-astral-light rounded-lg">
            {/* Health */}
            <div className="flex items-center gap-1.5" title="Health">
              <Heart className="w-4 h-4 text-health" />
              <span className="text-sm font-medium text-white">85</span>
            </div>
            
            {/* Energy */}
            <div className="flex items-center gap-1.5" title="Energy">
              <Zap className="w-4 h-4 text-energy" />
              <span className="text-sm font-medium text-white">92</span>
            </div>
            
            {/* Streak */}
            <div className="flex items-center gap-1.5" title="Streak">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-white">7</span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-2 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg hover:opacity-90 transition-opacity"
              title="Quick Actions"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>

            {/* Quick Actions Dropdown */}
            {showQuickActions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowQuickActions(false)}
                />
                <div className="absolute right-0 top-12 w-64 bg-astral-gray border border-astral-light rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                      Quick Actions
                    </h3>
                    <Link
                      href="/workout/new"
                      className="block px-3 py-2 rounded hover:bg-astral-light text-white transition-colors"
                      onClick={() => setShowQuickActions(false)}
                    >
                      Start Workout
                    </Link>
                    <Link
                      href="/exercises/new"
                      className="block px-3 py-2 rounded hover:bg-astral-light text-white transition-colors"
                      onClick={() => setShowQuickActions(false)}
                    >
                      Log Exercise
                    </Link>
                    <Link
                      href="/goals/new"
                      className="block px-3 py-2 rounded hover:bg-astral-light text-white transition-colors"
                      onClick={() => setShowQuickActions(false)}
                    >
                      Create Goal
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-astral-light rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 w-80 bg-astral-gray border border-astral-light rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-astral-light">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="divide-y divide-astral-light">
                    <div className="p-4 hover:bg-astral-light transition-colors cursor-pointer">
                      <p className="text-sm text-white">Achievement unlocked: Iron Will</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-4 hover:bg-astral-light transition-colors cursor-pointer">
                      <p className="text-sm text-white">New personal record in Bench Press!</p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                    <div className="p-4 hover:bg-astral-light transition-colors cursor-pointer">
                      <p className="text-sm text-white">Your guild ranked up to Silver tier</p>
                      <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-astral-light">
                    <Link
                      href="/notifications"
                      className="block text-center text-sm text-astral-blue hover:text-astral-purple transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 pr-3 hover:bg-astral-light rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-astral-blue to-astral-purple flex items-center justify-center text-white text-sm font-bold">
                L5
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 top-12 w-56 bg-astral-gray border border-astral-light rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-astral-light">
                    <p className="font-medium text-white">Warrior</p>
                    <p className="text-sm text-gray-400">Level 5 • 350 XP</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-astral-light text-white transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-astral-light text-white transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-astral-light text-error transition-colors"
                      onClick={() => {
                        setShowProfile(false)
                        // Handle logout
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
