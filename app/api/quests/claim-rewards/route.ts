import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AchievementUnlockSystem } from '@/lib/achievement-unlock-system'
import { QuestSystem } from '@/lib/quest-system'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { questId, questData } = await req.json()

    if (!questId || !questData) {
      return NextResponse.json(
        { error: 'Missing questId or questData' },
        { status: 400 }
      )
    }

    // Check if quest is complete
    if (!QuestSystem.isQuestComplete(questData)) {
      return NextResponse.json(
        { error: 'Quest not yet complete' },
        { status: 400 }
      )
    }

    // Process rewards
    let totalXP = 0
    const unlockedItems: Array<{ id: string; name: string; type: string }> = []

    for (const reward of questData.rewards) {
      if (reward.type === 'xp' && reward.amount) {
        totalXP += reward.amount
      } else if (reward.type === 'achievement' && reward.name) {
        const result = await AchievementUnlockSystem.unlockAchievement(
          prisma,
          session.user.id,
          reward.name,
          'quest',
          reward.description
        )
        if (result.success && !result.alreadyUnlocked && result.unlocked) {
          unlockedItems.push({ ...result.unlocked, type: 'achievement' })
        }
      } else if (reward.type === 'title' && reward.name) {
        const result = await AchievementUnlockSystem.unlockTitle(
          prisma,
          session.user.id,
          reward.name,
          reward.description
        )
        if (result.success && !result.alreadyUnlocked && result.unlocked) {
          unlockedItems.push({ ...result.unlocked, type: 'title' })
        }
      } else if (reward.type === 'template' && reward.name) {
        const result = await AchievementUnlockSystem.unlockTemplate(
          prisma,
          session.user.id,
          reward.name,
          'quest'
        )
        if (result.success && !result.alreadyUnlocked && result.unlocked) {
          unlockedItems.push({ ...result.unlocked, type: 'template' })
        }
      }
    }

    // Award XP - store in UserUnlock table for now since UserProfile doesn't have XP field
    if (totalXP > 0) {
      try {
        await prisma.userUnlock?.create({
          data: {
            userId: session.user.id,
            type: 'xp_award',
            identifier: `quest-${questId}`,
            source: 'quest',
            unlockedAt: new Date(),
          }
        })
      } catch (_error) {
        // XP tracking - ignore if already awarded
        console.log('XP already tracked for this quest')
      }
    }

    return NextResponse.json({
      success: true,
      xp: totalXP,
      unlocked: unlockedItems,
      message: 'Quest rewards claimed successfully!',
    })
  } catch (error) {
    console.error('Error claiming quest rewards:', error)
    return NextResponse.json(
      { error: 'Failed to claim quest rewards' },
      { status: 500 }
    )
  }
}

/*
// BROKEN CODE - Needs quest system refactoring
export async function POST(req: NextRequest) {
  try {
    const { userId, questId } = await req.json()

    if (!userId || !questId) {
      return NextResponse.json(
        { error: 'Missing userId or questId' },
        { status: 400 }
      )
    }

    // Get quest details
    const quest = QuestSystem.getQuestById(questId)
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }

    // Check if quest is complete
    if (!QuestSystem.isQuestComplete(quest)) {
      return NextResponse.json(
        { error: 'Quest not yet complete' },
        { status: 400 }
      )
    }

    // Process rewards using the new unlock system
    const rewardResults = await AchievementUnlockSystem.processQuestRewards(
      prisma,
      userId,
      quest.rewards
    )

    // Update user XP if rewards include XP
    if (rewardResults.xp > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          // Assuming you have an XP field on User model
          // If not, you may need to handle this differently
        },
      })
    }

    return NextResponse.json({
      success: true,
      xp: rewardResults.xp,
      unlocked: rewardResults.unlocked,
      message: 'Quest rewards claimed successfully',
    })
  } catch (error) {
    console.error('Error claiming quest rewards:', error)
    return NextResponse.json(
      { error: 'Failed to claim quest rewards' },
      { status: 500 }
    )
  }
}
*/
