'use client';

import { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type FriendStatus = 'online' | 'offline' | 'in_workout';

type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

type PrivacyLevel = 'public' | 'friends' | 'private';

type ActivityType = 
  | 'workout_completed'
  | 'achievement_unlocked'
  | 'level_up'
  | 'pr_set'
  | 'quest_completed'
  | 'challenge_won'
  | 'friend_added'
  | 'title_earned';

interface User {
  id: string;
  name: string;
  level: number;
  prestigeLevel: number;
  avatarUrl?: string;
  title?: string;
  gym?: string;
  totalXP: number;
}

interface Friend extends User {
  status: FriendStatus;
  friendSince: Date;
  mutualFriends: number;
  lastWorkout?: Date;
  currentStreak: number;
}

interface FriendRequest {
  id: string;
  from: User;
  to: User;
  status: FriendRequestStatus;
  message?: string;
  createdAt: Date;
}

interface WorkoutShare {
  id: string;
  user: User;
  workoutName: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
  duration: number;
  totalVolume: number;
  xpGained: number;
  privacy: PrivacyLevel;
  likes: string[]; // User IDs who liked
  comments: Comment[];
  sharedAt: Date;
  isPR?: boolean;
}

interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: Date;
}

interface Activity {
  id: string;
  user: User;
  type: ActivityType;
  data: {
    workoutName?: string;
    achievementName?: string;
    level?: number;
    prExercise?: string;
    prValue?: string;
    questName?: string;
    opponentName?: string;
    titleName?: string;
  };
  timestamp: Date;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface SocialHubProps {
  currentUser: User;
  onSendFriendRequest?: (userId: string, message?: string) => void;
  onAcceptFriendRequest?: (requestId: string) => void;
  onDeclineFriendRequest?: (requestId: string) => void;
  onRemoveFriend?: (friendId: string) => void;
  onBlockUser?: (userId: string) => void;
  onLikeWorkout?: (workoutId: string) => void;
  onCommentWorkout?: (workoutId: string, comment: string) => void;
  onShareWorkout?: (workout: WorkoutShare) => void;
}

export default function SocialHub({
  currentUser,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onRemoveFriend,
  onBlockUser,
  onLikeWorkout,
  onCommentWorkout,
  onShareWorkout,
}: SocialHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'requests' | 'share'>('feed');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'me'>('all');
  const [commentText, setCommentText] = useState('');
  const [selectedWorkoutToComment, setSelectedWorkoutToComment] = useState<string | null>(null);

  // Sample data (would come from API in production)
  const friends: Friend[] = [
    {
      id: 'f1',
      name: 'Alex Thunder',
      level: 45,
      prestigeLevel: 1,
      status: 'online',
      friendSince: new Date('2024-01-15'),
      mutualFriends: 5,
      lastWorkout: new Date('2024-10-04T10:30:00'),
      currentStreak: 12,
      totalXP: 125000,
      title: 'Iron Warrior',
      gym: 'PowerHouse Gym',
    },
    {
      id: 'f2',
      name: 'Sarah Strength',
      level: 52,
      prestigeLevel: 2,
      status: 'in_workout',
      friendSince: new Date('2024-02-20'),
      mutualFriends: 8,
      lastWorkout: new Date('2024-10-04T14:00:00'),
      currentStreak: 25,
      totalXP: 180000,
      title: 'Gym Queen',
      gym: 'Elite Fitness',
    },
    {
      id: 'f3',
      name: 'Mike Beast',
      level: 38,
      prestigeLevel: 0,
      status: 'offline',
      friendSince: new Date('2024-03-10'),
      mutualFriends: 3,
      lastWorkout: new Date('2024-10-03T18:45:00'),
      currentStreak: 7,
      totalXP: 95000,
      title: 'Rookie Crusher',
      gym: 'PowerHouse Gym',
    },
    {
      id: 'f4',
      name: 'Emma Endurance',
      level: 41,
      prestigeLevel: 1,
      status: 'online',
      friendSince: new Date('2024-04-05'),
      mutualFriends: 6,
      lastWorkout: new Date('2024-10-04T09:15:00'),
      currentStreak: 18,
      totalXP: 110000,
      title: 'Marathon Master',
    },
  ];

  const friendRequests: FriendRequest[] = [
    {
      id: 'req1',
      from: {
        id: 'u1',
        name: 'Chris Gains',
        level: 35,
        prestigeLevel: 0,
        totalXP: 85000,
        title: 'Rising Star',
      },
      to: currentUser,
      status: 'pending',
      message: 'Hey! Saw your PR on squats. Would love to train together sometime!',
      createdAt: new Date('2024-10-03T15:30:00'),
    },
    {
      id: 'req2',
      from: {
        id: 'u2',
        name: 'Jessica Flex',
        level: 48,
        prestigeLevel: 1,
        totalXP: 145000,
        title: 'Gym Legend',
      },
      to: currentUser,
      status: 'pending',
      message: 'We train at the same gym! Let\'s connect!',
      createdAt: new Date('2024-10-02T11:00:00'),
    },
  ];

  const activities: Activity[] = [
    {
      id: 'a1',
      user: friends[0],
      type: 'pr_set',
      data: {
        prExercise: 'Deadlift',
        prValue: '405 lbs × 5 reps',
      },
      timestamp: new Date('2024-10-04T10:35:00'),
    },
    {
      id: 'a2',
      user: friends[1],
      type: 'level_up',
      data: {
        level: 52,
      },
      timestamp: new Date('2024-10-04T09:20:00'),
    },
    {
      id: 'a3',
      user: friends[2],
      type: 'achievement_unlocked',
      data: {
        achievementName: 'Squat Master',
      },
      timestamp: new Date('2024-10-03T18:50:00'),
    },
    {
      id: 'a4',
      user: friends[3],
      type: 'workout_completed',
      data: {
        workoutName: '10K Run',
      },
      timestamp: new Date('2024-10-04T09:30:00'),
    },
    {
      id: 'a5',
      user: currentUser,
      type: 'challenge_won',
      data: {
        opponentName: 'Random Player',
      },
      timestamp: new Date('2024-10-03T20:15:00'),
    },
    {
      id: 'a6',
      user: friends[0],
      type: 'quest_completed',
      data: {
        questName: 'Weekly Warrior',
      },
      timestamp: new Date('2024-10-03T16:00:00'),
    },
  ];

  const workoutShares: WorkoutShare[] = [
    {
      id: 'ws1',
      user: friends[0],
      workoutName: 'Heavy Deadlift Day',
      exercises: [
        { name: 'Deadlift', sets: 5, reps: 5, weight: 405 },
        { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: 275 },
        { name: 'Barbell Row', sets: 4, reps: 8, weight: 185 },
      ],
      duration: 75,
      totalVolume: 15675,
      xpGained: 850,
      privacy: 'friends',
      likes: ['f2', 'f3'],
      comments: [
        {
          id: 'c1',
          user: friends[1],
          text: 'Beast mode! 💪',
          createdAt: new Date('2024-10-04T10:45:00'),
        },
      ],
      sharedAt: new Date('2024-10-04T10:40:00'),
      isPR: true,
    },
    {
      id: 'ws2',
      user: friends[1],
      workoutName: 'Upper Body Pump',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, weight: 135 },
        { name: 'Incline DB Press', sets: 3, reps: 12, weight: 50 },
        { name: 'Cable Flyes', sets: 3, reps: 15, weight: 30 },
        { name: 'Tricep Pushdown', sets: 3, reps: 15, weight: 70 },
      ],
      duration: 60,
      totalVolume: 10950,
      xpGained: 620,
      privacy: 'public',
      likes: ['f1', currentUser.id],
      comments: [],
      sharedAt: new Date('2024-10-04T08:15:00'),
    },
  ];

  // Helper functions
  const getStatusColor = (status: FriendStatus) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'in_workout':
        return 'bg-amber-500 animate-pulse';
      case 'offline':
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: FriendStatus) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'in_workout':
        return 'In Workout';
      case 'offline':
        return 'Offline';
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'workout_completed':
        return '💪';
      case 'achievement_unlocked':
        return '🏆';
      case 'level_up':
        return '⭐';
      case 'pr_set':
        return '🔥';
      case 'quest_completed':
        return '✅';
      case 'challenge_won':
        return '⚔️';
      case 'friend_added':
        return '👥';
      case 'title_earned':
        return '👑';
    }
  };

  const getActivityText = (activity: Activity) => {
    const { type, data } = activity;
    switch (type) {
      case 'workout_completed':
        return `completed ${data.workoutName}`;
      case 'achievement_unlocked':
        return `unlocked ${data.achievementName}`;
      case 'level_up':
        return `reached level ${data.level}`;
      case 'pr_set':
        return `set a new PR on ${data.prExercise}: ${data.prValue}`;
      case 'quest_completed':
        return `completed quest "${data.questName}"`;
      case 'challenge_won':
        return `defeated ${data.opponentName} in a challenge`;
      case 'friend_added':
        return 'made a new friend';
      case 'title_earned':
        return `earned the title "${data.titleName}"`;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleLike = (workoutId: string) => {
    if (onLikeWorkout) {
      onLikeWorkout(workoutId);
    }
  };

  const handleComment = (workoutId: string) => {
    if (onCommentWorkout && commentText.trim()) {
      onCommentWorkout(workoutId, commentText);
      setCommentText('');
      setSelectedWorkoutToComment(null);
    }
  };

  // Filter activities based on selected filter
  const filteredActivities = activities.filter((activity) => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'friends') return activity.user.id !== currentUser.id;
    if (feedFilter === 'me') return activity.user.id === currentUser.id;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🌐 Social Hub</h1>
          <p className="text-gray-400">Connect with friends and share your fitness journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'feed'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📰 Activity Feed
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'friends'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            👥 Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'requests'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📬 Requests
            {friendRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'share'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📤 Workout Shares
          </button>
        </div>

        {/* Activity Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Feed Filter */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFeedFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  feedFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All Activities
              </button>
              <button
                onClick={() => setFeedFilter('friends')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  feedFilter === 'friends'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Friends Only
              </button>
              <button
                onClick={() => setFeedFilter('me')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  feedFilter === 'me'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                My Activities
              </button>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                      {activity.user.name.charAt(0)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{activity.user.name}</span>
                        {activity.user.prestigeLevel > 0 && (
                          <span className="text-amber-400">{'★'.repeat(activity.user.prestigeLevel)}</span>
                        )}
                        <span className="text-purple-400">Lv.{activity.user.level}</span>
                        {activity.user.title && (
                          <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                            {activity.user.title}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                        <span>{getActivityText(activity)}</span>
                      </div>

                      <div className="text-sm text-gray-500 mt-2">
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div>
            {selectedFriend ? (
              // Friend Profile View
              <div>
                <button
                  onClick={() => setSelectedFriend(null)}
                  className="mb-4 text-purple-400 hover:text-purple-300 flex items-center gap-2"
                >
                  ← Back to Friends List
                </button>

                <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                  {/* Profile Header */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold">
                      {selectedFriend.name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold">{selectedFriend.name}</h2>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedFriend.status)}`} />
                        <span className="text-sm text-gray-400">{getStatusText(selectedFriend.status)}</span>
                      </div>

                      {selectedFriend.title && (
                        <div className="text-purple-300 mb-2">"{selectedFriend.title}"</div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span>🏋️ {selectedFriend.gym || 'No gym set'}</span>
                        <span>👥 {selectedFriend.mutualFriends} mutual friends</span>
                        <span>📅 Friends since {selectedFriend.friendSince.toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
                          💬 Message
                        </button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                          ⚔️ Challenge
                        </button>
                        <button
                          onClick={() => {
                            if (onRemoveFriend) onRemoveFriend(selectedFriend.id);
                            setSelectedFriend(null);
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                        >
                          Remove Friend
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Level</div>
                      <div className="text-2xl font-bold text-purple-400">
                        {selectedFriend.level}
                        {selectedFriend.prestigeLevel > 0 && (
                          <span className="text-amber-400 ml-2">
                            {'★'.repeat(selectedFriend.prestigeLevel)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Total XP</div>
                      <div className="text-2xl font-bold text-blue-400">
                        {selectedFriend.totalXP.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Current Streak</div>
                      <div className="text-2xl font-bold text-green-400">
                        {selectedFriend.currentStreak} days
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Last Workout</div>
                      <div className="text-sm font-semibold text-gray-300">
                        {selectedFriend.lastWorkout
                          ? formatTimestamp(selectedFriend.lastWorkout)
                          : 'No recent workouts'}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Section */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {activities
                        .filter((a) => a.user.id === selectedFriend.id)
                        .slice(0, 5)
                        .map((activity) => (
                          <div
                            key={activity.id}
                            className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getActivityIcon(activity.type)}</span>
                              <span>{getActivityText(activity)}</span>
                              <span className="text-sm text-gray-500 ml-auto">
                                {formatTimestamp(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Friends List
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-purple-500 transition-colors cursor-pointer"
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${getStatusColor(
                            friend.status
                          )}`}
                        />
                      </div>

                      {/* Friend Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{friend.name}</h3>
                          {friend.prestigeLevel > 0 && (
                            <span className="text-amber-400">{'★'.repeat(friend.prestigeLevel)}</span>
                          )}
                        </div>

                        <div className="text-purple-400 text-sm mb-2">
                          Level {friend.level}
                          {friend.title && ` • "${friend.title}"`}
                        </div>

                        <div className="text-sm text-gray-400 space-y-1">
                          <div>🏋️ {friend.gym || 'No gym set'}</div>
                          <div>🔥 {friend.currentStreak} day streak</div>
                          <div>👥 {friend.mutualFriends} mutual friends</div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold transition-colors">
                            💬 Message
                          </button>
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-colors">
                            ⚔️ Challenge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Friend Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {friendRequests.length === 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold mb-2">No Pending Requests</h3>
                <p className="text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                      {request.from.name.charAt(0)}
                    </div>

                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{request.from.name}</h3>
                        <span className="text-purple-400 text-sm">Lv.{request.from.level}</span>
                        {request.from.prestigeLevel > 0 && (
                          <span className="text-amber-400">{'★'.repeat(request.from.prestigeLevel)}</span>
                        )}
                      </div>

                      {request.from.title && (
                        <div className="text-sm text-purple-300 mb-2">"{request.from.title}"</div>
                      )}

                      {request.message && (
                        <div className="bg-gray-900 rounded-lg p-3 mb-3 text-sm text-gray-300 italic">
                          "{request.message}"
                        </div>
                      )}

                      <div className="text-sm text-gray-500 mb-3">
                        Sent {formatTimestamp(request.createdAt)}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (onAcceptFriendRequest) onAcceptFriendRequest(request.id);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => {
                            if (onDeclineFriendRequest) onDeclineFriendRequest(request.id);
                          }}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                        >
                          ✗ Decline
                        </button>
                        <button
                          onClick={() => {
                            if (onBlockUser) onBlockUser(request.from.id);
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                        >
                          🚫 Block
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Workout Shares Tab */}
        {activeTab === 'share' && (
          <div className="space-y-6">
            {workoutShares.map((workout) => {
              const isLiked = workout.likes.includes(currentUser.id);

              return (
                <div
                  key={workout.id}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6"
                >
                  {/* User Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                      {workout.user.name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{workout.user.name}</span>
                        {workout.user.prestigeLevel > 0 && (
                          <span className="text-amber-400">{'★'.repeat(workout.user.prestigeLevel)}</span>
                        )}
                        <span className="text-purple-400 text-sm">Lv.{workout.user.level}</span>
                      </div>
                      <div className="text-sm text-gray-500">{formatTimestamp(workout.sharedAt)}</div>
                    </div>

                    {workout.isPR && (
                      <div className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                        🏆 New PR!
                      </div>
                    )}
                  </div>

                  {/* Workout Title */}
                  <h3 className="text-2xl font-bold mb-4">{workout.workoutName}</h3>

                  {/* Exercises List */}
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{exercise.name}</span>
                          <span className="text-purple-400">
                            {exercise.sets}×{exercise.reps} @ {exercise.weight} lbs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workout Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-900 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Duration</div>
                      <div className="text-lg font-bold">{workout.duration} min</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Total Volume</div>
                      <div className="text-lg font-bold text-blue-400">
                        {workout.totalVolume.toLocaleString()} lbs
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">XP Gained</div>
                      <div className="text-lg font-bold text-purple-400">+{workout.xpGained}</div>
                    </div>
                  </div>

                  {/* Interaction Buttons */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
                    <button
                      onClick={() => handleLike(workout.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        isLiked
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {isLiked ? '❤️' : '🤍'} {workout.likes.length}
                    </button>

                    <button
                      onClick={() =>
                        setSelectedWorkoutToComment(
                          selectedWorkoutToComment === workout.id ? null : workout.id
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                      💬 {workout.comments.length}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">
                      🔗 Share
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-3">
                    {workout.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {comment.user.name.charAt(0)}
                        </div>
                        <div className="flex-1 bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.user.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(comment.createdAt)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300">{comment.text}</div>
                        </div>
                      </div>
                    ))}

                    {/* Comment Input */}
                    {selectedWorkoutToComment === workout.id && (
                      <div className="flex gap-3 pt-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {currentUser.name.charAt(0)}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleComment(workout.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleComment(workout.id)}
                            disabled={!commentText.trim()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-semibold transition-colors"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
