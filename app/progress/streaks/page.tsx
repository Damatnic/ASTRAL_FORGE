'use client';

import { useState } from 'react';
import StreakTracker from '@/components/streak-tracker';

export default function StreaksPage() {
  // Sample data - would come from database in production
  const [currentStreak, setCurrentStreak] = useState(15);
  const [bestStreak] = useState(42);
  const [freezeTokens, setFreezeTokens] = useState(2);
  const [totalWorkouts] = useState(127);

  // Generate sample streak history (last 42 days)
  const generateStreakHistory = () => {
    const history = [];
    const today = new Date();
    
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate workout pattern - higher chance in recent days
      const completed = i > currentStreak ? Math.random() > 0.4 : true;
      const workoutCount = completed ? Math.floor(Math.random() * 2) + 1 : 0;
      
      history.push({
        date: date.toISOString().split('T')[0],
        completed,
        workoutCount,
      });
    }
    
    return history;
  };

  const [streakHistory] = useState(generateStreakHistory());

  const handleUseFreeze = () => {
    if (freezeTokens > 0) {
      setFreezeTokens(freezeTokens - 1);
      // In production, this would save to database and show success message
      alert('Freeze token activated! Your streak is protected for today.');
    }
  };

  const handleRecoverStreak = () => {
    // In production, this would redirect to workout page
    alert('Starting workout to recover your streak!');
  };

  return (
    <div className="min-h-screen p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">🔥</div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Workout Streaks
            </h1>
            <p className="text-xl text-white/70 mt-2">
              Track your consistency and earn massive XP bonuses!
            </p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400">{currentStreak}</div>
              <div className="text-sm text-white/60">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400">+{Math.min(currentStreak * 5, 100)}%</div>
              <div className="text-sm text-white/60">XP Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400">{bestStreak}</div>
              <div className="text-sm text-white/60">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">{freezeTokens}</div>
              <div className="text-sm text-white/60">Freeze Tokens</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <StreakTracker
          currentStreak={currentStreak}
          bestStreak={bestStreak}
          bestStreakDate="March 15, 2024"
          totalWorkouts={totalWorkouts}
          freezeTokens={freezeTokens}
          lastWorkoutDate={new Date().toISOString().split('T')[0]}
          streakHistory={streakHistory}
          onUseFreeze={handleUseFreeze}
          onRecoverStreak={handleRecoverStreak}
        />
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">🎯 How Streak System Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Combo Multiplier */}
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-3">⚡ Combo Multiplier</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Earn <span className="text-green-400 font-bold">+5% XP bonus</span> for each consecutive day</li>
                <li>• Maximum bonus: <span className="text-yellow-400 font-bold">+100% XP at 20-day streak</span></li>
                <li>• Applies to all workout XP rewards</li>
                <li>• Multiplier resets if streak breaks</li>
              </ul>
            </div>

            {/* Streak Milestones */}
            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-3">🏆 Streak Milestones</h3>
              <ul className="space-y-2 text-white/70">
                <li>• <span className="text-orange-400 font-bold">7 days:</span> Week Warrior + 1 Freeze Token</li>
                <li>• <span className="text-yellow-400 font-bold">30 days:</span> Monthly Master + 2 Freeze Tokens</li>
                <li>• <span className="text-green-400 font-bold">90 days:</span> Quarterly Champion + 3 Freeze Tokens</li>
                <li>• <span className="text-purple-400 font-bold">365 days:</span> Yearly Legend + 5 Freeze Tokens</li>
              </ul>
            </div>

            {/* Freeze Tokens */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">❄️ Freeze Tokens</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Protect your streak when you can&apos;t workout</li>
                <li>• Maximum storage: <span className="text-blue-400 font-bold">3 tokens</span></li>
                <li>• Earn from milestone achievements</li>
                <li>• Use strategically for rest days or emergencies</li>
              </ul>
            </div>

            {/* Streak Recovery */}
            <div>
              <h3 className="text-xl font-bold text-orange-400 mb-3">🔄 Streak Recovery</h3>
              <ul className="space-y-2 text-white/70">
                <li>• <span className="text-orange-400 font-bold">24-hour grace period</span> after missing a workout</li>
                <li>• Complete a workout to recover your streak</li>
                <li>• Recovered streak has 50% XP bonus (temporary penalty)</li>
                <li>• Grace period resets after successful recovery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-green-400 mb-6">💡 Pro Tips for Maximum Streaks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-white mb-2">Plan Ahead</h3>
              <p className="text-sm text-white/70">
                Schedule your workouts in advance and set reminders. Consistency is easier with a routine.
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-lg font-bold text-white mb-2">Quality Over Length</h3>
              <p className="text-sm text-white/70">
                Even a 15-minute workout counts! Focus on showing up consistently rather than marathon sessions.
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">❄️</div>
              <h3 className="text-lg font-bold text-white mb-2">Save Your Tokens</h3>
              <p className="text-sm text-white/70">
                Use freeze tokens wisely for planned events, illness, or travel. Don&apos;t waste them on laziness!
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">Set Mini-Goals</h3>
              <p className="text-sm text-white/70">
                Aim for the next milestone (7, 14, 30 days) rather than thinking about year-long streaks.
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-lg font-bold text-white mb-2">Enable Notifications</h3>
              <p className="text-sm text-white/70">
                Get daily reminders and streak protection alerts to stay on track with your goals.
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-white mb-2">Find Accountability</h3>
              <p className="text-sm text-white/70">
                Share your streaks with friends or join leaderboard competitions for extra motivation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-pink-400 mb-6">🏅 Top Streaks Leaderboard</h2>
          
          <div className="space-y-3">
            {[
              { rank: 1, name: 'IronMike', streak: 365, badge: '🌟' },
              { rank: 2, name: 'FlexFury', streak: 287, badge: '👑' },
              { rank: 3, name: 'GymWarrior', streak: 203, badge: '💎' },
              { rank: 4, name: 'FitQueen', streak: 156, badge: '⭐' },
              { rank: 5, name: 'You', streak: currentStreak, badge: '🔥', highlight: true },
            ].map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.highlight
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400'
                    : 'bg-black/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold ${
                    entry.rank === 1 ? 'text-yellow-400' :
                    entry.rank === 2 ? 'text-gray-300' :
                    entry.rank === 3 ? 'text-orange-400' :
                    'text-white/60'
                  }`}>
                    #{entry.rank}
                  </div>
                  <div className="text-3xl">{entry.badge}</div>
                  <div>
                    <div className="text-lg font-bold text-white">{entry.name}</div>
                    <div className="text-sm text-white/60">{entry.streak} day streak</div>
                  </div>
                </div>
                {entry.highlight && (
                  <div className="text-purple-400 font-bold">Your Rank</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="/leaderboards"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              View Full Leaderboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
