'use client'

/**
 * INTERACTIVE SKILL TREE COMPONENT
 * 
 * Epic node-based skill tree with visual progression paths and unlockable abilities.
 * Features SVG connection lines, prerequisite tracking, and unlock animations.
 * 
 * Features:
 * - Visual node rendering with SVG connections
 * - 20+ skills organized in 5 tiers
 * - Category-based color coding
 * - Unlocked/locked states with glow effects
 * - Hover tooltips with skill info
 * - Prerequisite connection lines
 * - Unlock animations (pulse, glow, particles)
 * - Skill point spending system
 * - Tier progression unlocking
 * - Mastery levels (1-5 stars)
 */

import { useState, useRef, useEffect } from 'react'

// TypeScript interfaces
export interface SkillNode {
  id: string
  name: string
  description: string
  icon: string
  category: 'strength' | 'endurance' | 'mobility' | 'power' | 'technique'
  tier: 1 | 2 | 3 | 4 | 5
  position: { x: number; y: number }
  prerequisites: string[]
  unlocked: boolean
  level: number
  maxLevel: number
  cost: number
}

interface SkillTreeProps {
  skills: SkillNode[]
  availablePoints: number
  onSkillUnlock?: (skillId: string) => void
  onSkillUpgrade?: (skillId: string) => void
}

export function SkillTree({ skills, availablePoints, onSkillUnlock, onSkillUpgrade }: SkillTreeProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [pulsingSkills, setPulsingSkills] = useState<Set<string>>(new Set())
  const svgRef = useRef<SVGSVGElement>(null)

  // Check if skill can be unlocked
  function canUnlock(skill: SkillNode): boolean {
    if (skill.unlocked) return false
    if (availablePoints < skill.cost) return false
    
    // Check prerequisites
    return skill.prerequisites.every(prereqId => {
      const prereq = skills.find(s => s.id === prereqId)
      return prereq?.unlocked
    })
  }

  // Check if skill can be upgraded
  function canUpgrade(skill: SkillNode): boolean {
    if (!skill.unlocked) return false
    if (skill.level >= skill.maxLevel) return false
    if (availablePoints < skill.cost) return false
    return true
  }

  // Get category color
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'strength': return '#ef4444' // red-500
      case 'endurance': return '#3b82f6' // blue-500
      case 'mobility': return '#10b981' // green-500
      case 'power': return '#f97316' // orange-500
      case 'technique': return '#a855f7' // purple-500
      default: return '#6b7280' // gray-500
    }
  }

  // Handle skill click
  function handleSkillClick(skill: SkillNode) {
    setSelectedSkill(skill.id)
    
    if (!skill.unlocked && canUnlock(skill)) {
      // Unlock skill
      setPulsingSkills(prev => new Set(prev).add(skill.id))
      setTimeout(() => {
        setPulsingSkills(prev => {
          const newSet = new Set(prev)
          newSet.delete(skill.id)
          return newSet
        })
      }, 1000)
      onSkillUnlock?.(skill.id)
    } else if (skill.unlocked && canUpgrade(skill)) {
      // Upgrade skill
      onSkillUpgrade?.(skill.id)
    }
  }

  // Render connection line between nodes
  function renderConnection(from: SkillNode, to: SkillNode) {
    const startX = from.position.x + 40 // Center of node (80px / 2)
    const startY = from.position.y + 40
    const endX = to.position.x + 40
    const endY = to.position.y + 40

    const isUnlocked = from.unlocked && to.unlocked
    const isAvailable = from.unlocked && canUnlock(to)

    return (
      <g key={`${from.id}-${to.id}`}>
        {/* Connection line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={isUnlocked ? getCategoryColor(to.category) : isAvailable ? '#6b7280' : '#374151'}
          strokeWidth={isUnlocked ? 3 : 2}
          strokeDasharray={isUnlocked ? 'none' : '5,5'}
          opacity={isUnlocked ? 0.8 : 0.3}
          className="transition-all duration-500"
        />
        
        {/* Arrow head */}
        <circle
          cx={endX}
          cy={endY}
          r={4}
          fill={isUnlocked ? getCategoryColor(to.category) : '#374151'}
          opacity={isUnlocked ? 1 : 0.5}
        />
      </g>
    )
  }

  return (
    <div className="relative w-full">
      {/* Skill Tree Canvas */}
      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/20 overflow-auto" style={{ maxHeight: '800px' }}>
        {/* SVG for connections */}
        <svg
          ref={svgRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ minWidth: '1200px', minHeight: '1000px' }}
        >
          {skills.map(skill => 
            skill.prerequisites.map(prereqId => {
              const prereq = skills.find(s => s.id === prereqId)
              if (!prereq) return null
              return renderConnection(prereq, skill)
            })
          )}
        </svg>

        {/* Skill Nodes */}
        <div className="relative" style={{ minWidth: '1200px', minHeight: '1000px' }}>
          {skills.map(skill => {
            const isHovered = hoveredSkill === skill.id
            const isSelected = selectedSkill === skill.id
            const isPulsing = pulsingSkills.has(skill.id)
            const unlockable = canUnlock(skill)
            const upgradable = canUpgrade(skill)

            return (
              <div
                key={skill.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  isHovered || isSelected ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: `${skill.position.x}px`,
                  top: `${skill.position.y}px`,
                  width: '80px',
                  height: '80px'
                }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => handleSkillClick(skill)}
              >
                {/* Skill Node */}
                <div className="relative w-full h-full">
                  {/* Glow effect for unlocked/available skills */}
                  {(skill.unlocked || unlockable || isPulsing) && (
                    <div
                      className={`absolute -inset-2 rounded-full blur-lg ${
                        isPulsing ? 'animate-pulse' : ''
                      }`}
                      style={{
                        background: `radial-gradient(circle, ${getCategoryColor(skill.category)}66, transparent)`,
                        opacity: skill.unlocked ? 0.6 : unlockable ? 0.4 : 0.3
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <div
                    className={`relative w-full h-full rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${
                      skill.unlocked
                        ? 'bg-gradient-to-br shadow-lg'
                        : unlockable
                        ? 'bg-gradient-to-br opacity-60 hover:opacity-80'
                        : 'bg-slate-800 opacity-40'
                    } ${
                      isHovered ? 'scale-125 shadow-2xl' : 'scale-100'
                    } ${
                      isPulsing ? 'animate-pulse scale-110' : ''
                    }`}
                    style={{
                      background: skill.unlocked || unlockable
                        ? `linear-gradient(135deg, ${getCategoryColor(skill.category)}99, ${getCategoryColor(skill.category)}66)`
                        : undefined,
                      border: `3px solid ${skill.unlocked ? getCategoryColor(skill.category) : '#374151'}`,
                      boxShadow: skill.unlocked
                        ? `0 0 20px ${getCategoryColor(skill.category)}66`
                        : undefined
                    }}
                  >
                    {skill.unlocked ? skill.icon : '🔒'}
                  </div>

                  {/* Level stars */}
                  {skill.unlocked && skill.maxLevel > 1 && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {Array.from({ length: skill.maxLevel }, (_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < skill.level ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tier badge */}
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2"
                    style={{
                      backgroundColor: '#1e293b',
                      borderColor: getCategoryColor(skill.category),
                      color: getCategoryColor(skill.category)
                    }}
                  >
                    {skill.tier}
                  </div>

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 w-80 bg-slate-900 border-2 rounded-xl p-4 shadow-2xl z-50 pointer-events-none"
                      style={{ borderColor: getCategoryColor(skill.category) }}
                    >
                      {/* Skill name and tier */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                        <span className="text-sm font-semibold px-2 py-1 rounded"
                          style={{
                            backgroundColor: `${getCategoryColor(skill.category)}33`,
                            color: getCategoryColor(skill.category)
                          }}
                        >
                          Tier {skill.tier}
                        </span>
                      </div>

                      {/* Category */}
                      <div className="text-xs uppercase tracking-wider mb-3"
                        style={{ color: getCategoryColor(skill.category) }}
                      >
                        {skill.category}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300 mb-3">{skill.description}</p>

                      {/* Level progress */}
                      {skill.unlocked && skill.maxLevel > 1 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Level {skill.level}</span>
                            <span>Max: {skill.maxLevel}</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-500"
                              style={{
                                width: `${(skill.level / skill.maxLevel) * 100}%`,
                                backgroundColor: getCategoryColor(skill.category)
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {skill.prerequisites.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-gray-400 mb-1">Requirements:</div>
                          {skill.prerequisites.map(prereqId => {
                            const prereq = skills.find(s => s.id === prereqId)
                            if (!prereq) return null
                            return (
                              <div key={prereqId} className="flex items-center gap-1 text-xs">
                                <span>{prereq.unlocked ? '✅' : '❌'}</span>
                                <span className={prereq.unlocked ? 'text-green-400' : 'text-gray-500'}>
                                  {prereq.name}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Cost and action */}
                      <div className="pt-3 border-t border-gray-700">
                        {!skill.unlocked && (
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-gray-400">Cost:</span>
                              <span className="ml-2 font-bold text-yellow-400">{skill.cost} SP</span>
                            </div>
                            {unlockable ? (
                              <div className="text-xs font-bold text-green-400">Click to unlock!</div>
                            ) : (
                              <div className="text-xs text-gray-500">
                                {availablePoints < skill.cost ? 'Not enough points' : 'Requirements not met'}
                              </div>
                            )}
                          </div>
                        )}
                        {skill.unlocked && upgradable && (
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-gray-400">Upgrade:</span>
                              <span className="ml-2 font-bold text-yellow-400">{skill.cost} SP</span>
                            </div>
                            <div className="text-xs font-bold text-green-400">Click to upgrade!</div>
                          </div>
                        )}
                        {skill.unlocked && skill.level >= skill.maxLevel && (
                          <div className="text-center text-sm font-bold text-purple-400">
                            ⭐ MASTERED ⭐
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Skill Categories</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Strength', category: 'strength', icon: '💪' },
            { name: 'Endurance', category: 'endurance', icon: '🛡️' },
            { name: 'Mobility', category: 'mobility', icon: '🤸' },
            { name: 'Power', category: 'power', icon: '⚡' },
            { name: 'Technique', category: 'technique', icon: '✨' }
          ].map(cat => (
            <div key={cat.category} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{
                  backgroundColor: `${getCategoryColor(cat.category as any)}33`,
                  border: `2px solid ${getCategoryColor(cat.category as any)}`
                }}
              >
                {cat.icon}
              </div>
              <span className="text-sm font-semibold" style={{ color: getCategoryColor(cat.category as any) }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Points Display */}
      <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">💫</div>
          <div>
            <div className="text-sm text-yellow-400">Available Skill Points</div>
            <div className="text-3xl font-black text-white">{availablePoints}</div>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Click unlocked skills to view details<br />
          Click locked skills with met requirements to unlock
        </div>
      </div>
    </div>
  )
}
