'use client';

import { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ExerciseCategory = 
  | 'strength' 
  | 'hypertrophy' 
  | 'powerlifting' 
  | 'olympic' 
  | 'cardio' 
  | 'calisthenics' 
  | 'mobility' 
  | 'sports';

type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'forearms' 
  | 'core' 
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'fullBody' 
  | 'cardio' 
  | 'flexibility';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'elite';

type Equipment = 
  | 'barbell' 
  | 'dumbbell' 
  | 'kettlebell' 
  | 'cable' 
  | 'machine' 
  | 'bodyweight' 
  | 'bands' 
  | 'trx' 
  | 'cardio_machine' 
  | 'other';

type MovementPattern = 
  | 'push' 
  | 'pull' 
  | 'squat' 
  | 'hinge' 
  | 'carry' 
  | 'locomotion' 
  | 'rotation' 
  | 'antiRotation';

interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  difficulty: DifficultyLevel;
  equipment: Equipment[];
  movementPattern: MovementPattern[];
  description: string;
  formCues: string[];
  commonMistakes: string[];
  variations: string[];
  prerequisites?: string[];
  progressionPath?: string[];
  xpMultiplier: number;
  popularityScore: number;
  safetyRating: number; // 1-10
  userPersonalRecord?: {
    weight: number;
    reps: number;
    date: Date;
  };
}

interface ExerciseDatabaseProps {
  exercises: Exercise[];
  onSelectExercise?: (exercise: Exercise) => void;
  showComparison?: boolean;
  allowPersonalRecords?: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getCategoryIcon = (category: ExerciseCategory): string => {
  const icons: Record<ExerciseCategory, string> = {
    strength: '💪',
    hypertrophy: '🏋️',
    powerlifting: '⚡',
    olympic: '🔥',
    cardio: '🏃',
    calisthenics: '🤸',
    mobility: '🧘',
    sports: '⚽',
  };
  return icons[category];
};

const getCategoryName = (category: ExerciseCategory): string => {
  const names: Record<ExerciseCategory, string> = {
    strength: 'Strength',
    hypertrophy: 'Hypertrophy',
    powerlifting: 'Powerlifting',
    olympic: 'Olympic Lifting',
    cardio: 'Cardio',
    calisthenics: 'Calisthenics',
    mobility: 'Mobility & Stretching',
    sports: 'Sports & Conditioning',
  };
  return names[category];
};

const getMuscleGroupIcon = (muscle: MuscleGroup): string => {
  const icons: Record<MuscleGroup, string> = {
    chest: '🦁',
    back: '🦅',
    shoulders: '🦾',
    biceps: '💪',
    triceps: '🔨',
    forearms: '✊',
    core: '⭐',
    quads: '🦵',
    hamstrings: '🦴',
    glutes: '🍑',
    calves: '👟',
    fullBody: '🌟',
    cardio: '❤️',
    flexibility: '🌊',
  };
  return icons[muscle];
};

const getMuscleGroupName = (muscle: MuscleGroup): string => {
  const names: Record<MuscleGroup, string> = {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    forearms: 'Forearms',
    core: 'Core',
    quads: 'Quadriceps',
    hamstrings: 'Hamstrings',
    glutes: 'Glutes',
    calves: 'Calves',
    fullBody: 'Full Body',
    cardio: 'Cardiovascular',
    flexibility: 'Flexibility',
  };
  return names[muscle];
};

const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  const colors: Record<DifficultyLevel, string> = {
    beginner: 'text-green-400 border-green-500 bg-green-500/10',
    intermediate: 'text-blue-400 border-blue-500 bg-blue-500/10',
    advanced: 'text-purple-400 border-purple-500 bg-purple-500/10',
    expert: 'text-amber-400 border-amber-500 bg-amber-500/10',
    elite: 'text-red-400 border-red-500 bg-red-500/10',
  };
  return colors[difficulty];
};

const getDifficultyName = (difficulty: DifficultyLevel): string => {
  const names: Record<DifficultyLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    elite: 'Elite',
  };
  return names[difficulty];
};

const getEquipmentIcon = (equipment: Equipment): string => {
  const icons: Record<Equipment, string> = {
    barbell: '🏋️',
    dumbbell: '💪',
    kettlebell: '⚫',
    cable: '🔗',
    machine: '⚙️',
    bodyweight: '🧍',
    bands: '🎗️',
    trx: '⛓️',
    cardio_machine: '🏃',
    other: '🔧',
  };
  return icons[equipment];
};

const getEquipmentName = (equipment: Equipment): string => {
  const names: Record<Equipment, string> = {
    barbell: 'Barbell',
    dumbbell: 'Dumbbell',
    kettlebell: 'Kettlebell',
    cable: 'Cable',
    machine: 'Machine',
    bodyweight: 'Bodyweight',
    bands: 'Resistance Bands',
    trx: 'TRX/Suspension',
    cardio_machine: 'Cardio Machine',
    other: 'Other',
  };
  return names[equipment];
};

const getMovementPatternIcon = (pattern: MovementPattern): string => {
  const icons: Record<MovementPattern, string> = {
    push: '👐',
    pull: '🤲',
    squat: '⬇️',
    hinge: '🔽',
    carry: '🚶',
    locomotion: '🏃',
    rotation: '🔄',
    antiRotation: '🛡️',
  };
  return icons[pattern];
};

const getMovementPatternName = (pattern: MovementPattern): string => {
  const names: Record<MovementPattern, string> = {
    push: 'Push',
    pull: 'Pull',
    squat: 'Squat',
    hinge: 'Hinge',
    carry: 'Carry',
    locomotion: 'Locomotion',
    rotation: 'Rotation',
    antiRotation: 'Anti-Rotation',
  };
  return names[pattern];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExerciseDatabase({
  exercises,
  onSelectExercise,
  showComparison = false,
  allowPersonalRecords = true,
}: ExerciseDatabaseProps) {
  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'popularity' | 'xp'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [comparisonExercises, setComparisonExercises] = useState<Exercise[]>([]);

  // Filter exercises
  const filteredExercises = exercises.filter((exercise) => {
    // Search query
    if (searchQuery && !exercise.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && exercise.category !== selectedCategory) {
      return false;
    }

    // Muscle filter
    if (selectedMuscle !== 'all') {
      const hasMusclePrimary = exercise.primaryMuscles.includes(selectedMuscle);
      const hasMuscleSecondary = exercise.secondaryMuscles.includes(selectedMuscle);
      if (!hasMusclePrimary && !hasMuscleSecondary) {
        return false;
      }
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) {
      return false;
    }

    // Equipment filter
    if (selectedEquipment !== 'all' && !exercise.equipment.includes(selectedEquipment)) {
      return false;
    }

    return true;
  });

  // Sort exercises
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'difficulty': {
        const difficultyOrder: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert', 'elite'];
        return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
      }
      case 'popularity':
        return b.popularityScore - a.popularityScore;
      case 'xp':
        return b.xpMultiplier - a.xpMultiplier;
      default:
        return 0;
    }
  });

  // Handle exercise selection
  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    if (onSelectExercise) {
      onSelectExercise(exercise);
    }
  };

  // Handle comparison toggle
  const toggleComparison = (exercise: Exercise) => {
    const isInComparison = comparisonExercises.some((e) => e.id === exercise.id);
    if (isInComparison) {
      setComparisonExercises(comparisonExercises.filter((e) => e.id !== exercise.id));
    } else if (comparisonExercises.length < 3) {
      setComparisonExercises([...comparisonExercises, exercise]);
    }
  };

  const categories: ExerciseCategory[] = ['strength', 'hypertrophy', 'powerlifting', 'olympic', 'cardio', 'calisthenics', 'mobility', 'sports'];
  const muscles: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'core', 'quads', 'hamstrings', 'glutes', 'calves', 'fullBody', 'cardio', 'flexibility'];
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert', 'elite'];
  const equipmentTypes: Equipment[] = ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine', 'bodyweight', 'bands', 'trx', 'cardio_machine', 'other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Exercise Database</h2>
          <p className="text-gray-400 mt-1">
            {sortedExercises.length} {sortedExercises.length === 1 ? 'exercise' : 'exercises'} found
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg border ${
              viewMode === 'grid'
                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
            }`}
          >
            🔲 Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg border ${
              viewMode === 'list'
                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
            }`}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="popularity">Sort by Popularity</option>
          <option value="name">Sort by Name</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="xp">Sort by XP Value</option>
        </select>
      </div>

      {/* Category Filters */}
      <div>
        <div className="text-sm font-semibold text-gray-400 mb-2">CATEGORY</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg border ${
              selectedCategory === 'all'
                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border ${
                selectedCategory === category
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              }`}
            >
              {getCategoryIcon(category)} {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Muscle Group Filters */}
      <div>
        <div className="text-sm font-semibold text-gray-400 mb-2">MUSCLE GROUPS</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMuscle('all')}
            className={`px-4 py-2 rounded-lg border ${
              selectedMuscle === 'all'
                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
            }`}
          >
            All Muscles
          </button>
          {muscles.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-4 py-2 rounded-lg border ${
                selectedMuscle === muscle
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              }`}
            >
              {getMuscleGroupIcon(muscle)} {getMuscleGroupName(muscle)}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty Filter */}
        <div>
          <div className="text-sm font-semibold text-gray-400 mb-2">DIFFICULTY LEVEL</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-3 py-2 rounded-lg border ${
                selectedDifficulty === 'all'
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              }`}
            >
              All
            </button>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3 py-2 rounded-lg border ${
                  selectedDifficulty === difficulty
                    ? getDifficultyColor(difficulty)
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                {getDifficultyName(difficulty)}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Filter */}
        <div>
          <div className="text-sm font-semibold text-gray-400 mb-2">EQUIPMENT</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedEquipment('all')}
              className={`px-3 py-2 rounded-lg border ${
                selectedEquipment === 'all'
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              }`}
            >
              All
            </button>
            {equipmentTypes.map((equipment) => (
              <button
                key={equipment}
                onClick={() => setSelectedEquipment(equipment)}
                className={`px-3 py-2 rounded-lg border ${
                  selectedEquipment === equipment
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                {getEquipmentIcon(equipment)} {getEquipmentName(equipment)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Mode Banner */}
      {showComparison && comparisonExercises.length > 0 && (
        <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-400 font-semibold">
                Comparison Mode: {comparisonExercises.length}/3 exercises selected
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {comparisonExercises.map((e) => e.name).join(' vs ')}
              </div>
            </div>
            <button
              onClick={() => setComparisonExercises([])}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      )}

      {/* Exercise Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={handleSelectExercise}
              onToggleComparison={showComparison ? toggleComparison : undefined}
              isInComparison={comparisonExercises.some((e) => e.id === exercise.id)}
              allowPersonalRecords={allowPersonalRecords}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedExercises.map((exercise) => (
            <ExerciseListItem
              key={exercise.id}
              exercise={exercise}
              onSelect={handleSelectExercise}
              onToggleComparison={showComparison ? toggleComparison : undefined}
              isInComparison={comparisonExercises.some((e) => e.id === exercise.id)}
              allowPersonalRecords={allowPersonalRecords}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {sortedExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-xl font-semibold text-white mb-2">No exercises found</div>
          <div className="text-gray-400">Try adjusting your filters or search query</div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          allowPersonalRecords={allowPersonalRecords}
        />
      )}

      {/* Comparison Modal */}
      {showComparison && comparisonExercises.length >= 2 && (
        <ExerciseComparisonModal
          exercises={comparisonExercises}
          onClose={() => setComparisonExercises([])}
        />
      )}
    </div>
  );
}

// ============================================================================
// EXERCISE CARD COMPONENT (Grid View)
// ============================================================================

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onToggleComparison?: (exercise: Exercise) => void;
  isInComparison: boolean;
  allowPersonalRecords: boolean;
}

function ExerciseCard({
  exercise,
  onSelect,
  onToggleComparison,
  isInComparison,
  allowPersonalRecords,
}: ExerciseCardProps) {
  return (
    <div
      className={`bg-gray-800/50 border rounded-lg overflow-hidden hover:border-purple-500 transition-all cursor-pointer ${
        isInComparison ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-700'
      }`}
      onClick={() => onSelect(exercise)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(exercise.category)}</span>
            <div>
              <div className="font-semibold text-white">{exercise.name}</div>
              <div className="text-xs text-gray-400">{getCategoryName(exercise.category)}</div>
            </div>
          </div>
          {onToggleComparison && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComparison(exercise);
              }}
              className={`px-2 py-1 rounded text-xs ${
                isInComparison
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {isInComparison ? '✓ Compare' : '+ Compare'}
            </button>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className={`inline-block px-2 py-1 rounded-lg border text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
          {getDifficultyName(exercise.difficulty)} • {exercise.xpMultiplier}x XP
        </div>
      </div>

      {/* Primary Muscles */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-xs font-semibold text-gray-400 mb-2">PRIMARY MUSCLES</div>
        <div className="flex flex-wrap gap-1">
          {exercise.primaryMuscles.map((muscle) => (
            <span
              key={muscle}
              className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-xs text-purple-400"
            >
              {getMuscleGroupIcon(muscle)} {getMuscleGroupName(muscle)}
            </span>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-xs font-semibold text-gray-400 mb-2">EQUIPMENT</div>
        <div className="flex flex-wrap gap-1">
          {exercise.equipment.map((eq) => (
            <span
              key={eq}
              className="inline-block px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
            >
              {getEquipmentIcon(eq)} {getEquipmentName(eq)}
            </span>
          ))}
        </div>
      </div>

      {/* Personal Record */}
      {allowPersonalRecords && exercise.userPersonalRecord && (
        <div className="p-4 bg-amber-500/10 border-t border-amber-500/30">
          <div className="text-xs font-semibold text-amber-400 mb-1">🏆 PERSONAL RECORD</div>
          <div className="text-sm text-white">
            {exercise.userPersonalRecord.weight} lbs × {exercise.userPersonalRecord.reps} reps
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {exercise.userPersonalRecord.date.toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 bg-gray-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{exercise.popularityScore}/10</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🛡️</span>
            <span>{exercise.safetyRating}/10</span>
          </div>
        </div>
        <button className="text-xs text-purple-400 hover:text-purple-300">
          View Details →
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EXERCISE LIST ITEM COMPONENT (List View)
// ============================================================================

function ExerciseListItem({
  exercise,
  onSelect,
  onToggleComparison,
  isInComparison,
  allowPersonalRecords,
}: ExerciseCardProps) {
  return (
    <div
      className={`bg-gray-800/50 border rounded-lg p-4 hover:border-purple-500 transition-all cursor-pointer ${
        isInComparison ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-700'
      }`}
      onClick={() => onSelect(exercise)}
    >
      <div className="flex items-center justify-between">
        {/* Left: Exercise Info */}
        <div className="flex items-center gap-4 flex-1">
          <span className="text-3xl">{getCategoryIcon(exercise.category)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="font-semibold text-white text-lg">{exercise.name}</div>
              <div className={`px-2 py-0.5 rounded-lg border text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                {getDifficultyName(exercise.difficulty)}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{getCategoryName(exercise.category)}</span>
              <span>•</span>
              <span>{exercise.primaryMuscles.map((m) => getMuscleGroupName(m)).join(', ')}</span>
              <span>•</span>
              <span>{exercise.equipment.map((e) => getEquipmentName(e)).join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Right: Stats & Actions */}
        <div className="flex items-center gap-6">
          {/* Personal Record */}
          {allowPersonalRecords && exercise.userPersonalRecord && (
            <div className="text-right">
              <div className="text-xs text-amber-400 font-semibold">🏆 PR</div>
              <div className="text-sm text-white">
                {exercise.userPersonalRecord.weight} × {exercise.userPersonalRecord.reps}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-purple-400 font-semibold">{exercise.xpMultiplier}x</div>
              <div className="text-xs text-gray-400">XP</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-semibold">{exercise.popularityScore}</div>
              <div className="text-xs text-gray-400">Pop</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-semibold">{exercise.safetyRating}</div>
              <div className="text-xs text-gray-400">Safety</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onToggleComparison && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComparison(exercise);
                }}
                className={`px-3 py-1.5 rounded text-sm ${
                  isInComparison
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {isInComparison ? '✓' : '+'}
              </button>
            )}
            <button className="text-sm text-purple-400 hover:text-purple-300">
              Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXERCISE DETAIL MODAL
// ============================================================================

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
  allowPersonalRecords: boolean;
}

function ExerciseDetailModal({
  exercise,
  onClose,
  allowPersonalRecords,
}: ExerciseDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getCategoryIcon(exercise.category)}</span>
            <div>
              <h3 className="text-2xl font-bold text-white">{exercise.name}</h3>
              <div className="text-gray-400 mt-1">{getCategoryName(exercise.category)}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Difficulty & Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border text-center ${getDifficultyColor(exercise.difficulty)}`}>
              <div className="text-2xl font-bold">{getDifficultyName(exercise.difficulty)}</div>
              <div className="text-sm opacity-70 mt-1">Difficulty</div>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">{exercise.xpMultiplier}x</div>
              <div className="text-sm text-gray-400 mt-1">XP Multiplier</div>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-400">{exercise.popularityScore}/10</div>
              <div className="text-sm text-gray-400 mt-1">Popularity</div>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{exercise.safetyRating}/10</div>
              <div className="text-sm text-gray-400 mt-1">Safety Rating</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-sm font-semibold text-gray-400 mb-2">DESCRIPTION</div>
            <p className="text-gray-300 leading-relaxed">{exercise.description}</p>
          </div>

          {/* Muscle Groups */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2">PRIMARY MUSCLES</div>
              <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-3 py-1.5 bg-purple-500/20 border border-purple-500 rounded-lg text-purple-400"
                  >
                    {getMuscleGroupIcon(muscle)} {getMuscleGroupName(muscle)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2">SECONDARY MUSCLES</div>
              <div className="flex flex-wrap gap-2">
                {exercise.secondaryMuscles.length > 0 ? (
                  exercise.secondaryMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                    >
                      {getMuscleGroupIcon(muscle)} {getMuscleGroupName(muscle)}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Equipment & Movement Patterns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2">EQUIPMENT REQUIRED</div>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((eq) => (
                  <span
                    key={eq}
                    className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                  >
                    {getEquipmentIcon(eq)} {getEquipmentName(eq)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2">MOVEMENT PATTERNS</div>
              <div className="flex flex-wrap gap-2">
                {exercise.movementPattern.map((pattern) => (
                  <span
                    key={pattern}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-400"
                  >
                    {getMovementPatternIcon(pattern)} {getMovementPatternName(pattern)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form Cues */}
          <div>
            <div className="text-sm font-semibold text-gray-400 mb-2">✅ FORM CUES</div>
            <ul className="space-y-2">
              {exercise.formCues.map((cue, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div>
            <div className="text-sm font-semibold text-gray-400 mb-2">⚠️ COMMON MISTAKES</div>
            <ul className="space-y-2">
              {exercise.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Variations */}
          {exercise.variations.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2">🔄 VARIATIONS</div>
              <div className="flex flex-wrap gap-2">
                {exercise.variations.map((variation, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                  >
                    {variation}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {exercise.prerequisites && exercise.prerequisites.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2">📋 PREREQUISITES</div>
              <ul className="space-y-2">
                {exercise.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progression Path */}
          {exercise.progressionPath && exercise.progressionPath.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-2">📈 PROGRESSION PATH</div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {exercise.progressionPath.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 shrink-0">
                    <div className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-lg text-purple-400 whitespace-nowrap">
                      {step}
                    </div>
                    {index < exercise.progressionPath!.length - 1 && (
                      <span className="text-gray-500">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Record */}
          {allowPersonalRecords && exercise.userPersonalRecord && (
            <div className="bg-amber-500/10 border border-amber-500 rounded-lg p-4">
              <div className="text-sm font-semibold text-amber-400 mb-3">🏆 YOUR PERSONAL RECORD</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">{exercise.userPersonalRecord.weight} lbs</div>
                  <div className="text-sm text-gray-400">Weight</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{exercise.userPersonalRecord.reps} reps</div>
                  <div className="text-sm text-gray-400">Reps</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {exercise.userPersonalRecord.date.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-400">Date</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-semibold hover:bg-gray-700"
          >
            Close
          </button>
          <button className="flex-1 px-6 py-3 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700">
            Add to Workout
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXERCISE COMPARISON MODAL
// ============================================================================

interface ExerciseComparisonModalProps {
  exercises: Exercise[];
  onClose: () => void;
}

function ExerciseComparisonModal({
  exercises,
  onClose,
}: ExerciseComparisonModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Exercise Comparison</h3>
            <p className="text-gray-400 mt-1">Compare {exercises.length} exercises side by side</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${exercises.length}, 1fr)` }}>
            {/* Exercise Names */}
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{getCategoryIcon(exercise.category)}</div>
                <div className="font-semibold text-white">{exercise.name}</div>
                <div className="text-sm text-gray-400 mt-1">{getCategoryName(exercise.category)}</div>
              </div>
            ))}

            {/* Difficulty */}
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">DIFFICULTY</div>
                <div className={`px-3 py-1.5 rounded-lg border text-center font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                  {getDifficultyName(exercise.difficulty)}
                </div>
              </div>
            ))}

            {/* XP Multiplier */}
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">XP MULTIPLIER</div>
                <div className="text-2xl font-bold text-purple-400 text-center">{exercise.xpMultiplier}x</div>
              </div>
            ))}

            {/* Primary Muscles */}
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">PRIMARY MUSCLES</div>
                <div className="space-y-1">
                  {exercise.primaryMuscles.map((muscle) => (
                    <div key={muscle} className="text-sm text-white">
                      {getMuscleGroupIcon(muscle)} {getMuscleGroupName(muscle)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Equipment */}
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">EQUIPMENT</div>
                <div className="space-y-1">
                  {exercise.equipment.map((eq) => (
                    <div key={eq} className="text-sm text-white">
                      {getEquipmentIcon(eq)} {getEquipmentName(eq)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Stats */}
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-3">RATINGS</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Popularity</span>
                    <span className="text-sm font-semibold text-amber-400">{exercise.popularityScore}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Safety</span>
                    <span className="text-sm font-semibold text-green-400">{exercise.safetyRating}/10</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
