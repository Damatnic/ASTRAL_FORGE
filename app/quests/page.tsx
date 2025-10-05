'use client'

/**
 * QUESTS PAGE
 * 
 * Epic quest board with daily/weekly/story quests.
 * Features comprehensive quest system with progress tracking and rewards.
 */

import { useState } from 'react'
import { QuestBoard, Quest } from '@/components/quest-board'
import { ParticleBackground } from '@/components/particle-background'

export default function QuestsPage() {
  // Sample quests data
  const [quests, setQuests] = useState<Quest[]>([
    // Daily Quests
    {
      id: 'daily-1',
      type: 'daily',
      difficulty: 'easy',
      category: 'strength',
      title: 'Iron Initiate',
      description: 'Begin your journey to legendary strength',
      lore: 'Every warrior must lift their first weight. Today, you forge the foundation of might.',
      icon: '🏋️',
      objectives: [
        { description: 'Complete 3 strength exercises', current: 2, max: 3, completed: false },
        { description: 'Achieve 10 total reps', current: 10, max: 10, completed: true }
      ],
      rewards: {
        xp: 250,
        gold: 50
      },
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      completed: false,
      claimed: false
    },
    {
      id: 'daily-2',
      type: 'daily',
      difficulty: 'medium',
      category: 'endurance',
      title: 'Cardio Crusader',
      description: 'Push your limits with relentless endurance training',
      lore: 'The heart of a champion never stops beating. Run until the sky burns.',
      icon: '🏃',
      objectives: [
        { description: 'Complete 20 minutes of cardio', current: 15, max: 20, completed: false },
        { description: 'Maintain heart rate above 140 BPM', current: 18, max: 20, completed: false }
      ],
      rewards: {
        xp: 800,
        gold: 120,
        items: ['Stamina Potion']
      },
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      completed: false,
      claimed: false,
      bonusObjective: {
        description: 'Hit 30 minutes for bonus rewards',
        current: 15,
        max: 30,
        completed: false
      }
    },
    {
      id: 'daily-3',
      type: 'daily',
      difficulty: 'hard',
      category: 'technique',
      title: 'Perfect Form Mastery',
      description: 'Execute flawless technique in every movement',
      lore: 'Precision is the blade that carves perfection. Master the art, transcend the body.',
      icon: '🎯',
      objectives: [
        { description: 'Rate 3 exercises as "Excellent"', current: 3, max: 3, completed: true },
        { description: 'Complete workout with no failed sets', current: 5, max: 5, completed: true },
        { description: 'Submit form check video', current: 1, max: 1, completed: true }
      ],
      rewards: {
        xp: 1500,
        gold: 200,
        items: ['Technique Scroll', 'XP Boost (2x)']
      },
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
      completed: true,
      claimed: false
    },

    // Weekly Quests
    {
      id: 'weekly-1',
      type: 'weekly',
      difficulty: 'hard',
      category: 'consistency',
      title: 'Seven Days of Steel',
      description: 'Train relentlessly for an entire week without missing a day',
      lore: 'The path to greatness is forged in unbroken chains of discipline. Seven sunrises, seven victories.',
      icon: '🔥',
      objectives: [
        { description: 'Complete 7 consecutive training days', current: 5, max: 7, completed: false },
        { description: 'Maintain minimum 30 min per session', current: 5, max: 7, completed: false }
      ],
      rewards: {
        xp: 3500,
        gold: 500,
        items: ['Epic Loot Box', 'Streak Shield'],
        special: '7-Day Achievement Badge'
      },
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      completed: false,
      claimed: false,
      bonusObjective: {
        description: 'Train 10+ hours total this week',
        current: 6,
        max: 10,
        completed: false
      }
    },
    {
      id: 'weekly-2',
      type: 'weekly',
      difficulty: 'extreme',
      category: 'social',
      title: 'Brotherhood of Iron',
      description: 'Unite with fellow warriors and forge unbreakable bonds',
      lore: 'Alone we are strong. Together, we are unstoppable. The Guild calls for champions.',
      icon: '👥',
      objectives: [
        { description: 'Train with 3 different guild members', current: 1, max: 3, completed: false },
        { description: 'Complete 5 guild challenges', current: 2, max: 5, completed: false },
        { description: 'Reach top 10 on leaderboard', current: 0, max: 1, completed: false }
      ],
      rewards: {
        xp: 5000,
        gold: 750,
        items: ['Legendary Loot Box', 'Guild Banner'],
        special: 'Guild Champion Title'
      },
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
      completed: false,
      claimed: false
    },
    {
      id: 'weekly-3',
      type: 'weekly',
      difficulty: 'legendary',
      category: 'exploration',
      title: 'The Undiscovered Realm',
      description: 'Venture into unknown territories of physical excellence',
      lore: 'Beyond the familiar lies infinite potential. Dare to explore what you have never attempted.',
      icon: '🗺️',
      objectives: [
        { description: 'Try 5 new exercises', current: 3, max: 5, completed: false },
        { description: 'Complete 3 different workout types', current: 2, max: 3, completed: false },
        { description: 'Unlock 2 new skills', current: 0, max: 2, completed: false },
        { description: 'Achieve PR in new movement', current: 0, max: 1, completed: false }
      ],
      rewards: {
        xp: 10000,
        gold: 1000,
        items: ['Mythic Loot Box', 'Explorer\'s Compass', 'Skill Point x3'],
        special: 'Legendary Title: The Pioneer'
      },
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      completed: false,
      claimed: false,
      bonusObjective: {
        description: 'Master one new skill to level 5',
        current: 0,
        max: 1,
        completed: false
      }
    },

    // Story Quest
    {
      id: 'story-1',
      type: 'story',
      difficulty: 'legendary',
      category: 'strength',
      title: 'Chapter I: The Awakening of Power',
      description: 'Your legendary journey begins with a test of raw strength',
      lore: 'In the ancient halls of the Astral Forge, a prophecy speaks of one who will surpass all limits. The elders watch. The gods await. Your destiny unfolds with each lift, each breath, each drop of sweat. Prove yourself worthy.',
      icon: '⚔️',
      objectives: [
        { description: 'Reach character level 50', current: 47, max: 50, completed: false },
        { description: 'Achieve 1000 lb total (squat+bench+deadlift)', current: 875, max: 1000, completed: false },
        { description: 'Complete 100 total workouts', current: 87, max: 100, completed: false },
        { description: 'Unlock "Titan Strength" achievement', current: 0, max: 1, completed: false }
      ],
      rewards: {
        xp: 15000,
        gold: 2000,
        items: ['Mythic Gear Set', 'Legendary Weapon Skin', 'Title Token'],
        special: 'Chapter II Unlock + "Forge Master" Title'
      },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      completed: false,
      claimed: false,
      bonusObjective: {
        description: 'Break 3 personal records in the process',
        current: 1,
        max: 3,
        completed: false
      }
    }
  ])

  // Handle quest completion (automatically called when objectives done)
  const handleQuestComplete = (questId: string) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId ? { ...quest, completed: true } : quest
      )
    )
  }

  // Handle reward claim
  const handleRewardClaim = (questId: string) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

    // Claim the reward
    setQuests(prevQuests =>
      prevQuests.map(q =>
        q.id === questId ? { ...q, claimed: true } : q
      )
    )

    // Show reward notification (could be expanded with a toast/modal)
    console.log(`Claimed rewards for "${quest.title}":`, quest.rewards)
  }

  // Handle quest reroll
  const handleQuestReroll = (questId: string, cost: number) => {
    // Confirm reroll
    const confirmed = window.confirm(
      `Reroll this quest for ${cost} gold?\n\nThis will generate a new quest of the same difficulty tier.`
    )
    
    if (!confirmed) return

    // TODO: Implement gold check and deduction
    console.log(`Rerolling quest ${questId} for ${cost} gold`)
    
    // TODO: Generate new quest and replace the old one
    // For now, just log the action
  }

  // Calculate quest stats
  const totalQuests = quests.length
  const completedQuests = quests.filter(q => q.completed).length
  const claimableQuests = quests.filter(q => q.completed && !q.claimed).length
  const activeQuests = quests.filter(q => !q.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <ParticleBackground
        particleCount={80}
        colors={['rgba(168, 85, 247, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(251, 191, 36, 0.6)']}
        speed={0.3}
      />

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-6xl">📜</div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 text-transparent bg-clip-text">
              QUEST BOARD
            </h1>
            <div className="text-6xl">⚔️</div>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Embark on epic challenges, track your progress, and claim legendary rewards.
            Daily quests refresh every 24 hours. Weekly quests refresh every 7 days.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-2 border-blue-500/50 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-black text-white">{totalQuests}</div>
            <div className="text-sm text-gray-400">Total Quests</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-2 border-green-500/50 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-black text-white">{completedQuests}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border-2 border-amber-500/50 rounded-xl p-4 text-center animate-pulse">
            <div className="text-4xl mb-2">🎁</div>
            <div className="text-3xl font-black text-white">{claimableQuests}</div>
            <div className="text-sm text-gray-400">Claimable</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/50 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-3xl font-black text-white">{activeQuests}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
        </div>

        {/* Quest Board */}
        <QuestBoard
          quests={quests}
          onQuestComplete={handleQuestComplete}
          onRewardClaim={handleRewardClaim}
          onQuestReroll={handleQuestReroll}
        />

        {/* Quest Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Quest Master Tips
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-lg">⭐</span>
              <div>
                <div className="font-semibold text-white">Difficulty Tiers</div>
                <div>Higher difficulty = Better rewards! Challenge yourself for legendary loot.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🎯</span>
              <div>
                <div className="font-semibold text-white">Bonus Objectives</div>
                <div>Complete bonus objectives for extra XP, gold, and special items.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔄</span>
              <div>
                <div className="font-semibold text-white">Quest Rerolls</div>
                <div>Don&apos;t like a quest? Reroll it for gold (1 💰 daily, 5 💰 weekly).</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">⏰</span>
              <div>
                <div className="font-semibold text-white">Time Management</div>
                <div>Quests expiring soon pulse red. Complete them before time runs out!</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📖</span>
              <div>
                <div className="font-semibold text-white">Story Progression</div>
                <div>Story quests unlock epic narratives and exclusive rewards. Take your time!</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🏆</span>
              <div>
                <div className="font-semibold text-white">Completion Bonuses</div>
                <div>Finish all daily or weekly quests for streak bonuses and extra rewards.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
