'use client'

import { useEffect, useState } from 'react'

/**
 * Character Avatar System
 * Visual representation of user's fitness journey with progression states
 */

export type AvatarTier = 'novice' | 'apprentice' | 'warrior' | 'veteran' | 'master' | 'legend'
export type AvatarEquipment = {
  head?: string
  chest?: string
  legs?: string
  weapon?: string
  accessory?: string
}

interface CharacterAvatarProps {
  level: number
  tier: AvatarTier
  equipment?: AvatarEquipment
  stats: {
    strength: number
    endurance: number
    agility: number
    flexibility: number
    power: number
  }
  isIdling?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showDetails?: boolean
}

export function CharacterAvatar({
  level,
  tier,
  equipment = {},
  stats,
  isIdling = true,
  size = 'md',
  showDetails = true,
}: CharacterAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [idleState, setIdleState] = useState(0)

  // Idle animation cycle
  useEffect(() => {
    if (!isIdling) return
    
    const interval = setInterval(() => {
      setIdleState((prev) => (prev + 1) % 3)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [isIdling])

  const getTierColor = (t: AvatarTier) => {
    switch (t) {
      case 'legend':
        return {
          bg: 'from-yellow-500 via-orange-500 to-red-500',
          border: 'border-yellow-500',
          glow: 'shadow-yellow-500/50',
          text: 'text-yellow-400',
        }
      case 'master':
        return {
          bg: 'from-purple-500 via-pink-500 to-purple-600',
          border: 'border-purple-500',
          glow: 'shadow-purple-500/50',
          text: 'text-purple-400',
        }
      case 'veteran':
        return {
          bg: 'from-blue-500 via-cyan-500 to-blue-600',
          border: 'border-blue-500',
          glow: 'shadow-blue-500/50',
          text: 'text-blue-400',
        }
      case 'warrior':
        return {
          bg: 'from-green-500 via-emerald-500 to-green-600',
          border: 'border-green-500',
          glow: 'shadow-green-500/50',
          text: 'text-green-400',
        }
      case 'apprentice':
        return {
          bg: 'from-cyan-500 to-blue-500',
          border: 'border-cyan-500',
          glow: 'shadow-cyan-500/50',
          text: 'text-cyan-400',
        }
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          border: 'border-gray-500',
          glow: 'shadow-gray-500/30',
          text: 'text-gray-400',
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'xl':
        return { container: 'w-64 h-64', avatar: 'text-8xl', level: 'text-2xl', name: 'text-2xl' }
      case 'lg':
        return { container: 'w-48 h-48', avatar: 'text-6xl', level: 'text-xl', name: 'text-xl' }
      case 'md':
        return { container: 'w-32 h-32', avatar: 'text-5xl', level: 'text-lg', name: 'text-lg' }
      case 'sm':
        return { container: 'w-24 h-24', avatar: 'text-4xl', level: 'text-base', name: 'text-base' }
    }
  }

  const getAvatarIcon = () => {
    // Progress through different avatar states
    if (level >= 80) return '👑' // Legend
    if (level >= 60) return '⚔️' // Master
    if (level >= 40) return '🛡️' // Veteran
    if (level >= 20) return '💪' // Warrior
    if (level >= 10) return '🥊' // Apprentice
    return '🏃' // Novice
  }

  const getTierName = () => {
    return tier.charAt(0).toUpperCase() + tier.slice(1)
  }

  const colors = getTierColor(tier)
  const sizes = getSizeClasses()

  return (
    <div className="relative">
      {/* Main Avatar Container */}
      <div className={`relative ${sizes.container}`}>
        {/* Rotating ring */}
        <div className={`absolute inset-0 rounded-full border-4 ${colors.border} ${colors.glow} shadow-2xl animate-spin-slow`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full" />
        </div>

        {/* Inner glow pulse */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${colors.bg} opacity-30 animate-pulse-slow`} />

        {/* Avatar */}
        <div className={`
          absolute inset-4 rounded-full bg-gradient-to-br ${colors.bg} 
          flex items-center justify-center
          ${isIdling ? 'animate-breathing' : ''}
          ${isAnimating ? 'animate-level-up' : ''}
        `}>
          <span className={`${sizes.avatar} transform ${idleState === 1 ? 'scale-105' : idleState === 2 ? 'scale-95' : ''} transition-transform duration-1000`}>
            {getAvatarIcon()}
          </span>
        </div>

        {/* Level Badge */}
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${sizes.level} font-bold px-4 py-1 bg-black border-2 ${colors.border} rounded-full ${colors.text} shadow-lg`}>
          Lv.{level}
        </div>

        {/* Equipment Slots */}
        {size !== 'sm' && (
          <>
            {/* Head slot */}
            {equipment.head && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
                {equipment.head}
              </div>
            )}
            
            {/* Weapon slot */}
            {equipment.weapon && (
              <div className="absolute top-1/2 -translate-y-1/2 -right-6 text-2xl">
                {equipment.weapon}
              </div>
            )}
            
            {/* Accessory slot */}
            {equipment.accessory && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xl">
                {equipment.accessory}
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="mt-6 space-y-3">
          {/* Tier Name */}
          <div className="text-center">
            <div className={`inline-block px-4 py-2 bg-gradient-to-r ${colors.bg} rounded-lg font-bold text-black shadow-lg`}>
              {getTierName()}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/50 border border-cyan-700 rounded p-2">
              <div className="text-xs text-gray-400">STR</div>
              <div className="text-lg font-bold text-red-400">{stats.strength}</div>
            </div>
            <div className="bg-black/50 border border-cyan-700 rounded p-2">
              <div className="text-xs text-gray-400">END</div>
              <div className="text-lg font-bold text-green-400">{stats.endurance}</div>
            </div>
            <div className="bg-black/50 border border-cyan-700 rounded p-2">
              <div className="text-xs text-gray-400">AGI</div>
              <div className="text-lg font-bold text-yellow-400">{stats.agility}</div>
            </div>
            <div className="bg-black/50 border border-cyan-700 rounded p-2">
              <div className="text-xs text-gray-400">FLX</div>
              <div className="text-lg font-bold text-purple-400">{stats.flexibility}</div>
            </div>
          </div>

          {/* Power Level */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-2 border-cyan-500 rounded-lg p-3">
            <div className="text-xs text-cyan-400 mb-1">POWER LEVEL</div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {stats.power}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes level-up {
          0% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-breathing {
          animation: breathing 4s ease-in-out infinite;
        }

        .animate-level-up {
          animation: level-up 1s ease-in-out;
        }
      `}</style>
    </div>
  )
}

// Profile Creation/Customization Modal
// Would show when user first starts or wants to customize
interface CharacterCreatorProps {
  onComplete: (avatar: { tier: AvatarTier; equipment: AvatarEquipment }) => void
}

export function CharacterCreator({ onComplete }: CharacterCreatorProps) {
  const [selectedTier, setSelectedTier] = useState<AvatarTier>('novice')
  const [equipment, setEquipment] = useState<AvatarEquipment>({})

  const tiers: AvatarTier[] = ['novice', 'apprentice', 'warrior', 'veteran', 'master', 'legend']
  
  const equipmentOptions = {
    head: ['👑', '🎩', '🪖', '⛑️', '🎓'],
    weapon: ['⚔️', '🗡️', '🔨', '🏹', '🪓'],
    accessory: ['💍', '📿', '⌚', '🎖️', '🏆'],
  }

  return (
    <div className="bg-black/95 border-2 border-cyan-500 rounded-lg p-8 max-w-2xl mx-auto backdrop-blur-md">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 text-center">
        CREATE YOUR PROFILE
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="flex items-center justify-center">
          <CharacterAvatar
            level={1}
            tier={selectedTier}
            equipment={equipment}
            stats={{ strength: 10, endurance: 10, agility: 10, flexibility: 10, power: 40 }}
            size="lg"
            showDetails={false}
          />
        </div>

        {/* Customization */}
        <div className="space-y-6">
          {/* Tier Selection */}
          <div>
            <label className="block text-cyan-400 font-bold mb-2">Starting Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {tiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`
                    px-3 py-2 rounded font-bold transition-all
                    ${selectedTier === tier 
                      ? 'bg-cyan-500 text-black scale-105' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-cyan-400 font-bold mb-2">Head Gear</label>
            <div className="flex gap-2">
              {equipmentOptions.head.map((item) => (
                <button
                  key={item}
                  onClick={() => setEquipment({ ...equipment, head: item })}
                  className={`
                    text-3xl p-2 rounded transition-all
                    ${equipment.head === item 
                      ? 'bg-cyan-500 scale-110' 
                      : 'bg-gray-800 hover:bg-gray-700'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-cyan-400 font-bold mb-2">Weapon</label>
            <div className="flex gap-2">
              {equipmentOptions.weapon.map((item) => (
                <button
                  key={item}
                  onClick={() => setEquipment({ ...equipment, weapon: item })}
                  className={`
                    text-3xl p-2 rounded transition-all
                    ${equipment.weapon === item 
                      ? 'bg-cyan-500 scale-110' 
                      : 'bg-gray-800 hover:bg-gray-700'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-cyan-400 font-bold mb-2">Accessory</label>
            <div className="flex gap-2">
              {equipmentOptions.accessory.map((item) => (
                <button
                  key={item}
                  onClick={() => setEquipment({ ...equipment, accessory: item })}
                  className={`
                    text-3xl p-2 rounded transition-all
                    ${equipment.accessory === item 
                      ? 'bg-cyan-500 scale-110' 
                      : 'bg-gray-800 hover:bg-gray-700'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={() => onComplete({ tier: selectedTier, equipment })}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            BEGIN YOUR JOURNEY
          </button>
        </div>
      </div>
    </div>
  )
}

