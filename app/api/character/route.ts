import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getCharacterStats,
  awardXP,
  setCharacterClass,
  getSkillTreeData,
  unlockSkill,
  getAchievements,
  checkAndAwardAchievements,
  SKILL_TREES,
} from '@/lib/api/character';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    // Get skill tree data
    if (mode === 'skill-tree') {
      const treeName = searchParams.get('tree') as keyof typeof SKILL_TREES;
      if (!treeName || !SKILL_TREES[treeName]) {
        return NextResponse.json({ error: 'Invalid tree name' }, { status: 400 });
      }
      const data = await getSkillTreeData(session.user.email, treeName);
      return NextResponse.json(data);
    }

    // Get achievements
    if (mode === 'achievements') {
      const data = await getAchievements(session.user.email);
      return NextResponse.json(data);
    }

    // Check for new achievements
    if (mode === 'check-achievements') {
      const newAchievements = await checkAndAwardAchievements(session.user.email);
      return NextResponse.json({ newAchievements });
    }

    // Default: Get character stats
    const data = await getCharacterStats(session.user.email);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch character data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action;

    // Award XP
    if (action === 'award-xp') {
      if (!body.amount || !body.source) {
        return NextResponse.json(
          { error: 'Amount and source are required' },
          { status: 400 }
        );
      }
      const result = await awardXP(session.user.email, body.amount, body.source);
      return NextResponse.json(result);
    }

    // Set character class
    if (action === 'set-class') {
      if (!body.characterClass) {
        return NextResponse.json(
          { error: 'Character class is required' },
          { status: 400 }
        );
      }
      await setCharacterClass(session.user.email, body.characterClass);
      return NextResponse.json({ success: true });
    }

    // Unlock skill
    if (action === 'unlock-skill') {
      if (!body.skillId) {
        return NextResponse.json(
          { error: 'Skill ID is required' },
          { status: 400 }
        );
      }
      const success = await unlockSkill(session.user.email, body.skillId);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to perform character action:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
