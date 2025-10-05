'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * HUD (Heads-Up Display) Interface - Enhanced Gaming Edition
 * Full immersive gaming HUD with dynamic stats, combat effects, and real-time updates
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
  power?: number // Combat power rating
  streak?: number // Current streak
  achievements?: number // Unlocked achievements
  notifications: Array<{
    id: string
    type: 'achievement' | 'levelup' | 'quest' | 'loot' | 'combat' | 'warning'
    message: string
    icon: string
    timestamp?: Date
  }>
  combatMode?: boolean // Whether user is in workout session
  buffs?: Array<{
    id: string
    name: string
    icon: string
    duration: number // seconds remaining
  }>
  location?: string // Current page/zone
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
  power = 9001,
  streak = 0,
  achievements = 0,
  notifications,
  combatMode = false,
  buffs = [],
  location = 'The Forge',
}: HUDProps) {
  const [time, setTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMiniMap, setShowMiniMap] = useState(false)
  const [damageNumbers, setDamageNumbers] = useState<Array<{id: string, value: number, x: number, y: number}>>([])
  const [pulseEffect, setPulseEffect] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Trigger pulse effect on HP/MP changes
  useEffect(() => {
    setPulseEffect(true)
    const timeout = setTimeout(() => setPulseEffect(false), 300)
    return () => clearTimeout(timeout)
  }, [hp, mp])

  const hpPercent = (hp / maxHp) * 100
  const mpPercent = (mp / maxMp) * 100
  const xpPercent = (xp / maxXp) * 100
  
  // Determine HP bar color based on health level
  const getHPColor = () => {
    if (hpPercent > 60) return 'from-green-500 to-emerald-500'
    if (hpPercent > 30) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-red-700'
  }

  // Simulated damage number animation (would be triggered by actual combat events)
  const showDamageNumber = (value: number) => {
    const newDamage = {
      id: Date.now().toString(),
      value,
      x: Math.random() * 100,
      y: Math.random() * 50,
    }
    setDamageNumbers(prev => [...prev, newDamage])
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== newDamage.id))
    }, 1000)
  }

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
      <div className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b-2 shadow-lg transition-all duration-300 ${
        combatMode 
          ? 'border-red-500 shadow-red-500/50' 
          : 'border-cyan-500 shadow-cyan-500/20'
      }`}>
        <div className="relative">
          {/* Combat Mode Indicator */}
          {combatMode && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse">
              <div className="h-full bg-white/50 animate-shimmer-fast" />
            </div>
          )}

          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.03)_50%)] bg-[length:100%_4px] animate-scanlines pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-6">
              {/* Left: Character Info */}
              <div className="flex items-center gap-4">
                {/* Avatar with Combat Pulse */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-2 shadow-lg transition-all duration-300 ${
                    combatMode 
                      ? 'border-red-400 shadow-red-500/70 animate-pulse' 
                      : 'border-cyan-400 shadow-cyan-500/50'
                  }`}>
                    <span className="text-2xl">{combatMode ? '⚔️' : '💪'}</span>
                  </div>
                  {/* Level Badge */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-black flex items-center justify-center text-xs font-black shadow-lg">
                    {level}
                  </div>
                  {/* Combat Mode Ring */}
                  {combatMode && (
                    <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" />
                  )}
                </div>

                {/* Enhanced Stats Bars */}
                <div className="space-y-1">
                  {/* XP Bar with Glow */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cyan-400 font-mono w-8 font-bold">XP</span>
                    <div className="relative w-40 h-4 bg-gray-900 border border-cyan-700 rounded-sm overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 transition-all duration-500 relative"
                        style={{ width: `${xpPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                      </div>
                      {/* XP Milestone Markers */}
                      <div className="absolute inset-0 flex items-center">
                        {[25, 50, 75].map((marker) => (
                          <div 
                            key={marker}
                            className="absolute h-full w-px bg-cyan-900"
                            style={{ left: `${marker}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-cyan-300 font-mono font-bold min-w-[60px]">{xp}/{maxXp}</span>
                  </div>

                  {/* HP Bar with Dynamic Color & Pulse */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400 font-mono w-8 font-bold">HP</span>
                    <div className={`relative w-40 h-4 bg-gray-900 border rounded-sm overflow-hidden shadow-inner transition-all duration-300 ${
                      hpPercent <= 30 ? 'border-red-700 animate-pulse' : 'border-green-700'
                    }`}>
                      <div 
                        className={`h-full bg-gradient-to-r transition-all duration-500 relative ${getHPColor()} ${
                          pulseEffect ? 'scale-y-110' : ''
                        }`}
                        style={{ width: `${hpPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30" />
                        {hpPercent <= 30 && (
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        )}
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold min-w-[60px] transition-colors ${
                      hpPercent <= 30 ? 'text-red-400' : 'text-green-300'
                    }`}>{hp}/{maxHp}</span>
                  </div>

                  {/* MP/Stamina Bar with Glow */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-400 font-mono w-8 font-bold">MP</span>
                    <div className="relative w-40 h-4 bg-gray-900 border border-purple-700 rounded-sm overflow-hidden shadow-inner">
                      <div 
                        className={`h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500 relative ${
                          pulseEffect ? 'scale-y-110' : ''
                        }`}
                        style={{ width: `${mpPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30" />
                        <div className="absolute inset-0 bg-white/10 animate-shimmer" />
                      </div>
                    </div>
                    <span className="text-xs text-purple-300 font-mono font-bold min-w-[60px]">{mp}/{maxMp}</span>
                  </div>
                </div>
              </div>

              {/* Center: Enhanced Quick Stats & Buffs */}
              <div className="hidden md:flex items-center gap-3">
                {/* Gold/Workouts */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-600/50 rounded shadow-lg hover:border-yellow-400 transition-all hover:scale-105">
                  <span className="text-yellow-400 text-lg">💰</span>
                  <span className="text-yellow-400 font-bold font-mono text-sm">{gold}</span>
                </div>

                {/* Power Level */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-600/50 rounded shadow-lg hover:border-cyan-400 transition-all hover:scale-105">
                  <span className="text-cyan-400 text-lg">⚡</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-cyan-500 uppercase tracking-wider font-bold">Power</span>
                    <span className="text-cyan-400 font-black font-mono text-xs leading-none">{power?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Achievements */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-600/50 rounded shadow-lg hover:border-purple-400 transition-all hover:scale-105">
                  <span className="text-purple-400 text-lg">🏆</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-purple-500 uppercase tracking-wider font-bold">Trophies</span>
                    <span className="text-purple-400 font-black font-mono text-xs leading-none">{achievements}/100</span>
                  </div>
                </div>

                {/* Streak Counter */}
                {streak > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-600/50 rounded shadow-lg animate-pulse">
                    <span className="text-orange-400 text-lg">🔥</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-orange-500 uppercase tracking-wider font-bold">Streak</span>
                      <span className="text-orange-400 font-black font-mono text-xs leading-none">{streak} Days</span>
                    </div>
                  </div>
                )}

                {/* Active Buffs */}
                {buffs.length > 0 && (
                  <div className="flex items-center gap-1">
                    {buffs.slice(0, 3).map((buff) => (
                      <div
                        key={buff.id}
                        className="relative group px-2 py-1 bg-green-900/50 border border-green-600/50 rounded cursor-help hover:border-green-400 transition-all"
                        title={`${buff.name} - ${buff.duration}s remaining`}
                      >
                        <span className="text-sm">{buff.icon}</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-green-500 rounded text-xs text-green-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {buff.name}
                          <div className="text-[10px] text-gray-400">{buff.duration}s left</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Location, Time, Mini-Map, Actions */}
              <div className="flex items-center gap-3">
                {/* Current Location/Zone */}
                <div className="hidden lg:block text-right">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Location</div>
                  <div className="text-sm text-cyan-400 font-bold font-mono">📍 {location}</div>
                </div>

                {/* Time Display */}
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">System Time</div>
                  <div className="text-sm text-cyan-400 font-mono font-bold">
                    {time.toLocaleTimeString()}
                  </div>
                </div>

                {/* Mini-Map Toggle */}
                <button
                  onClick={() => setShowMiniMap(!showMiniMap)}
                  className={`relative p-2 bg-gray-900/50 border rounded transition-all ${
                    showMiniMap 
                      ? 'border-cyan-400 bg-cyan-900/30' 
                      : 'border-cyan-600 hover:border-cyan-400'
                  }`}
                  title="Toggle Mini-Map"
                >
                  <span className="text-cyan-400">🗺️</span>
                </button>

                {/* Notifications with Enhanced Badge */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 bg-gray-900/50 border rounded transition-all ${
                    showNotifications 
                      ? 'border-cyan-400 bg-cyan-900/30' 
                      : 'border-cyan-600 hover:border-cyan-400'
                  }`}
                >
                  <span className="text-cyan-400">🔔</span>
                  {notifications.length > 0 && (
                    <>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 border-2 border-black rounded-full flex items-center justify-center text-xs font-black shadow-lg animate-bounce">
                        {notifications.length}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75" />
                    </>
                  )}
                </button>

                {/* Settings */}
                <Link
                  href="/settings"
                  className="p-2 bg-gray-900/50 border border-gray-600 rounded hover:border-cyan-400 hover:bg-gray-800/50 transition-all"
                  title="Settings"
                >
                  <span className="text-gray-400 hover:text-cyan-400 transition-colors">⚙️</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Map Overlay */}
      {showMiniMap && (
        <div className="fixed top-20 right-4 z-50 w-64 h-64 bg-black/95 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/50 backdrop-blur-md overflow-hidden">
          {/* Mini-Map Header */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-cyan-700 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">🗺️</span>
              <span className="text-sm font-bold text-cyan-400">ZONE MAP</span>
            </div>
            <button 
              onClick={() => setShowMiniMap(false)}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Mini-Map Grid */}
          <div className="relative w-full h-full p-4">
            {/* Grid background */}
            <div 
              className="absolute inset-4 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
            
            {/* Zone Areas */}
            <div className="absolute inset-0 flex flex-col p-4 gap-2">
              {/* The Forge - Main Area */}
              <div className="flex-1 bg-cyan-500/20 border border-cyan-500/50 rounded flex items-center justify-center relative group cursor-pointer hover:bg-cyan-500/30 transition-all">
                <span className="text-xs font-bold text-cyan-400">🔨 THE FORGE</span>
                {location === 'The Forge' && (
                  <div className="absolute inset-0 border-2 border-cyan-400 rounded animate-pulse" />
                )}
              </div>
              
              {/* Training Grounds */}
              <div className="flex gap-2 flex-1">
                <div className="flex-1 bg-orange-500/20 border border-orange-500/50 rounded flex items-center justify-center text-xs font-bold text-orange-400 hover:bg-orange-500/30 transition-all cursor-pointer">
                  ⚔️ ARENA
                </div>
                <div className="flex-1 bg-purple-500/20 border border-purple-500/50 rounded flex items-center justify-center text-xs font-bold text-purple-400 hover:bg-purple-500/30 transition-all cursor-pointer">
                  📚 GUILD
                </div>
              </div>
              
              {/* Character & Progress */}
              <div className="flex gap-2 flex-1">
                <div className="flex-1 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center text-xs font-bold text-green-400 hover:bg-green-500/30 transition-all cursor-pointer">
                  👤 HERO
                </div>
                <div className="flex-1 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center text-xs font-bold text-blue-400 hover:bg-blue-500/30 transition-all cursor-pointer">
                  📈 STATS
                </div>
              </div>
            </div>

            {/* Player Position Indicator */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Notification Dropdown */}
      {showNotifications && (
        <div className="fixed top-20 right-4 z-50 w-96 bg-black/95 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/50 backdrop-blur-md">
          {/* Notification Header */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-cyan-700 px-4 py-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <span>NOTIFICATIONS</span>
              {notifications.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 rounded-full text-xs text-white">
                  {notifications.length}
                </span>
              )}
            </h3>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          
          {/* Notification List */}
          <div className="p-4">
            {notifications.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded flex items-start gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
                      notif.type === 'levelup' ? 'bg-yellow-900/30 border border-yellow-600/50 hover:border-yellow-400' :
                      notif.type === 'achievement' ? 'bg-purple-900/30 border border-purple-600/50 hover:border-purple-400' :
                      notif.type === 'combat' ? 'bg-red-900/30 border border-red-600/50 hover:border-red-400' :
                      notif.type === 'quest' ? 'bg-blue-900/30 border border-blue-600/50 hover:border-blue-400' :
                      notif.type === 'warning' ? 'bg-orange-900/30 border border-orange-600/50 hover:border-orange-400' :
                      'bg-cyan-900/30 border border-cyan-600/50 hover:border-cyan-400'
                    }`}
                  >
                    <span className="text-3xl flex-shrink-0">{notif.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-semibold leading-tight">{notif.message}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs uppercase tracking-wider font-bold ${
                          notif.type === 'levelup' ? 'text-yellow-400' :
                          notif.type === 'achievement' ? 'text-purple-400' :
                          notif.type === 'combat' ? 'text-red-400' :
                          notif.type === 'quest' ? 'text-blue-400' :
                          notif.type === 'warning' ? 'text-orange-400' :
                          'text-cyan-400'
                        }`}>
                          {notif.type}
                        </span>
                        {notif.timestamp && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-xs text-gray-400">
                              {notif.timestamp.toLocaleTimeString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-3 opacity-30">🔕</div>
                <div className="text-gray-500 font-medium">No new notifications</div>
                <div className="text-gray-600 text-sm mt-1">You're all caught up!</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Combat Damage Numbers Overlay */}
      {damageNumbers.map((damage) => (
        <div
          key={damage.id}
          className="fixed z-40 text-4xl font-black text-yellow-400 animate-damage-float pointer-events-none"
          style={{
            left: `${damage.x}%`,
            top: `${damage.y}%`,
            textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5)',
          }}
        >
          +{damage.value}
        </div>
      ))}

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

        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes damage-float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0.8);
            opacity: 0;
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

        .animate-shimmer-fast {
          animation: shimmer-fast 1s linear infinite;
        }

        .animate-damage-float {
          animation: damage-float 1s ease-out forwards;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.5);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.7);
        }
      `}</style>
    </>
  )
}
