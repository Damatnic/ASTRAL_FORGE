'use client'

import { useState } from 'react'
import { useCharacter } from '@/hooks/use-data'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { SKILL_TREES } from '@/lib/api/character'

export default function MilestonesPage() {
  const { data: character, loading, refetch } = useCharacter()
  const [selectedTree, setSelectedTree] = useState<keyof typeof SKILL_TREES>('strength')
  const [unlocking, setUnlocking] = useState(false)

  const handleUnlockSkill = async (skillId: string) => {
    setUnlocking(true)
    try {
      const response = await fetch('/api/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlock-skill', skillId }),
      })

      if (!response.ok) throw new Error('Failed to unlock skill')

      const result = await response.json()
      if (result.success) {
        await refetch()
      } else {
        alert('Failed to unlock milestone. Requirements not met.')
      }
    } catch (error) {
      console.error('Failed to unlock skill:', error)
      alert('Failed to unlock skill. Please try again.')
    } finally {
      setUnlocking(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading milestones...</p>
          </div>
        </div>
      </div>
    )
  }

  const selectedTreeData = SKILL_TREES[selectedTree]
  const unlockedSkills = character?.skills || {}

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/profile">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
          Training Milestones
        </h1>
        <p className="text-gray-400">Track your training achievements and passive bonuses</p>
      </div>

      {/* Tree Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {(Object.keys(SKILL_TREES) as Array<keyof typeof SKILL_TREES>).map((treeName) => {
          const tree = SKILL_TREES[treeName]
          const isSelected = selectedTree === treeName
          return (
            <button
              key={treeName}
              onClick={() => setSelectedTree(treeName)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-900/30'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{tree.icon}</div>
              <div className="font-semibold text-white">{tree.name}</div>
            </button>
          )
        })}
      </div>

      {/* Selected Tree */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{selectedTreeData.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedTreeData.name} Milestones</h2>
            <p className="text-gray-400">Track your {selectedTreeData.name.toLowerCase()} progress</p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          {selectedTreeData.skills.map((skill) => {
            const currentLevel = unlockedSkills[skill.id] || 0
            const isMaxed = currentLevel >= skill.maxLevel

            return (
              <Card
                key={skill.id}
                className={`p-4 ${
                  isMaxed
                    ? 'bg-green-900/20 border-green-500/30'
                    : currentLevel > 0
                    ? 'bg-purple-900/20 border-purple-500/30'
                    : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: skill.maxLevel }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < currentLevel ? 'bg-purple-500' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{skill.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-gray-500">
                        Level: <span className="text-white font-semibold">{currentLevel}/{skill.maxLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Unlock Button */}
                  <div className="flex-shrink-0">
                    {isMaxed ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/50 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-semibold">Maxed</span>
                      </div>
                    ) : currentLevel === 0 ? (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={unlocking}
                        onClick={() => handleUnlockSkill(skill.id)}
                      >
                        Unlock
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={unlocking}
                        onClick={() => handleUnlockSkill(skill.id)}
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
