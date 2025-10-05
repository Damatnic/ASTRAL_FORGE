'use client';

import { useState } from 'react';
import BossBattles from '@/components/boss-battles';

export default function BossesPage() {
  const userLevel = 25; // Sample user level

  // Sample boss battles
  const sampleBosses = [
    // STRENGTH TITANS (3 bosses)
    {
      id: 'iron-colossus',
      name: 'Iron Colossus',
      title: 'The Unmovable Mountain',
      type: 'strength' as const,
      difficulty: 'beginner' as const,
      icon: '🗿',
      description: 'Test your raw pulling power against this titan of deadlifts',
      lore: 'No weight is too heavy for one who believes in their strength.',
      maxHealth: 100,
      recommendedLevel: 10,
      phases: [
        { healthThreshold: 100, modifier: 'Warm-Up Phase', description: 'The Colossus observes your technique' },
        { healthThreshold: 75, modifier: 'Power Phase', description: 'The weight feels heavier now' },
        { healthThreshold: 50, modifier: 'Grind Phase', description: 'Your grip is tested to its limits' },
        { healthThreshold: 25, modifier: 'Final Stand', description: 'One last all-out effort!' },
      ],
      workout: {
        exercises: [
          { name: 'Deadlift', sets: 1, reps: 1, notes: 'Work up to 1 Rep Max' },
        ],
        objective: 'Hit your maximum deadlift for 1 rep',
        targetPerformance: 315, // pounds - beginner target
      },
      rewards: {
        xp: 1000,
        badge: '🏋️',
        title: 'Deadlift Disciple',
        leaderboardPoints: 100,
      },
      unlocked: true,
    },
    {
      id: 'titan-of-the-squat-rack',
      name: 'Titan of the Squat Rack',
      title: 'Guardian of Leg Day',
      type: 'strength' as const,
      difficulty: 'intermediate' as const,
      icon: '👑',
      description: 'Prove your squat supremacy against the king of lower body',
      lore: 'Those who skip leg day shall never pass.',
      maxHealth: 100,
      recommendedLevel: 20,
      enrageTimer: 1200, // 20 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Depth Check', description: 'Hit proper depth on every rep' },
        { healthThreshold: 75, modifier: 'The Grind', description: 'Your quads are burning' },
        { healthThreshold: 50, modifier: 'Mental War', description: 'This is where champions are forged' },
        { healthThreshold: 25, modifier: 'Ascension', description: 'Leave nothing in the tank!' },
      ],
      workout: {
        exercises: [
          { name: 'Back Squat', sets: 1, reps: 5, notes: 'Work up to 5 Rep Max' },
        ],
        objective: 'Hit your maximum back squat for 5 reps',
        targetPerformance: 275, // pounds - intermediate target
      },
      rewards: {
        xp: 2000,
        badge: '🦵',
        title: 'Squat Sovereign',
        leaderboardPoints: 200,
      },
      unlocked: true,
    },
    {
      id: 'bench-press-behemoth',
      name: 'Bench Press Behemoth',
      title: 'Lord of the Chest',
      type: 'strength' as const,
      difficulty: 'elite' as const,
      icon: '👹',
      description: 'The ultimate test of pressing power and chest dominance',
      lore: 'Only those who have mastered the press may claim this throne.',
      maxHealth: 100,
      recommendedLevel: 40,
      enrageTimer: 900, // 15 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Calculated Power', description: 'Control the descent, explosive press' },
        { healthThreshold: 75, modifier: 'Sticking Point', description: 'Push through the lockout' },
        { healthThreshold: 50, modifier: 'Forced Reps', description: 'Every fiber strains for one more rep' },
        { healthThreshold: 25, modifier: 'Beyond Limits', description: 'This is your maximum test!' },
      ],
      workout: {
        exercises: [
          { name: 'Bench Press', sets: 1, reps: 3, notes: 'Work up to 3 Rep Max' },
        ],
        objective: 'Hit your maximum bench press for 3 reps',
        targetPerformance: 315, // pounds - elite target
      },
      rewards: {
        xp: 5000,
        badge: '💪',
        title: 'Press King',
        leaderboardPoints: 500,
      },
      unlocked: true,
    },

    // CIRCUIT DEMONS (3 bosses)
    {
      id: 'burpee-inferno',
      name: 'Burpee Inferno',
      title: 'The Conditioning Nightmare',
      type: 'circuit' as const,
      difficulty: 'beginner' as const,
      icon: '🔥',
      description: 'Survive 100 burpees and emerge victorious',
      lore: 'In the flames of suffering, champions are forged.',
      maxHealth: 100,
      recommendedLevel: 5,
      enrageTimer: 600, // 10 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Fresh Legs', description: 'The first 25 feel easy' },
        { healthThreshold: 75, modifier: 'The Wall', description: 'Your lungs begin to burn' },
        { healthThreshold: 50, modifier: 'Mental Battle', description: 'Every rep is a choice to continue' },
        { healthThreshold: 25, modifier: 'Final Push', description: 'Victory is within reach!' },
      ],
      workout: {
        exercises: [
          { name: 'Burpees', reps: 100, notes: 'Complete all 100 reps, breaking as needed' },
        ],
        objective: 'Complete 100 burpees as fast as possible',
        targetPerformance: 100, // reps
      },
      rewards: {
        xp: 800,
        badge: '💥',
        title: 'Burpee Survivor',
        leaderboardPoints: 80,
      },
      unlocked: true,
    },
    {
      id: 'thruster-demon',
      name: 'Thruster Demon',
      title: 'Bringer of Lactate',
      type: 'circuit' as const,
      difficulty: 'advanced' as const,
      icon: '😈',
      description: '21-15-9 thrusters and pull-ups - the legendary Fran protocol',
      lore: 'Some call it Fran. I call it hell.',
      maxHealth: 100,
      recommendedLevel: 30,
      enrageTimer: 600, // 10 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Round of 21', description: 'Pace yourself, this is just the start' },
        { healthThreshold: 66, modifier: 'Round of 15', description: 'The burn is real now' },
        { healthThreshold: 33, modifier: 'Round of 9', description: 'Give everything you have left!' },
        { healthThreshold: 10, modifier: 'Final Reps', description: 'Victory is one rep away!' },
      ],
      workout: {
        exercises: [
          { name: 'Thrusters', reps: 21, weight: 95, notes: '21-15-9 reps' },
          { name: 'Pull-Ups', reps: 21, notes: '21-15-9 reps' },
        ],
        objective: 'Complete Fran (21-15-9 Thrusters 95lb + Pull-Ups) for time',
        targetPerformance: 45, // total reps (21+15+9)*2
      },
      rewards: {
        xp: 3500,
        badge: '👹',
        title: 'Fran Conqueror',
        leaderboardPoints: 350,
      },
      unlocked: true,
    },
    {
      id: 'tabata-tormentor',
      name: 'Tabata Tormentor',
      title: 'Master of Intervals',
      type: 'circuit' as const,
      difficulty: 'intermediate' as const,
      icon: '⚡',
      description: '8 rounds of 20-second all-out effort with 10-second rest',
      lore: 'Twenty seconds of everything you have. Ten seconds to survive.',
      maxHealth: 100,
      recommendedLevel: 15,
      enrageTimer: 240, // 4 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Rounds 1-2', description: 'Easy pace, find your rhythm' },
        { healthThreshold: 75, modifier: 'Rounds 3-4', description: 'Fatigue sets in' },
        { healthThreshold: 50, modifier: 'Rounds 5-6', description: 'Every second is agony' },
        { healthThreshold: 25, modifier: 'Rounds 7-8', description: 'Leave it all on the floor!' },
      ],
      workout: {
        exercises: [
          { name: 'Burpees', time: 20, notes: 'Max effort for 20 seconds' },
          { name: 'Rest', time: 10, notes: '8 rounds total' },
        ],
        objective: 'Complete 8 Tabata rounds (20 sec work / 10 sec rest)',
        targetPerformance: 64, // total reps across 8 rounds
      },
      rewards: {
        xp: 1500,
        badge: '⏱️',
        title: 'Tabata Warrior',
        leaderboardPoints: 150,
      },
      unlocked: true,
    },

    // ENDURANCE DRAGONS (3 bosses)
    {
      id: 'murph-dragon',
      name: 'Murph Dragon',
      title: 'The Hero Workout Beast',
      type: 'endurance' as const,
      difficulty: 'elite' as const,
      icon: '🐉',
      description: 'The ultimate hero WOD: 1 mile run, 100 pull-ups, 200 push-ups, 300 squats, 1 mile run',
      lore: 'In honor of Navy Lt. Michael Murphy, who gave his life for his teammates.',
      maxHealth: 100,
      recommendedLevel: 35,
      enrageTimer: 3600, // 60 minutes
      phases: [
        { healthThreshold: 100, modifier: 'First Mile', description: 'Pace it right, you have a long way to go' },
        { healthThreshold: 75, modifier: 'The Chipper', description: '100-200-300 reps await' },
        { healthThreshold: 25, modifier: 'Final Mile', description: 'Your legs are dead, your will is tested' },
        { healthThreshold: 10, modifier: 'The Finish', description: 'Honor requires you finish!' },
      ],
      workout: {
        exercises: [
          { name: '1 Mile Run', reps: 1 },
          { name: 'Pull-Ups', reps: 100 },
          { name: 'Push-Ups', reps: 200 },
          { name: 'Air Squats', reps: 300 },
          { name: '1 Mile Run', reps: 1 },
        ],
        objective: 'Complete the full Murph protocol',
        targetPerformance: 600, // total reps (100+200+300)
      },
      rewards: {
        xp: 10000,
        badge: '🎖️',
        title: 'Murph Legend',
        leaderboardPoints: 1000,
      },
      unlocked: true,
    },
    {
      id: 'cindy-serpent',
      name: 'Cindy Serpent',
      title: 'Queen of AMRAP',
      type: 'endurance' as const,
      difficulty: 'intermediate' as const,
      icon: '🐍',
      description: '20 minutes of 5 pull-ups, 10 push-ups, 15 squats - how many rounds?',
      lore: 'Round after round, the serpent never tires.',
      maxHealth: 100,
      recommendedLevel: 18,
      enrageTimer: 1200, // 20 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Minutes 1-5', description: 'Easy, sustainable pace' },
        { healthThreshold: 75, modifier: 'Minutes 6-10', description: 'Maintain your rhythm' },
        { healthThreshold: 50, modifier: 'Minutes 11-15', description: 'The grind is real' },
        { healthThreshold: 25, modifier: 'Minutes 16-20', description: 'Sprint to the finish!' },
      ],
      workout: {
        exercises: [
          { name: 'Pull-Ups', reps: 5, notes: 'Each round' },
          { name: 'Push-Ups', reps: 10, notes: 'Each round' },
          { name: 'Air Squats', reps: 15, notes: 'Each round' },
        ],
        objective: 'Complete as many rounds as possible in 20 minutes',
        targetPerformance: 20, // rounds
      },
      rewards: {
        xp: 2500,
        badge: '🔄',
        title: 'Cindy Master',
        leaderboardPoints: 250,
      },
      unlocked: true,
    },
    {
      id: 'kalsu-kraken',
      name: 'Kalsu Kraken',
      title: 'The Brutal 100',
      type: 'endurance' as const,
      difficulty: 'advanced' as const,
      icon: '🦑',
      description: '100 thrusters with 5 burpees every minute on the minute',
      lore: 'Named after Lt. Bob Kalsu, the only active NFL player killed in Vietnam.',
      maxHealth: 100,
      recommendedLevel: 28,
      enrageTimer: 1800, // 30 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Thrusters 1-25', description: 'Find your pace early' },
        { healthThreshold: 75, modifier: 'Thrusters 26-50', description: 'The burpees are relentless' },
        { healthThreshold: 50, modifier: 'Thrusters 51-75', description: 'Mental fortitude tested' },
        { healthThreshold: 25, modifier: 'Thrusters 76-100', description: 'Finish what you started!' },
      ],
      workout: {
        exercises: [
          { name: 'Thrusters', reps: 100, weight: 135, notes: 'Complete all 100' },
          { name: 'Burpees', reps: 5, notes: 'Every minute on the minute' },
        ],
        objective: 'Complete 100 thrusters (135lb) + 5 burpees EMOM',
        targetPerformance: 100, // thrusters
      },
      rewards: {
        xp: 4000,
        badge: '🏅',
        title: 'Kalsu Survivor',
        leaderboardPoints: 400,
      },
      unlocked: true,
    },

    // HYBRID MONSTERS (3 bosses)
    {
      id: 'helen-hydra',
      name: 'Helen Hydra',
      title: 'Three-Headed Terror',
      type: 'hybrid' as const,
      difficulty: 'intermediate' as const,
      icon: '🐲',
      description: '3 rounds: 400m run, 21 KB swings, 12 pull-ups',
      lore: 'Three rounds of suffering, each head more vicious than the last.',
      maxHealth: 100,
      recommendedLevel: 22,
      enrageTimer: 900, // 15 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Round 1', description: 'Controlled aggression' },
        { healthThreshold: 66, modifier: 'Round 2', description: 'Fatigue accumulates' },
        { healthThreshold: 33, modifier: 'Round 3', description: 'Slay the final head!' },
        { healthThreshold: 10, modifier: 'Victory Sprint', description: 'One last push!' },
      ],
      workout: {
        exercises: [
          { name: '400m Run', reps: 3, notes: 'Each round' },
          { name: 'KB Swings', reps: 21, weight: 53, notes: 'Each round (53lb)' },
          { name: 'Pull-Ups', reps: 12, notes: 'Each round' },
        ],
        objective: 'Complete 3 rounds of Helen as fast as possible',
        targetPerformance: 3, // rounds
      },
      rewards: {
        xp: 2200,
        badge: '🏃',
        title: 'Helen Slayer',
        leaderboardPoints: 220,
      },
      unlocked: true,
    },
    {
      id: 'dt-destroyer',
      name: 'DT Destroyer',
      title: 'Barbell Complex Demon',
      type: 'hybrid' as const,
      difficulty: 'elite' as const,
      icon: '💀',
      description: '5 rounds: 12 deadlifts, 9 hang power cleans, 6 push jerks (155lb)',
      lore: 'In memory of USAF SSgt Timothy P. Davis. The barbell never lies.',
      maxHealth: 100,
      recommendedLevel: 45,
      enrageTimer: 900, // 15 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Rounds 1-2', description: 'Technique is everything' },
        { healthThreshold: 60, modifier: 'Rounds 3-4', description: 'The complex breaks you down' },
        { healthThreshold: 20, modifier: 'Round 5', description: 'One final barbell complex!' },
        { healthThreshold: 5, modifier: 'Last Rep', description: 'Finish strong!' },
      ],
      workout: {
        exercises: [
          { name: 'Deadlifts', reps: 12, weight: 155, notes: 'Each round' },
          { name: 'Hang Power Cleans', reps: 9, weight: 155, notes: 'Each round' },
          { name: 'Push Jerks', reps: 6, weight: 155, notes: 'Each round' },
        ],
        objective: 'Complete 5 rounds of DT (12-9-6 @ 155lb)',
        targetPerformance: 5, // rounds
      },
      rewards: {
        xp: 8000,
        badge: '⚡',
        title: 'DT Dominator',
        leaderboardPoints: 800,
      },
      unlocked: true,
    },
    {
      id: 'the-filthy-fifty',
      name: 'The Filthy Fifty',
      title: 'Master of Mayhem',
      type: 'hybrid' as const,
      difficulty: 'advanced' as const,
      icon: '👻',
      description: '50 reps of 10 different movements - pure chaos',
      lore: 'Fifty reps, ten movements, one survivor.',
      maxHealth: 100,
      recommendedLevel: 32,
      enrageTimer: 2400, // 40 minutes
      phases: [
        { healthThreshold: 100, modifier: 'Movements 1-3', description: 'Fresh and ready' },
        { healthThreshold: 75, modifier: 'Movements 4-6', description: 'The variety wears you down' },
        { healthThreshold: 50, modifier: 'Movements 7-8', description: 'Every rep is earned' },
        { healthThreshold: 25, modifier: 'Movements 9-10', description: 'The end is near!' },
      ],
      workout: {
        exercises: [
          { name: 'Box Jumps (24")', reps: 50 },
          { name: 'Jumping Pull-Ups', reps: 50 },
          { name: 'KB Swings (35lb)', reps: 50 },
          { name: 'Walking Lunges', reps: 50 },
          { name: 'Knees to Elbows', reps: 50 },
          { name: 'Push Press (45lb)', reps: 50 },
          { name: 'Back Extensions', reps: 50 },
          { name: 'Wall Balls (20lb)', reps: 50 },
          { name: 'Burpees', reps: 50 },
          { name: 'Double Unders', reps: 50 },
        ],
        objective: 'Complete all 500 total reps across 10 movements',
        targetPerformance: 500, // total reps
      },
      rewards: {
        xp: 5000,
        badge: '💯',
        title: 'Filthy Champion',
        leaderboardPoints: 500,
      },
      unlocked: true,
    },
  ];

  // Sample attempts
  const [attempts] = useState([
    { bossId: 'iron-colossus', date: 'Oct 1, 2025', performance: 315, victory: true, damageDealt: 100 },
    { bossId: 'burpee-inferno', date: 'Oct 2, 2025', performance: 85, victory: false, damageDealt: 85 },
    { bossId: 'cindy-serpent', date: 'Oct 3, 2025', performance: 18, victory: false, damageDealt: 90 },
  ]);

  const handleStartBattle = (bossId: string) => {
    console.log('Starting battle with:', bossId);
  };

  const handleCompleteBattle = (bossId: string, performance: number, victory: boolean) => {
    console.log('Battle completed:', { bossId, performance, victory });
    // In production: Save to database, update leaderboards, award XP/rewards
  };

  return (
    <div className="min-h-screen p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">⚔️</div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Boss Battles
            </h1>
            <p className="text-xl text-white/70 mt-2">
              Face epic workout challenges and claim legendary rewards!
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-400">{sampleBosses.length}</div>
            <div className="text-sm text-white/60">Total Bosses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400">
              {attempts.filter(a => a.victory).length}
            </div>
            <div className="text-sm text-white/60">Bosses Defeated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400">{attempts.length}</div>
            <div className="text-sm text-white/60">Total Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400">
              {sampleBosses.reduce((sum, b) => sum + b.rewards.xp, 0)}
            </div>
            <div className="text-sm text-white/60">Total XP Available</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <BossBattles
          bosses={sampleBosses}
          attempts={attempts}
          userLevel={userLevel}
          onStartBattle={handleStartBattle}
          onCompleteBattle={handleCompleteBattle}
        />
      </div>

      {/* Boss Battle Guide */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">⚔️ How Boss Battles Work</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Boss Health System</h3>
              <p className="text-white/80">
                Each boss has 100 HP. As you progress through the workout and hit performance targets, 
                you deal damage to the boss. Reach your target performance to deplete the boss health to 0 and claim victory!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-orange-400 mb-2">Battle Phases</h3>
              <p className="text-white/80 mb-2">
                Bosses transition through 4 phases as their health depletes (100% → 75% → 50% → 25%). 
                Each phase may introduce new challenges or modifiers that test your resolve.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-2">Enrage Timers</h3>
              <p className="text-white/80">
                Some bosses have enrage timers - time limits within which you must complete the challenge. 
                Exceed the timer and face automatic defeat!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Rewards & Progression</h3>
              <p className="text-white/80">
                Defeat bosses to earn massive XP bonuses, exclusive titles, special badges, and leaderboard points. 
                First-time victories grant the most prestigious rewards!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Level Requirements</h3>
              <p className="text-white/80">
                Each boss has a recommended level. While you can attempt bosses below your level for practice, 
                attempting bosses significantly above your level is not recommended!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Boss Types Guide */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">🎯 Boss Types Explained</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-6">
              <div className="text-5xl mb-3">⚔️</div>
              <h3 className="text-2xl font-bold text-red-400 mb-3">Strength Titans</h3>
              <p className="text-white/80 mb-4">
                Test your maximum strength with 1RM, 3RM, and 5RM challenges. Perfect for powerlifters and strength athletes.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Maximum lift challenges</li>
                <li>✓ Heavy compound movements</li>
                <li>✓ Short duration, max intensity</li>
                <li>✓ Pure strength testing</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg p-6">
              <div className="text-5xl mb-3">🔥</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-3">Circuit Demons</h3>
              <p className="text-white/80 mb-4">
                Brutal high-rep conditioning circuits that test your anaerobic capacity and mental toughness.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ High-rep challenges</li>
                <li>✓ Metabolic conditioning</li>
                <li>✓ Short to medium duration</li>
                <li>✓ Cardio + strength mix</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-6">
              <div className="text-5xl mb-3">🐉</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-3">Endurance Dragons</h3>
              <p className="text-white/80 mb-4">
                Long-duration tests that challenge your stamina, pacing, and mental fortitude over extended efforts.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Long-duration workouts</li>
                <li>✓ Pacing strategies crucial</li>
                <li>✓ Mental toughness tested</li>
                <li>✓ Hero WODs and classics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
              <div className="text-5xl mb-3">👹</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">Hybrid Monsters</h3>
              <p className="text-white/80 mb-4">
                Mixed modality gauntlets that combine strength, cardio, and skill movements into ultimate tests.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Multiple movement patterns</li>
                <li>✓ Total fitness assessment</li>
                <li>✓ Varied time domains</li>
                <li>✓ CrossFit-style benchmarks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
