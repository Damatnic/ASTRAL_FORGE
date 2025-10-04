'use client'

import { useEffect, useState } from 'react'
import { useSound } from '@/lib/sound-system'

/**
 * Victory Screen
 * Post-workout celebration with XP breakdown and loot drops
 */

interface VictoryScreenProps {
  workoutName: string
  duration: number
  volume: number
  sets: number
  prsHit: number
  xpBreakdown: {
    base: number
    volume: number
    prs: number
    streak: number
    total: number
  }
  lootDrops: Array<{
    name: string
    icon: string
    rarity: string
  }>
  leveledUp?: boolean
  newLevel?: number
  onContinue: () => void
}

export function VictoryScreen({
  workoutName = 'Workout',
  duration = 0,
  volume = 0,
  sets = 0,
  prsHit = 0,
  xpBreakdown = { base: 0, volume: 0, prs: 0, streak: 0, total: 0 },
  lootDrops = [],
  leveledUp = false,
  newLevel = 1,
  onContinue,
}: VictoryScreenProps) {
  const [showXP, setShowXP] = useState(false)
  const [showLoot, setShowLoot] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const sound = useSound()

  useEffect(() => {
    // Victory sound
    sound.play('victory')
    
    // Stagger animations
    setTimeout(() => setShowXP(true), 500)
    setTimeout(() => {
      setShowLoot(true)
      sound.play('loot')
    }, 1500)
    
    if (leveledUp) {
      setTimeout(() => {
        setShowLevelUp(true)
        sound.play('levelup')
      }, 2500)
    }
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'from-red-500 via-orange-500 to-yellow-500'
      case 'legendary': return 'from-yellow-400 to-yellow-600'
      case 'epic': return 'from-purple-400 to-pink-500'
      case 'rare': return 'from-blue-400 to-cyan-500'
      case 'uncommon': return 'from-green-400 to-emerald-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Victory Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4 animate-pulse">
            🏆 VICTORY! 🏆
          </h1>
          <p className="text-2xl text-white font-semibold">{workoutName}</p>
          <p className="text-gray-400 mt-2">Workout Complete!</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-2 border-cyan-500 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-cyan-400">{duration}m</div>
            <div className="text-xs text-gray-400">Duration</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🏋️</div>
            <div className="text-2xl font-bold text-purple-400">{volume.toLocaleString()}kg</div>
            <div className="text-xs text-gray-400">Volume</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-green-500 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">💪</div>
            <div className="text-2xl font-bold text-green-400">{sets}</div>
            <div className="text-xs text-gray-400">Sets</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-2 border-yellow-500 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-yellow-400">{prsHit}</div>
            <div className="text-xs text-gray-400">PRs</div>
          </div>
        </div>

        {/* XP Breakdown */}
        {showXP && (
          <div className="bg-black/50 border-2 border-cyan-500 rounded-lg p-6 mb-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <span>⭐</span>
              <span>XP BREAKDOWN</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Base XP</span>
                <span className="text-xl font-bold text-white">+{xpBreakdown.base}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Volume Bonus</span>
                <span className="text-xl font-bold text-purple-400">+{xpBreakdown.volume}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">PR Bonus</span>
                <span className="text-xl font-bold text-yellow-400">+{xpBreakdown.prs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Streak Bonus</span>
                <span className="text-xl font-bold text-orange-400">+{xpBreakdown.streak}</span>
              </div>
              <div className="border-t-2 border-cyan-500 pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-cyan-400">TOTAL XP</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  +{xpBreakdown.total}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loot Drops */}
        {showLoot && lootDrops.length > 0 && (
          <div className="bg-black/50 border-2 border-yellow-500 rounded-lg p-6 mb-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span>🎁</span>
              <span>LOOT DROPS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lootDrops.map((item, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${getRarityColor(item.rarity)} p-4 rounded-lg text-center animate-loot-drop shadow-lg`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="font-bold text-black">{item.name}</div>
                  <div className="text-xs uppercase text-black/70">{item.rarity}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level Up */}
        {showLevelUp && leveledUp && newLevel && (
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-4 border-yellow-500 rounded-lg p-8 mb-6 text-center animate-bounce-in shadow-2xl shadow-yellow-500/50">
            <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4 animate-pulse">
              🎉 LEVEL UP! 🎉
            </h2>
            <p className="text-4xl font-bold text-white mb-2">Level {newLevel}</p>
            <p className="text-gray-300">You've grown stronger!</p>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={() => {
              sound.play('click')
              onContinue()
            }}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/50"
          >
            CONTINUE
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loot-drop {
          0% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
          }
          50% {
            transform: translateY(10px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-loot-drop {
          animation: loot-drop 0.8s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}

