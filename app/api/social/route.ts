import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  removeFriend,
  searchUsers,
  getLeaderboard,
  getUserRank,
  getPublicGuilds,
  getUserGuild,
  createGuild,
  getActiveChallenges,
  getChallengeProgress,
} from '@/lib/api/social';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    // Get friends list
    if (mode === 'friends') {
      const data = await getFriends(session.user.email);
      return NextResponse.json(data);
    }

    // Search users
    if (mode === 'search') {
      const query = searchParams.get('query');
      if (!query) {
        return NextResponse.json({ error: 'Query required' }, { status: 400 });
      }
      const data = await searchUsers(query);
      return NextResponse.json(data);
    }

    // Get leaderboard
    if (mode === 'leaderboard') {
      const type = searchParams.get('type') as any || 'level';
      const limit = searchParams.get('limit');
      const data = await getLeaderboard(type, limit ? parseInt(limit) : undefined);
      return NextResponse.json(data);
    }

    // Get user rank
    if (mode === 'rank') {
      const type = searchParams.get('type') as any || 'level';
      const data = await getUserRank(session.user.email, type);
      return NextResponse.json(data);
    }

    // Get public guilds
    if (mode === 'guilds') {
      const data = await getPublicGuilds();
      return NextResponse.json(data);
    }

    // Get user's guild
    if (mode === 'my-guild') {
      const data = await getUserGuild(session.user.email);
      return NextResponse.json(data);
    }

    // Get active challenges
    if (mode === 'challenges') {
      const data = await getActiveChallenges();
      return NextResponse.json(data);
    }

    // Get challenge progress
    if (mode === 'challenge-progress') {
      const challengeId = searchParams.get('challengeId');
      if (!challengeId) {
        return NextResponse.json({ error: 'Challenge ID required' }, { status: 400 });
      }
      const data = await getChallengeProgress(session.user.email, challengeId);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (error) {
    console.error('Failed to fetch social data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social data' },
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

    // Send friend request
    if (action === 'send-friend-request') {
      if (!body.toEmail) {
        return NextResponse.json({ error: 'Target email required' }, { status: 400 });
      }
      const success = await sendFriendRequest(session.user.email, body.toEmail);
      return NextResponse.json({ success });
    }

    // Accept friend request
    if (action === 'accept-friend-request') {
      if (!body.requestId) {
        return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
      }
      const success = await acceptFriendRequest(session.user.email, body.requestId);
      return NextResponse.json({ success });
    }

    // Remove friend
    if (action === 'remove-friend') {
      if (!body.friendUserId) {
        return NextResponse.json({ error: 'Friend user ID required' }, { status: 400 });
      }
      const success = await removeFriend(session.user.email, body.friendUserId);
      return NextResponse.json({ success });
    }

    // Create guild
    if (action === 'create-guild') {
      if (!body.name || !body.description || !body.icon) {
        return NextResponse.json(
          { error: 'Name, description, and icon are required' },
          { status: 400 }
        );
      }
      const guild = await createGuild(session.user.email, {
        name: body.name,
        description: body.description,
        icon: body.icon,
        isPublic: body.isPublic !== false,
        minLevel: body.minLevel,
        minWorkouts: body.minWorkouts,
      });
      return NextResponse.json(guild);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to perform social action:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
