'use client';

import React from 'react';
import { Trophy, Medal, TrendingUp, Award, Crown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  progress: number;
  completedAt?: string;
  isCurrentUser?: boolean;
}

interface ChallengeLeaderboardProps {
  challengeId: string;
  challengeName: string;
  goal: number;
  unit: string;
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  isLoading?: boolean;
  compact?: boolean;
}

const getRankColor = (rank: number) => {
  if (rank === 1) return 'from-yellow-500 to-orange-500';
  if (rank === 2) return 'from-gray-400 to-gray-500';
  if (rank === 3) return 'from-amber-600 to-amber-700';
  return 'from-gray-600 to-gray-700';
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return Crown;
  if (rank === 2) return Trophy;
  if (rank === 3) return Medal;
  return Award;
};

export function ChallengeLeaderboard({
  challengeName,
  goal,
  unit,
  entries,
  currentUserRank,
  isLoading = false,
  compact = false,
}: ChallengeLeaderboardProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
              <div className="flex-1 h-6 bg-gray-700 rounded" />
              <div className="w-20 h-6 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentUserEntry = entries.find((e) => e.isCurrentUser);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        </div>
        <p className="text-white/80">{challengeName}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Top 3 Podium */}
        {top3.length > 0 && !compact && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="flex flex-col items-center pt-8">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-2xl font-bold text-white">
                    {top3[1].userName[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                </div>
                <p className="text-sm font-medium text-white mb-1 text-center">
                  {top3[1].userName}
                </p>
                <p className="text-xs text-gray-400">
                  {top3[1].progress} {unit}
                </p>
                <div className="mt-2 px-3 py-1 bg-gray-700/50 rounded-full">
                  <p className="text-xs text-gray-300">
                    {((top3[1].progress / goal) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <div className="flex flex-col items-center">
                <Crown className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-white border-4 border-yellow-400">
                    {top3[0].userName[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
                    1
                  </div>
                </div>
                <p className="text-base font-bold text-white mb-1 text-center">
                  {top3[0].userName}
                </p>
                <p className="text-sm text-yellow-400 font-medium">
                  {top3[0].progress} {unit}
                </p>
                <div className="mt-2 px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/50">
                  <p className="text-sm font-medium text-yellow-300">
                    {((top3[0].progress / goal) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="flex flex-col items-center pt-8">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-2xl font-bold text-white">
                    {top3[2].userName[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                </div>
                <p className="text-sm font-medium text-white mb-1 text-center">
                  {top3[2].userName}
                </p>
                <p className="text-xs text-gray-400">
                  {top3[2].progress} {unit}
                </p>
                <div className="mt-2 px-3 py-1 bg-gray-700/50 rounded-full">
                  <p className="text-xs text-gray-300">
                    {((top3[2].progress / goal) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rest of Rankings */}
        <div className="space-y-2">
          {(compact ? entries : rest).map((entry) => {
            const Icon = getRankIcon(entry.rank);
            const gradientColor = getRankColor(entry.rank);
            const progressPercentage = (entry.progress / goal) * 100;

            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  entry.isCurrentUser
                    ? 'bg-purple-500/20 border border-purple-500/50'
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                  >
                    {entry.rank <= 3 ? (
                      <Icon className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-bold text-sm">{entry.rank}</span>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white truncate">
                      {entry.userName}
                    </p>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-medium rounded">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {entry.progress} {unit}
                    </span>
                    {entry.completedAt && (
                      <span className="text-xs">
                        • Completed {formatDistanceToNow(new Date(entry.completedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="text-right">
                  <p className="text-sm font-medium text-white mb-1">
                    {progressPercentage.toFixed(1)}%
                  </p>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-300`}
                      style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current User Rank (if not in top 10) */}
        {currentUserEntry && currentUserRank && currentUserRank > 10 && (
          <div className="pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">Your Rank</p>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-500/20 border border-purple-500/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentUserRank}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white mb-1">{currentUserEntry.userName}</p>
                <p className="text-sm text-gray-400">
                  {currentUserEntry.progress} {unit} • {((currentUserEntry.progress / goal) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No participants yet</p>
            <p className="text-sm text-gray-500 mt-1">Be the first to join!</p>
          </div>
        )}
      </div>
    </div>
  );
}
