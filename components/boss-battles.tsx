'use client';

import { useState } from 'react';

type BossType = 'strength' | 'circuit' | 'endurance' | 'hybrid';
type BossDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'elite';

interface BossPhase {
  healthThreshold: number;
  modifier: string;
  description: string;
}

interface Boss {
  id: string;
  name: string;
  title: string;
  type: BossType;
  difficulty: BossDifficulty;
  icon: string;
  description: string;
  lore: string;
  maxHealth: number;
  enrageTimer?: number; // seconds
  phases: BossPhase[];
  workout: BossWorkout;
  rewards: BossRewards;
  recommendedLevel: number;
  unlocked?: boolean;
}

interface BossWorkout {
  exercises: BossExercise[];
  objective: string;
  targetPerformance: number; // Varies by type: weight for strength, time for circuit, etc.
}

interface BossExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  time?: number;
  notes?: string;
}

interface BossRewards {
  xp: number;
  title?: string;
  badge: string;
  leaderboardPoints: number;
}

interface BossAttempt {
  bossId: string;
  date: string;
  performance: number;
  victory: boolean;
  damageDealt: number;
}

interface BossBattlesProps {
  bosses: Boss[];
  attempts: BossAttempt[];
  userLevel: number;
  onStartBattle: (bossId: string) => void;
  onCompleteBattle: (bossId: string, performance: number, victory: boolean) => void;
}

export default function BossBattles({
  bosses,
  attempts,
  userLevel,
  onStartBattle,
  onCompleteBattle,
}: BossBattlesProps) {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [inBattle, setInBattle] = useState(false);
  const [currentHealth, setCurrentHealth] = useState(100);
  const [currentPerformance, setCurrentPerformance] = useState(0);
  const [battlePhase, setBattlePhase] = useState(0);

  const getDifficultyColor = (difficulty: BossDifficulty): string => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-amber-500';
      case 'advanced': return 'from-orange-500 to-red-500';
      case 'elite': return 'from-purple-500 via-pink-500 to-red-500';
    }
  };

  const getTypeIcon = (type: BossType): string => {
    switch (type) {
      case 'strength': return '⚔️';
      case 'circuit': return '🔥';
      case 'endurance': return '🐉';
      case 'hybrid': return '👹';
    }
  };

  const getTypeColor = (type: BossType): string => {
    switch (type) {
      case 'strength': return 'text-red-400';
      case 'circuit': return 'text-orange-400';
      case 'endurance': return 'text-blue-400';
      case 'hybrid': return 'text-purple-400';
    }
  };

  const getBossAttempts = (bossId: string): BossAttempt[] => {
    return attempts.filter(a => a.bossId === bossId);
  };

  const getBestPerformance = (bossId: string): number => {
    const bossAttempts = getBossAttempts(bossId);
    if (bossAttempts.length === 0) return 0;
    return Math.max(...bossAttempts.map(a => a.performance));
  };

  const hasDefeated = (bossId: string): boolean => {
    return attempts.some(a => a.bossId === bossId && a.victory);
  };

  const startBattle = (boss: Boss) => {
    setSelectedBoss(boss);
    setInBattle(true);
    setCurrentHealth(100);
    setCurrentPerformance(0);
    setBattlePhase(0);
    onStartBattle(boss.id);
  };

  const updatePerformance = (value: number) => {
    if (!selectedBoss) return;
    
    setCurrentPerformance(value);
    
    // Calculate damage dealt (percentage of target performance)
    const damagePercent = Math.min((value / selectedBoss.workout.targetPerformance) * 100, 100);
    const remainingHealth = 100 - damagePercent;
    setCurrentHealth(remainingHealth);
    
    // Update battle phase based on health
    if (remainingHealth <= 25 && battlePhase < 3) {
      setBattlePhase(3);
    } else if (remainingHealth <= 50 && battlePhase < 2) {
      setBattlePhase(2);
    } else if (remainingHealth <= 75 && battlePhase < 1) {
      setBattlePhase(1);
    }
  };

  const completeBattle = () => {
    if (!selectedBoss) return;
    
    const victory = currentHealth <= 0;
    onCompleteBattle(selectedBoss.id, currentPerformance, victory);
    
    // Show result screen (in production, this would be a modal/separate view)
    if (victory) {
      alert(`🏆 VICTORY! You defeated ${selectedBoss.name}!\n\nRewards:\n+${selectedBoss.rewards.xp} XP\n${selectedBoss.rewards.badge}\n${selectedBoss.rewards.title || ''}`);
    } else {
      alert(`💀 DEFEAT! ${selectedBoss.name} was too powerful!\n\nTry again to claim victory!`);
    }
    
    setInBattle(false);
    setSelectedBoss(null);
  };

  // Pre-Battle Screen
  if (selectedBoss && !inBattle) {
    const bossAttempts = getBossAttempts(selectedBoss.id);
    const bestPerformance = getBestPerformance(selectedBoss.id);
    const defeated = hasDefeated(selectedBoss.id);

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Boss Header */}
          <div className={`bg-gradient-to-r ${getDifficultyColor(selectedBoss.difficulty)} rounded-lg p-8 mb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-8xl">{selectedBoss.icon}</div>
                  <div>
                    <div className="text-sm text-white/80 mb-1">{selectedBoss.title}</div>
                    <h1 className="text-5xl font-bold text-white mb-2">{selectedBoss.name}</h1>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${getTypeColor(selectedBoss.type)}`}>
                        {getTypeIcon(selectedBoss.type)}
                      </span>
                      <span className="text-xl text-white/90">Level {selectedBoss.recommendedLevel}</span>
                      {defeated && (
                        <span className="px-3 py-1 bg-green-500/30 border border-green-400 rounded-full text-sm font-bold text-green-400">
                          ✅ DEFEATED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBoss(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ← Back
                </button>
              </div>

              <p className="text-xl text-white/90 italic mb-4">"{selectedBoss.lore}"</p>
              <p className="text-white/80">{selectedBoss.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Boss Stats */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-400 mb-4">⚔️ Boss Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Health Points</span>
                  <span className="text-xl font-bold text-red-400">{selectedBoss.maxHealth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Difficulty</span>
                  <span className="text-xl font-bold capitalize">{selectedBoss.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Recommended Level</span>
                  <span className={`text-xl font-bold ${userLevel >= selectedBoss.recommendedLevel ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedBoss.recommendedLevel}
                  </span>
                </div>
                {selectedBoss.enrageTimer && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Enrage Timer</span>
                    <span className="text-xl font-bold text-orange-400">
                      {Math.floor(selectedBoss.enrageTimer / 60)}:{(selectedBoss.enrageTimer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Your Stats */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">🛡️ Your Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Your Level</span>
                  <span className={`text-xl font-bold ${userLevel >= selectedBoss.recommendedLevel ? 'text-green-400' : 'text-yellow-400'}`}>
                    {userLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Attempts</span>
                  <span className="text-xl font-bold text-white">{bossAttempts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Best Performance</span>
                  <span className="text-xl font-bold text-purple-400">{bestPerformance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Victory Status</span>
                  <span className={`text-xl font-bold ${defeated ? 'text-green-400' : 'text-red-400'}`}>
                    {defeated ? '✅ Defeated' : '❌ Undefeated'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Workout Details */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">📋 Battle Objective</h2>
            <p className="text-xl text-white/90 mb-4">{selectedBoss.workout.objective}</p>
            
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <div className="text-lg font-bold text-green-400 mb-2">
                Target Performance: {selectedBoss.workout.targetPerformance}
              </div>
              <div className="text-sm text-white/70">
                Defeat the boss by reaching or exceeding this target!
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">Exercise Protocol:</h3>
            <div className="space-y-3">
              {selectedBoss.workout.exercises.map((exercise, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-white/60">#{index + 1}</div>
                    <div>
                      <div className="text-lg font-bold text-white">{exercise.name}</div>
                      <div className="text-sm text-white/60">
                        {exercise.sets && `${exercise.sets} sets`}
                        {exercise.reps && ` × ${exercise.reps} reps`}
                        {exercise.weight && ` @ ${exercise.weight} lbs`}
                        {exercise.time && ` for ${exercise.time} seconds`}
                      </div>
                      {exercise.notes && (
                        <div className="text-xs text-white/50 mt-1">{exercise.notes}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boss Phases */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">⚡ Boss Phases</h2>
            <div className="space-y-3">
              {selectedBoss.phases.map((phase, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">
                      {index === 0 && '😠'}
                      {index === 1 && '😡'}
                      {index === 2 && '🤬'}
                      {index === 3 && '💀'}
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        Phase {index + 1} ({phase.healthThreshold}% HP)
                      </div>
                      <div className="text-sm text-orange-400">{phase.modifier}</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🏆 Victory Rewards</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-green-400">{selectedBoss.rewards.xp}</div>
                <div className="text-sm text-white/60">XP</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{selectedBoss.rewards.badge}</div>
                <div className="text-sm text-white/80">Victory Badge</div>
              </div>
              {selectedBoss.rewards.title && (
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">👑</div>
                  <div className="text-sm text-white/80">{selectedBoss.rewards.title}</div>
                </div>
              )}
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-purple-400">{selectedBoss.rewards.leaderboardPoints}</div>
                <div className="text-sm text-white/60">Leaderboard Pts</div>
              </div>
            </div>
          </div>

          {/* Start Battle Button */}
          <button
            onClick={() => startBattle(selectedBoss)}
            disabled={userLevel < selectedBoss.recommendedLevel}
            className={`w-full py-6 rounded-lg font-bold text-2xl transition-all ${
              userLevel < selectedBoss.recommendedLevel
                ? 'bg-gray-600 cursor-not-allowed'
                : `bg-gradient-to-r ${getDifficultyColor(selectedBoss.difficulty)} hover:scale-105`
            }`}
          >
            {userLevel < selectedBoss.recommendedLevel
              ? `⚠️ Level ${selectedBoss.recommendedLevel} Required`
              : '⚔️ ENGAGE BOSS BATTLE'}
          </button>
        </div>
      </div>
    );
  }

  // Active Battle Screen
  if (inBattle && selectedBoss) {
    const currentPhase = selectedBoss.phases[battlePhase];
    
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-red-900/20 to-black">
        <div className="max-w-6xl mx-auto">
          {/* Boss Info */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{selectedBoss.icon}</div>
            <h1 className="text-4xl font-bold text-white mb-1">{selectedBoss.name}</h1>
            <div className="text-lg text-white/70">{selectedBoss.title}</div>
          </div>

          {/* Boss Health Bar */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-red-400">Boss Health</span>
              <span className="text-2xl font-bold text-white">{currentHealth.toFixed(1)}%</span>
            </div>
            <div className="relative h-8 bg-black/50 rounded-full overflow-hidden border-2 border-red-400">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                style={{ width: `${currentHealth}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {currentHealth > 0 ? `${currentHealth.toFixed(0)}% HP` : 'DEFEATED!'}
              </div>
            </div>
          </div>

          {/* Current Phase */}
          {currentPhase && (
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {battlePhase === 0 && '😠'}
                  {battlePhase === 1 && '😡'}
                  {battlePhase === 2 && '🤬'}
                  {battlePhase === 3 && '💀'}
                </div>
                <div>
                  <div className="font-bold text-orange-400">Phase {battlePhase + 1}: {currentPhase.modifier}</div>
                  <div className="text-sm text-white/70">{currentPhase.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tracker */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">Your Performance</h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                value={currentPerformance}
                onChange={(e) => updatePerformance(Number(e.target.value))}
                className="flex-1 px-6 py-4 bg-black/30 border border-white/20 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-green-400"
                placeholder="Enter performance..."
              />
              <div className="text-right">
                <div className="text-sm text-white/60">Target</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {selectedBoss.workout.targetPerformance}
                </div>
              </div>
            </div>

            <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${Math.min((currentPerformance / selectedBoss.workout.targetPerformance) * 100, 100)}%` }}
              />
            </div>

            <div className="mt-4 text-center">
              <div className="text-sm text-white/60 mb-1">Damage Dealt</div>
              <div className="text-4xl font-bold text-red-400">
                {((currentPerformance / selectedBoss.workout.targetPerformance) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={completeBattle}
              className="flex-1 px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold text-2xl hover:scale-105 transition-transform"
            >
              ✅ Complete Battle
            </button>
            <button
              onClick={() => {
                setInBattle(false);
                setSelectedBoss(null);
              }}
              className="px-8 py-6 bg-white/10 border border-white/20 rounded-lg font-bold text-xl hover:bg-white/20 transition-colors"
            >
              ❌ Retreat
            </button>
          </div>

          {/* Workout Protocol Reference */}
          <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-4">📋 Protocol</h3>
            <div className="space-y-2">
              {selectedBoss.workout.exercises.map((exercise, index) => (
                <div key={index} className="text-sm text-white/80">
                  {index + 1}. {exercise.name}
                  {exercise.sets && ` - ${exercise.sets} sets`}
                  {exercise.reps && ` × ${exercise.reps} reps`}
                  {exercise.weight && ` @ ${exercise.weight} lbs`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Boss Selection Screen
  const strengthBosses = bosses.filter(b => b.type === 'strength');
  const circuitBosses = bosses.filter(b => b.type === 'circuit');
  const enduranceBosses = bosses.filter(b => b.type === 'endurance');
  const hybridBosses = bosses.filter(b => b.type === 'hybrid');

  return (
    <div className="space-y-8">
      {/* Strength Titans */}
      {strengthBosses.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">⚔️ Strength Titans</h2>
          <p className="text-white/70 mb-6">Test your raw power with maximum lift challenges</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strengthBosses.map((boss) => {
              const defeated = hasDefeated(boss.id);
              const bestPerf = getBestPerformance(boss.id);
              
              return (
                <div
                  key={boss.id}
                  className={`bg-white/5 backdrop-blur-sm border rounded-lg p-6 hover:border-red-400/50 transition-all cursor-pointer ${
                    defeated ? 'border-green-400/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedBoss(boss)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{boss.icon}</div>
                    {defeated && <div className="text-2xl">✅</div>}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{boss.name}</h3>
                  <div className="text-sm text-white/60 mb-3">{boss.title}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${getDifficultyColor(boss.difficulty)}`}>
                    {boss.difficulty.toUpperCase()}
                  </div>
                  <p className="text-sm text-white/80 mb-4">{boss.description}</p>
                  {bestPerf > 0 && (
                    <div className="bg-purple-500/20 border border-purple-400/30 rounded p-2 text-xs">
                      <span className="text-purple-400 font-bold">Best: {bestPerf}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Circuit Demons */}
      {circuitBosses.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-orange-400 mb-4">🔥 Circuit Demons</h2>
          <p className="text-white/70 mb-6">Survive brutal high-rep conditioning circuits</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circuitBosses.map((boss) => {
              const defeated = hasDefeated(boss.id);
              const bestPerf = getBestPerformance(boss.id);
              
              return (
                <div
                  key={boss.id}
                  className={`bg-white/5 backdrop-blur-sm border rounded-lg p-6 hover:border-orange-400/50 transition-all cursor-pointer ${
                    defeated ? 'border-green-400/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedBoss(boss)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{boss.icon}</div>
                    {defeated && <div className="text-2xl">✅</div>}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{boss.name}</h3>
                  <div className="text-sm text-white/60 mb-3">{boss.title}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${getDifficultyColor(boss.difficulty)}`}>
                    {boss.difficulty.toUpperCase()}
                  </div>
                  <p className="text-sm text-white/80 mb-4">{boss.description}</p>
                  {bestPerf > 0 && (
                    <div className="bg-purple-500/20 border border-purple-400/30 rounded p-2 text-xs">
                      <span className="text-purple-400 font-bold">Best: {bestPerf}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Endurance Dragons */}
      {enduranceBosses.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-blue-400 mb-4">🐉 Endurance Dragons</h2>
          <p className="text-white/70 mb-6">Outlast long-duration tests of mental fortitude</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enduranceBosses.map((boss) => {
              const defeated = hasDefeated(boss.id);
              const bestPerf = getBestPerformance(boss.id);
              
              return (
                <div
                  key={boss.id}
                  className={`bg-white/5 backdrop-blur-sm border rounded-lg p-6 hover:border-blue-400/50 transition-all cursor-pointer ${
                    defeated ? 'border-green-400/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedBoss(boss)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{boss.icon}</div>
                    {defeated && <div className="text-2xl">✅</div>}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{boss.name}</h3>
                  <div className="text-sm text-white/60 mb-3">{boss.title}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${getDifficultyColor(boss.difficulty)}`}>
                    {boss.difficulty.toUpperCase()}
                  </div>
                  <p className="text-sm text-white/80 mb-4">{boss.description}</p>
                  {bestPerf > 0 && (
                    <div className="bg-purple-500/20 border border-purple-400/30 rounded p-2 text-xs">
                      <span className="text-purple-400 font-bold">Best: {bestPerf}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hybrid Monsters */}
      {hybridBosses.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-purple-400 mb-4">👹 Hybrid Monsters</h2>
          <p className="text-white/70 mb-6">Conquer mixed modality gauntlets that test everything</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hybridBosses.map((boss) => {
              const defeated = hasDefeated(boss.id);
              const bestPerf = getBestPerformance(boss.id);
              
              return (
                <div
                  key={boss.id}
                  className={`bg-white/5 backdrop-blur-sm border rounded-lg p-6 hover:border-purple-400/50 transition-all cursor-pointer ${
                    defeated ? 'border-green-400/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedBoss(boss)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{boss.icon}</div>
                    {defeated && <div className="text-2xl">✅</div>}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{boss.name}</h3>
                  <div className="text-sm text-white/60 mb-3">{boss.title}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${getDifficultyColor(boss.difficulty)}`}>
                    {boss.difficulty.toUpperCase()}
                  </div>
                  <p className="text-sm text-white/80 mb-4">{boss.description}</p>
                  {bestPerf > 0 && (
                    <div className="bg-purple-500/20 border border-purple-400/30 rounded p-2 text-xs">
                      <span className="text-purple-400 font-bold">Best: {bestPerf}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
