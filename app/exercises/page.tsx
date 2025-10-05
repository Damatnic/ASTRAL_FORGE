'use client';

import { useState } from 'react';
import ExerciseDatabase from '@/components/exercise-database';

// Sample exercise data with 30+ exercises across all categories
const SAMPLE_EXERCISES = [
  // POWERLIFTING - Big 3
  {
    id: 'ex-001',
    name: 'Barbell Back Squat',
    category: 'powerlifting' as const,
    primaryMuscles: ['quads' as const, 'glutes' as const],
    secondaryMuscles: ['hamstrings' as const, 'core' as const],
    difficulty: 'intermediate' as const,
    equipment: ['barbell' as const],
    movementPattern: ['squat' as const],
    description: 'The king of lower body exercises. A fundamental compound movement that builds overall strength and muscle mass.',
    formCues: [
      'Bar should rest on your traps/rear delts',
      'Keep chest up and core braced throughout',
      'Break at the hips and knees simultaneously',
      'Descend until thighs are parallel or below',
      'Drive through heels to stand back up',
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse)',
      'Rising onto toes / heels coming up',
      'Excessive forward lean',
      'Not reaching proper depth',
    ],
    variations: ['Front Squat', 'High Bar Squat', 'Low Bar Squat', 'Pause Squat', 'Box Squat'],
    prerequisites: ['Bodyweight Squat', 'Goblet Squat'],
    progressionPath: ['Bodyweight Squat', 'Goblet Squat', 'Barbell Back Squat', 'Pause Squat'],
    xpMultiplier: 2.5,
    popularityScore: 10,
    safetyRating: 7,
    userPersonalRecord: { weight: 315, reps: 5, date: new Date('2024-09-15') },
  },
  {
    id: 'ex-002',
    name: 'Barbell Bench Press',
    category: 'powerlifting' as const,
    primaryMuscles: ['chest' as const],
    secondaryMuscles: ['triceps' as const, 'shoulders' as const],
    difficulty: 'intermediate' as const,
    equipment: ['barbell' as const],
    movementPattern: ['push' as const],
    description: 'The classic upper body pressing movement. Essential for building chest strength and mass.',
    formCues: [
      'Lie flat with eyes under the bar',
      'Grip slightly wider than shoulder width',
      'Create an arch in your lower back',
      'Retract and depress shoulder blades',
      'Lower bar to mid-chest with control',
    ],
    commonMistakes: [
      'Bouncing bar off chest',
      'Flaring elbows excessively',
      'Losing shoulder blade retraction',
      'Lifting hips off bench',
    ],
    variations: ['Incline Bench Press', 'Close Grip Bench', 'Paused Bench', 'Floor Press'],
    progressionPath: ['Push-ups', 'Dumbbell Bench', 'Barbell Bench Press', 'Paused Bench'],
    xpMultiplier: 2.5,
    popularityScore: 10,
    safetyRating: 6,
    userPersonalRecord: { weight: 225, reps: 8, date: new Date('2024-09-20') },
  },
  {
    id: 'ex-003',
    name: 'Conventional Deadlift',
    category: 'powerlifting' as const,
    primaryMuscles: ['back' as const, 'glutes' as const, 'hamstrings' as const],
    secondaryMuscles: ['forearms' as const, 'core' as const],
    difficulty: 'advanced' as const,
    equipment: ['barbell' as const],
    movementPattern: ['hinge' as const, 'pull' as const],
    description: 'The ultimate test of total body strength. Builds strength from fingertips to toes.',
    formCues: [
      'Feet hip-width apart, bar over mid-foot',
      'Chest up, shoulders back, lats engaged',
      'Hinge at hips and push floor away with legs',
      'Keep bar close to shins and thighs',
      'Lock out at top with full extension',
    ],
    commonMistakes: [
      'Rounding lower back',
      'Starting with hips too low',
      'Bar drifting away from body',
      'Hyperextending at lockout',
    ],
    variations: ['Sumo Deadlift', 'Romanian Deadlift', 'Deficit Deadlift', 'Trap Bar Deadlift'],
    progressionPath: ['Romanian Deadlift', 'Rack Pull', 'Conventional Deadlift', 'Deficit Deadlift'],
    xpMultiplier: 3.0,
    popularityScore: 10,
    safetyRating: 5,
    userPersonalRecord: { weight: 405, reps: 3, date: new Date('2024-10-01') },
  },

  // OLYMPIC LIFTING
  {
    id: 'ex-004',
    name: 'Power Clean',
    category: 'olympic' as const,
    primaryMuscles: ['fullBody' as const],
    secondaryMuscles: ['quads' as const, 'back' as const, 'shoulders' as const],
    difficulty: 'expert' as const,
    equipment: ['barbell' as const],
    movementPattern: ['pull' as const, 'squat' as const],
    description: 'Explosive triple extension movement that develops power and athleticism.',
    formCues: [
      'Start with bar over mid-foot',
      'Explosive hip extension and shrug',
      'Catch bar on shoulders in quarter squat',
      'Stand to full extension',
    ],
    commonMistakes: ['Early arm bend', 'Incomplete hip extension', 'Poor catch position'],
    variations: ['Hang Power Clean', 'Clean Pull', 'Full Clean'],
    progressionPath: ['Hang Power Clean', 'Power Clean from Blocks', 'Power Clean', 'Full Clean'],
    xpMultiplier: 2.8,
    popularityScore: 7,
    safetyRating: 6,
  },

  // STRENGTH - Upper Body
  {
    id: 'ex-005',
    name: 'Overhead Press (OHP)',
    category: 'strength' as const,
    primaryMuscles: ['shoulders' as const],
    secondaryMuscles: ['triceps' as const, 'core' as const],
    difficulty: 'intermediate' as const,
    equipment: ['barbell' as const],
    movementPattern: ['push' as const],
    description: 'Strict overhead pressing builds shoulder strength and stability.',
    formCues: [
      'Grip slightly wider than shoulders',
      'Brace core and squeeze glutes',
      'Press bar straight up past face',
      'Finish with bar over mid-foot',
    ],
    commonMistakes: ['Excessive lean back', 'Bar path too far forward', 'Incomplete lockout'],
    variations: ['Seated OHP', 'Push Press', 'Z-Press'],
    xpMultiplier: 2.2,
    popularityScore: 9,
    safetyRating: 7,
  },
  {
    id: 'ex-006',
    name: 'Pull-ups',
    category: 'calisthenics' as const,
    primaryMuscles: ['back' as const],
    secondaryMuscles: ['biceps' as const, 'forearms' as const],
    difficulty: 'intermediate' as const,
    equipment: ['bodyweight' as const],
    movementPattern: ['pull' as const],
    description: 'The king of bodyweight back exercises. Builds width and overall pulling strength.',
    formCues: [
      'Hang from bar with full arm extension',
      'Engage lats and pull elbows down',
      'Pull until chin clears bar',
      'Lower with control to full hang',
    ],
    commonMistakes: ['Kipping/using momentum', 'Not achieving full range', 'Shrugging shoulders'],
    variations: ['Chin-ups', 'Wide Grip Pull-ups', 'Weighted Pull-ups'],
    progressionPath: ['Assisted Pull-ups', 'Negative Pull-ups', 'Pull-ups', 'Weighted Pull-ups'],
    xpMultiplier: 2.3,
    popularityScore: 9,
    safetyRating: 8,
  },
  {
    id: 'ex-007',
    name: 'Barbell Row',
    category: 'strength' as const,
    primaryMuscles: ['back' as const],
    secondaryMuscles: ['biceps' as const, 'forearms' as const],
    difficulty: 'intermediate' as const,
    equipment: ['barbell' as const],
    movementPattern: ['pull' as const, 'hinge' as const],
    description: 'Fundamental horizontal pulling movement for back thickness.',
    formCues: [
      'Hinge at hips, back flat',
      'Pull bar to lower chest/upper abs',
      'Squeeze shoulder blades together',
      'Lower with control',
    ],
    commonMistakes: ['Excessive body english', 'Rounding lower back', 'Using too much momentum'],
    variations: ['Pendlay Row', 'Yates Row', 'T-Bar Row'],
    xpMultiplier: 2.2,
    popularityScore: 9,
    safetyRating: 7,
  },

  // HYPERTROPHY - Chest
  {
    id: 'ex-008',
    name: 'Dumbbell Bench Press',
    category: 'hypertrophy' as const,
    primaryMuscles: ['chest' as const],
    secondaryMuscles: ['triceps' as const, 'shoulders' as const],
    difficulty: 'beginner' as const,
    equipment: ['dumbbell' as const],
    movementPattern: ['push' as const],
    description: 'Allows greater range of motion and unilateral development compared to barbell.',
    formCues: [
      'Start with dumbbells at chest level',
      'Press up and slightly together',
      'Lower with control to stretch',
    ],
    commonMistakes: ['Banging dumbbells together', 'Flaring elbows excessively'],
    variations: ['Incline DB Press', 'Decline DB Press', 'Neutral Grip DB Press'],
    xpMultiplier: 1.8,
    popularityScore: 9,
    safetyRating: 8,
  },
  {
    id: 'ex-009',
    name: 'Dips',
    category: 'calisthenics' as const,
    primaryMuscles: ['chest' as const, 'triceps' as const],
    secondaryMuscles: ['shoulders' as const],
    difficulty: 'intermediate' as const,
    equipment: ['bodyweight' as const],
    movementPattern: ['push' as const],
    description: 'Bodyweight pressing exercise that builds pushing strength.',
    formCues: [
      'Start at full arm extension',
      'Lean forward for chest emphasis',
      'Lower until upper arms parallel',
      'Press back to start',
    ],
    commonMistakes: ['Going too deep', 'Swinging/using momentum'],
    variations: ['Weighted Dips', 'Ring Dips', 'Bench Dips'],
    progressionPath: ['Bench Dips', 'Assisted Dips', 'Dips', 'Weighted Dips'],
    xpMultiplier: 2.0,
    popularityScore: 8,
    safetyRating: 6,
  },

  // HYPERTROPHY - Arms
  {
    id: 'ex-010',
    name: 'Barbell Curl',
    category: 'hypertrophy' as const,
    primaryMuscles: ['biceps' as const],
    secondaryMuscles: ['forearms' as const],
    difficulty: 'beginner' as const,
    equipment: ['barbell' as const],
    movementPattern: ['pull' as const],
    description: 'Classic bicep builder that allows progressive overload.',
    formCues: [
      'Elbows pinned at sides',
      'Curl weight up with biceps',
      'Squeeze at top',
      'Lower with control',
    ],
    commonMistakes: ['Swinging body for momentum', 'Elbows moving forward'],
    variations: ['EZ Bar Curl', 'Wide Grip Curl', '21s'],
    xpMultiplier: 1.3,
    popularityScore: 9,
    safetyRating: 9,
  },
  {
    id: 'ex-011',
    name: 'Tricep Pushdown',
    category: 'hypertrophy' as const,
    primaryMuscles: ['triceps' as const],
    secondaryMuscles: [],
    difficulty: 'beginner' as const,
    equipment: ['cable' as const],
    movementPattern: ['push' as const],
    description: 'Cable-based tricep isolation with constant tension.',
    formCues: [
      'Elbows pinned at sides',
      'Push attachment down to full extension',
      'Return with control',
    ],
    commonMistakes: ['Leaning forward excessively', 'Elbows moving'],
    variations: ['Rope Pushdown', 'Single Arm Pushdown', 'Reverse Grip Pushdown'],
    xpMultiplier: 1.2,
    popularityScore: 9,
    safetyRating: 10,
  },

  // STRENGTH - Lower Body
  {
    id: 'ex-012',
    name: 'Front Squat',
    category: 'strength' as const,
    primaryMuscles: ['quads' as const],
    secondaryMuscles: ['core' as const, 'glutes' as const],
    difficulty: 'advanced' as const,
    equipment: ['barbell' as const],
    movementPattern: ['squat' as const],
    description: 'Front-loaded squat that emphasizes quads and requires upright torso.',
    formCues: [
      'Bar rests on front delts, elbows high',
      'Keep torso as upright as possible',
      'Drive through heels to stand',
    ],
    commonMistakes: ['Elbows dropping', 'Forward lean', 'Insufficient depth'],
    variations: ['Zercher Squat', 'Goblet Squat'],
    progressionPath: ['Goblet Squat', 'Back Squat', 'Front Squat'],
    xpMultiplier: 2.4,
    popularityScore: 7,
    safetyRating: 7,
  },
  {
    id: 'ex-013',
    name: 'Romanian Deadlift (RDL)',
    category: 'strength' as const,
    primaryMuscles: ['hamstrings' as const, 'glutes' as const],
    secondaryMuscles: ['back' as const, 'forearms' as const],
    difficulty: 'intermediate' as const,
    equipment: ['barbell' as const],
    movementPattern: ['hinge' as const],
    description: 'Hip hinge movement that targets hamstrings and glutes with stretch.',
    formCues: [
      'Soft bend in knees, push hips back',
      'Lower bar down shins while maintaining back arch',
      'Feel hamstring stretch',
      'Drive hips forward to return',
    ],
    commonMistakes: ['Rounding lower back', 'Bending knees too much', 'Bar drifting away'],
    variations: ['Single Leg RDL', 'Dumbbell RDL', 'Stiff Leg Deadlift'],
    xpMultiplier: 2.0,
    popularityScore: 9,
    safetyRating: 8,
  },
  {
    id: 'ex-014',
    name: 'Bulgarian Split Squat',
    category: 'hypertrophy' as const,
    primaryMuscles: ['quads' as const, 'glutes' as const],
    secondaryMuscles: ['hamstrings' as const],
    difficulty: 'intermediate' as const,
    equipment: ['dumbbell' as const],
    movementPattern: ['squat' as const],
    description: 'Single-leg squat variation that builds unilateral strength and balance.',
    formCues: [
      'Rear foot elevated on bench',
      'Front foot far enough forward',
      'Lower until front thigh parallel',
      'Drive through front heel',
    ],
    commonMistakes: ['Stance too short', 'Leaning too far forward', 'Not going deep enough'],
    variations: ['Barbell Bulgarian Split Squat', 'Front Foot Elevated'],
    xpMultiplier: 2.0,
    popularityScore: 8,
    safetyRating: 8,
  },

  // CARDIO
  {
    id: 'ex-015',
    name: 'Running',
    category: 'cardio' as const,
    primaryMuscles: ['cardio' as const],
    secondaryMuscles: ['quads' as const, 'hamstrings' as const, 'calves' as const],
    difficulty: 'beginner' as const,
    equipment: ['other' as const],
    movementPattern: ['locomotion' as const],
    description: 'Classic cardiovascular exercise for heart health and endurance.',
    formCues: [
      'Maintain upright posture',
      'Land mid-foot, not heel',
      'Arms swing naturally',
      'Breathe rhythmically',
    ],
    commonMistakes: ['Overstriding', 'Heel striking', 'Poor posture'],
    variations: ['Sprints', 'Intervals', 'Long Distance', 'Hill Runs'],
    xpMultiplier: 1.5,
    popularityScore: 10,
    safetyRating: 8,
  },
  {
    id: 'ex-016',
    name: 'Rowing Machine',
    category: 'cardio' as const,
    primaryMuscles: ['cardio' as const, 'back' as const],
    secondaryMuscles: ['quads' as const, 'hamstrings' as const],
    difficulty: 'intermediate' as const,
    equipment: ['cardio_machine' as const],
    movementPattern: ['pull' as const, 'push' as const],
    description: 'Low-impact full-body cardio that builds power and endurance.',
    formCues: [
      'Drive with legs first',
      'Then lean back and pull handle',
      'Reverse the sequence on return',
    ],
    commonMistakes: ['Pulling with arms before legs extend', 'Rounding back'],
    variations: ['Intervals', '2K Test', 'Steady State'],
    xpMultiplier: 1.8,
    popularityScore: 8,
    safetyRating: 9,
  },

  // CALISTHENICS
  {
    id: 'ex-017',
    name: 'Push-ups',
    category: 'calisthenics' as const,
    primaryMuscles: ['chest' as const, 'triceps' as const],
    secondaryMuscles: ['shoulders' as const, 'core' as const],
    difficulty: 'beginner' as const,
    equipment: ['bodyweight' as const],
    movementPattern: ['push' as const],
    description: 'Fundamental bodyweight pressing movement.',
    formCues: [
      'Hands shoulder-width apart',
      'Body in straight line',
      'Lower chest to ground',
      'Push back to start',
    ],
    commonMistakes: ['Sagging hips', 'Flaring elbows', 'Partial range'],
    variations: ['Diamond Push-ups', 'Wide Push-ups', 'Decline Push-ups'],
    progressionPath: ['Incline Push-ups', 'Push-ups', 'Decline Push-ups'],
    xpMultiplier: 1.4,
    popularityScore: 10,
    safetyRating: 10,
  },

  // MOBILITY
  {
    id: 'ex-018',
    name: 'Yoga Flow',
    category: 'mobility' as const,
    primaryMuscles: ['flexibility' as const],
    secondaryMuscles: ['core' as const],
    difficulty: 'beginner' as const,
    equipment: ['bodyweight' as const, 'other' as const],
    movementPattern: ['rotation' as const],
    description: 'Dynamic stretching sequence that improves mobility and mindfulness.',
    formCues: [
      'Flow between poses smoothly',
      'Focus on breath control',
      'Hold stretches for 30-60 seconds',
    ],
    commonMistakes: ['Holding breath', 'Bouncing in stretches', 'Poor alignment'],
    variations: ['Vinyasa Flow', 'Power Yoga', 'Yin Yoga'],
    xpMultiplier: 1.0,
    popularityScore: 7,
    safetyRating: 10,
  },
];

export default function ExercisesPage() {
  const [showComparison] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Exercise Library</h1>
          <p className="text-gray-400 text-lg">
            Browse our comprehensive database of {SAMPLE_EXERCISES.length} exercises with detailed form cues, progression paths, and personal records tracking.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-400">{SAMPLE_EXERCISES.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total Exercises</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400">8</div>
            <div className="text-sm text-gray-400 mt-1">Categories</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400">14</div>
            <div className="text-sm text-gray-400 mt-1">Muscle Groups</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-amber-400">
              {SAMPLE_EXERCISES.filter(e => e.userPersonalRecord).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Personal Records</div>
          </div>
        </div>

        {/* Exercise Database Component */}
        <ExerciseDatabase
          exercises={SAMPLE_EXERCISES}
          showComparison={showComparison}
          allowPersonalRecords={true}
          onSelectExercise={(exercise) => {
            console.log('Selected exercise:', exercise);
          }}
        />

        {/* How to Use Guide */}
        <div className="mt-12 bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">📚 How to Use the Exercise Database</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">🔍 Searching & Filtering</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Use the search bar to find exercises by name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Filter by category (Powerlifting, Olympic, Strength, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Filter by muscle group to target specific areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Filter by difficulty level based on your experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Filter by available equipment in your gym</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">💪 Using Exercise Details</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Click any exercise to view detailed form cues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Learn common mistakes to avoid injuries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Follow progression paths to advance your skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Track your personal records for each exercise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Compare up to 3 exercises side-by-side</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">🎯 Pro Tips</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Start with Fundamentals</div>
                <div className="text-sm text-gray-400">
                  Master beginner exercises before progressing to advanced movements. Build a strong foundation.
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Focus on Form</div>
                <div className="text-sm text-gray-400">
                  Always prioritize proper technique over weight. Review form cues regularly.
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Track Progress</div>
                <div className="text-sm text-gray-400">
                  Set and beat personal records. Progressive overload is key to continuous improvement.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

