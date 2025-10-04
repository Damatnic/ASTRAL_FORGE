'use client'

import { useEffect, useState } from 'react'

/**
 * Combat Log / Activity Feed
 * MMO-style combat log for workout activities
 */

export interface CombatLogEntry {
  id: string
  timestamp: Date
  type: 'damage' | 'heal' | 'xp' | 'loot' | 'achievement' | 'critical' | 'combo'
  actor: string
  action: string
  target?: string
  value?: number
  unit?: string
  icon?: string
  critical?: boolean
}

interface CombatLogProps {
  entries: CombatLogEntry[]
  maxEntries?: number
  autoScroll?: boolean
}

export function CombatLog({ entries, maxEntries = 50, autoScroll = true }: CombatLogProps) {
  const [displayEntries, setDisplayEntries] = useState<CombatLogEntry[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const filtered = filter === 'all' 
      ? entries 
      : entries.filter((e) => e.type === filter)
    
    setDisplayEntries(filtered.slice(-maxEntries))
  }, [entries, filter, maxEntries])

  const getEntryColor = (type: CombatLogEntry['type']) => {
    switch (type) {
      case 'damage':
        return 'text-red-400'
      case 'heal':
        return 'text-green-400'
      case 'xp':
        return 'text-cyan-400'
      case 'loot':
        return 'text-yellow-400'
      case 'achievement':
        return 'text-purple-400'
      case 'critical':
        return 'text-orange-400'
      case 'combo':
        return 'text-pink-400'
      default:
        return 'text-gray-400'
    }
  }

  const getEntryIcon = (type: CombatLogEntry['type'], icon?: string) => {
    if (icon) return icon
    switch (type) {
      case 'damage':
        return '⚔️'
      case 'heal':
        return '💚'
      case 'xp':
        return '⭐'
      case 'loot':
        return '📦'
      case 'achievement':
        return '🏆'
      case 'critical':
        return '💥'
      case 'combo':
        return '🔥'
      default:
        return '•'
    }
  }

  const formatEntry = (entry: CombatLogEntry) => {
    let message = ''
    
    switch (entry.type) {
      case 'damage':
        message = `${entry.actor} ${entry.action} ${entry.target || ''} for ${entry.value} ${entry.unit || 'damage'}`
        break
      case 'heal':
        message = `${entry.actor} ${entry.action} ${entry.value} ${entry.unit || 'HP'}`
        break
      case 'xp':
        message = `${entry.actor} gained ${entry.value} ${entry.unit || 'XP'} from ${entry.action}`
        break
      case 'loot':
        message = `${entry.actor} obtained [${entry.action}]`
        break
      case 'achievement':
        message = `${entry.actor} unlocked achievement: ${entry.action}!`
        break
      case 'critical':
        message = `${entry.actor} ${entry.action} ${entry.target || ''} for ${entry.value} ${entry.unit || 'damage'} **CRITICAL HIT**`
        break
      case 'combo':
        message = `${entry.actor} ${entry.action} - ${entry.value}x COMBO!`
        break
      default:
        message = `${entry.actor} ${entry.action}`
    }

    return message
  }

  return (
    <div className="bg-black/90 border-2 border-cyan-500 rounded-lg backdrop-blur-md shadow-2xl shadow-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-cyan-500 p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-cyan-400 font-mono flex items-center gap-2">
            <span>📜</span>
            <span>COMBAT LOG</span>
          </h3>
          
          {/* Filters */}
          <div className="flex gap-1">
            {['all', 'damage', 'xp', 'loot', 'achievement'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-2 py-1 text-xs font-mono rounded transition-colors
                  ${filter === f 
                    ? 'bg-cyan-500 text-black' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }
                `}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="h-96 overflow-y-auto p-3 space-y-1 font-mono text-sm bg-gradient-to-b from-gray-900/50 to-black/50">
        {displayEntries.length > 0 ? (
          displayEntries.map((entry, idx) => (
            <div
              key={entry.id}
              className={`
                flex items-start gap-2 p-2 rounded hover:bg-cyan-900/20 transition-colors
                ${entry.critical ? 'animate-pulse-once bg-orange-900/30' : ''}
              `}
            >
              {/* Timestamp */}
              <span className="text-xs text-gray-500 shrink-0">
                [{new Date(entry.timestamp).toLocaleTimeString()}]
              </span>

              {/* Icon */}
              <span className="shrink-0">{getEntryIcon(entry.type, entry.icon)}</span>

              {/* Message */}
              <div className={`flex-1 ${getEntryColor(entry.type)}`}>
                {formatEntry(entry)}
                {entry.critical && (
                  <span className="ml-2 text-orange-400 font-bold animate-bounce">
                    CRIT!
                  </span>
                )}
              </div>

              {/* Value (if numeric) */}
              {entry.value !== undefined && entry.type !== 'xp' && (
                <span className={`${getEntryColor(entry.type)} font-bold shrink-0`}>
                  {entry.type === 'heal' ? '+' : ''}{entry.value}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📜</div>
              <div>No entries yet</div>
              <div className="text-xs mt-1">Complete workouts to see activity here</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-900/80 border-t border-cyan-500 p-2 flex items-center justify-between text-xs font-mono">
        <div className="text-gray-400">
          Showing {displayEntries.length} entries
        </div>
        <div className="flex gap-4">
          <div className="text-red-400">
            DMG: {entries.filter((e) => e.type === 'damage').reduce((sum, e) => sum + (e.value || 0), 0)}
          </div>
          <div className="text-cyan-400">
            XP: {entries.filter((e) => e.type === 'xp').reduce((sum, e) => sum + (e.value || 0), 0)}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-once {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out 1;
        }
      `}</style>
    </div>
  )
}

// Helper function to create combat log entries
export function createLogEntry(
  type: CombatLogEntry['type'],
  actor: string,
  action: string,
  options?: Partial<CombatLogEntry>
): CombatLogEntry {
  return {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    type,
    actor,
    action,
    ...options,
  }
}

