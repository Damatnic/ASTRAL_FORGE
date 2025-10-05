'use client';

import { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ProgramCategory = 'powerlifting' | 'bodybuilding' | 'athletic' | 'specialization';
type ProgramDifficulty = 'beginner' | 'intermediate' | 'advanced';
type ProgressionType = 'linear' | 'wave' | 'block' | 'daily_undulating';

interface Exercise {
  name: string;
  sets: string; // e.g., "5", "3-5", "AMRAP"
  reps: string; // e.g., "5", "8-12", "AMRAP"
  intensity: string; // e.g., "80% 1RM", "RPE 8", "Heavy"
  notes?: string;
}

interface WorkoutDay {
  name: string;
  exercises: Exercise[];
  estimatedDuration: number; // minutes
}

interface WeekSchedule {
  weekNumber: number;
  days: (WorkoutDay | null)[]; // null = rest day
  deloadWeek?: boolean;
}

interface Program {
  id: string;
  name: string;
  category: ProgramCategory;
  difficulty: ProgramDifficulty;
  duration: number; // weeks
  daysPerWeek: number;
  focusAreas: string[];
  description: string;
  benefits: string[];
  whoItsFor: string[];
  progressionScheme: ProgressionType;
  deloadProtocol: string;
  weekSchedule: WeekSchedule[];
  xpMultiplier: number;
  popularityScore: number;
}

interface ProgramTemplatesProps {
  onSelectProgram?: (program: Program) => void;
  onStartProgram?: (program: Program, customizations?: any) => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getCategoryIcon = (category: ProgramCategory) => {
  switch (category) {
    case 'powerlifting': return '⚡';
    case 'bodybuilding': return '💪';
    case 'athletic': return '🏃';
    case 'specialization': return '🎯';
  }
};

const getCategoryName = (category: ProgramCategory) => {
  switch (category) {
    case 'powerlifting': return 'Powerlifting';
    case 'bodybuilding': return 'Bodybuilding';
    case 'athletic': return 'Athletic/Functional';
    case 'specialization': return 'Specialization';
  }
};

const getDifficultyColor = (difficulty: ProgramDifficulty) => {
  switch (difficulty) {
    case 'beginner': return 'text-green-400 border-green-500 bg-green-500/10';
    case 'intermediate': return 'text-blue-400 border-blue-500 bg-blue-500/10';
    case 'advanced': return 'text-purple-400 border-purple-500 bg-purple-500/10';
  }
};

const getDifficultyName = (difficulty: ProgramDifficulty) => {
  switch (difficulty) {
    case 'beginner': return 'Beginner';
    case 'intermediate': return 'Intermediate';
    case 'advanced': return 'Advanced';
  }
};

// ============================================================================
// SAMPLE PROGRAMS DATA
// ============================================================================

const samplePrograms: Program[] = [
  // POWERLIFTING PROGRAMS
  {
    id: 'stronglifts-5x5',
    name: 'StrongLifts 5×5',
    category: 'powerlifting',
    difficulty: 'beginner',
    duration: 12,
    daysPerWeek: 3,
    focusAreas: ['Strength', 'Compound Movements', 'Linear Progression'],
    description: 'Classic beginner strength program focusing on compound lifts with simple linear progression. Train 3 days per week alternating between two workouts.',
    benefits: [
      'Simple and easy to follow',
      'Fast strength gains for beginners',
      'Builds solid foundation',
      'Only requires 3 days per week',
      'Auto-regulation through prescribed progression',
    ],
    whoItsFor: [
      'Complete beginners to strength training',
      'Those who want to build a strong base',
      'People with limited time (3 days/week)',
      'Anyone looking for straightforward progression',
    ],
    progressionScheme: 'linear',
    deloadProtocol: 'Deload after 3 failed sessions on same weight (reduce 10%)',
    weekSchedule: [
      {
        weekNumber: 1,
        days: [
          {
            name: 'Workout A',
            exercises: [
              { name: 'Squat', sets: '5', reps: '5', intensity: 'Start 50% 1RM, add 5lbs each session' },
              { name: 'Bench Press', sets: '5', reps: '5', intensity: 'Start 50% 1RM, add 5lbs each session' },
              { name: 'Barbell Row', sets: '5', reps: '5', intensity: 'Start 50% 1RM, add 5lbs each session' },
            ],
            estimatedDuration: 45,
          },
          null, // Rest
          {
            name: 'Workout B',
            exercises: [
              { name: 'Squat', sets: '5', reps: '5', intensity: 'Progressive from last session' },
              { name: 'Overhead Press', sets: '5', reps: '5', intensity: 'Start 50% 1RM, add 5lbs each session' },
              { name: 'Deadlift', sets: '1', reps: '5', intensity: 'Start 50% 1RM, add 10lbs each session' },
            ],
            estimatedDuration: 45,
          },
          null, // Rest
          {
            name: 'Workout A',
            exercises: [
              { name: 'Squat', sets: '5', reps: '5', intensity: 'Progressive from last session' },
              { name: 'Bench Press', sets: '5', reps: '5', intensity: 'Progressive from last session' },
              { name: 'Barbell Row', sets: '5', reps: '5', intensity: 'Progressive from last session' },
            ],
            estimatedDuration: 45,
          },
          null, // Rest
          null, // Rest
        ],
      },
    ],
    xpMultiplier: 2.0,
    popularityScore: 10,
  },
  {
    id: 'wendler-531',
    name: 'Wendler 5/3/1',
    category: 'powerlifting',
    difficulty: 'intermediate',
    duration: 16,
    daysPerWeek: 4,
    focusAreas: ['Strength', 'Controlled Progression', 'Sub-maximal Training'],
    description: 'Intermediate strength program using wave periodization with 4 main lifts. Each cycle lasts 4 weeks with built-in deload.',
    benefits: [
      'Sustainable long-term progression',
      'Built-in deload weeks prevent burnout',
      'Proven track record for strength gains',
      'Flexible accessory work',
      'Works well for intermediate lifters',
    ],
    whoItsFor: [
      'Intermediate lifters who stalled on linear progression',
      'Those wanting structured periodization',
      'Lifters who need deloads to recover',
      'People comfortable with percentages',
    ],
    progressionScheme: 'wave',
    deloadProtocol: 'Every 4th week is programmed deload (40/50/60% of training max)',
    weekSchedule: [
      {
        weekNumber: 1,
        days: [
          {
            name: 'Squat Day (Week 1: 5s)',
            exercises: [
              { name: 'Squat', sets: '3', reps: '5, 5, 5+', intensity: '65%, 75%, 85% TM', notes: 'AMRAP on last set' },
              { name: 'Boring But Big Squat', sets: '5', reps: '10', intensity: '50% TM' },
              { name: 'Leg Accessories', sets: '3-5', reps: '10-20', intensity: 'Moderate' },
            ],
            estimatedDuration: 60,
          },
          {
            name: 'Bench Day (Week 1: 5s)',
            exercises: [
              { name: 'Bench Press', sets: '3', reps: '5, 5, 5+', intensity: '65%, 75%, 85% TM', notes: 'AMRAP on last set' },
              { name: 'Boring But Big Bench', sets: '5', reps: '10', intensity: '50% TM' },
              { name: 'Chest/Tricep Accessories', sets: '3-5', reps: '10-20', intensity: 'Moderate' },
            ],
            estimatedDuration: 60,
          },
          null, // Rest
          {
            name: 'Deadlift Day (Week 1: 5s)',
            exercises: [
              { name: 'Deadlift', sets: '3', reps: '5, 5, 5+', intensity: '65%, 75%, 85% TM', notes: 'AMRAP on last set' },
              { name: 'Boring But Big Deadlift', sets: '5', reps: '10', intensity: '50% TM' },
              { name: 'Back Accessories', sets: '3-5', reps: '10-20', intensity: 'Moderate' },
            ],
            estimatedDuration: 60,
          },
          {
            name: 'OHP Day (Week 1: 5s)',
            exercises: [
              { name: 'Overhead Press', sets: '3', reps: '5, 5, 5+', intensity: '65%, 75%, 85% TM', notes: 'AMRAP on last set' },
              { name: 'Boring But Big OHP', sets: '5', reps: '10', intensity: '50% TM' },
              { name: 'Shoulder/Arm Accessories', sets: '3-5', reps: '10-20', intensity: 'Moderate' },
            ],
            estimatedDuration: 60,
          },
          null, // Rest
          null, // Rest
        ],
      },
    ],
    xpMultiplier: 2.5,
    popularityScore: 9,
  },
  
  // BODYBUILDING PROGRAMS
  {
    id: 'ppl',
    name: 'Push/Pull/Legs (PPL)',
    category: 'bodybuilding',
    difficulty: 'intermediate',
    duration: 12,
    daysPerWeek: 6,
    focusAreas: ['Hypertrophy', 'Volume', 'Muscle Balance'],
    description: 'Classic bodybuilding split training each muscle group 2x per week with high volume. Can run as 6-day or 3-day split.',
    benefits: [
      'High frequency (2x per week per muscle)',
      'Balanced muscle development',
      'High volume for hypertrophy',
      'Flexible exercise selection',
      'Proven for muscle growth',
    ],
    whoItsFor: [
      'Intermediate lifters focused on muscle gain',
      'Those who can train 6 days per week',
      'Bodybuilders and physique athletes',
      'People who enjoy volume training',
    ],
    progressionScheme: 'linear',
    deloadProtocol: 'Reduce volume by 40% every 6-8 weeks',
    weekSchedule: [
      {
        weekNumber: 1,
        days: [
          {
            name: 'Push (Chest/Shoulders/Triceps)',
            exercises: [
              { name: 'Bench Press', sets: '4', reps: '6-8', intensity: 'Heavy', notes: 'Main strength movement' },
              { name: 'Overhead Press', sets: '3', reps: '8-10', intensity: 'Moderate-Heavy' },
              { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12', intensity: 'Moderate' },
              { name: 'Lateral Raises', sets: '3', reps: '12-15', intensity: 'Light-Moderate' },
              { name: 'Tricep Pushdowns', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Overhead Tricep Extension', sets: '3', reps: '12-15', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          {
            name: 'Pull (Back/Biceps)',
            exercises: [
              { name: 'Deadlift', sets: '3', reps: '5-8', intensity: 'Heavy', notes: 'Main strength movement' },
              { name: 'Pull-ups', sets: '3', reps: '8-12', intensity: 'Bodyweight or weighted' },
              { name: 'Barbell Row', sets: '4', reps: '8-10', intensity: 'Moderate-Heavy' },
              { name: 'Face Pulls', sets: '3', reps: '15-20', intensity: 'Light-Moderate' },
              { name: 'Barbell Curl', sets: '3', reps: '10-12', intensity: 'Moderate' },
              { name: 'Hammer Curl', sets: '3', reps: '12-15', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          {
            name: 'Legs (Quads/Hams/Calves)',
            exercises: [
              { name: 'Squat', sets: '4', reps: '6-8', intensity: 'Heavy', notes: 'Main strength movement' },
              { name: 'Romanian Deadlift', sets: '3', reps: '8-10', intensity: 'Moderate-Heavy' },
              { name: 'Leg Press', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Leg Curl', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Calf Raises', sets: '4', reps: '15-20', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          {
            name: 'Push (Chest/Shoulders/Triceps)',
            exercises: [
              { name: 'Incline Barbell Press', sets: '4', reps: '6-8', intensity: 'Heavy' },
              { name: 'Dumbbell Shoulder Press', sets: '3', reps: '8-10', intensity: 'Moderate-Heavy' },
              { name: 'Dips', sets: '3', reps: '8-12', intensity: 'Bodyweight or weighted' },
              { name: 'Cable Flyes', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Lateral Raises', sets: '3', reps: '15-20', intensity: 'Light-Moderate' },
              { name: 'Skull Crushers', sets: '3', reps: '10-12', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          {
            name: 'Pull (Back/Biceps)',
            exercises: [
              { name: 'Barbell Row', sets: '4', reps: '6-8', intensity: 'Heavy' },
              { name: 'Lat Pulldown', sets: '3', reps: '10-12', intensity: 'Moderate' },
              { name: 'Cable Row', sets: '3', reps: '10-12', intensity: 'Moderate' },
              { name: 'Shrugs', sets: '3', reps: '12-15', intensity: 'Heavy' },
              { name: 'Preacher Curl', sets: '3', reps: '10-12', intensity: 'Moderate' },
              { name: 'Cable Curl', sets: '3', reps: '12-15', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          {
            name: 'Legs (Quads/Hams/Calves)',
            exercises: [
              { name: 'Front Squat', sets: '4', reps: '8-10', intensity: 'Moderate-Heavy' },
              { name: 'Leg Press', sets: '3', reps: '10-12', intensity: 'Moderate-Heavy' },
              { name: 'Walking Lunges', sets: '3', reps: '12-15 per leg', intensity: 'Moderate' },
              { name: 'Leg Curl', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Seated Calf Raises', sets: '4', reps: '15-20', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          null, // Rest
        ],
      },
    ],
    xpMultiplier: 2.2,
    popularityScore: 10,
  },
  {
    id: 'phul',
    name: 'PHUL (Power Hypertrophy Upper Lower)',
    category: 'bodybuilding',
    difficulty: 'intermediate',
    duration: 12,
    daysPerWeek: 4,
    focusAreas: ['Strength', 'Hypertrophy', 'Power Training'],
    description: 'Combines powerlifting and bodybuilding with 2 power days (heavy, low reps) and 2 hypertrophy days (moderate weight, higher reps).',
    benefits: [
      'Best of both worlds (strength + size)',
      'Only 4 days per week',
      'Balanced approach to training',
      'Good for intermediate lifters',
      'Variety prevents boredom',
    ],
    whoItsFor: [
      'Intermediate lifters wanting strength AND size',
      'Those with 4 days per week to train',
      'People who enjoy variety',
      'Lifters transitioning from beginner programs',
    ],
    progressionScheme: 'linear',
    deloadProtocol: 'Every 8 weeks, reduce weight by 10% and volume by 30%',
    weekSchedule: [
      {
        weekNumber: 1,
        days: [
          {
            name: 'Upper Power',
            exercises: [
              { name: 'Barbell Bench Press', sets: '4', reps: '3-5', intensity: '85-90% 1RM' },
              { name: 'Barbell Row', sets: '4', reps: '3-5', intensity: '85-90% 1RM' },
              { name: 'Overhead Press', sets: '3', reps: '5-8', intensity: '75-85% 1RM' },
              { name: 'Barbell Curl', sets: '3', reps: '6-8', intensity: 'Heavy' },
              { name: 'Skull Crushers', sets: '3', reps: '6-8', intensity: 'Heavy' },
            ],
            estimatedDuration: 60,
          },
          {
            name: 'Lower Power',
            exercises: [
              { name: 'Squat', sets: '4', reps: '3-5', intensity: '85-90% 1RM' },
              { name: 'Deadlift', sets: '3', reps: '3-5', intensity: '85-90% 1RM' },
              { name: 'Leg Press', sets: '3', reps: '10-12', intensity: 'Moderate' },
              { name: 'Leg Curl', sets: '3', reps: '6-8', intensity: 'Heavy' },
              { name: 'Calf Raises', sets: '4', reps: '6-8', intensity: 'Heavy' },
            ],
            estimatedDuration: 60,
          },
          null, // Rest
          {
            name: 'Upper Hypertrophy',
            exercises: [
              { name: 'Incline Dumbbell Press', sets: '4', reps: '10-12', intensity: '65-75% 1RM' },
              { name: 'Cable Row', sets: '4', reps: '10-12', intensity: '65-75% 1RM' },
              { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10-12', intensity: 'Moderate' },
              { name: 'Lateral Raises', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Cable Flyes', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Tricep Pushdown', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Dumbbell Curl', sets: '3', reps: '12-15', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          {
            name: 'Lower Hypertrophy',
            exercises: [
              { name: 'Front Squat', sets: '4', reps: '10-12', intensity: '65-75% 1RM' },
              { name: 'Romanian Deadlift', sets: '3', reps: '10-12', intensity: '65-75% 1RM' },
              { name: 'Leg Press', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Leg Extension', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Leg Curl', sets: '3', reps: '12-15', intensity: 'Moderate' },
              { name: 'Seated Calf Raises', sets: '4', reps: '12-15', intensity: 'Moderate' },
            ],
            estimatedDuration: 75,
          },
          null, // Rest
          null, // Rest
          null, // Rest
        ],
      },
    ],
    xpMultiplier: 2.3,
    popularityScore: 8,
  },

  // ATHLETIC/FUNCTIONAL PROGRAMS
  {
    id: 'gzclp',
    name: 'GZCLP (Cody Lefever Linear Progression)',
    category: 'athletic',
    difficulty: 'beginner',
    duration: 12,
    daysPerWeek: 4,
    focusAreas: ['Strength', 'Work Capacity', 'Balanced Development'],
    description: 'Structured around Tier system: T1 (main lifts, heavy), T2 (secondary, moderate), T3 (accessories, light). Great for building both strength and size.',
    benefits: [
      'Excellent for beginners and intermediates',
      'Clear tier-based progression',
      'Balances strength and hypertrophy',
      'Auto-regulation built in',
      'Sustainable long-term',
    ],
    whoItsFor: [
      'Beginners who want structured progression',
      'Intermediate lifters seeking balance',
      'Those who like clear, logical programming',
      'People with 4 days per week',
    ],
    progressionScheme: 'linear',
    deloadProtocol: 'When T1 fails, reduce to 6×2, then 10×1. When 10×1 fails, increase 5-10lbs and restart at 5×3',
    weekSchedule: [
      {
        weekNumber: 1,
        days: [
          {
            name: 'Day 1',
            exercises: [
              { name: 'Squat (T1)', sets: '5', reps: '3', intensity: 'Heavy (85-90%)', notes: 'Add 5lbs when all sets complete' },
              { name: 'Bench Press (T2)', sets: '3', reps: '10', intensity: 'Moderate (65-75%)', notes: 'Add 5lbs when all sets complete' },
              { name: 'Lat Pulldown (T3)', sets: '3', reps: '15+', intensity: 'Light (50-60%)', notes: 'Add reps, then weight' },
            ],
            estimatedDuration: 60,
          },
          {
            name: 'Day 2',
            exercises: [
              { name: 'Overhead Press (T1)', sets: '5', reps: '3', intensity: 'Heavy (85-90%)' },
              { name: 'Deadlift (T2)', sets: '3', reps: '10', intensity: 'Moderate (65-75%)' },
              { name: 'Dumbbell Row (T3)', sets: '3', reps: '15+', intensity: 'Light (50-60%)' },
            ],
            estimatedDuration: 60,
          },
          null, // Rest
          {
            name: 'Day 3',
            exercises: [
              { name: 'Bench Press (T1)', sets: '5', reps: '3', intensity: 'Heavy (85-90%)' },
              { name: 'Squat (T2)', sets: '3', reps: '10', intensity: 'Moderate (65-75%)' },
              { name: 'Dumbbell Flyes (T3)', sets: '3', reps: '15+', intensity: 'Light (50-60%)' },
            ],
            estimatedDuration: 60,
          },
          {
            name: 'Day 4',
            exercises: [
              { name: 'Deadlift (T1)', sets: '5', reps: '3', intensity: 'Heavy (85-90%)' },
              { name: 'Overhead Press (T2)', sets: '3', reps: '10', intensity: 'Moderate (65-75%)' },
              { name: 'Bicep Curls (T3)', sets: '3', reps: '15+', intensity: 'Light (50-60%)' },
            ],
            estimatedDuration: 60,
          },
          null, // Rest
          null, // Rest
          null, // Rest
        ],
      },
    ],
    xpMultiplier: 2.1,
    popularityScore: 7,
  },

  // SPECIALIZATION PROGRAMS
  {
    id: 'nsuns-531',
    name: 'nSuns 531 LP',
    category: 'specialization',
    difficulty: 'intermediate',
    duration: 12,
    daysPerWeek: 5,
    focusAreas: ['Strength', 'High Volume', 'Rapid Progression'],
    description: 'High-volume 531 variant with 9 working sets on main lifts. Intense but produces rapid strength gains. Multiple variations (4-day, 5-day, 6-day).',
    benefits: [
      'Very fast strength gains',
      'High volume builds work capacity',
      'Linear progression with auto-regulation',
      'Customizable accessories',
      'Proven results for intermediates',
    ],
    whoItsFor: [
      'Intermediate lifters seeking rapid strength gains',
      'Those who can handle high volume',
      'People with 5-6 days per week',
      'Lifters who thrive on intensity',
    ],
    progressionScheme: 'linear',
    deloadProtocol: 'If AMRAP set fails to hit minimum reps, deload 10% on training max',
    weekSchedule: [
      {
        weekNumber: 1,
        days: [
          {
            name: 'Bench/OHP Day',
            exercises: [
              { name: 'Bench Press', sets: '9', reps: 'Varies (8,6,4,4,4,6,8,8,8+)', intensity: '65-95% TM', notes: 'Last set AMRAP' },
              { name: 'Overhead Press', sets: '8', reps: 'Varies (6,5,3,5,7,4,6,8)', intensity: '50-80% TM' },
              { name: 'Accessories', sets: '3-5', reps: '8-12', intensity: 'Your choice: chest/shoulders/triceps' },
            ],
            estimatedDuration: 90,
          },
          {
            name: 'Squat/Sumo Deadlift Day',
            exercises: [
              { name: 'Squat', sets: '9', reps: 'Varies (5,3,1+,3,3,3,5,5,5+)', intensity: '70-95% TM', notes: 'Last set AMRAP' },
              { name: 'Sumo Deadlift', sets: '8', reps: 'Varies (5,5,3,5,7,4,6,8)', intensity: '50-75% TM' },
              { name: 'Accessories', sets: '3-5', reps: '8-12', intensity: 'Your choice: legs/back' },
            ],
            estimatedDuration: 90,
          },
          {
            name: 'OHP/Incline Bench Day',
            exercises: [
              { name: 'Overhead Press', sets: '9', reps: 'Varies (5,3,1+,3,3,3,5,5,5+)', intensity: '70-95% TM', notes: 'Last set AMRAP' },
              { name: 'Incline Bench Press', sets: '8', reps: 'Varies (6,5,3,5,7,4,6,8)', intensity: '50-80% TM' },
              { name: 'Accessories', sets: '3-5', reps: '8-12', intensity: 'Your choice: shoulders/chest/triceps' },
            ],
            estimatedDuration: 90,
          },
          {
            name: 'Deadlift/Front Squat Day',
            exercises: [
              { name: 'Deadlift', sets: '9', reps: 'Varies (5,3,1+,3,5,3,5,5,5+)', intensity: '70-95% TM', notes: 'Last set AMRAP' },
              { name: 'Front Squat', sets: '8', reps: 'Varies (5,5,3,5,7,4,6,8)', intensity: '50-75% TM' },
              { name: 'Accessories', sets: '3-5', reps: '8-12', intensity: 'Your choice: back/legs' },
            ],
            estimatedDuration: 90,
          },
          {
            name: 'Bench/Close Grip Bench Day',
            exercises: [
              { name: 'Bench Press', sets: '9', reps: 'Varies (5,3,1+,3,5,3,5,5,5+)', intensity: '70-95% TM', notes: 'Last set AMRAP' },
              { name: 'Close Grip Bench', sets: '8', reps: 'Varies (6,5,3,5,7,4,6,8)', intensity: '50-80% TM' },
              { name: 'Accessories', sets: '3-5', reps: '8-12', intensity: 'Your choice: chest/triceps' },
            ],
            estimatedDuration: 90,
          },
          null, // Rest
          null, // Rest
        ],
      },
    ],
    xpMultiplier: 2.8,
    popularityScore: 8,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WorkoutTemplates({ onSelectProgram, onStartProgram }: ProgramTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProgramDifficulty | 'all'>('all');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter programs
  const filteredPrograms = samplePrograms.filter((program) => {
    if (selectedCategory !== 'all' && program.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && program.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    if (onSelectProgram) onSelectProgram(program);
  };

  const handleStartProgram = (program: Program) => {
    if (onStartProgram) onStartProgram(program);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {selectedProgram ? (
          // PROGRAM DETAIL VIEW
          <div>
            <button
              onClick={() => setSelectedProgram(null)}
              className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
            >
              ← Back to Programs
            </button>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
              {/* Program Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{getCategoryIcon(selectedProgram.category)}</span>
                    <h1 className="text-4xl font-bold">{selectedProgram.name}</h1>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-lg border font-semibold ${getDifficultyColor(selectedProgram.difficulty)}`}>
                      {getDifficultyName(selectedProgram.difficulty)}
                    </span>
                    <span className="text-gray-400">{getCategoryName(selectedProgram.category)}</span>
                    <span className="text-purple-400">⭐ {selectedProgram.popularityScore}/10</span>
                    <span className="text-green-400">{selectedProgram.xpMultiplier}x XP</span>
                  </div>

                  <p className="text-gray-300 text-lg mb-4">{selectedProgram.description}</p>

                  <div className="flex gap-4 text-sm text-gray-400">
                    <div>📅 {selectedProgram.duration} weeks</div>
                    <div>🏋️ {selectedProgram.daysPerWeek} days/week</div>
                    <div>📈 {selectedProgram.progressionScheme.replace('_', ' ')} progression</div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartProgram(selectedProgram)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg transition-colors"
                >
                  🚀 Start Program
                </button>
              </div>

              {/* Focus Areas */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🎯 Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.focusAreas.map((area, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits & Who It's For */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">✅ Benefits</h3>
                  <ul className="space-y-2">
                    {selectedProgram.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-gray-300 flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">👤 Who It's For</h3>
                  <ul className="space-y-2">
                    {selectedProgram.whoItsFor.map((who, idx) => (
                      <li key={idx} className="text-gray-300 flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>{who}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Progression & Deload */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold mb-2 text-purple-400">📈 Progression Scheme</h3>
                  <p className="text-gray-300">{selectedProgram.progressionScheme.replace('_', ' ').toUpperCase()}</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold mb-2 text-amber-400">🔄 Deload Protocol</h3>
                  <p className="text-gray-300">{selectedProgram.deloadProtocol}</p>
                </div>
              </div>

              {/* Week Schedule */}
              <div>
                <h3 className="text-2xl font-bold mb-4">📋 Sample Week Schedule</h3>
                {selectedProgram.weekSchedule.map((week) => (
                  <div key={week.weekNumber} className="space-y-4">
                    <h4 className="text-xl font-semibold text-purple-400">Week {week.weekNumber}</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {week.days.map((day, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg p-3 ${
                            day
                              ? 'bg-gray-900 border border-purple-500/30 hover:border-purple-500 transition-colors cursor-pointer'
                              : 'bg-gray-800/50 border border-gray-700'
                          }`}
                        >
                          {day ? (
                            <div>
                              <div className="font-bold text-sm mb-2 text-purple-300">{day.name}</div>
                              <div className="text-xs text-gray-400 space-y-1">
                                {day.exercises.map((ex, exIdx) => (
                                  <div key={exIdx}>
                                    {ex.name}: {ex.sets}×{ex.reps}
                                  </div>
                                ))}
                              </div>
                              <div className="text-xs text-gray-500 mt-2">~{day.estimatedDuration}min</div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 text-sm">Rest</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // PROGRAM BROWSER VIEW
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">📚 Workout Programs</h1>
              <p className="text-gray-400">Proven training programs to reach your goals</p>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2">CATEGORY</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    All Programs
                  </button>
                  <button
                    onClick={() => setSelectedCategory('powerlifting')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === 'powerlifting'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    ⚡ Powerlifting
                  </button>
                  <button
                    onClick={() => setSelectedCategory('bodybuilding')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === 'bodybuilding'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    💪 Bodybuilding
                  </button>
                  <button
                    onClick={() => setSelectedCategory('athletic')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === 'athletic'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    🏃 Athletic
                  </button>
                  <button
                    onClick={() => setSelectedCategory('specialization')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === 'specialization'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    🎯 Specialization
                  </button>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2">DIFFICULTY</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDifficulty('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedDifficulty === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    All Levels
                  </button>
                  <button
                    onClick={() => setSelectedDifficulty('beginner')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedDifficulty === 'beginner'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    🟢 Beginner
                  </button>
                  <button
                    onClick={() => setSelectedDifficulty('intermediate')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedDifficulty === 'intermediate'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    🔵 Intermediate
                  </button>
                  <button
                    onClick={() => setSelectedDifficulty('advanced')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedDifficulty === 'advanced'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    🟣 Advanced
                  </button>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'grid' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'list' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Programs Grid/List */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  onClick={() => handleSelectProgram(program)}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-purple-500 transition-colors cursor-pointer"
                >
                  {/* Program Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">{getCategoryIcon(program.category)}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{program.name}</h3>
                      <div className={`inline-block px-2 py-0.5 rounded text-sm border ${getDifficultyColor(program.difficulty)}`}>
                        {getDifficultyName(program.difficulty)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{program.description}</p>

                  {/* Program Info */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-900 rounded p-2">
                      <div className="text-gray-500 text-xs">Duration</div>
                      <div className="font-semibold">{program.duration} weeks</div>
                    </div>
                    <div className="bg-gray-900 rounded p-2">
                      <div className="text-gray-500 text-xs">Days/Week</div>
                      <div className="font-semibold">{program.daysPerWeek} days</div>
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {program.focusAreas.slice(0, 3).map((area, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-purple-400">⭐ {program.popularityScore}/10</span>
                      <span className="text-green-400">{program.xpMultiplier}x XP</span>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300 font-semibold">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
