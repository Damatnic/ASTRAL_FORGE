'use client';

import { useState, useEffect, useCallback } from 'react';

type ChallengeType = 'amrap' | 'speedrun' | 'volume';
type DifficultyTier = 'beginner' | 'intermediate' | 'advanced' | 'elite';
type ChallengeCategory = 'cardio' | 'strength' | 'endurance' | 'hybrid';

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: DifficultyTier;
  icon: string;
  exercises: ChallengeExercise[];
  timeLimit?: number; // seconds for AMRAP
  targetTime?: number; // seconds for speed run
  targetVolume?: number; // total reps/weight for volume
  xpReward: number;
  featured?: boolean;
}

interface ChallengeExercise {
  name: string;
  reps?: number;
  rounds?: number;
  weight?: number;
}

interface ChallengeAttempt {
  challengeId: string;
  completedAt: string;
  performance: number; // reps for AMRAP, seconds for speedrun, volume for volume
  rank?: number;
}

interface PersonalBest {
  challengeId: string;
  performance: number;
  date: string;
}

interface ChallengeModesProps {
  challenges: Challenge[];
  personalBests: PersonalBest[];
  recentAttempts: ChallengeAttempt[];
  onStartChallenge: (challengeId: string) => void;
  onCompleteChallenge: (challengeId: string, performance: number) => void;
}

export default function ChallengeModes({
  challenges,
  personalBests,
  recentAttempts,
  onStartChallenge,
  onCompleteChallenge,
}: ChallengeModesProps) {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ChallengeType | 'all'>('all');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && activeChallenge) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          // For AMRAP, count up to time limit
          if (activeChallenge.type === 'amrap' && activeChallenge.timeLimit) {
            if (prev >= activeChallenge.timeLimit) {
              setIsRunning(false);
              handleChallengeComplete();
              return prev;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, activeChallenge]);

  const handleChallengeComplete = useCallback(() => {
    if (!activeChallenge) return;
    
    let performance = 0;
    if (activeChallenge.type === 'amrap') {
      performance = currentReps;
    } else if (activeChallenge.type === 'speedrun') {
      performance = elapsedTime;
    } else if (activeChallenge.type === 'volume') {
      performance = currentVolume;
    }
    
    onCompleteChallenge(activeChallenge.id, performance);
    setActiveChallenge(null);
    setIsRunning(false);
    setElapsedTime(0);
    setCurrentReps(0);
    setCurrentVolume(0);
  }, [activeChallenge, currentReps, elapsedTime, currentVolume, onCompleteChallenge]);

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setElapsedTime(0);
    setCurrentReps(0);
    setCurrentVolume(0);
    setIsRunning(true);
    onStartChallenge(challenge.id);
  };

  const stopChallenge = () => {
    setIsRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: DifficultyTier): string => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-amber-500';
      case 'advanced': return 'from-orange-500 to-red-500';
      case 'elite': return 'from-purple-500 to-pink-500';
    }
  };

  const getDifficultyBadge = (difficulty: DifficultyTier): string => {
    switch (difficulty) {
      case 'beginner': return '⭐';
      case 'intermediate': return '⭐⭐';
      case 'advanced': return '⭐⭐⭐';
      case 'elite': return '💎';
    }
  };

  const getCategoryIcon = (category: ChallengeCategory): string => {
    switch (category) {
      case 'cardio': return '🏃';
      case 'strength': return '💪';
      case 'endurance': return '⚡';
      case 'hybrid': return '🔥';
    }
  };

  const getTypeIcon = (type: ChallengeType): string => {
    switch (type) {
      case 'amrap': return '⏱️';
      case 'speedrun': return '🚀';
      case 'volume': return '📊';
    }
  };

  const getPersonalBest = (challengeId: string): PersonalBest | undefined => {
    return personalBests.find(pb => pb.challengeId === challengeId);
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedCategory !== 'all' && challenge.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && challenge.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'all' && challenge.type !== selectedType) return false;
    return true;
  });

  const featuredChallenges = challenges.filter(c => c.featured);

  // Active Challenge View
  if (activeChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Challenge Header */}
          <div className={`bg-gradient-to-r ${getDifficultyColor(activeChallenge.difficulty)} rounded-lg p-8 mb-6 text-center`}>
            <div className="text-6xl mb-4">{activeChallenge.icon}</div>
            <h1 className="text-4xl font-bold text-white mb-2">{activeChallenge.name}</h1>
            <p className="text-xl text-white/90">{activeChallenge.description}</p>
          </div>

          {/* Timer Display */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-12 mb-6 text-center">
            <div className="text-8xl font-bold text-white mb-4">
              {formatTime(elapsedTime)}
            </div>
            
            {activeChallenge.type === 'amrap' && activeChallenge.timeLimit && (
              <div className="text-2xl text-white/70 mb-6">
                Time Remaining: {formatTime(activeChallenge.timeLimit - elapsedTime)}
              </div>
            )}

            {/* Progress Indicators */}
            {activeChallenge.type === 'amrap' && (
              <div className="mb-6">
                <div className="text-6xl font-bold text-green-400 mb-2">{currentReps}</div>
                <div className="text-xl text-white/70">Reps Completed</div>
              </div>
            )}

            {activeChallenge.type === 'speedrun' && activeChallenge.targetTime && (
              <div className="mb-6">
                <div className="text-xl text-white/70 mb-2">Target Time: {formatTime(activeChallenge.targetTime)}</div>
                <div className={`text-2xl font-bold ${
                  elapsedTime <= activeChallenge.targetTime ? 'text-green-400' : 'text-red-400'
                }`}>
                  {elapsedTime <= activeChallenge.targetTime ? '✅ On Pace!' : '⚠️ Behind Target'}
                </div>
              </div>
            )}

            {activeChallenge.type === 'volume' && activeChallenge.targetVolume && (
              <div className="mb-6">
                <div className="text-6xl font-bold text-blue-400 mb-2">
                  {currentVolume} / {activeChallenge.targetVolume}
                </div>
                <div className="text-xl text-white/70 mb-4">Total Reps</div>
                <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                    style={{ width: `${Math.min((currentVolume / activeChallenge.targetVolume) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4 justify-center">
              {activeChallenge.type === 'amrap' && (
                <button
                  onClick={() => setCurrentReps(prev => prev + 1)}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold text-2xl hover:scale-105 transition-transform"
                  disabled={!isRunning}
                >
                  + Add Rep
                </button>
              )}

              {activeChallenge.type === 'volume' && (
                <>
                  <button
                    onClick={() => setCurrentVolume(prev => prev + 1)}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold hover:scale-105 transition-transform"
                    disabled={!isRunning}
                  >
                    + 1 Rep
                  </button>
                  <button
                    onClick={() => setCurrentVolume(prev => prev + 10)}
                    className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:scale-105 transition-transform"
                    disabled={!isRunning}
                  >
                    + 10 Reps
                  </button>
                </>
              )}

              <button
                onClick={isRunning ? stopChallenge : () => setIsRunning(true)}
                className={`px-8 py-4 rounded-lg font-bold text-xl hover:scale-105 transition-transform ${
                  isRunning
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
              >
                {isRunning ? '⏸️ Pause' : '▶️ Resume'}
              </button>

              <button
                onClick={handleChallengeComplete}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg font-bold text-xl hover:scale-105 transition-transform"
              >
                ✅ Complete
              </button>

              <button
                onClick={() => {
                  setActiveChallenge(null);
                  setIsRunning(false);
                  setElapsedTime(0);
                  setCurrentReps(0);
                  setCurrentVolume(0);
                }}
                className="px-6 py-4 bg-white/10 border border-white/20 rounded-lg font-bold hover:bg-white/20 transition-colors"
              >
                ❌ Quit
              </button>
            </div>
          </div>

          {/* Exercise List */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Workout Protocol</h3>
            <div className="space-y-3">
              {activeChallenge.exercises.map((exercise, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-white/60">#{index + 1}</div>
                    <div>
                      <div className="text-lg font-bold text-white">{exercise.name}</div>
                      {exercise.reps && <div className="text-sm text-white/60">{exercise.reps} reps</div>}
                      {exercise.rounds && <div className="text-sm text-white/60">{exercise.rounds} rounds</div>}
                      {exercise.weight && <div className="text-sm text-white/60">{exercise.weight} lbs</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Challenge Selection View
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-4">🔍 Filter Challenges</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ChallengeCategory | 'all')}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Categories</option>
              <option value="cardio">🏃 Cardio Crusher</option>
              <option value="strength">💪 Strength Sprint</option>
              <option value="endurance">⚡ Endurance Gauntlet</option>
              <option value="hybrid">🔥 Hybrid Hero</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyTier | 'all')}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">⭐ Beginner</option>
              <option value="intermediate">⭐⭐ Intermediate</option>
              <option value="advanced">⭐⭐⭐ Advanced</option>
              <option value="elite">💎 Elite</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Challenge Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ChallengeType | 'all')}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Types</option>
              <option value="amrap">⏱️ AMRAP</option>
              <option value="speedrun">🚀 Speed Run</option>
              <option value="volume">📊 Volume Challenge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Challenges */}
      {featuredChallenges.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">⭐ Featured Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredChallenges.map((challenge) => {
              const pb = getPersonalBest(challenge.id);
              
              return (
                <div
                  key={challenge.id}
                  className={`bg-gradient-to-br ${getDifficultyColor(challenge.difficulty)} rounded-lg p-6 border-2 border-yellow-400/50`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-5xl">{challenge.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{challenge.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">{getCategoryIcon(challenge.category)}</span>
                          <span className="text-sm">{getTypeIcon(challenge.type)}</span>
                          <span className="text-sm">{getDifficultyBadge(challenge.difficulty)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/90 mb-4">{challenge.description}</p>

                  {/* Challenge Details */}
                  <div className="bg-black/30 rounded-lg p-4 mb-4 space-y-2">
                    {challenge.type === 'amrap' && (
                      <div className="text-sm text-white/80">
                        ⏱️ Complete as many reps as possible in {formatTime(challenge.timeLimit || 0)}
                      </div>
                    )}
                    {challenge.type === 'speedrun' && (
                      <div className="text-sm text-white/80">
                        🚀 Complete workout as fast as possible (Target: {formatTime(challenge.targetTime || 0)})
                      </div>
                    )}
                    {challenge.type === 'volume' && (
                      <div className="text-sm text-white/80">
                        📊 Hit {challenge.targetVolume} total reps this session
                      </div>
                    )}
                    <div className="text-sm text-yellow-400 font-bold">
                      💰 Reward: {challenge.xpReward} XP
                    </div>
                  </div>

                  {/* Personal Best */}
                  {pb && (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4">
                      <div className="text-sm text-green-400 font-bold">
                        🏆 Personal Best: {
                          challenge.type === 'amrap' ? `${pb.performance} reps` :
                          challenge.type === 'speedrun' ? formatTime(pb.performance) :
                          `${pb.performance} total volume`
                        }
                      </div>
                      <div className="text-xs text-white/60">{pb.date}</div>
                    </div>
                  )}

                  <button
                    onClick={() => startChallenge(challenge)}
                    className="w-full px-6 py-3 bg-white text-black rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    🎯 Start Challenge
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Challenges */}
      <div>
        <h2 className="text-3xl font-bold text-purple-400 mb-4">
          🎮 All Challenges ({filteredChallenges.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge) => {
            const pb = getPersonalBest(challenge.id);
            
            return (
              <div
                key={challenge.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-purple-400/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{challenge.icon}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getCategoryIcon(challenge.category)}</span>
                    <span className="text-lg">{getTypeIcon(challenge.type)}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{challenge.name}</h3>
                <p className="text-sm text-white/70 mb-3">{challenge.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} rounded-full text-xs font-bold text-white`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold">
                    {challenge.xpReward} XP
                  </span>
                </div>

                {pb && (
                  <div className="bg-green-500/10 border border-green-400/20 rounded p-2 mb-3">
                    <div className="text-xs text-green-400 font-bold">
                      PB: {
                        challenge.type === 'amrap' ? `${pb.performance} reps` :
                        challenge.type === 'speedrun' ? formatTime(pb.performance) :
                        `${pb.performance} volume`
                      }
                    </div>
                  </div>
                )}

                <button
                  onClick={() => startChallenge(challenge)}
                  className={`w-full px-4 py-2 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} rounded-lg font-bold text-sm hover:scale-105 transition-transform`}
                >
                  Start Challenge
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attempts */}
      {recentAttempts.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-pink-400 mb-4">📈 Recent Attempts</h2>
          <div className="space-y-3">
            {recentAttempts.slice(0, 5).map((attempt, index) => {
              const challenge = challenges.find(c => c.id === attempt.challengeId);
              if (!challenge) return null;

              return (
                <div key={index} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{challenge.icon}</div>
                    <div>
                      <div className="font-bold text-white">{challenge.name}</div>
                      <div className="text-sm text-white/60">{attempt.completedAt}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">
                      {challenge.type === 'amrap' ? `${attempt.performance} reps` :
                       challenge.type === 'speedrun' ? formatTime(attempt.performance) :
                       `${attempt.performance} volume`}
                    </div>
                    {attempt.rank && (
                      <div className="text-sm text-yellow-400">#{attempt.rank} Global</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
