'use client';

import { useState } from 'react';

// TypeScript Interfaces
interface PvPChallenge {
  id: string;
  type: 'duel' | 'tournament' | 'team' | 'async';
  mode: 'same-workout' | 'scaled' | 'open' | 'benchmark';
  name: string;
  description: string;
  workout: ChallengeWorkout;
  creator: User;
  opponent?: User;
  participants?: User[];
  status: 'pending' | 'active' | 'completed';
  startTime?: Date;
  endTime?: Date;
  timeLimit?: number; // minutes
  victoryCondition: 'fastest-time' | 'most-reps' | 'heaviest-weight' | 'best-score';
  ranked: boolean;
  division?: Division;
  rewards: ChallengeRewards;
  result?: ChallengeResult;
  createdAt: Date;
}

interface ChallengeWorkout {
  exercises: WorkoutExercise[];
  objective: string;
  format: string;
}

interface WorkoutExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  time?: number;
  distance?: number;
  notes?: string;
}

interface User {
  id: string;
  username: string;
  level: number;
  rank: number;
  division: Division;
  winRate: number;
  totalWins: number;
  totalLosses: number;
  avatar?: string;
}

interface Division {
  name: string;
  tier: number;
  minRank: number;
  maxRank: number;
  color: string;
}

interface ChallengeRewards {
  xp: number;
  rankedPoints: number;
  title?: string;
  badge?: string;
}

interface ChallengeResult {
  winner: string; // userId
  loser?: string; // userId
  winnerPerformance: PerformanceData;
  loserPerformance?: PerformanceData;
  margin: string; // e.g., "15 seconds faster", "23 more reps"
  verified: boolean;
}

interface PerformanceData {
  time?: number; // seconds
  reps?: number;
  weight?: number;
  score?: number;
  completedAt: Date;
}

interface PvPChallengesProps {
  challenges: PvPChallenge[];
  currentUser: User;
  onCreateChallenge: (challenge: Partial<PvPChallenge>) => void;
  onAcceptChallenge: (challengeId: string) => void;
  onDeclineChallenge: (challengeId: string) => void;
  onSubmitPerformance: (challengeId: string, performance: PerformanceData) => void;
  onFindMatch?: () => void;
}

export default function PvPChallenges({
  challenges,
  currentUser,
  onCreateChallenge,
  onAcceptChallenge,
  onDeclineChallenge,
  onSubmitPerformance,
  onFindMatch,
}: PvPChallengesProps) {
  const [view, setView] = useState<'browse' | 'active' | 'history' | 'create'>('browse');
  const [selectedChallenge, setSelectedChallenge] = useState<PvPChallenge | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRanked, setFilterRanked] = useState<string>('all');
  
  // Create Challenge State
  const [newChallengeType, setNewChallengeType] = useState<PvPChallenge['type']>('duel');
  const [newChallengeMode, setNewChallengeMode] = useState<PvPChallenge['mode']>('same-workout');
  const [newChallengeName, setNewChallengeName] = useState('');
  const [newChallengeRanked, setNewChallengeRanked] = useState(false);

  // Performance Submission State
  const [performanceTime, setPerformanceTime] = useState('');
  const [performanceReps, setPerformanceReps] = useState('');
  const [performanceWeight, setPerformanceWeight] = useState('');

  // Divisions
  const divisions: Division[] = [
    { name: 'Bronze', tier: 1, minRank: 0, maxRank: 999, color: '#CD7F32' },
    { name: 'Silver', tier: 2, minRank: 1000, maxRank: 1499, color: '#C0C0C0' },
    { name: 'Gold', tier: 3, minRank: 1500, maxRank: 1999, color: '#FFD700' },
    { name: 'Platinum', tier: 4, minRank: 2000, maxRank: 2499, color: '#E5E4E2' },
    { name: 'Diamond', tier: 5, minRank: 2500, maxRank: 2999, color: '#B9F2FF' },
    { name: 'Master', tier: 6, minRank: 3000, maxRank: 3499, color: '#9B59B6' },
    { name: 'Grandmaster', tier: 7, minRank: 3500, maxRank: 9999, color: '#FF6B6B' },
  ];

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    const typeMatch = filterType === 'all' || challenge.type === filterType;
    const rankedMatch = filterRanked === 'all' || 
                        (filterRanked === 'ranked' && challenge.ranked) || 
                        (filterRanked === 'casual' && !challenge.ranked);
    return typeMatch && rankedMatch;
  });

  // Separate challenges by status
  const pendingChallenges = filteredChallenges.filter(c => 
    c.status === 'pending' && (c.opponent?.id === currentUser.id || c.creator.id === currentUser.id)
  );
  const activeChallenges = filteredChallenges.filter(c => 
    c.status === 'active' && (c.opponent?.id === currentUser.id || c.creator.id === currentUser.id)
  );
  const availableChallenges = filteredChallenges.filter(c => 
    c.status === 'pending' && !c.opponent && c.creator.id !== currentUser.id
  );
  const completedChallenges = filteredChallenges.filter(c => c.status === 'completed');

  const handleCreateChallenge = () => {
    if (!newChallengeName.trim()) {
      alert('Please enter a challenge name');
      return;
    }

    const newChallenge: Partial<PvPChallenge> = {
      type: newChallengeType,
      mode: newChallengeMode,
      name: newChallengeName,
      ranked: newChallengeRanked,
      status: 'pending',
      victoryCondition: 'fastest-time',
      workout: {
        exercises: [
          { name: 'Burpees', reps: 50, notes: 'Chest to ground, full hip extension' },
          { name: 'Pull-Ups', reps: 25, notes: 'Chin over bar' },
          { name: 'Push-Ups', reps: 50, notes: 'Chest to ground' },
        ],
        objective: 'Complete all reps as fast as possible',
        format: 'For Time',
      },
      rewards: {
        xp: newChallengeRanked ? 2000 : 1000,
        rankedPoints: newChallengeRanked ? 50 : 0,
      },
    };

    onCreateChallenge(newChallenge);
    setNewChallengeName('');
    setView('browse');
  };

  const handleSubmitPerformance = (challengeId: string) => {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const performance: PerformanceData = {
      completedAt: new Date(),
    };

    if (challenge.victoryCondition === 'fastest-time' && performanceTime) {
      performance.time = parseFloat(performanceTime);
    }
    if (challenge.victoryCondition === 'most-reps' && performanceReps) {
      performance.reps = parseInt(performanceReps);
    }
    if (challenge.victoryCondition === 'heaviest-weight' && performanceWeight) {
      performance.weight = parseFloat(performanceWeight);
    }

    onSubmitPerformance(challengeId, performance);
    setPerformanceTime('');
    setPerformanceReps('');
    setPerformanceWeight('');
    setSelectedChallenge(null);
  };

  const getDivisionBadge = (division: Division) => {
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: division.color + '40', color: division.color }}
      >
        {division.name}
      </span>
    );
  };

  const getChallengeTypeIcon = (type: PvPChallenge['type']) => {
    switch (type) {
      case 'duel': return '⚔️';
      case 'tournament': return '🏆';
      case 'team': return '👥';
      case 'async': return '⏱️';
      default: return '🎯';
    }
  };

  const getVictoryConditionLabel = (condition: PvPChallenge['victoryCondition']) => {
    switch (condition) {
      case 'fastest-time': return 'Fastest Time';
      case 'most-reps': return 'Most Reps';
      case 'heaviest-weight': return 'Heaviest Weight';
      case 'best-score': return 'Best Score';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with User Stats */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-6xl">⚔️</div>
            <div>
              <h2 className="text-3xl font-bold text-purple-400">{currentUser.username}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-sm text-white/70">Level {currentUser.level}</div>
                <div>{getDivisionBadge(currentUser.division)}</div>
                <div className="text-sm text-white/70">Rank #{currentUser.rank}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">
              {currentUser.totalWins}W - {currentUser.totalLosses}L
            </div>
            <div className="text-sm text-white/60">
              {currentUser.winRate.toFixed(1)}% Win Rate
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setView('browse')}
          className={`px-6 py-2 rounded-t-lg font-bold transition ${
            view === 'browse'
              ? 'bg-purple-500/30 text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Browse Challenges
        </button>
        <button
          onClick={() => setView('active')}
          className={`px-6 py-2 rounded-t-lg font-bold transition ${
            view === 'active'
              ? 'bg-orange-500/30 text-orange-400 border-b-2 border-orange-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Active Battles ({activeChallenges.length})
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-6 py-2 rounded-t-lg font-bold transition ${
            view === 'history'
              ? 'bg-blue-500/30 text-blue-400 border-b-2 border-blue-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Match History
        </button>
        <button
          onClick={() => setView('create')}
          className={`px-6 py-2 rounded-t-lg font-bold transition ${
            view === 'create'
              ? 'bg-green-500/30 text-green-400 border-b-2 border-green-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Create Challenge
        </button>
      </div>

      {/* Browse Challenges View */}
      {view === 'browse' && (
        <div className="space-y-6">
          {/* Quick Match Button */}
          {onFindMatch && (
            <button
              onClick={onFindMatch}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🎮</span>
              <span className="text-xl">FIND QUICK MATCH</span>
            </button>
          )}

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="all">All Types</option>
              <option value="duel">1v1 Duels</option>
              <option value="tournament">Tournaments</option>
              <option value="team">Team Battles</option>
              <option value="async">Async Challenges</option>
            </select>
            <select
              value={filterRanked}
              onChange={(e) => setFilterRanked(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="all">All Modes</option>
              <option value="ranked">Ranked Only</option>
              <option value="casual">Casual Only</option>
            </select>
          </div>

          {/* Pending Invites */}
          {pendingChallenges.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">⏳ Pending Invites</h3>
              <div className="space-y-3">
                {pendingChallenges.map(challenge => (
                  <div
                    key={challenge.id}
                    className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{getChallengeTypeIcon(challenge.type)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{challenge.name}</h4>
                            {challenge.ranked && (
                              <span className="text-xs bg-red-500/30 text-red-400 px-2 py-1 rounded">
                                RANKED
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/60">
                            Challenge from <span className="text-purple-400">{challenge.creator.username}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAcceptChallenge(challenge.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onDeclineChallenge(challenge.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded transition"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Challenges */}
          <div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">🎯 Available Challenges</h3>
            {availableChallenges.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                <div className="text-5xl mb-4">🏜️</div>
                <p className="text-white/60">No available challenges. Create your own!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableChallenges.map(challenge => (
                  <div
                    key={challenge.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-purple-400/50 transition cursor-pointer"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{getChallengeTypeIcon(challenge.type)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{challenge.name}</h4>
                            {challenge.ranked && (
                              <span className="text-xs bg-red-500/30 text-red-400 px-2 py-1 rounded">
                                RANKED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50">by {challenge.creator.username}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Mode:</span>
                        <span className="text-white capitalize">{challenge.mode.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Win Condition:</span>
                        <span className="text-white">{getVictoryConditionLabel(challenge.victoryCondition)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Rewards:</span>
                        <span className="text-yellow-400">{challenge.rewards.xp} XP</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptChallenge(challenge.id);
                      }}
                      className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded transition"
                    >
                      Accept Challenge
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Battles View */}
      {view === 'active' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-orange-400">🔥 Active Battles</h3>
          {activeChallenges.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">💤</div>
              <p className="text-white/60">No active battles. Accept a challenge to start!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeChallenges.map(challenge => {
                const isCreator = challenge.creator.id === currentUser.id;
                const opponent = isCreator ? challenge.opponent : challenge.creator;
                
                return (
                  <div
                    key={challenge.id}
                    className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-xl font-bold text-white">{challenge.name}</h4>
                          {challenge.ranked && (
                            <span className="text-xs bg-red-500/50 text-red-300 px-2 py-1 rounded">
                              RANKED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/60">{challenge.workout.objective}</p>
                      </div>
                      <div className="text-3xl">{getChallengeTypeIcon(challenge.type)}</div>
                    </div>

                    {/* VS Display */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-lg font-bold text-purple-400">{currentUser.username}</div>
                        <div className="text-sm text-white/60">Level {currentUser.level}</div>
                        <div className="mt-2">{getDivisionBadge(currentUser.division)}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="text-4xl font-bold text-red-400">VS</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-lg font-bold text-pink-400">{opponent?.username}</div>
                        <div className="text-sm text-white/60">Level {opponent?.level}</div>
                        <div className="mt-2">{opponent && getDivisionBadge(opponent.division)}</div>
                      </div>
                    </div>

                    {/* Workout Details */}
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-white mb-3">Workout:</h5>
                      <div className="space-y-2">
                        {challenge.workout.exercises.map((ex, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-orange-400">•</span>
                            <span className="text-white">
                              {ex.name}: {ex.sets && `${ex.sets} sets x `}
                              {ex.reps && `${ex.reps} reps`}
                              {ex.weight && ` @ ${ex.weight} lbs`}
                              {ex.time && ` for ${ex.time} seconds`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Performance */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-bold text-white mb-3">Submit Your Performance:</h5>
                      <div className="space-y-3">
                        {challenge.victoryCondition === 'fastest-time' && (
                          <div>
                            <label className="block text-sm text-white/70 mb-1">Time (seconds):</label>
                            <input
                              type="number"
                              value={performanceTime}
                              onChange={(e) => setPerformanceTime(e.target.value)}
                              placeholder="e.g., 325"
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                            />
                          </div>
                        )}
                        {challenge.victoryCondition === 'most-reps' && (
                          <div>
                            <label className="block text-sm text-white/70 mb-1">Total Reps:</label>
                            <input
                              type="number"
                              value={performanceReps}
                              onChange={(e) => setPerformanceReps(e.target.value)}
                              placeholder="e.g., 150"
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                            />
                          </div>
                        )}
                        {challenge.victoryCondition === 'heaviest-weight' && (
                          <div>
                            <label className="block text-sm text-white/70 mb-1">Weight (lbs):</label>
                            <input
                              type="number"
                              value={performanceWeight}
                              onChange={(e) => setPerformanceWeight(e.target.value)}
                              placeholder="e.g., 315"
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                            />
                          </div>
                        )}
                        <button
                          onClick={() => handleSubmitPerformance(challenge.id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition"
                        >
                          Submit Performance
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Match History View */}
      {view === 'history' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-blue-400">📜 Match History</h3>
          {completedChallenges.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-white/60">No completed matches yet. Start battling!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedChallenges.map(challenge => {
                const isWinner = challenge.result?.winner === currentUser.id;
                const opponent = challenge.creator.id === currentUser.id ? challenge.opponent : challenge.creator;
                
                return (
                  <div
                    key={challenge.id}
                    className={`border rounded-lg p-4 ${
                      isWinner
                        ? 'bg-green-500/10 border-green-400/30'
                        : 'bg-red-500/10 border-red-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{isWinner ? '🏆' : '💀'}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{challenge.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${
                              isWinner ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                            }`}>
                              {isWinner ? 'VICTORY' : 'DEFEAT'}
                            </span>
                          </div>
                          <p className="text-sm text-white/60">
                            vs <span className="text-purple-400">{opponent?.username}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white/70">
                          {isWinner ? '+' : ''}{challenge.rewards.xp} XP
                        </div>
                        {challenge.ranked && (
                          <div className="text-xs text-white/50">
                            {isWinner ? '+' : '-'}{challenge.rewards.rankedPoints} RP
                          </div>
                        )}
                      </div>
                    </div>
                    {challenge.result && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-sm text-white/60">
                          Won by <span className="text-yellow-400">{challenge.result.margin}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Challenge View */}
      {view === 'create' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-green-400">⚡ Create New Challenge</h3>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            {/* Challenge Name */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">Challenge Name:</label>
              <input
                type="text"
                value={newChallengeName}
                onChange={(e) => setNewChallengeName(e.target.value)}
                placeholder="e.g., Friday Night Fight"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>

            {/* Challenge Type */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">Challenge Type:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['duel', 'tournament', 'team', 'async'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setNewChallengeType(type)}
                    className={`p-3 rounded-lg border-2 transition ${
                      newChallengeType === type
                        ? 'bg-purple-500/30 border-purple-400'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getChallengeTypeIcon(type)}</div>
                    <div className="text-xs text-white capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Challenge Mode */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">Workout Mode:</label>
              <select
                value={newChallengeMode}
                onChange={(e) => setNewChallengeMode(e.target.value as PvPChallenge['mode'])}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="same-workout">Same Workout</option>
                <option value="scaled">Scaled Workout</option>
                <option value="open">Open Format</option>
                <option value="benchmark">Benchmark Battle</option>
              </select>
            </div>

            {/* Ranked Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ranked"
                checked={newChallengeRanked}
                onChange={(e) => setNewChallengeRanked(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="ranked" className="text-white">
                <span className="font-bold">Ranked Match</span>
                <span className="text-sm text-white/60 ml-2">(Affects division ranking)</span>
              </label>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateChallenge}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition"
            >
              Create Challenge
            </button>
          </div>

          {/* Challenge Types Guide */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h4 className="font-bold text-white mb-4">Challenge Types Explained:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-bold text-purple-400">⚔️ 1v1 Duel:</span>
                <span className="text-white/70 ml-2">Direct head-to-head battle with one opponent</span>
              </div>
              <div>
                <span className="font-bold text-yellow-400">🏆 Tournament:</span>
                <span className="text-white/70 ml-2">Bracket-style competition with multiple rounds</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">👥 Team Battle:</span>
                <span className="text-white/70 ml-2">Squad vs squad collaborative challenges</span>
              </div>
              <div>
                <span className="font-bold text-green-400">⏱️ Async Challenge:</span>
                <span className="text-white/70 ml-2">Compete on your own schedule, results compared later</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Detail Modal (if selected) */}
      {selectedChallenge && view === 'browse' && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedChallenge(null)}
        >
          <div 
            className="bg-gray-900 border border-purple-400/30 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getChallengeTypeIcon(selectedChallenge.type)}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedChallenge.name}</h3>
                  <p className="text-sm text-white/60">by {selectedChallenge.creator.username}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">Workout Details:</h4>
                <p className="text-sm text-white/70 mb-3">{selectedChallenge.workout.objective}</p>
                <div className="space-y-2">
                  {selectedChallenge.workout.exercises.map((ex, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-purple-400">•</span>
                      <span className="text-white">
                        {ex.name}: {ex.sets && `${ex.sets} sets x `}
                        {ex.reps && `${ex.reps} reps`}
                        {ex.weight && ` @ ${ex.weight} lbs`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 mb-1">Type:</div>
                  <div className="text-white capitalize">{selectedChallenge.type}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 mb-1">Mode:</div>
                  <div className="text-white capitalize">{selectedChallenge.mode.replace('-', ' ')}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 mb-1">Win Condition:</div>
                  <div className="text-white">{getVictoryConditionLabel(selectedChallenge.victoryCondition)}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 mb-1">Rewards:</div>
                  <div className="text-yellow-400">{selectedChallenge.rewards.xp} XP</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onAcceptChallenge(selectedChallenge.id);
                  setSelectedChallenge(null);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition"
              >
                Accept Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
