'use client';

import { useState } from 'react';
import PvPChallenges from '@/components/pvp-challenges';

export default function PvPPage() {
  // Sample current user
  const currentUser = {
    id: 'user-1',
    username: 'IronWarrior',
    level: 25,
    rank: 1247,
    division: {
      name: 'Gold',
      tier: 3,
      minRank: 1500,
      maxRank: 1999,
      color: '#FFD700',
    },
    winRate: 64.2,
    totalWins: 45,
    totalLosses: 25,
  };

  // Sample challenges
  const [challenges] = useState([
    // Pending Invites
    {
      id: 'challenge-1',
      type: 'duel' as const,
      mode: 'same-workout' as const,
      name: 'Friday Night Throwdown',
      description: 'Head-to-head burpee battle',
      workout: {
        exercises: [
          { name: 'Burpees', reps: 100, notes: 'Chest to ground, full extension' },
        ],
        objective: 'Complete 100 burpees as fast as possible',
        format: 'For Time',
      },
      creator: {
        id: 'user-2',
        username: 'FitBeast92',
        level: 23,
        rank: 1389,
        division: {
          name: 'Gold',
          tier: 3,
          minRank: 1500,
          maxRank: 1999,
          color: '#FFD700',
        },
        winRate: 58.3,
        totalWins: 35,
        totalLosses: 25,
      },
      opponent: currentUser,
      status: 'pending' as const,
      victoryCondition: 'fastest-time' as const,
      ranked: true,
      rewards: {
        xp: 2000,
        rankedPoints: 50,
        title: 'Burpee Champion',
      },
      createdAt: new Date('2025-10-03'),
    },
    {
      id: 'challenge-2',
      type: 'async' as const,
      mode: 'benchmark' as const,
      name: 'Fran Showdown',
      description: 'Classic CrossFit benchmark battle',
      workout: {
        exercises: [
          { name: 'Thrusters', reps: 21, weight: 95, notes: '21-15-9 reps' },
          { name: 'Pull-Ups', reps: 21, notes: '21-15-9 reps' },
        ],
        objective: 'Complete Fran (21-15-9) as fast as possible',
        format: 'For Time',
      },
      creator: {
        id: 'user-3',
        username: 'WODKiller',
        level: 28,
        rank: 987,
        division: {
          name: 'Platinum',
          tier: 4,
          minRank: 2000,
          maxRank: 2499,
          color: '#E5E4E2',
        },
        winRate: 71.5,
        totalWins: 58,
        totalLosses: 23,
      },
      opponent: currentUser,
      status: 'pending' as const,
      victoryCondition: 'fastest-time' as const,
      ranked: true,
      rewards: {
        xp: 3000,
        rankedPoints: 75,
        badge: '🏆',
      },
      createdAt: new Date('2025-10-02'),
    },

    // Active Battles
    {
      id: 'challenge-3',
      type: 'duel' as const,
      mode: 'same-workout' as const,
      name: 'Pull-Up Power Battle',
      description: 'Max pull-ups in 5 minutes',
      workout: {
        exercises: [
          { name: 'Pull-Ups', time: 300, notes: 'Max reps in 5 minutes' },
        ],
        objective: 'Complete as many pull-ups as possible in 5 minutes',
        format: 'AMRAP',
      },
      creator: currentUser,
      opponent: {
        id: 'user-4',
        username: 'PullUpKing',
        level: 26,
        rank: 1156,
        division: {
          name: 'Gold',
          tier: 3,
          minRank: 1500,
          maxRank: 1999,
          color: '#FFD700',
        },
        winRate: 62.8,
        totalWins: 42,
        totalLosses: 25,
      },
      status: 'active' as const,
      startTime: new Date('2025-10-04'),
      victoryCondition: 'most-reps' as const,
      ranked: false,
      rewards: {
        xp: 1500,
        rankedPoints: 0,
      },
      createdAt: new Date('2025-10-03'),
    },
    {
      id: 'challenge-4',
      type: 'duel' as const,
      mode: 'same-workout' as const,
      name: 'Squat Max Challenge',
      description: 'Who can lift more?',
      workout: {
        exercises: [
          { name: 'Back Squat', sets: 1, reps: 1, notes: 'Work up to 1 Rep Max' },
        ],
        objective: 'Hit your maximum back squat for 1 rep',
        format: '1RM Test',
      },
      creator: {
        id: 'user-5',
        username: 'LegDayLegend',
        level: 29,
        rank: 845,
        division: {
          name: 'Platinum',
          tier: 4,
          minRank: 2000,
          maxRank: 2499,
          color: '#E5E4E2',
        },
        winRate: 68.9,
        totalWins: 51,
        totalLosses: 23,
      },
      opponent: currentUser,
      status: 'active' as const,
      startTime: new Date('2025-10-03'),
      victoryCondition: 'heaviest-weight' as const,
      ranked: true,
      rewards: {
        xp: 2500,
        rankedPoints: 60,
        title: 'Squat King',
      },
      createdAt: new Date('2025-10-02'),
    },

    // Available Challenges
    {
      id: 'challenge-5',
      type: 'duel' as const,
      mode: 'benchmark' as const,
      name: 'Helen Speed Run',
      description: 'Classic CrossFit Helen WOD',
      workout: {
        exercises: [
          { name: '400m Run', reps: 3, notes: 'Each round' },
          { name: 'KB Swings', reps: 21, weight: 53, notes: 'Each round (53lb)' },
          { name: 'Pull-Ups', reps: 12, notes: 'Each round' },
        ],
        objective: 'Complete 3 rounds of Helen as fast as possible',
        format: 'For Time',
      },
      creator: {
        id: 'user-6',
        username: 'CardioKing',
        level: 27,
        rank: 1034,
        division: {
          name: 'Platinum',
          tier: 4,
          minRank: 2000,
          maxRank: 2499,
          color: '#E5E4E2',
        },
        winRate: 65.4,
        totalWins: 48,
        totalLosses: 25,
      },
      status: 'pending' as const,
      victoryCondition: 'fastest-time' as const,
      ranked: true,
      rewards: {
        xp: 2200,
        rankedPoints: 55,
      },
      createdAt: new Date('2025-10-01'),
    },
    {
      id: 'challenge-6',
      type: 'async' as const,
      mode: 'open' as const,
      name: 'Weekend Warrior Challenge',
      description: 'Your choice of workout, we compare results',
      workout: {
        exercises: [
          { name: 'Choose Your Own', notes: 'Any workout, submit your best effort' },
        ],
        objective: 'Complete your chosen workout and submit performance',
        format: 'Open',
      },
      creator: {
        id: 'user-7',
        username: 'FlexMaster',
        level: 24,
        rank: 1478,
        division: {
          name: 'Gold',
          tier: 3,
          minRank: 1500,
          maxRank: 1999,
          color: '#FFD700',
        },
        winRate: 59.2,
        totalWins: 38,
        totalLosses: 26,
      },
      status: 'pending' as const,
      victoryCondition: 'best-score' as const,
      ranked: false,
      rewards: {
        xp: 1200,
        rankedPoints: 0,
      },
      createdAt: new Date('2025-09-30'),
    },
    {
      id: 'challenge-7',
      type: 'tournament' as const,
      mode: 'benchmark' as const,
      name: 'Murph Madness Tournament',
      description: '8-person bracket, Murph WOD',
      workout: {
        exercises: [
          { name: '1 Mile Run', reps: 1 },
          { name: 'Pull-Ups', reps: 100 },
          { name: 'Push-Ups', reps: 200 },
          { name: 'Air Squats', reps: 300 },
          { name: '1 Mile Run', reps: 1 },
        ],
        objective: 'Complete the Murph hero WOD',
        format: 'For Time',
      },
      creator: {
        id: 'user-8',
        username: 'MurphMaster',
        level: 32,
        rank: 456,
        division: {
          name: 'Diamond',
          tier: 5,
          minRank: 2500,
          maxRank: 2999,
          color: '#B9F2FF',
        },
        winRate: 76.3,
        totalWins: 71,
        totalLosses: 22,
      },
      status: 'pending' as const,
      participants: [],
      victoryCondition: 'fastest-time' as const,
      ranked: true,
      timeLimit: 60,
      rewards: {
        xp: 5000,
        rankedPoints: 150,
        title: 'Murph Champion',
        badge: '🎖️',
      },
      createdAt: new Date('2025-09-28'),
    },

    // Completed Challenges
    {
      id: 'challenge-8',
      type: 'duel' as const,
      mode: 'same-workout' as const,
      name: 'Tuesday Night Fight',
      description: 'Death by burpees',
      workout: {
        exercises: [
          { name: 'Burpees', notes: 'Death by burpees format' },
        ],
        objective: 'Complete death by burpees',
        format: 'Death By',
      },
      creator: currentUser,
      opponent: {
        id: 'user-9',
        username: 'BurpeeNinja',
        level: 22,
        rank: 1567,
        division: {
          name: 'Gold',
          tier: 3,
          minRank: 1500,
          maxRank: 1999,
          color: '#FFD700',
        },
        winRate: 54.1,
        totalWins: 33,
        totalLosses: 28,
      },
      status: 'completed' as const,
      victoryCondition: 'most-reps' as const,
      ranked: false,
      rewards: {
        xp: 1500,
        rankedPoints: 0,
      },
      result: {
        winner: currentUser.id,
        loser: 'user-9',
        winnerPerformance: {
          reps: 156,
          completedAt: new Date('2025-10-01'),
        },
        loserPerformance: {
          reps: 142,
          completedAt: new Date('2025-10-01'),
        },
        margin: '14 more reps',
        verified: true,
      },
      createdAt: new Date('2025-09-30'),
    },
    {
      id: 'challenge-9',
      type: 'duel' as const,
      mode: 'benchmark' as const,
      name: 'Cindy AMRAP Battle',
      description: '20-minute AMRAP competition',
      workout: {
        exercises: [
          { name: 'Pull-Ups', reps: 5, notes: 'Each round' },
          { name: 'Push-Ups', reps: 10, notes: 'Each round' },
          { name: 'Air Squats', reps: 15, notes: 'Each round' },
        ],
        objective: 'Complete as many rounds as possible in 20 minutes',
        format: '20-Min AMRAP',
      },
      creator: {
        id: 'user-10',
        username: 'AMRAPWarrior',
        level: 26,
        rank: 1134,
        division: {
          name: 'Gold',
          tier: 3,
          minRank: 1500,
          maxRank: 1999,
          color: '#FFD700',
        },
        winRate: 63.5,
        totalWins: 47,
        totalLosses: 27,
      },
      opponent: currentUser,
      status: 'completed' as const,
      victoryCondition: 'most-reps' as const,
      ranked: true,
      rewards: {
        xp: 2000,
        rankedPoints: 50,
      },
      result: {
        winner: 'user-10',
        loser: currentUser.id,
        winnerPerformance: {
          reps: 23,
          completedAt: new Date('2025-09-29'),
        },
        loserPerformance: {
          reps: 21,
          completedAt: new Date('2025-09-29'),
        },
        margin: '2 more rounds',
        verified: true,
      },
      createdAt: new Date('2025-09-28'),
    },
    {
      id: 'challenge-10',
      type: 'duel' as const,
      mode: 'same-workout' as const,
      name: 'Deadlift Duel',
      description: 'Max deadlift showdown',
      workout: {
        exercises: [
          { name: 'Deadlift', sets: 1, reps: 1, notes: 'Work up to 1RM' },
        ],
        objective: 'Hit your maximum deadlift',
        format: '1RM Test',
      },
      creator: currentUser,
      opponent: {
        id: 'user-11',
        username: 'DeadliftDemon',
        level: 30,
        rank: 723,
        division: {
          name: 'Platinum',
          tier: 4,
          minRank: 2000,
          maxRank: 2499,
          color: '#E5E4E2',
        },
        winRate: 69.7,
        totalWins: 53,
        totalLosses: 23,
      },
      status: 'completed' as const,
      victoryCondition: 'heaviest-weight' as const,
      ranked: true,
      rewards: {
        xp: 2500,
        rankedPoints: 60,
        title: 'Deadlift King',
      },
      result: {
        winner: currentUser.id,
        loser: 'user-11',
        winnerPerformance: {
          weight: 455,
          completedAt: new Date('2025-09-27'),
        },
        loserPerformance: {
          weight: 445,
          completedAt: new Date('2025-09-27'),
        },
        margin: '10 lbs heavier',
        verified: true,
      },
      createdAt: new Date('2025-09-26'),
    },
  ]);

  const handleCreateChallenge = (challenge: any) => {
    console.log('Creating challenge:', challenge);
    alert('Challenge created! (In production: Save to database and notify opponent)');
  };

  const handleAcceptChallenge = (challengeId: string) => {
    console.log('Accepting challenge:', challengeId);
    alert('Challenge accepted! (In production: Update status to active and notify creator)');
  };

  const handleDeclineChallenge = (challengeId: string) => {
    console.log('Declining challenge:', challengeId);
    alert('Challenge declined. (In production: Remove challenge and notify creator)');
  };

  const handleSubmitPerformance = (challengeId: string, performance: any) => {
    console.log('Submitting performance:', { challengeId, performance });
    alert(`Performance submitted! (In production: Save result, determine winner, award rewards)\n\nYour Performance: ${JSON.stringify(performance, null, 2)}`);
  };

  const handleFindMatch = () => {
    alert('Finding match... (In production: Use matchmaking algorithm based on skill level, division, and preferences)');
  };

  return (
    <div className="min-h-screen p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">⚔️</div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              PvP Arena
            </h1>
            <p className="text-xl text-white/70 mt-2">
              Challenge other athletes and prove your dominance!
            </p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400">
              {challenges.filter(c => c.status === 'pending' && (c.opponent?.id === currentUser.id || c.creator.id === currentUser.id)).length}
            </div>
            <div className="text-sm text-white/60">Pending Invites</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400">
              {challenges.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-white/60">Active Battles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400">{currentUser.totalWins}</div>
            <div className="text-sm text-white/60">Total Wins</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-400">{currentUser.totalLosses}</div>
            <div className="text-sm text-white/60">Total Losses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400">{currentUser.winRate}%</div>
            <div className="text-sm text-white/60">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <PvPChallenges
          challenges={challenges}
          currentUser={currentUser}
          onCreateChallenge={handleCreateChallenge}
          onAcceptChallenge={handleAcceptChallenge}
          onDeclineChallenge={handleDeclineChallenge}
          onSubmitPerformance={handleSubmitPerformance}
          onFindMatch={handleFindMatch}
        />
      </div>

      {/* How PvP Works Guide */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">⚔️ How PvP Works</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-pink-400 mb-2">Creating Challenges</h3>
              <p className="text-white/80">
                Create custom challenges with specific workouts, win conditions, and rewards. Choose between 
                ranked matches (affects your division) or casual battles for fun. Invite specific opponents or 
                post open challenges for anyone to accept.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-orange-400 mb-2">Challenge Types</h3>
              <ul className="space-y-2 text-white/80">
                <li><span className="text-purple-400">⚔️ 1v1 Duels:</span> Direct head-to-head battles with one opponent</li>
                <li><span className="text-yellow-400">🏆 Tournaments:</span> Bracket-style competitions with multiple rounds and playoffs</li>
                <li><span className="text-blue-400">👥 Team Battles:</span> Squad vs squad collaborative challenges</li>
                <li><span className="text-green-400">⏱️ Async Challenges:</span> Compete on your schedule, results compared later</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-2">Victory Conditions</h3>
              <ul className="space-y-2 text-white/80">
                <li><span className="text-green-400">⏱️ Fastest Time:</span> Complete the workout in the shortest time</li>
                <li><span className="text-orange-400">💪 Most Reps:</span> Accumulate the highest rep count</li>
                <li><span className="text-red-400">🏋️ Heaviest Weight:</span> Lift the most weight (1RM challenges)</li>
                <li><span className="text-purple-400">⭐ Best Score:</span> Judge-scored or points-based competitions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Ranked System</h3>
              <p className="text-white/80 mb-3">
                Compete in ranked matches to earn division points and climb the ladder. Divisions range from 
                Bronze to Grandmaster. Win matches to gain points and promotions, lose to drop in rankings.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-[#CD7F32]/20 border border-[#CD7F32]/30 rounded p-2 text-center">
                  <div className="font-bold" style={{ color: '#CD7F32' }}>Bronze</div>
                  <div className="text-white/60">0-999 RP</div>
                </div>
                <div className="bg-[#C0C0C0]/20 border border-[#C0C0C0]/30 rounded p-2 text-center">
                  <div className="font-bold" style={{ color: '#C0C0C0' }}>Silver</div>
                  <div className="text-white/60">1000-1499 RP</div>
                </div>
                <div className="bg-[#FFD700]/20 border border-[#FFD700]/30 rounded p-2 text-center">
                  <div className="font-bold" style={{ color: '#FFD700' }}>Gold</div>
                  <div className="text-white/60">1500-1999 RP</div>
                </div>
                <div className="bg-[#E5E4E2]/20 border border-[#E5E4E2]/30 rounded p-2 text-center">
                  <div className="font-bold" style={{ color: '#E5E4E2' }}>Platinum</div>
                  <div className="text-white/60">2000-2499 RP</div>
                </div>
                <div className="bg-[#B9F2FF]/20 border border-[#B9F2FF]/30 rounded p-2 text-center">
                  <div className="font-bold" style={{ color: '#B9F2FF' }}>Diamond</div>
                  <div className="text-white/60">2500-2999 RP</div>
                </div>
                <div className="bg-[#9B59B6]/20 border border-[#9B59B6]/30 rounded p-2 text-center">
                  <div className="font-bold" style={{ color: '#9B59B6' }}>Master</div>
                  <div className="text-white/60">3000-3499 RP</div>
                </div>
                <div className="bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 rounded p-2 text-center">
                  <div className="font-bold" style={{ color: '#FF6B6B' }}>Grandmaster</div>
                  <div className="text-white/60">3500+ RP</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Rewards & Progression</h3>
              <p className="text-white/80">
                Win challenges to earn XP, ranked points, exclusive titles, and special badges. Ranked victories 
                award more rewards but losses cost you points. Build your win streak for bonus rewards!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fair Play Guidelines */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-red-400 mb-6">⚖️ Fair Play & Sportsmanship</h2>
          
          <div className="space-y-4 text-white/80">
            <p>
              <span className="font-bold text-green-400">✓ Video Proof:</span> Ranked matches may require video 
              proof of performance to prevent cheating. Submit your workout recording for verification.
            </p>
            <p>
              <span className="font-bold text-blue-400">✓ Honest Reporting:</span> Report your actual performance. 
              Dishonest scores will be flagged by the community and may result in bans.
            </p>
            <p>
              <span className="font-bold text-purple-400">✓ Good Sportsmanship:</span> Respect your opponents. 
              Trash talk is fun, but keep it friendly. Toxic behavior is not tolerated.
            </p>
            <p>
              <span className="font-bold text-orange-400">✓ Community Standards:</span> Follow workout movement 
              standards (full ROM, proper depth, etc.). Judges may review contested results.
            </p>
            <p>
              <span className="font-bold text-red-400">✗ Cheating:</span> No falsified scores, performance 
              enhancing drugs, or movement shortcuts. Violations result in permanent bans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
