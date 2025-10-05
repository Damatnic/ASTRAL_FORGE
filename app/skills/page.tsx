'use client'

/**
 * SKILLS PAGE
 * 
 * Epic skill tree interface showing all unlockable abilities and progression paths.
 * Features interactive node-based visualization with SVG connections.
 */

import { useState } from 'react'
import { SkillTree, SkillNode } from '@/components/skill-tree'
import { ParticleBackground } from '@/components/particle-background'

export default function SkillsPage() {
  // Mock skill points (in real app, fetch from user data)
  const [availablePoints, setAvailablePoints] = useState(5)

  // Mock skills data (in real app, fetch from database)
  const [skills, setSkills] = useState<SkillNode[]>([
    // TIER 1 - BEGINNER (5 skills)
    {
      id: 'basic-strength',
      name: 'Iron Foundation',
      description: 'Build fundamental strength with basic compound movements. Increases base strength by 10%.',
      icon: '💪',
      category: 'strength',
      tier: 1,
      position: { x: 100, y: 100 },
      prerequisites: [],
      unlocked: true,
      level: 3,
      maxLevel: 5,
      cost: 1
    },
    {
      id: 'basic-endurance',
      name: 'Cardio Basics',
      description: 'Develop cardiovascular endurance through steady-state training. Increases stamina by 15%.',
      icon: '🏃',
      category: 'endurance',
      tier: 1,
      position: { x: 300, y: 100 },
      prerequisites: [],
      unlocked: true,
      level: 2,
      maxLevel: 5,
      cost: 1
    },
    {
      id: 'basic-mobility',
      name: 'Flexibility First',
      description: 'Master basic stretching and mobility work. Improves range of motion by 20%.',
      icon: '🧘',
      category: 'mobility',
      tier: 1,
      position: { x: 500, y: 100 },
      prerequisites: [],
      unlocked: true,
      level: 4,
      maxLevel: 5,
      cost: 1
    },
    {
      id: 'basic-power',
      name: 'Explosive Start',
      description: 'Learn explosive movements and plyometrics. Increases power output by 12%.',
      icon: '💥',
      category: 'power',
      tier: 1,
      position: { x: 700, y: 100 },
      prerequisites: [],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 1
    },
    {
      id: 'basic-technique',
      name: 'Form Fundamentals',
      description: 'Perfect your exercise form and technique. Reduces injury risk by 30%.',
      icon: '✍️',
      category: 'technique',
      tier: 1,
      position: { x: 900, y: 100 },
      prerequisites: [],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 1
    },

    // TIER 2 - INTERMEDIATE (5 skills)
    {
      id: 'advanced-strength',
      name: 'Steel Warrior',
      description: 'Advanced strength training with progressive overload. Increases strength by 25%.',
      icon: '⚔️',
      category: 'strength',
      tier: 2,
      position: { x: 100, y: 250 },
      prerequisites: ['basic-strength'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 2
    },
    {
      id: 'advanced-endurance',
      name: 'Marathon Mind',
      description: 'Push endurance limits with interval training. Increases stamina by 35%.',
      icon: '🏆',
      category: 'endurance',
      tier: 2,
      position: { x: 300, y: 250 },
      prerequisites: ['basic-endurance'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 2
    },
    {
      id: 'advanced-mobility',
      name: 'Acrobat',
      description: 'Advanced mobility and dynamic stretching. Improves agility by 40%.',
      icon: '🤸',
      category: 'mobility',
      tier: 2,
      position: { x: 500, y: 250 },
      prerequisites: ['basic-mobility'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 2
    },
    {
      id: 'advanced-power',
      name: 'Thunder Strike',
      description: 'Harness explosive power with Olympic lifts. Increases power by 30%.',
      icon: '⚡',
      category: 'power',
      tier: 2,
      position: { x: 700, y: 250 },
      prerequisites: ['basic-power', 'basic-strength'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 2
    },
    {
      id: 'advanced-technique',
      name: 'Master Form',
      description: 'Perfect technique across all movement patterns. Increases efficiency by 25%.',
      icon: '⭐',
      category: 'technique',
      tier: 2,
      position: { x: 900, y: 250 },
      prerequisites: ['basic-technique'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 2
    },

    // TIER 3 - ADVANCED (4 skills)
    {
      id: 'expert-strength',
      name: 'Titan Force',
      description: 'Unleash godlike strength with advanced programming. Increases strength by 50%.',
      icon: '🦾',
      category: 'strength',
      tier: 3,
      position: { x: 200, y: 400 },
      prerequisites: ['advanced-strength', 'advanced-technique'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 3
    },
    {
      id: 'expert-endurance',
      name: 'Unstoppable',
      description: 'Endless endurance through metabolic conditioning. Increases stamina by 60%.',
      icon: '♾️',
      category: 'endurance',
      tier: 3,
      position: { x: 400, y: 400 },
      prerequisites: ['advanced-endurance', 'advanced-mobility'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 3
    },
    {
      id: 'expert-power',
      name: 'Lightning Bolt',
      description: 'Channel pure explosive power. Increases power output by 55%.',
      icon: '⚡',
      category: 'power',
      tier: 3,
      position: { x: 600, y: 400 },
      prerequisites: ['advanced-power', 'advanced-strength'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 3
    },
    {
      id: 'expert-technique',
      name: 'Flawless Execution',
      description: 'Achieve perfection in every movement. Maximizes gains by 40%.',
      icon: '💎',
      category: 'technique',
      tier: 3,
      position: { x: 800, y: 400 },
      prerequisites: ['advanced-technique', 'advanced-mobility'],
      unlocked: false,
      level: 0,
      maxLevel: 5,
      cost: 3
    },

    // TIER 4 - MASTER (3 skills)
    {
      id: 'master-physique',
      name: 'Olympian Body',
      description: 'Sculpt a legendary physique. Combines all attributes for 70% total boost.',
      icon: '🏛️',
      category: 'strength',
      tier: 4,
      position: { x: 300, y: 550 },
      prerequisites: ['expert-strength', 'expert-endurance'],
      unlocked: false,
      level: 0,
      maxLevel: 3,
      cost: 5
    },
    {
      id: 'master-performance',
      name: 'Peak Condition',
      description: 'Reach peak athletic performance. All stats increased by 80%.',
      icon: '🔥',
      category: 'power',
      tier: 4,
      position: { x: 600, y: 550 },
      prerequisites: ['expert-power', 'expert-technique'],
      unlocked: false,
      level: 0,
      maxLevel: 3,
      cost: 5
    },
    {
      id: 'master-mastery',
      name: 'Total Control',
      description: 'Complete mastery over body and mind. Maximizes all training efficiency by 100%.',
      icon: '🧠',
      category: 'technique',
      tier: 4,
      position: { x: 900, y: 550 },
      prerequisites: ['expert-technique', 'expert-endurance'],
      unlocked: false,
      level: 0,
      maxLevel: 3,
      cost: 5
    },

    // TIER 5 - LEGENDARY (2 skills)
    {
      id: 'legendary-demigod',
      name: 'Demigod Ascension',
      description: 'Transcend mortal limits. Become a living legend. All attributes +150%.',
      icon: '👑',
      category: 'strength',
      tier: 5,
      position: { x: 400, y: 700 },
      prerequisites: ['master-physique', 'master-performance'],
      unlocked: false,
      level: 0,
      maxLevel: 1,
      cost: 10
    },
    {
      id: 'legendary-immortal',
      name: 'Immortal Warrior',
      description: 'Achieve eternal fitness. The ultimate skill. All attributes +200%, unlock special training modes.',
      icon: '⚡',
      category: 'power',
      tier: 5,
      position: { x: 700, y: 700 },
      prerequisites: ['master-performance', 'master-mastery'],
      unlocked: false,
      level: 0,
      maxLevel: 1,
      cost: 10
    }
  ])

  // Handle skill unlock
  function handleSkillUnlock(skillId: string) {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId
        ? { ...skill, unlocked: true, level: 1 }
        : skill
    ))
    setAvailablePoints(prev => {
      const skill = skills.find(s => s.id === skillId)
      return prev - (skill?.cost || 0)
    })
  }

  // Handle skill upgrade
  function handleSkillUpgrade(skillId: string) {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId
        ? { ...skill, level: Math.min(skill.level + 1, skill.maxLevel) }
        : skill
    ))
    setAvailablePoints(prev => {
      const skill = skills.find(s => s.id === skillId)
      return prev - (skill?.cost || 0)
    })
  }

  return (
    <main className="relative min-h-screen bg-slate-950">
      {/* Epic particle background */}
      <ParticleBackground
        particleCount={80}
        colors={['#a855f7', '#ec4899', '#3b82f6']}
      />

      <div className="relative z-10 p-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">🌟</div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
                Skill Tree
              </h1>
              <p className="text-gray-400 text-lg">
                Unlock and upgrade your abilities • Build your perfect warrior
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
              <div className="text-sm text-purple-400 mb-1">Skills Unlocked</div>
              <div className="text-3xl font-black text-white">
                {skills.filter(s => s.unlocked).length}/{skills.length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
              <div className="text-sm text-blue-400 mb-1">Mastery Level</div>
              <div className="text-3xl font-black text-white">
                {Math.max(...skills.map(s => s.unlocked ? s.tier : 0))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
              <div className="text-sm text-green-400 mb-1">Total Skill Level</div>
              <div className="text-3xl font-black text-white">
                {skills.reduce((sum, s) => sum + s.level, 0)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="text-sm text-yellow-400 mb-1">Available Points</div>
              <div className="text-3xl font-black text-white">
                {availablePoints}
              </div>
            </div>
          </div>
        </div>

        {/* Skill tree component */}
        <SkillTree
          skills={skills}
          availablePoints={availablePoints}
          onSkillUnlock={handleSkillUnlock}
          onSkillUpgrade={handleSkillUpgrade}
        />

        {/* Tier progression guide */}
        <div className="mt-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Progression Guide</h2>
          <div className="grid grid-cols-5 gap-4">
            {[
              { tier: 1, name: 'Beginner', icon: '🌱', color: '#10b981', description: 'Foundation skills - Start here!' },
              { tier: 2, name: 'Intermediate', icon: '🔥', color: '#3b82f6', description: 'Advanced techniques unlock' },
              { tier: 3, name: 'Advanced', icon: '⚡', color: '#a855f7', description: 'Expert level mastery' },
              { tier: 4, name: 'Master', icon: '👑', color: '#f59e0b', description: 'Elite warrior status' },
              { tier: 5, name: 'Legendary', icon: '✨', color: '#ec4899', description: 'Transcend mortal limits' }
            ].map(tier => (
              <div key={tier.tier} className="bg-slate-800/50 rounded-xl p-4 border-2" style={{ borderColor: tier.color }}>
                <div className="text-4xl mb-2 text-center">{tier.icon}</div>
                <div className="text-center">
                  <div className="font-bold text-white mb-1">{tier.name}</div>
                  <div className="text-xs px-2 py-1 rounded-full inline-block mb-2" style={{ backgroundColor: `${tier.color}33`, color: tier.color }}>
                    Tier {tier.tier}
                  </div>
                  <div className="text-xs text-gray-400">{tier.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
