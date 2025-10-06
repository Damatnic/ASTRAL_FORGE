'use client'

/**
 * REWARDS DEMO PAGE
 * 
 * Demonstrates the new rewards system with unlock animations,
 * reward trees, and the rewards gallery.
 */

import { useState } from 'react'
import { RewardUnlockCard, RewardTree, UnlockedRewardsGallery } from '@/components/rewards'
import { Trophy, Sparkles } from 'lucide-react'

// Sample data
const sampleUnlockedRewards = [
  {
    id: '1',
    type: 'achievement' as const,
    name: 'Daily Warrior',
    description: 'Complete a workout every day for a week',
    unlockedAt: new Date('2024-10-01'),
    source: 'quest',
  },
  {
    id: '2',
    type: 'achievement' as const,
    name: 'Volume Crusher',
    description: 'Complete 1000 total reps in a single workout',
    unlockedAt: new Date('2024-10-02'),
    source: 'quest',
  },
  {
    id: '3',
    type: 'template' as const,
    name: 'PPL Program',
    description: 'Push/Pull/Legs split for intermediate lifters',
    unlockedAt: new Date('2024-10-03'),
    source: 'tier',
  },
  {
    id: '4',
    type: 'feature' as const,
    name: 'Advanced Metrics',
    description: 'Track volume, intensity, and frequency',
    unlockedAt: new Date('2024-10-04'),
    source: 'tier',
  },
  {
    id: '5',
    type: 'title' as const,
    name: 'The Relentless',
    description: 'Awarded for unwavering consistency',
    unlockedAt: new Date('2024-10-05'),
    source: 'achievement',
  },
]

const sampleRewardTree = [
  {
    id: '1',
    type: 'achievement' as const,
    name: 'Getting Started',
    description: 'Complete your first workout',
    requirement: 'Complete 1 workout session',
    unlocked: true,
    children: [
      {
        id: '2',
        type: 'achievement' as const,
        name: 'Dedicated',
        description: 'Complete 10 workouts',
        requirement: 'Complete 10 workout sessions',
        unlocked: true,
        children: [
          {
            id: '3',
            type: 'template' as const,
            name: 'PPL Program',
            description: 'Unlock Push/Pull/Legs training split',
            requirement: 'Reach Intermediate tier',
            unlocked: false,
            progress: 65,
          },
          {
            id: '4',
            type: 'achievement' as const,
            name: 'Century Club',
            description: 'Complete 100 workouts',
            requirement: 'Complete 100 workout sessions',
            unlocked: false,
            progress: 78,
          },
        ],
      },
      {
        id: '5',
        type: 'feature' as const,
        name: 'Advanced Metrics',
        description: 'Track volume, intensity, and frequency',
        requirement: 'Reach Beginner tier',
        unlocked: true,
        children: [
          {
            id: '6',
            type: 'title' as const,
            name: 'The Relentless',
            description: 'Special title for consistency',
            requirement: '7-day workout streak',
            unlocked: false,
            progress: 40,
          },
        ],
      },
    ],
  },
]

export default function RewardsDemoPage() {
  const [showUnlockCard, setShowUnlockCard] = useState(false)
  const [unlockType, setUnlockType] = useState<'achievement' | 'template' | 'feature' | 'title'>('achievement')

  const triggerUnlock = (type: 'achievement' | 'template' | 'feature' | 'title') => {
    setUnlockType(type)
    setShowUnlockCard(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Rewards System Demo</h1>
              <p className="text-gray-400 mt-1">
                Explore the new deterministic reward system
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Unlock Card Demo */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Unlock Animations</h2>
              <p className="text-gray-400 mt-1">
                Click a button to see the unlock celebration animation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => triggerUnlock('achievement')}
              className="p-6 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-500/60 hover:scale-105 transition-all text-center"
            >
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="font-semibold">Achievement</div>
              <div className="text-xs text-gray-500 mt-1">Daily Warrior</div>
            </button>

            <button
              onClick={() => triggerUnlock('template')}
              className="p-6 rounded-lg border-2 border-blue-500/30 bg-blue-500/10 hover:border-blue-500/60 hover:scale-105 transition-all text-center"
            >
              <Trophy className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="font-semibold">Template</div>
              <div className="text-xs text-gray-500 mt-1">PPL Program</div>
            </button>

            <button
              onClick={() => triggerUnlock('feature')}
              className="p-6 rounded-lg border-2 border-purple-500/30 bg-purple-500/10 hover:border-purple-500/60 hover:scale-105 transition-all text-center"
            >
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="font-semibold">Feature</div>
              <div className="text-xs text-gray-500 mt-1">Advanced Metrics</div>
            </button>

            <button
              onClick={() => triggerUnlock('title')}
              className="p-6 rounded-lg border-2 border-pink-500/30 bg-pink-500/10 hover:border-pink-500/60 hover:scale-105 transition-all text-center"
            >
              <Trophy className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="font-semibold">Title</div>
              <div className="text-xs text-gray-500 mt-1">The Relentless</div>
            </button>
          </div>
        </section>

        {/* Reward Tree Demo */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Reward Progression Tree</h2>
            <p className="text-gray-400 mt-1">
              Visual progression showing locked and unlocked rewards
            </p>
          </div>

          <div className="bg-gray-950 rounded-xl border border-gray-800 p-6">
            <RewardTree
              rewards={sampleRewardTree}
              onNodeClick={(node) => {
                console.log('Clicked:', node.name)
                if (node.unlocked) {
                  alert(`Already unlocked: ${node.name}`)
                } else {
                  alert(`Locked: ${node.name}\nRequirement: ${node.requirement}`)
                }
              }}
            />
          </div>
        </section>

        {/* Rewards Gallery Demo */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Unlocked Rewards Gallery</h2>
            <p className="text-gray-400 mt-1">
              Browse, search, and filter all your unlocked rewards
            </p>
          </div>

          <div className="bg-gray-950 rounded-xl border border-gray-800 p-6">
            <UnlockedRewardsGallery
              rewards={sampleUnlockedRewards}
              onRewardClick={(reward) => {
                alert(
                  `${reward.name}\n\n${reward.description}\n\nUnlocked: ${reward.unlockedAt.toLocaleDateString()}\nSource: ${reward.source || 'Unknown'}`
                )
              }}
            />
          </div>
        </section>

        {/* Integration Guide */}
        <section className="border-2 border-purple-500/30 rounded-xl p-8 bg-purple-500/5">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Integration Guide</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-semibold text-white mb-2">1. Import Components</h3>
                  <code className="block bg-gray-950 p-3 rounded text-sm border border-gray-800">
                    {`import { RewardUnlockCard, RewardTree, UnlockedRewardsGallery } from '@/components/rewards'`}
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">2. Use Quest Completion Hook</h3>
                  <code className="block bg-gray-950 p-3 rounded text-sm border border-gray-800">
                    {`const { claimQuestRewards, showUnlockCard, currentUnlock } = useQuestCompletion()`}
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">3. Show Unlock Animation</h3>
                  <code className="block bg-gray-950 p-3 rounded text-sm border border-gray-800 whitespace-pre">
                    {`{showUnlockCard && currentUnlock && (
  <RewardUnlockCard
    type={currentUnlock.type}
    name={currentUnlock.name}
    description={currentUnlock.description}
    onClose={handleUnlockCardClose}
    autoClose={true}
  />
)}`}
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">4. Backend Integration</h3>
                  <code className="block bg-gray-950 p-3 rounded text-sm border border-gray-800 whitespace-pre">
                    {`// In your quest completion handler
const results = await AchievementUnlockSystem.processQuestRewards(
  prisma,
  userId,
  quest.rewards
)

// results.unlocked contains all newly unlocked rewards`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Unlock Card Modal */}
      {showUnlockCard && (
        <RewardUnlockCard
          type={unlockType}
          name={
            unlockType === 'achievement'
              ? 'Daily Warrior'
              : unlockType === 'template'
              ? 'PPL Program'
              : unlockType === 'feature'
              ? 'Advanced Metrics'
              : 'The Relentless'
          }
          description={
            unlockType === 'achievement'
              ? 'Complete a workout every day for a week'
              : unlockType === 'template'
              ? 'Push/Pull/Legs split for intermediate lifters'
              : unlockType === 'feature'
              ? 'Track volume, intensity, and frequency'
              : 'Awarded for unwavering consistency'
          }
          onClose={() => setShowUnlockCard(false)}
          autoClose={true}
          autoCloseDelay={5000}
        />
      )}
    </div>
  )
}
