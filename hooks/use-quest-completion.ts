'use client'

import { useState } from 'react'
import { AchievementUnlockSystem } from '@/lib/achievement-unlock-system'
import { QuestSystem, Quest } from '@/lib/quest-system'
import { PrismaClient } from '@prisma/client'

export interface UnlockNotification {
  type: 'achievement' | 'template' | 'feature' | 'title'
  name: string
  description: string
}

export function useQuestCompletion() {
  const [showUnlockCard, setShowUnlockCard] = useState(false)
  const [currentUnlock, setCurrentUnlock] = useState<UnlockNotification | null>(null)
  const [unlockQueue, setUnlockQueue] = useState<UnlockNotification[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const claimQuestRewards = async (quest: Quest, userId: string, prisma: PrismaClient) => {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      // Get basic rewards from quest
      const basicRewards = QuestSystem.claimQuestRewards(quest)

      // Process unlocks through the unlock system
      const unlockResults = await AchievementUnlockSystem.processQuestRewards(
        prisma,
        userId,
        quest.rewards
      )

      // Build notification queue
      const notifications: UnlockNotification[] = []

      unlockResults.unlocked.forEach((unlock) => {
        const notification: UnlockNotification = {
          type: unlock.type as 'achievement' | 'template' | 'feature' | 'title',
          name: unlock.name,
          description: getUnlockDescription(unlock.type, unlock.name),
        }
        notifications.push(notification)
      })

      // Set queue and show first unlock
      setUnlockQueue(notifications)
      if (notifications.length > 0) {
        showNextUnlock(notifications)
      }

      return {
        xp: basicRewards.xp,
        unlocked: unlockResults.unlocked,
      }
    } catch (error) {
      console.error('Error claiming quest rewards:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const showNextUnlock = (queue: UnlockNotification[]) => {
    if (queue.length === 0) {
      setCurrentUnlock(null)
      setShowUnlockCard(false)
      return
    }

    const [next, ...remaining] = queue
    setCurrentUnlock(next)
    setShowUnlockCard(true)
    setUnlockQueue(remaining)
  }

  const handleUnlockCardClose = () => {
    setShowUnlockCard(false)
    
    // Show next unlock after a brief delay
    setTimeout(() => {
      showNextUnlock(unlockQueue)
    }, 300)
  }

  return {
    claimQuestRewards,
    showUnlockCard,
    currentUnlock,
    handleUnlockCardClose,
    isProcessing,
  }
}

function getUnlockDescription(type: string, name: string): string {
  // You can customize these descriptions based on the unlock
  const descriptions: Record<string, Record<string, string>> = {
    achievement: {
      'Daily Warrior': 'Complete a workout every day',
      'Volume Crusher': 'Master high-volume training',
      'PR Breaker': 'Set new personal records',
    },
    template: {
      'PPL Program': 'Push/Pull/Legs split for intermediate lifters',
      'German Volume Training': 'Classic 10x10 hypertrophy program',
      '5/3/1': 'Jim Wendler\'s strength progression system',
    },
    feature: {
      'Advanced Metrics': 'Track volume, intensity, and frequency',
      'Cardio Tracker': 'Monitor cardiovascular training',
      '1RM Calculator': 'Estimate your one-rep max',
    },
    title: {
      'The Relentless': 'Awarded for unwavering consistency',
      'Iron Warrior': 'Master of strength training',
      'The Dedicated': 'Never miss a workout',
    },
  }

  return descriptions[type]?.[name] || `Unlocked: ${name}`
}
