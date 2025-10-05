'use client';

import { useState } from 'react';
import ChallengeModes from '@/components/challenge-modes';

export default function ChallengesPage() {
  // Sample challenges data
  const sampleChallenges = [
    // AMRAP Challenges
    {
      id: 'amrap-burpee-blitz',
      name: 'Burpee Blitz',
      description: 'Max burpees in 5 minutes - test your conditioning!',
      type: 'amrap' as const,
      category: 'cardio' as const,
      difficulty: 'intermediate' as const,
      icon: '💥',
      exercises: [{ name: 'Burpees', reps: 1 }],
      timeLimit: 300, // 5 minutes
      xpReward: 500,
      featured: true,
    },
    {
      id: 'amrap-pushup-madness',
      name: 'Push-Up Madness',
      description: 'How many push-ups can you do in 3 minutes?',
      type: 'amrap' as const,
      category: 'strength' as const,
      difficulty: 'beginner' as const,
      icon: '💪',
      exercises: [{ name: 'Push-Ups', reps: 1 }],
      timeLimit: 180, // 3 minutes
      xpReward: 300,
    },
    {
      id: 'amrap-death-by-thrusters',
      name: 'Death by Thrusters',
      description: 'AMRAP thrusters in 7 minutes - CrossFit classic!',
      type: 'amrap' as const,
      category: 'hybrid' as const,
      difficulty: 'advanced' as const,
      icon: '🔥',
      exercises: [{ name: 'Thrusters', reps: 1, weight: 95 }],
      timeLimit: 420, // 7 minutes
      xpReward: 1000,
      featured: true,
    },
    {
      id: 'amrap-cindy',
      name: 'Cindy',
      description: 'Classic CrossFit benchmark: 5 pull-ups, 10 push-ups, 15 squats',
      type: 'amrap' as const,
      category: 'endurance' as const,
      difficulty: 'intermediate' as const,
      icon: '⚡',
      exercises: [
        { name: 'Pull-Ups', reps: 5 },
        { name: 'Push-Ups', reps: 10 },
        { name: 'Air Squats', reps: 15 },
      ],
      timeLimit: 1200, // 20 minutes
      xpReward: 1500,
    },

    // Speed Run Challenges
    {
      id: 'speedrun-murph-lite',
      name: 'Murph Lite',
      description: 'Half Murph for time - a true test of grit!',
      type: 'speedrun' as const,
      category: 'endurance' as const,
      difficulty: 'advanced' as const,
      icon: '🎖️',
      exercises: [
        { name: 'Run', reps: 1, weight: 800 }, // 800m
        { name: 'Pull-Ups', reps: 50 },
        { name: 'Push-Ups', reps: 100 },
        { name: 'Air Squats', reps: 150 },
        { name: 'Run', reps: 1, weight: 800 },
      ],
      targetTime: 1800, // 30 minutes target
      xpReward: 2000,
      featured: true,
    },
    {
      id: 'speedrun-fran',
      name: 'Fran',
      description: 'Legendary CrossFit workout: 21-15-9 thrusters and pull-ups',
      type: 'speedrun' as const,
      category: 'hybrid' as const,
      difficulty: 'elite' as const,
      icon: '👑',
      exercises: [
        { name: 'Thrusters (21-15-9)', weight: 95 },
        { name: 'Pull-Ups (21-15-9)' },
      ],
      targetTime: 300, // 5 minutes target for elite
      xpReward: 3000,
    },
    {
      id: 'speedrun-helen',
      name: 'Helen',
      description: '3 rounds: 400m run, 21 KB swings, 12 pull-ups',
      type: 'speedrun' as const,
      category: 'cardio' as const,
      difficulty: 'intermediate' as const,
      icon: '🏃',
      exercises: [
        { name: 'Run 400m', rounds: 3 },
        { name: 'KB Swings (53lb)', reps: 21, rounds: 3 },
        { name: 'Pull-Ups', reps: 12, rounds: 3 },
      ],
      targetTime: 720, // 12 minutes
      xpReward: 1200,
    },
    {
      id: 'speedrun-quick-hundred',
      name: 'Quick Hundred',
      description: '100 burpees as fast as possible!',
      type: 'speedrun' as const,
      category: 'cardio' as const,
      difficulty: 'beginner' as const,
      icon: '💨',
      exercises: [{ name: 'Burpees', reps: 100 }],
      targetTime: 600, // 10 minutes
      xpReward: 500,
    },

    // Volume Challenges
    {
      id: 'volume-thousand-rep',
      name: '1000 Rep Gauntlet',
      description: 'Hit 1000 total reps across all exercises this session',
      type: 'volume' as const,
      category: 'endurance' as const,
      difficulty: 'advanced' as const,
      icon: '📊',
      exercises: [
        { name: 'Any Exercise' },
      ],
      targetVolume: 1000,
      xpReward: 2500,
    },
    {
      id: 'volume-push-pull',
      name: 'Push-Pull 500',
      description: '500 total reps of push and pull movements',
      type: 'volume' as const,
      category: 'strength' as const,
      difficulty: 'intermediate' as const,
      icon: '🔄',
      exercises: [
        { name: 'Push Exercises (Push-Ups, Dips, etc.)' },
        { name: 'Pull Exercises (Pull-Ups, Rows, etc.)' },
      ],
      targetVolume: 500,
      xpReward: 1000,
    },
    {
      id: 'volume-leg-destroyer',
      name: 'Leg Day 300',
      description: '300 total squat reps - your legs will hate you!',
      type: 'volume' as const,
      category: 'strength' as const,
      difficulty: 'beginner' as const,
      icon: '🦵',
      exercises: [
        { name: 'Squats (any variation)' },
      ],
      targetVolume: 300,
      xpReward: 600,
    },
    {
      id: 'volume-core-crusher',
      name: 'Core Crusher 250',
      description: '250 total ab movements - feel the burn!',
      type: 'volume' as const,
      category: 'strength' as const,
      difficulty: 'intermediate' as const,
      icon: '🔥',
      exercises: [
        { name: 'Ab Exercises (Sit-Ups, Planks, etc.)' },
      ],
      targetVolume: 250,
      xpReward: 750,
    },
  ];

  // Sample personal bests
  const [personalBests] = useState([
    { challengeId: 'amrap-burpee-blitz', performance: 87, date: 'Sep 15, 2025' },
    { challengeId: 'speedrun-fran', performance: 342, date: 'Aug 22, 2025' },
    { challengeId: 'volume-thousand-rep', performance: 1000, date: 'Sep 28, 2025' },
  ]);

  // Sample recent attempts
  const [recentAttempts] = useState([
    { challengeId: 'amrap-burpee-blitz', completedAt: 'Oct 3, 2025', performance: 82, rank: 145 },
    { challengeId: 'speedrun-helen', completedAt: 'Oct 2, 2025', performance: 735, rank: 67 },
    { challengeId: 'volume-leg-destroyer', completedAt: 'Oct 1, 2025', performance: 300, rank: 23 },
  ]);

  const handleStartChallenge = (challengeId: string) => {
    console.log('Starting challenge:', challengeId);
    // In production, track challenge start in database
  };

  const handleCompleteChallenge = (challengeId: string, performance: number) => {
    console.log('Completed challenge:', challengeId, 'Performance:', performance);
    // In production, save to database and show results screen
    alert(`Challenge Complete! Performance: ${performance}`);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">🎯</div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Challenge Modes
            </h1>
            <p className="text-xl text-white/70 mt-2">
              Test your limits with AMRAP, Speed Runs, and Volume Challenges!
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400">{sampleChallenges.length}</div>
            <div className="text-sm text-white/60">Available Challenges</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400">{personalBests.length}</div>
            <div className="text-sm text-white/60">Personal Bests</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400">{recentAttempts.length}</div>
            <div className="text-sm text-white/60">Recent Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400">
              {sampleChallenges.reduce((sum, c) => sum + c.xpReward, 0)}
            </div>
            <div className="text-sm text-white/60">Total XP Available</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <ChallengeModes
          challenges={sampleChallenges}
          personalBests={personalBests}
          recentAttempts={recentAttempts}
          onStartChallenge={handleStartChallenge}
          onCompleteChallenge={handleCompleteChallenge}
        />
      </div>

      {/* Challenge Types Guide */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">📚 Challenge Types Explained</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AMRAP */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-6">
              <div className="text-5xl mb-3">⏱️</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-3">AMRAP</h3>
              <p className="text-white/80 mb-4">
                <strong>As Many Reps/Rounds As Possible</strong> in a fixed time limit.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Fixed time limit (3-20 minutes)</li>
                <li>✓ Maximize reps or rounds</li>
                <li>✓ Great for conditioning</li>
                <li>✓ Compare with leaderboards</li>
                <li>✓ Push your cardio limits</li>
              </ul>
            </div>

            {/* Speed Run */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-6">
              <div className="text-5xl mb-3">🚀</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-3">Speed Run</h3>
              <p className="text-white/80 mb-4">
                <strong>Complete the workout as fast as possible</strong> and beat the clock!
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Fixed rep scheme</li>
                <li>✓ Minimize completion time</li>
                <li>✓ Target time to beat</li>
                <li>✓ Classic benchmark WODs</li>
                <li>✓ Test overall fitness</li>
              </ul>
            </div>

            {/* Volume */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">Volume Challenge</h3>
              <p className="text-white/80 mb-4">
                <strong>Hit a target total volume</strong> across one or more exercises.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Total rep target (e.g., 500, 1000)</li>
                <li>✓ Complete at your own pace</li>
                <li>✓ Mix of exercises allowed</li>
                <li>✓ Build work capacity</li>
                <li>✓ Perfect for strength endurance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Tiers */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-pink-400 mb-6">⭐ Difficulty Tiers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Beginner</h3>
              <p className="text-sm text-white/70">
                Perfect for those new to fitness or learning movements
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">⭐⭐</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Intermediate</h3>
              <p className="text-sm text-white/70">
                For athletes with solid conditioning and technique
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">⭐⭐⭐</div>
              <h3 className="text-xl font-bold text-orange-400 mb-2">Advanced</h3>
              <p className="text-sm text-white/70">
                Serious challenges for experienced athletes
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">💎</div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Elite</h3>
              <p className="text-sm text-white/70">
                Brutal tests for top-tier competitive athletes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-green-400 mb-6">💡 Challenge Pro Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">Start Appropriate</h3>
              <p className="text-sm text-white/70">
                Choose difficulty levels that match your current fitness. It&apos;s better to crush a beginner challenge than fail an elite one!
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">📹</div>
              <h3 className="text-lg font-bold text-white mb-2">Record Your Attempts</h3>
              <p className="text-sm text-white/70">
                Film yourself for form checks and to verify your performance. Great for tracking technique improvements too!
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Pace Yourself</h3>
              <p className="text-sm text-white/70">
                For longer challenges, start at 80% intensity. You can always speed up, but you can&apos;t recover from going out too hot!
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-lg font-bold text-white mb-2">Warm Up Properly</h3>
              <p className="text-sm text-white/70">
                Always do a thorough warm-up before challenges. Cold muscles + max effort = injury risk. Spend 10-15 minutes preparing.
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-white mb-2">Track Everything</h3>
              <p className="text-sm text-white/70">
                Log all attempts, not just PRs. Seeing progress over time is hugely motivating and helps identify patterns.
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-bold text-white mb-2">Compete With Yourself</h3>
              <p className="text-sm text-white/70">
                Your only real competition is your previous best. Beat that, and you&apos;re winning regardless of leaderboard position!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Teaser */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">🏅 Global Leaderboards</h2>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-3">Compete Globally</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Every challenge has a global leaderboard. See how you stack up against athletes worldwide. Top performers earn special badges and titles!
            </p>
            <a
              href="/leaderboards"
              className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              View Leaderboards
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
