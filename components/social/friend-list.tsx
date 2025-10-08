'use client';

import React, { useState } from 'react';
import { Users, UserMinus, MessageCircle, TrendingUp, Award, Search, Filter } from 'lucide-react';

interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
  createdAt: string;
  acceptedAt?: string;
  friend: {
    id: string;
    name: string;
    email: string;
    profile?: {
      level: string;
    };
  };
  stats?: {
    totalWorkouts: number;
    currentStreak: number;
    totalPRs: number;
  };
}

interface FriendListProps {
  friends: Friend[];
  onUnfriend?: (friendId: string) => void;
  onMessage?: (friendId: string) => void;
  onViewProfile?: (friendId: string) => void;
  isLoading?: boolean;
}

export function FriendList({ 
  friends, 
  onUnfriend, 
  onMessage, 
  onViewProfile,
  isLoading = false 
}: FriendListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'streak' | 'workouts' | 'recent'>('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const acceptedFriends = friends.filter((f) => f.status === 'ACCEPTED');

  const filteredFriends = acceptedFriends.filter((friend) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        friend.friend.name?.toLowerCase().includes(query) ||
        friend.friend.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sortedFriends = [...filteredFriends].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.friend.name || a.friend.email).localeCompare(
          b.friend.name || b.friend.email
        );
      case 'streak':
        return (b.stats?.currentStreak || 0) - (a.stats?.currentStreak || 0);
      case 'workouts':
        return (b.stats?.totalWorkouts || 0) - (a.stats?.totalWorkouts || 0);
      case 'recent':
        return (
          new Date(b.acceptedAt || b.createdAt).getTime() -
          new Date(a.acceptedAt || a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            Allied Warriors ({acceptedFriends.length})
          </h2>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="SEARCH ALLIES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border-2 border-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:border-amber-700 transition-colors uppercase tracking-wider font-bold"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="px-4 py-2 bg-neutral-900 border-2 border-neutral-800 text-white hover:border-amber-700/30 transition-colors flex items-center gap-2 font-black uppercase tracking-wider"
          >
            <Filter className="w-4 h-4" />
            Sort
          </button>

          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border-2 border-neutral-800 shadow-lg z-10">
              {[
                { value: 'recent', label: 'Recently Added' },
                { value: 'name', label: 'Name (A-Z)' },
                { value: 'streak', label: 'Highest Streak' },
                { value: 'workouts', label: 'Most Workouts' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value as typeof sortBy);
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors font-black uppercase tracking-wider ${
                    sortBy === option.value
                      ? 'bg-amber-950/20 border-2 border-amber-700 text-amber-400'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Friends List */}
      {sortedFriends.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900 border-2 border-neutral-800">
          <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400 uppercase tracking-wider font-bold">
            {searchQuery ? 'No allies found' : 'No allies yet'}
          </p>
          {!searchQuery && (
            <p className="text-sm text-neutral-500 mt-1 uppercase tracking-wider font-bold">
              Search for warriors and send alliance requests
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-4 hover:border-amber-700/30 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-xl font-black text-white">
                  {(friend.friend.name || friend.friend.email)[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black truncate uppercase tracking-wider">
                      {friend.friend.name || friend.friend.email}
                    </h3>
                    {friend.friend.profile?.level && (
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-black uppercase tracking-wider">
                        {friend.friend.profile.level}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  {friend.stats && (
                    <div className="flex items-center gap-4 text-sm text-neutral-400 uppercase tracking-wider font-bold">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{friend.stats.totalWorkouts} battles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{friend.stats.currentStreak} day streak</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile?.(friend.friendId)}
                    className="px-3 py-2 bg-amber-950/20 border-2 border-amber-700 hover:bg-amber-950/40 text-amber-400 transition-colors text-sm font-black uppercase tracking-wider"
                  >
                    View Profile
                  </button>

                  {onMessage && (
                    <button
                      onClick={() => onMessage(friend.friendId)}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                      title="Message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}

                  {onUnfriend && (
                    <button
                      onClick={() => onUnfriend(friend.friendId)}
                      className="p-2 bg-red-950/20 border-2 border-red-700 hover:bg-red-950/40 text-red-400 transition-colors"
                      title="Remove Ally"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
