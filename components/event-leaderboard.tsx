'use client';

import { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Users, Star } from 'lucide-react';

// Types
export type LeaderboardPeriod = 'daily' | 'weekly' | 'overall';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  change?: number; // Rank change from previous period (positive = moved up)
  guild?: string;
  title?: string;
  isCurrentUser?: boolean;
}

interface EventLeaderboardProps {
  eventName: string;
  entries: LeaderboardEntry[];
  period?: LeaderboardPeriod;
  onPeriodChange?: (period: LeaderboardPeriod) => void;
  scoreLabel?: string; // e.g., "Points", "Volume", "Workouts"
  showGuildColumn?: boolean;
}

export default function EventLeaderboard({
  eventName,
  entries = [],
  period = 'overall',
  onPeriodChange,
  scoreLabel = 'Points',
  showGuildColumn = true,
}: EventLeaderboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>(period);

  const handlePeriodChange = (newPeriod: LeaderboardPeriod) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  // Get medal/crown for top 3
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  // Get rank display styling
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-600 to-amber-600 text-white';
      case 2:
        return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-br from-amber-600 to-orange-600 text-white';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Format score with K/M suffixes
  const formatScore = (score: number): string => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toString();
  };

  // Top 3 podium display
  const topThree = entries.slice(0, 3);
  const restOfEntries = entries.slice(3);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-purple-500/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-500" />
              {eventName} Leaderboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">Compete for exclusive rewards!</p>
          </div>

          {/* Period Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {(['daily', 'weekly', 'overall'] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-4 py-2 rounded-md transition-colors capitalize ${
                  selectedPeriod === p
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Podium Display (Top 3) */}
        {topThree.length > 0 && (
          <div className="flex items-end justify-center gap-4 mt-6">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="flex flex-col items-center flex-1 max-w-[150px]">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center border-4 border-gray-300">
                    {topThree[1].avatar ? (
                      <img
                        src={topThree[1].avatar}
                        alt={topThree[1].username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {topThree[1].username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <Medal className="w-8 h-8 text-gray-300" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg w-full text-center border-2 border-gray-400">
                  <div className="font-bold text-white truncate">{topThree[1].username}</div>
                  <div className="text-xl font-bold text-gray-300 mt-1">
                    {formatScore(topThree[1].score)}
                  </div>
                  <div className="text-xs text-gray-400">{scoreLabel}</div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="flex flex-col items-center flex-1 max-w-[180px]">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center border-4 border-yellow-400 ring-4 ring-yellow-500/30">
                    {topThree[0].avatar ? (
                      <img
                        src={topThree[0].avatar}
                        alt={topThree[0].username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {topThree[0].username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-10 h-10 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-amber-700 p-4 rounded-lg w-full text-center border-2 border-yellow-400">
                  <div className="font-bold text-white truncate text-lg">
                    {topThree[0].username}
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {formatScore(topThree[0].score)}
                  </div>
                  <div className="text-xs text-yellow-200">{scoreLabel}</div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="flex flex-col items-center flex-1 max-w-[150px]">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center border-4 border-amber-500">
                    {topThree[2].avatar ? (
                      <img
                        src={topThree[2].avatar}
                        alt={topThree[2].username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {topThree[2].username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <Medal className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-700 to-orange-800 p-3 rounded-lg w-full text-center border-2 border-amber-500">
                  <div className="font-bold text-white truncate">{topThree[2].username}</div>
                  <div className="text-xl font-bold text-amber-200 mt-1">
                    {formatScore(topThree[2].score)}
                  </div>
                  <div className="text-xs text-amber-300">{scoreLabel}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Player
              </th>
              {showGuildColumn && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Guild
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {scoreLabel}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {restOfEntries.map((entry) => (
              <tr
                key={entry.userId}
                className={`hover:bg-gray-800/50 transition-colors ${
                  entry.isCurrentUser ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : ''
                }`}
              >
                {/* Rank */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank) || (
                      <div
                        className={`w-8 h-8 rounded-full ${getRankStyle(
                          entry.rank
                        )} flex items-center justify-center text-sm font-bold`}
                      >
                        {entry.rank}
                      </div>
                    )}
                  </div>
                </td>

                {/* Player */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-white">
                          {entry.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white flex items-center gap-2">
                        {entry.username}
                        {entry.isCurrentUser && (
                          <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded">
                            You
                          </span>
                        )}
                      </div>
                      {entry.title && (
                        <div className="text-xs text-gray-400">{entry.title}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Guild */}
                {showGuildColumn && (
                  <td className="px-6 py-4">
                    {entry.guild ? (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users className="w-4 h-4 text-purple-400" />
                        {entry.guild}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">-</span>
                    )}
                  </td>
                )}

                {/* Score */}
                <td className="px-6 py-4 text-right">
                  <div className="text-lg font-bold text-white">
                    {formatScore(entry.score)}
                  </div>
                </td>

                {/* Rank Change */}
                <td className="px-6 py-4">
                  {entry.change !== undefined && entry.change !== 0 && (
                    <div className="flex items-center justify-center gap-1">
                      {entry.change > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-semibold text-green-500">
                            +{entry.change}
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                          <span className="text-sm font-semibold text-red-500">
                            {entry.change}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Rankings Yet</h3>
          <p className="text-gray-500">
            Be the first to participate in this event and claim the top spot!
          </p>
        </div>
      )}

      {/* Footer Info */}
      {entries.length > 0 && (
        <div className="bg-gray-800/30 p-4 border-t border-gray-700 text-center text-sm text-gray-400">
          <Star className="w-4 h-4 inline mr-2 text-yellow-500" />
          Showing top {entries.length} participants • Rankings update every hour
        </div>
      )}
    </div>
  );
}
