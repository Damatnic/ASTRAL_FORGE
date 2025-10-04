'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * HUD (Heads-Up Display) Interface
 * Gaming-style top bar with stats, notifications, and quick access
 */

interface HUDProps {
  level: number
  xp: number
  maxXp: number
  hp: number // Health/Energy for today
  maxHp: number
  mp: number // Mana/Stamina
  maxMp: number
  gold: number // Total workouts
  notifications: Array<{
    id: string
    type: 'achievement' | 'levelup' | 'quest' | 'loot'
    message: string
    icon: string
  }>
}

export function HUDInterface({
  level,
  xp,
  maxXp,
  hp,
  maxHp,
  mp,
  maxMp,
  gold,
  notifications,
}: HUDProps) {
  const [time, setTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hpPercent = (hp / maxHp) * 100
  const mpPercent = (mp / maxMp) * 100
  const xpPercent = (xp / maxXp) * 100

  return (
    <>
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,255,255,0.02)_50%,transparent_100%)] animate-scan" />
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main HUD Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
        <div className="relative">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.03)_50%)] bg-[length:100%_4px] animate-scanlines pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-6">
              {/* Left: Character Info */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-2 border-cyan-400 shadow-lg shadow-cyan-500/50">
                    <span className="text-2xl">💪</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 border-2 border-black flex items-center justify-center text-xs font-bold">
                    {level}
                  </div>
                </div>

                {/* Stats Bars */}
                <div className="space-y-1">
                  {/* XP Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cyan-400 font-mono w-8">XP</span>
                    <div className="w-32 h-3 bg-gray-900 border border-cyan-700 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 relative"
                        style={{ width: `${xpPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                      </div>
                    </div>
                    <span className="text-xs text-cyan-300 font-mono">{xp}/{maxXp}</span>
                  </div>

                  {/* HP Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400 font-mono w-8">HP</span>
                    <div className="w-32 h-3 bg-gray-900 border border-green-700 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-green-300 font-mono">{hp}/{maxHp}</span>
                  </div>

                  {/* MP Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-400 font-mono w-8">MP</span>
                    <div className="w-32 h-3 bg-gray-900 border border-purple-700 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${mpPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-purple-300 font-mono">{mp}/{maxMp}</span>
                  </div>
                </div>
              </div>

              {/* Center: Quick Stats */}
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-900/50 border border-yellow-600 rounded">
                  <span className="text-yellow-400">💰</span>
                  <span className="text-yellow-400 font-bold font-mono">{gold}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-gray-900/50 border border-cyan-600 rounded">
                  <span className="text-cyan-400">⚡</span>
                  <span className="text-cyan-400 font-bold font-mono">PWR: 9,001</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-gray-900/50 border border-purple-600 rounded">
                  <span className="text-purple-400">🏆</span>
                  <span className="text-purple-400 font-bold font-mono">45/100</span>
                </div>
              </div>

              {/* Right: Actions & Time */}
              <div className="flex items-center gap-4">
                {/* Time */}
                <div className="text-right">
                  <div className="text-xs text-gray-400 font-mono">SYSTEM TIME</div>
                  <div className="text-sm text-cyan-400 font-mono font-bold">
                    {time.toLocaleTimeString()}
                  </div>
                </div>

                {/* Notifications */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 bg-gray-900/50 border border-cyan-600 rounded hover:border-cyan-400 transition-colors"
                >
                  <span className="text-cyan-400">🔔</span>
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                      {notifications.length}
                    </div>
                  )}
                </button>

                {/* Settings */}
                <Link
                  href="/settings"
                  className="p-2 bg-gray-900/50 border border-gray-600 rounded hover:border-cyan-400 transition-colors"
                >
                  <span className="text-gray-400">⚙️</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50 w-80 bg-black/95 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/50 backdrop-blur-md">
          <div className="p-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span>🔔</span>
              <span>NOTIFICATIONS</span>
            </h3>
            {notifications.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 bg-gray-900/50 border border-cyan-700 rounded flex items-center gap-3 hover:border-cyan-400 transition-colors"
                  >
                    <span className="text-2xl">{notif.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white">{notif.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{notif.type.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes scanlines {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 4px;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }

        .animate-scanlines {
          animation: scanlines 0.1s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </>
  )
}

