'use client'

/**
 * CHARACTER SHEET PAGE
 * 
 * Complete RPG character profile with detailed stats, skills, equipment, and progression.
 * Features 5 main tabs: Stats, Skills, Equipment, Achievements, Combat Log
 * 
 * Epic gaming elements:
 * - 3D character avatar with class/level display
 * - Primary stats (STR, DEX, CON, INT, WIS, CHA)
 * - Derived stats (HP, Stamina, Power, Defense, Crit)
 * - Skill tree with unlocked/locked abilities
 * - Equipment slots with rarity display
 * - Achievement gallery with progress tracking
 * - Combat log with session history
 * - Stat allocation points system
 * - Prestige system preview
 * - Animated progression bars
 */

import { useState, useEffect } from 'react'
import { ParticleBackground } from '@/components/particle-background'
import Link from 'next/link'

// TypeScript interfaces
interface CharacterStats {
  level: number
  experience: number
  experienceToNextLevel: number
  prestigeLevel: number
  className: string
  title: string
  powerLevel: number
  // Primary stats
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  // Derived stats
  maxHealth: number
  currentHealth: number
  maxStamina: number
  currentStamina: number
  physicalPower: number
  magicalPower: number
  defense: number
  criticalChance: number
  criticalDamage: number
  // Progression
  totalWorkouts: number
  totalSets: number
  totalReps: number
  totalWeight: number
  statPoints: number
}

interface Skill {
  id: string
  name: string
  description: string
  icon: string
  level: number
  maxLevel: number
  unlocked: boolean
  requirements: string[]
  category: 'strength' | 'endurance' | 'mobility' | 'power' | 'technique'
}

interface Equipment {
  slot: 'weapon' | 'armor' | 'accessory1' | 'accessory2' | 'accessory3'
  item: {
    id: string
    name: string
    icon: string
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
    stats: { stat: string; value: number }[]
  } | null
}

interface CombatLogEntry {
  id: string
  date: string
  type: 'workout' | 'achievement' | 'level_up' | 'skill_unlock'
  description: string
  rewards: string[]
}

export default function CharacterSheetPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'equipment' | 'achievements' | 'combat-log'>('stats')
  const [stats, setStats] = useState<CharacterStats | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([])

  useEffect(() => {
    loadCharacterData()
  }, [])

  async function loadCharacterData() {
    // Simulate loading character data
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock character stats
    setStats({
      level: 42,
      experience: 12450,
      experienceToNextLevel: 15000,
      prestigeLevel: 2,
      className: 'Battle Master',
      title: 'The Unyielding',
      powerLevel: 9847,
      strength: 85,
      dexterity: 72,
      constitution: 90,
      intelligence: 65,
      wisdom: 78,
      charisma: 68,
      maxHealth: 2500,
      currentHealth: 2500,
      maxStamina: 1800,
      currentStamina: 1800,
      physicalPower: 1245,
      magicalPower: 687,
      defense: 892,
      criticalChance: 28.5,
      criticalDamage: 215,
      totalWorkouts: 387,
      totalSets: 4821,
      totalReps: 18493,
      totalWeight: 2847500,
      statPoints: 5
    })

    // Mock skills
    setSkills([
      { id: 'power-strike', name: 'Power Strike', description: 'Increases damage of heavy compound lifts', icon: '⚔️', level: 5, maxLevel: 5, unlocked: true, requirements: [], category: 'strength' },
      { id: 'iron-will', name: 'Iron Will', description: 'Gain bonus stamina for extended sets', icon: '🛡️', level: 4, maxLevel: 5, unlocked: true, requirements: ['power-strike'], category: 'endurance' },
      { id: 'berserker', name: 'Berserker Mode', description: 'Increased power at low stamina', icon: '⚡', level: 3, maxLevel: 5, unlocked: true, requirements: ['iron-will'], category: 'power' },
      { id: 'perfect-form', name: 'Perfect Form', description: 'Bonus multiplier for strict technique', icon: '✨', level: 5, maxLevel: 5, unlocked: true, requirements: ['power-strike'], category: 'technique' },
      { id: 'warrior-focus', name: 'Warrior Focus', description: 'Enhanced concentration during workouts', icon: '🎯', level: 2, maxLevel: 5, unlocked: true, requirements: ['perfect-form'], category: 'technique' },
      { id: 'explosive-power', name: 'Explosive Power', description: 'Increases speed and plyometric effectiveness', icon: '💥', level: 3, maxLevel: 5, unlocked: true, requirements: [], category: 'power' },
      { id: 'flexibility-master', name: 'Flexibility Master', description: 'Improved range of motion and injury prevention', icon: '🤸', level: 4, maxLevel: 5, unlocked: true, requirements: [], category: 'mobility' },
      { id: 'titan-strength', name: 'Titan Strength', description: 'Unlock godlike lifting capacity', icon: '👑', level: 0, maxLevel: 5, unlocked: false, requirements: ['power-strike', 'berserker'], category: 'strength' },
      { id: 'endless-stamina', name: 'Endless Stamina', description: 'Nearly unlimited workout duration', icon: '♾️', level: 0, maxLevel: 5, unlocked: false, requirements: ['iron-will', 'berserker'], category: 'endurance' },
      { id: 'critical-mastery', name: 'Critical Mastery', description: 'Massively increased critical hit chance', icon: '🌟', level: 0, maxLevel: 5, unlocked: false, requirements: ['warrior-focus', 'perfect-form'], category: 'technique' }
    ])

    // Mock equipment
    setEquipment([
      {
        slot: 'weapon',
        item: {
          id: 'heavens-barbell',
          name: "Heaven's Barbell",
          icon: '🏋️',
          rarity: 'legendary',
          stats: [
            { stat: 'Strength', value: 25 },
            { stat: 'Physical Power', value: 150 },
            { stat: 'Critical Chance', value: 8 }
          ]
        }
      },
      {
        slot: 'armor',
        item: {
          id: 'iron-fortress',
          name: 'Iron Fortress Plate',
          icon: '🛡️',
          rarity: 'epic',
          stats: [
            { stat: 'Constitution', value: 20 },
            { stat: 'Defense', value: 180 },
            { stat: 'Max Health', value: 300 }
          ]
        }
      },
      {
        slot: 'accessory1',
        item: {
          id: 'warriors-band',
          name: "Warrior's Band",
          icon: '💍',
          rarity: 'rare',
          stats: [
            { stat: 'Strength', value: 12 },
            { stat: 'Dexterity', value: 8 }
          ]
        }
      },
      {
        slot: 'accessory2',
        item: {
          id: 'focus-charm',
          name: 'Charm of Focus',
          icon: '✨',
          rarity: 'uncommon',
          stats: [
            { stat: 'Wisdom', value: 10 }
          ]
        }
      },
      {
        slot: 'accessory3',
        item: null
      }
    ])

    // Mock combat log
    setCombatLog([
      {
        id: '1',
        date: '2 hours ago',
        type: 'workout',
        description: 'Completed "The Iron Gauntlet" (Legendary Difficulty)',
        rewards: ['+500 XP', '+50 Strength', 'Epic Chest']
      },
      {
        id: '2',
        date: '1 day ago',
        type: 'achievement',
        description: 'Unlocked achievement: "Iron Will" (Complete 100 workouts)',
        rewards: ['+1000 XP', 'Legendary Title']
      },
      {
        id: '3',
        date: '2 days ago',
        type: 'level_up',
        description: 'Reached Level 42',
        rewards: ['+5 Stat Points', '+100 Max HP', '+50 Max Stamina']
      },
      {
        id: '4',
        date: '3 days ago',
        type: 'skill_unlock',
        description: 'Unlocked skill: "Perfect Form" (Level 5)',
        rewards: ['+50 Technique', 'New Combo Unlocked']
      },
      {
        id: '5',
        date: '5 days ago',
        type: 'workout',
        description: 'Completed "Titan\'s Trial" (Epic Difficulty)',
        rewards: ['+350 XP', '+30 Constitution']
      }
    ])

    setLoading(false)
  }

  function getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'uncommon': return 'from-green-500 to-green-600'
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-orange-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  function getRarityGlow(rarity: string): string {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/50'
      case 'uncommon': return 'shadow-green-500/50'
      case 'rare': return 'shadow-blue-500/50'
      case 'epic': return 'shadow-purple-500/50'
      case 'legendary': return 'shadow-orange-500/50'
      default: return 'shadow-gray-500/50'
    }
  }

  function getCategoryColor(category: string): string {
    switch (category) {
      case 'strength': return 'from-red-500 to-red-600'
      case 'endurance': return 'from-blue-500 to-blue-600'
      case 'mobility': return 'from-green-500 to-green-600'
      case 'power': return 'from-orange-500 to-orange-600'
      case 'technique': return 'from-purple-500 to-purple-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  function getStatColor(value: number, max: number = 100): string {
    const percentage = (value / max) * 100
    if (percentage >= 80) return 'from-orange-500 to-red-500'
    if (percentage >= 60) return 'from-yellow-500 to-orange-500'
    if (percentage >= 40) return 'from-blue-500 to-purple-500'
    return 'from-cyan-500 to-blue-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-8xl animate-bounce">⚔️</div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">
              Loading Character Data...
            </div>
            <div className="text-sm text-cyan-400/60 animate-pulse delay-100">
              Retrieving stats and equipment
            </div>
            <div className="text-sm text-blue-400/60 animate-pulse delay-200">
              Calculating power level
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const experiencePercentage = (stats.experience / stats.experienceToNextLevel) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground
        colors={['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']}
        particleCount={70}
        connectionDistance={120}
        speed={0.3}
      />

      {/* Atmospheric Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Epic Header with Character Profile */}
        <div className="mb-8">
          <div className="flex items-start gap-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
            {/* Character Avatar */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-6xl shadow-xl">
                  ⚔️
                </div>
                {/* Prestige Badge */}
                {stats.prestigeLevel > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-orange-500/50 animate-pulse">
                    ⭐ P{stats.prestigeLevel}
                  </div>
                )}
              </div>
            </div>

            {/* Character Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-sm text-cyan-400 font-semibold tracking-wider">{stats.className}</div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  {stats.title}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-2xl font-bold text-white">Level {stats.level}</div>
                  <div className="text-xl text-cyan-400">⚡ {stats.powerLevel.toLocaleString()} Power</div>
                </div>
              </div>

              {/* Experience Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400 font-semibold">Experience</span>
                  <span className="text-white font-bold">{stats.experience.toLocaleString()} / {stats.experienceToNextLevel.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/30">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${experiencePercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>

              {/* Stat Points Available */}
              {stats.statPoints > 0 && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-lg px-4 py-2 animate-pulse">
                  <span className="text-orange-400 text-2xl">💫</span>
                  <span className="text-white font-bold">{stats.statPoints} Stat Points Available</span>
                  <button className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-lg font-bold hover:scale-105 transition">
                    Allocate
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">❤️</div>
                <div className="text-2xl font-bold text-white">{stats.currentHealth}</div>
                <div className="text-xs text-red-400">Health</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">⚡</div>
                <div className="text-2xl font-bold text-white">{stats.currentStamina}</div>
                <div className="text-xs text-cyan-400">Stamina</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">⚔️</div>
                <div className="text-2xl font-bold text-white">{stats.physicalPower}</div>
                <div className="text-xs text-orange-400">Power</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">🛡️</div>
                <div className="text-2xl font-bold text-white">{stats.defense}</div>
                <div className="text-xs text-blue-400">Defense</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-2">
            {[
              { id: 'stats' as const, label: 'Stats', icon: '📊' },
              { id: 'skills' as const, label: 'Skills', icon: '✨' },
              { id: 'equipment' as const, label: 'Equipment', icon: '⚔️' },
              { id: 'achievements' as const, label: 'Achievements', icon: '🏆' },
              { id: 'combat-log' as const, label: 'Combat Log', icon: '📜' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-105'
                    : 'text-cyan-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Primary Stats */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                <span>💪</span> Primary Stats
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Strength', value: stats.strength, icon: '💪', color: 'from-red-500 to-orange-500' },
                  { name: 'Dexterity', value: stats.dexterity, icon: '⚡', color: 'from-yellow-500 to-orange-500' },
                  { name: 'Constitution', value: stats.constitution, icon: '❤️', color: 'from-red-500 to-pink-500' },
                  { name: 'Intelligence', value: stats.intelligence, icon: '🧠', color: 'from-blue-500 to-purple-500' },
                  { name: 'Wisdom', value: stats.wisdom, icon: '🔮', color: 'from-purple-500 to-pink-500' },
                  { name: 'Charisma', value: stats.charisma, icon: '✨', color: 'from-cyan-500 to-blue-500' }
                ].map(stat => (
                  <div key={stat.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{stat.icon}</span>
                        <span className="text-white font-bold">{stat.name}</span>
                      </div>
                      <span className="text-2xl font-black text-white">{stat.value}</span>
                    </div>
                    <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700">
                      <div 
                        className={`h-full bg-gradient-to-r ${getStatColor(stat.value)} transition-all duration-1000`}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Derived Stats */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                <span>⚔️</span> Combat Stats
              </h2>
              <div className="space-y-6">
                {/* Health & Stamina */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-red-400 font-semibold">❤️ Health</span>
                      <span className="text-white font-bold">{stats.currentHealth} / {stats.maxHealth}</span>
                    </div>
                    <div className="h-4 bg-slate-800/80 rounded-full overflow-hidden border border-red-500/30">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-cyan-400 font-semibold">⚡ Stamina</span>
                      <span className="text-white font-bold">{stats.currentStamina} / {stats.maxStamina}</span>
                    </div>
                    <div className="h-4 bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/30">
                      <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500 transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>

                {/* Power Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-4">
                    <div className="text-3xl mb-2">⚔️</div>
                    <div className="text-2xl font-bold text-white">{stats.physicalPower}</div>
                    <div className="text-xs text-orange-400">Physical Power</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-xl p-4">
                    <div className="text-3xl mb-2">🔮</div>
                    <div className="text-2xl font-bold text-white">{stats.magicalPower}</div>
                    <div className="text-xs text-purple-400">Magical Power</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl p-4">
                    <div className="text-3xl mb-2">🛡️</div>
                    <div className="text-2xl font-bold text-white">{stats.defense}</div>
                    <div className="text-xs text-blue-400">Defense</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-4">
                    <div className="text-3xl mb-2">💥</div>
                    <div className="text-2xl font-bold text-white">{stats.criticalChance}%</div>
                    <div className="text-xs text-yellow-400">Crit Chance</div>
                  </div>
                </div>

                {/* Critical Damage */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🌟</span>
                      <span className="text-white font-bold">Critical Damage</span>
                    </div>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                      {stats.criticalDamage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progression Stats */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                <span>📈</span> Lifetime Progression
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">🏋️</div>
                  <div className="text-3xl font-black text-white mb-1">{stats.totalWorkouts.toLocaleString()}</div>
                  <div className="text-sm text-cyan-400">Total Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-2">📊</div>
                  <div className="text-3xl font-black text-white mb-1">{stats.totalSets.toLocaleString()}</div>
                  <div className="text-sm text-blue-400">Total Sets</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-2">🔢</div>
                  <div className="text-3xl font-black text-white mb-1">{stats.totalReps.toLocaleString()}</div>
                  <div className="text-sm text-purple-400">Total Reps</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-2">⚖️</div>
                  <div className="text-3xl font-black text-white mb-1">{(stats.totalWeight / 1000).toFixed(1)}k</div>
                  <div className="text-sm text-orange-400">Total Weight (lbs)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                <span>✨</span> Skill Tree
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      skill.unlocked
                        ? `bg-gradient-to-br ${getCategoryColor(skill.category)}/20 border-${skill.category === 'strength' ? 'red' : skill.category === 'endurance' ? 'blue' : skill.category === 'mobility' ? 'green' : skill.category === 'power' ? 'orange' : 'purple'}-500/50 hover:scale-105 cursor-pointer`
                        : 'bg-slate-800/50 border-slate-700/50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Skill Card */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="text-4xl">{skill.icon}</div>
                        {!skill.unlocked && (
                          <div className="text-2xl">🔒</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                        <p className="text-sm text-slate-300">{skill.description}</p>
                      </div>
                      {skill.unlocked ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-cyan-400 font-semibold">Level {skill.level}</span>
                            <span className="text-white">Max: {skill.maxLevel}</span>
                          </div>
                          <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getCategoryColor(skill.category)}`}
                              style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                            />
                          </div>
                          {skill.level < skill.maxLevel && (
                            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg font-bold text-sm hover:scale-105 transition">
                              Upgrade
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-slate-400">
                            <div className="font-semibold mb-1">Requirements:</div>
                            {skill.requirements.length > 0 ? (
                              skill.requirements.map(req => (
                                <div key={req} className="flex items-center gap-1">
                                  <span>🔸</span>
                                  <span>{skills.find(s => s.id === req)?.name}</span>
                                </div>
                              ))
                            ) : (
                              <div>None</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment Slots */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                <span>⚔️</span> Equipment Slots
              </h2>
              <div className="space-y-4">
                {equipment.map(slot => (
                  <div
                    key={slot.slot}
                    className={`rounded-xl border-2 p-4 transition-all duration-300 ${
                      slot.item
                        ? `bg-gradient-to-r ${getRarityColor(slot.item.rarity)}/20 border-${slot.item.rarity === 'legendary' ? 'orange' : slot.item.rarity === 'epic' ? 'purple' : slot.item.rarity === 'rare' ? 'blue' : slot.item.rarity === 'uncommon' ? 'green' : 'gray'}-500/50 shadow-lg ${getRarityGlow(slot.item.rarity)} hover:scale-102 cursor-pointer`
                        : 'bg-slate-800/50 border-slate-700/50 border-dashed hover:border-cyan-500/50 cursor-pointer'
                    }`}
                  >
                    {slot.item ? (
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{slot.item.icon}</div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                              {slot.slot.replace(/\d/g, ' $&')}
                            </div>
                            <h3 className="text-lg font-bold text-white">{slot.item.name}</h3>
                            <div className={`inline-block text-xs font-bold px-2 py-1 rounded bg-gradient-to-r ${getRarityColor(slot.item.rarity)} text-white uppercase`}>
                              {slot.item.rarity}
                            </div>
                          </div>
                          <div className="space-y-1">
                            {slot.item.stats.map((stat, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-green-400">+{stat.value}</span>
                                <span className="text-slate-300">{stat.stat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <div className="text-4xl mb-2">➕</div>
                        <div className="text-sm font-semibold">Empty Slot</div>
                        <div className="text-xs">{slot.slot.replace(/\d/g, ' $&')}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Stats Summary */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                  <span>📊</span> Equipment Bonuses
                </h2>
                <div className="space-y-4">
                  {(() => {
                    const bonuses: { [key: string]: number } = {}
                    equipment.forEach(slot => {
                      if (slot.item) {
                        slot.item.stats.forEach(stat => {
                          bonuses[stat.stat] = (bonuses[stat.stat] || 0) + stat.value
                        })
                      }
                    })
                    return Object.entries(bonuses).map(([stat, value]) => (
                      <div key={stat} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-white font-semibold">{stat}</span>
                        <span className="text-2xl font-bold text-green-400">+{value}</span>
                      </div>
                    ))
                  })()}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                  <span>✨</span> Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link href="/forge">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition shadow-lg shadow-orange-500/50">
                      🔨 Visit The Forge
                    </button>
                  </Link>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition shadow-lg shadow-purple-500/50">
                    🎒 Open Inventory
                  </button>
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition shadow-lg shadow-cyan-500/50">
                    🏪 Visit Shop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
              <span>🏆</span> Achievement Gallery
            </h2>
            <div className="text-center py-12 text-slate-400">
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-xl font-bold mb-2">Achievement System</div>
              <div className="text-sm">View your unlocked achievements and track progress</div>
              <Link href="/dashboard/gaming">
                <button className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition shadow-lg shadow-cyan-500/50">
                  View Full Achievement Showcase
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Combat Log Tab */}
        {activeTab === 'combat-log' && (
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
              <span>📜</span> Combat History
            </h2>
            <div className="space-y-4">
              {combatLog.map(entry => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-102 cursor-pointer ${
                    entry.type === 'workout'
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50'
                      : entry.type === 'achievement'
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50'
                      : entry.type === 'level_up'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                      : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {entry.type === 'workout' && '⚔️'}
                      {entry.type === 'achievement' && '🏆'}
                      {entry.type === 'level_up' && '⬆️'}
                      {entry.type === 'skill_unlock' && '✨'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm text-slate-400">{entry.date}</div>
                          <div className="text-white font-bold">{entry.description}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {entry.rewards.map((reward, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1 bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1 text-sm"
                          >
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white font-semibold">{reward}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styling */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 10px;
          border: 2px solid rgba(15, 23, 42, 0.5);
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
