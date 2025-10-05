'use client';

import { useState } from 'react';

interface StreakMilestone {
  days: number;
  title: string;
  reward: string;
  icon: string;
  unlocked: boolean;
}

interface StreakDay {
  date: string;
  completed: boolean;
  workoutCount: number;
}

interface StreakTrackerProps {
  currentStreak: number;
  bestStreak: number;
  bestStreakDate: string;
  totalWorkouts: number;
  freezeTokens: number;
  lastWorkoutDate: string;
  streakHistory: StreakDay[];
  onUseFreeze: () => void;
  onRecoverStreak: () => void;
}

export default function StreakTracker({
  currentStreak,
  bestStreak,
  bestStreakDate,
  totalWorkouts,
  freezeTokens,
  lastWorkoutDate,
  streakHistory,
  onUseFreeze,
  onRecoverStreak,
}: StreakTrackerProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'calendar' | 'milestones'>('overview');

  // Calculate combo multiplier
  const comboMultiplier = Math.min(currentStreak * 5, 100); // +5% per day, max +100%
  
  // Streak milestones
  const milestones: StreakMilestone[] = [
    { days: 7, title: 'Week Warrior', reward: '1 Freeze Token + 500 XP', icon: '🔥', unlocked: currentStreak >= 7 || bestStreak >= 7 },
    { days: 14, title: 'Fortnight Fighter', reward: '1 Freeze Token + 1000 XP', icon: '💪', unlocked: currentStreak >= 14 || bestStreak >= 14 },
    { days: 30, title: 'Monthly Master', reward: '2 Freeze Tokens + 2500 XP', icon: '⭐', unlocked: currentStreak >= 30 || bestStreak >= 30 },
    { days: 60, title: 'Two-Month Titan', reward: '2 Freeze Tokens + 5000 XP', icon: '👑', unlocked: currentStreak >= 60 || bestStreak >= 60 },
    { days: 90, title: 'Quarterly Champion', reward: '3 Freeze Tokens + 10000 XP', icon: '💎', unlocked: currentStreak >= 90 || bestStreak >= 90 },
    { days: 180, title: 'Half-Year Hero', reward: '3 Freeze Tokens + 25000 XP', icon: '🏆', unlocked: currentStreak >= 180 || bestStreak >= 180 },
    { days: 365, title: 'Yearly Legend', reward: '5 Freeze Tokens + 100000 XP', icon: '🌟', unlocked: currentStreak >= 365 || bestStreak >= 365 },
  ];

  // Get next milestone
  const nextMilestone = milestones.find(m => m.days > currentStreak);
  const daysToNextMilestone = nextMilestone ? nextMilestone.days - currentStreak : 0;

  // Get streak flame intensity
  const getStreakFlame = (streak: number): string => {
    if (streak === 0) return '💤';
    if (streak < 3) return '🔥';
    if (streak < 7) return '🔥🔥';
    if (streak < 14) return '🔥🔥🔥';
    if (streak < 30) return '🔥🔥🔥🔥';
    return '🔥🔥🔥🔥🔥';
  };

  // Get streak color
  const getStreakColor = (streak: number): string => {
    if (streak === 0) return 'text-gray-400';
    if (streak < 7) return 'text-orange-400';
    if (streak < 14) return 'text-amber-400';
    if (streak < 30) return 'text-yellow-400';
    if (streak < 60) return 'text-green-400';
    if (streak < 90) return 'text-blue-400';
    if (streak < 180) return 'text-purple-400';
    return 'text-pink-400';
  };

  // Get streak gradient
  const getStreakGradient = (streak: number): string => {
    if (streak === 0) return 'from-gray-500 to-gray-600';
    if (streak < 7) return 'from-orange-500 to-red-500';
    if (streak < 14) return 'from-amber-500 to-orange-500';
    if (streak < 30) return 'from-yellow-500 to-amber-500';
    if (streak < 60) return 'from-green-500 to-emerald-500';
    if (streak < 90) return 'from-blue-500 to-cyan-500';
    if (streak < 180) return 'from-purple-500 to-pink-500';
    return 'from-pink-500 via-purple-500 to-blue-500';
  };

  // Calculate weekly consistency
  const last7Days = streakHistory.slice(-7);
  const weeklyConsistency = last7Days.length > 0 
    ? Math.round((last7Days.filter(d => d.completed).length / last7Days.length) * 100)
    : 0;

  // Calculate monthly stats
  const last30Days = streakHistory.slice(-30);
  const monthlyWorkouts = last30Days.filter(d => d.completed).length;
  const monthlyConsistency = last30Days.length > 0
    ? Math.round((monthlyWorkouts / last30Days.length) * 100)
    : 0;

  // Check if streak can be recovered (within 24 hours)
  const canRecover = false; // This would be calculated based on last workout time
  const hoursRemaining = 0; // Hours left in 24-hour grace period

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'overview'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          🔥 Overview
        </button>
        <button
          onClick={() => setSelectedTab('calendar')}
          className={`px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'calendar'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          📅 Calendar
        </button>
        <button
          onClick={() => setSelectedTab('milestones')}
          className={`px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'milestones'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          🏆 Milestones
        </button>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Streak Display */}
          <div className={`bg-gradient-to-br ${getStreakGradient(currentStreak)} rounded-lg p-8 text-center border-2 border-white/20`}>
            <div className="text-6xl mb-4 animate-pulse">
              {getStreakFlame(currentStreak)}
            </div>
            <div className="text-7xl font-bold text-white mb-2">
              {currentStreak}
            </div>
            <div className="text-2xl text-white/90 mb-4">
              Day Streak
            </div>
            {currentStreak > 0 && (
              <div className="bg-black/30 rounded-lg px-6 py-3 inline-block">
                <div className="text-sm text-white/80 mb-1">XP Combo Multiplier</div>
                <div className="text-3xl font-bold text-yellow-400">
                  +{comboMultiplier}%
                </div>
              </div>
            )}
          </div>

          {/* Streak Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">🏅</div>
              <div className="text-2xl font-bold text-amber-400">{bestStreak}</div>
              <div className="text-sm text-white/60">Best Streak</div>
              <div className="text-xs text-white/40 mt-1">{bestStreakDate}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">💪</div>
              <div className="text-2xl font-bold text-green-400">{totalWorkouts}</div>
              <div className="text-sm text-white/60">Total Workouts</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">❄️</div>
              <div className="text-2xl font-bold text-blue-400">{freezeTokens}</div>
              <div className="text-sm text-white/60">Freeze Tokens</div>
              <div className="text-xs text-white/40 mt-1">Max 3 stored</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-purple-400">{weeklyConsistency}%</div>
              <div className="text-sm text-white/60">Weekly Consistency</div>
              <div className="text-xs text-white/40 mt-1">Last 7 days</div>
            </div>
          </div>

          {/* Next Milestone */}
          {nextMilestone && (
            <div className="bg-white/5 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{nextMilestone.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400">{nextMilestone.title}</h3>
                    <p className="text-sm text-white/60">{nextMilestone.reward}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{daysToNextMilestone}</div>
                  <div className="text-sm text-white/60">days to go</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {currentStreak} / {nextMilestone.days} days
                </div>
              </div>
            </div>
          )}

          {/* Streak Protection */}
          {freezeTokens > 0 && (
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">❄️</div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">Streak Protection Available</h3>
                    <p className="text-sm text-white/70">
                      Use a freeze token to protect your streak if you miss a workout
                    </p>
                  </div>
                </div>
                <button
                  onClick={onUseFreeze}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  Use Freeze ({freezeTokens} available)
                </button>
              </div>
            </div>
          )}

          {/* Streak Recovery */}
          {canRecover && (
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">⚠️</div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-400">Streak Recovery Available</h3>
                    <p className="text-sm text-white/70">
                      Complete a workout within {hoursRemaining} hours to recover your streak!
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      Recovered streak will have reduced XP bonus (50%)
                    </p>
                  </div>
                </div>
                <button
                  onClick={onRecoverStreak}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  Start Workout Now
                </button>
              </div>
            </div>
          )}

          {/* Weekly & Monthly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">📈 Weekly Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Workouts Completed</span>
                  <span className="text-xl font-bold text-green-400">
                    {last7Days.filter(d => d.completed).length} / 7
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Consistency Rate</span>
                  <span className="text-xl font-bold text-blue-400">{weeklyConsistency}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ width: `${weeklyConsistency}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-400 mb-4">📊 Monthly Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Workouts Completed</span>
                  <span className="text-xl font-bold text-green-400">
                    {monthlyWorkouts} / 30
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Consistency Rate</span>
                  <span className="text-xl font-bold text-blue-400">{monthlyConsistency}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                    style={{ width: `${monthlyConsistency}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6 text-center">
            <div className="text-2xl mb-3">
              {currentStreak === 0 && '💪 Start your streak today!'}
              {currentStreak > 0 && currentStreak < 3 && '🔥 Great start! Keep it going!'}
              {currentStreak >= 3 && currentStreak < 7 && '💪 You\'re on fire! Don\'t break the chain!'}
              {currentStreak >= 7 && currentStreak < 30 && '⭐ Amazing consistency! You\'re unstoppable!'}
              {currentStreak >= 30 && '🏆 You\'re a legend! This is incredible dedication!'}
            </div>
            <p className="text-white/70">
              {currentStreak === 0 && 'Every expert was once a beginner. Take the first step!'}
              {currentStreak > 0 && currentStreak < 7 && 'Consistency is the key to success. One day at a time!'}
              {currentStreak >= 7 && currentStreak < 30 && 'You\'re building an unbreakable habit. Keep pushing!'}
              {currentStreak >= 30 && 'You\'re in the top 1% of dedication. Absolutely phenomenal!'}
            </p>
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {selectedTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-6">📅 Workout Calendar</h3>
            
            {/* Calendar Grid - Last 42 days (6 weeks) */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-white/60 pb-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {streakHistory.slice(-42).map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all hover:scale-110 ${
                    day.completed
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-green-400'
                      : 'bg-white/5 border border-white/10'
                  }`}
                  title={`${day.date}: ${day.completed ? `${day.workoutCount} workout${day.workoutCount > 1 ? 's' : ''}` : 'Rest day'}`}
                >
                  <div className="text-xs text-white/60">
                    {new Date(day.date).getDate()}
                  </div>
                  {day.completed && (
                    <div className="text-lg">
                      {day.workoutCount > 1 ? '🔥' : '✅'}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-green-400" />
                <span className="text-sm text-white/70">Workout Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
                <span className="text-sm text-white/70">Rest Day</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {selectedTab === 'milestones' && (
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const isActive = currentStreak >= milestone.days;
            const progress = Math.min((currentStreak / milestone.days) * 100, 100);

            return (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-sm border rounded-lg p-6 transition-all ${
                  milestone.unlocked
                    ? 'border-green-400/50 bg-green-500/10'
                    : isActive
                    ? 'border-purple-400/50 bg-purple-500/10'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl ${milestone.unlocked ? 'animate-bounce' : ''}`}>
                      {milestone.icon}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        milestone.unlocked ? 'text-green-400' : 'text-white'
                      }`}>
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-white/60">{milestone.reward}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{milestone.days}</div>
                    <div className="text-sm text-white/60">days</div>
                    {milestone.unlocked && (
                      <div className="text-green-400 text-sm font-bold mt-1">✅ UNLOCKED</div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {!milestone.unlocked && (
                  <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
