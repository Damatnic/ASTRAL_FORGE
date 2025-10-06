'use client'

import { useFriends, useMyGuild, useLeaderboard, useChallenges, useUserRank } from '@/hooks/use-data'
import Link from 'next/link'

export default function SocialHubPage() {
  const { data: friends, loading: friendsLoading } = useFriends()
  const { data: guild, loading: guildLoading } = useMyGuild()
  const { data: leaderboard, loading: leaderboardLoading } = useLeaderboard('level', 5)
  const { data: rank, loading: rankLoading } = useUserRank('level')
  const { data: challenges, loading: challengesLoading } = useChallenges()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Social Hub
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Friends</div>
          <div className="text-3xl font-bold text-purple-400">
            {friendsLoading ? '...' : friends?.friends?.length || 0}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Guild Members</div>
          <div className="text-3xl font-bold text-blue-400">
            {guildLoading ? '...' : guild?.guild?.memberCount || 0}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Global Rank</div>
          <div className="text-3xl font-bold text-yellow-400">
            {rankLoading ? '...' : `#${rank?.rank || '-'}`}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Active Challenges</div>
          <div className="text-3xl font-bold text-green-400">
            {challengesLoading ? '...' : challenges?.challenges?.filter((c: any) => c.isActive).length || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Friends Preview */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-purple-400">Friends</h2>
            <Link 
              href="/social/friends"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              View All →
            </Link>
          </div>

          {friendsLoading ? (
            <div className="text-slate-400 text-center py-8">Loading friends...</div>
          ) : !friends?.friends?.length ? (
            <div className="text-slate-400 text-center py-8">
              No friends yet. Start connecting with other warriors!
            </div>
          ) : (
            <div className="space-y-3">
              {friends.friends.slice(0, 5).map((friend: any) => (
                <div
                  key={friend.userId}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">⚔️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{friend.userName}</div>
                      <div className="text-sm text-slate-400">
                        Level {friend.level} {friend.characterClass}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    <div>{friend.totalWorkouts} workouts</div>
                    <div>{friend.currentStreak} day streak</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {friends?.pendingRequests?.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="text-yellow-400 font-semibold">
                {friends.pendingRequests.length} pending friend request{friends.pendingRequests.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Guild Preview */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-400">Guild</h2>
            <Link 
              href="/social/guilds"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {guild?.guild ? 'View Guild' : 'Browse Guilds'} →
            </Link>
          </div>

          {guildLoading ? (
            <div className="text-slate-400 text-center py-8">Loading guild...</div>
          ) : !guild?.guild ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏰</div>
              <div className="text-slate-400 mb-4">
                You're not in a guild yet
              </div>
              <Link
                href="/social/guilds"
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Find a Guild
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl mb-3">{guild.guild.icon}</div>
                <h3 className="text-xl font-bold text-white mb-1">{guild.guild.name}</h3>
                <p className="text-slate-400 text-sm">{guild.guild.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{guild.guild.memberCount}</div>
                  <div className="text-xs text-slate-400">Members</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{guild.guild.level}</div>
                  <div className="text-xs text-slate-400">Guild Level</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {(guild.guild.totalXP / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-slate-400">Total Progress</div>
                </div>
              </div>

              {guild.role && (
                <div className="text-center text-sm">
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400">
                    {guild.role.charAt(0).toUpperCase() + guild.role.slice(1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Top Warriors</h2>
          <Link 
            href="/social/leaderboards"
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            View All Leaderboards →
          </Link>
        </div>

        {leaderboardLoading ? (
          <div className="text-slate-400 text-center py-8">Loading leaderboard...</div>
        ) : (
          <div className="space-y-2">
            {leaderboard?.entries?.map((entry: any) => (
              <div
                key={entry.userId}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    entry.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                    entry.rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {entry.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{entry.userName}</div>
                    <div className="text-sm text-slate-400">{entry.characterClass}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-400">Level {entry.level}</div>
                  {entry.change > 0 && (
                    <div className="text-sm text-green-400">↑ {entry.change}</div>
                  )}
                </div>
              </div>
            ))}

            {rank && (
              <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
                <span className="text-slate-400">Your Rank: </span>
                <span className="font-bold text-purple-400">#{rank.rank}</span>
                <span className="text-slate-400"> of {rank.total}</span>
                <span className="ml-2 text-sm text-slate-500">
                  (Top {rank.percentile}%)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Challenges */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-400">Active Challenges</h2>
          <Link 
            href="/social/challenges"
            className="text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        {challengesLoading ? (
          <div className="text-slate-400 text-center py-8">Loading challenges...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenges?.challenges?.filter((c: any) => c.isActive).map((challenge: any) => (
              <div
                key={challenge.id}
                className="p-4 bg-slate-900/50 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{challenge.icon || '🏆'}</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 rounded-full text-green-400">
                    Active
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1">{challenge.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{challenge.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {challenge.participants?.length || 0} participants
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    +{challenge.reward} Progress
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
