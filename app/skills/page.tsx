'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Award,
  CheckCircle2,
  Lock,
  Zap,
  Star,
  Crown,
  Shield,
  Dumbbell,
  Activity,
  Calendar,
  BarChart3,
  Plus,
} from 'lucide-react';

type SkillCategory = 'strength' | 'volume' | 'consistency' | 'endurance' | 'technique' | 'all';
type SkillTier = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'elite' | 'legendary';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  tier: SkillTier;
  points: number;
  progress: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  requirement: string;
  currentValue?: number;
  targetValue?: number;
  earnedDate?: string;
}

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');

  // Mock data - replace with real API calls
  const userStats = {
    totalPoints: 8750,
    unlockedSkills: 24,
    completedSkills: 18,
    inProgress: 6,
    nextMilestone: 'Deadlift 2x Bodyweight',
    nextProgress: 87,
  };

  const skills: Skill[] = [
    // Strength Skills
    {
      id: '1',
      name: 'First Bench Press',
      description: 'Complete your first bench press workout',
      category: 'strength',
      tier: 'beginner',
      points: 100,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: 'Bench Press 1 rep',
      earnedDate: '2024-08-15',
    },
    {
      id: '2',
      name: 'Bench Bodyweight',
      description: 'Bench press your bodyweight for 1 rep',
      category: 'strength',
      tier: 'novice',
      points: 250,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: 'Bench 1x BW',
      currentValue: 80,
      targetValue: 80,
      earnedDate: '2024-09-20',
    },
    {
      id: '3',
      name: 'Bench 1.25x Bodyweight',
      description: 'Bench press 1.25x bodyweight for 1 rep',
      category: 'strength',
      tier: 'intermediate',
      points: 500,
      progress: 72,
      isUnlocked: true,
      isCompleted: false,
      requirement: 'Bench 1.25x BW',
      currentValue: 87.5,
      targetValue: 100,
    },
    {
      id: '4',
      name: 'Squat 1.5x Bodyweight',
      description: 'Squat 1.5x bodyweight for 1 rep',
      category: 'strength',
      tier: 'intermediate',
      points: 500,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: 'Squat 1.5x BW',
      currentValue: 120,
      targetValue: 120,
      earnedDate: '2024-10-01',
    },
    {
      id: '5',
      name: 'Deadlift 2x Bodyweight',
      description: 'Deadlift 2x bodyweight for 1 rep',
      category: 'strength',
      tier: 'advanced',
      points: 1000,
      progress: 87,
      isUnlocked: true,
      isCompleted: false,
      requirement: 'Deadlift 2x BW',
      currentValue: 150,
      targetValue: 160,
    },
    {
      id: '6',
      name: 'The Big Three',
      description: 'Achieve elite total in powerlifting (bench/squat/deadlift)',
      category: 'strength',
      tier: 'elite',
      points: 2500,
      progress: 45,
      isUnlocked: true,
      isCompleted: false,
      requirement: 'Combined total 5x BW',
      currentValue: 357.5,
      targetValue: 400,
    },
    // Volume Skills
    {
      id: '7',
      name: '100K Club',
      description: 'Lift a total of 100,000 kg',
      category: 'volume',
      tier: 'novice',
      points: 500,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: '100K kg total',
      earnedDate: '2024-07-10',
    },
    {
      id: '8',
      name: '500K Club',
      description: 'Lift a total of 500,000 kg',
      category: 'volume',
      tier: 'intermediate',
      points: 1000,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: '500K kg total',
      earnedDate: '2024-09-15',
    },
    {
      id: '9',
      name: '1M Club',
      description: 'Lift a total of 1,000,000 kg',
      category: 'volume',
      tier: 'advanced',
      points: 2000,
      progress: 75,
      isUnlocked: true,
      isCompleted: false,
      requirement: '1M kg total',
      currentValue: 750000,
      targetValue: 1000000,
    },
    // Consistency Skills
    {
      id: '10',
      name: 'Week Warrior',
      description: 'Train for 7 consecutive days',
      category: 'consistency',
      tier: 'beginner',
      points: 200,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: '7 day streak',
      earnedDate: '2024-08-20',
    },
    {
      id: '11',
      name: 'Month Master',
      description: 'Train for 30 consecutive days',
      category: 'consistency',
      tier: 'intermediate',
      points: 750,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: '30 day streak',
      earnedDate: '2024-09-05',
    },
    {
      id: '12',
      name: 'Quarter Champion',
      description: 'Train for 90 consecutive days',
      category: 'consistency',
      tier: 'advanced',
      points: 1500,
      progress: 40,
      isUnlocked: true,
      isCompleted: false,
      requirement: '90 day streak',
      currentValue: 36,
      targetValue: 90,
    },
    // Endurance Skills
    {
      id: '13',
      name: 'Pull-up Apprentice',
      description: 'Perform 10 consecutive pull-ups',
      category: 'endurance',
      tier: 'novice',
      points: 300,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: '10 pull-ups',
      earnedDate: '2024-08-30',
    },
    {
      id: '14',
      name: 'Pull-up Master',
      description: 'Perform 20 consecutive pull-ups',
      category: 'endurance',
      tier: 'advanced',
      points: 1000,
      progress: 60,
      isUnlocked: true,
      isCompleted: false,
      requirement: '20 pull-ups',
      currentValue: 12,
      targetValue: 20,
    },
    {
      id: '15',
      name: 'Push-up Pro',
      description: 'Perform 50 consecutive push-ups',
      category: 'endurance',
      tier: 'intermediate',
      points: 500,
      progress: 90,
      isUnlocked: true,
      isCompleted: false,
      requirement: '50 push-ups',
      currentValue: 45,
      targetValue: 50,
    },
    // Technique Skills
    {
      id: '16',
      name: 'Form Fundamentals',
      description: 'Master basic form on all compound lifts',
      category: 'technique',
      tier: 'beginner',
      points: 250,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: 'Pass form check',
      earnedDate: '2024-08-10',
    },
    {
      id: '17',
      name: 'Squat Specialist',
      description: 'Achieve mastery level in squat technique',
      category: 'technique',
      tier: 'intermediate',
      points: 600,
      progress: 100,
      isUnlocked: true,
      isCompleted: true,
      requirement: 'Squat mastery',
      earnedDate: '2024-09-25',
    },
    {
      id: '18',
      name: 'Bench Specialist',
      description: 'Achieve mastery level in bench press technique',
      category: 'technique',
      tier: 'intermediate',
      points: 600,
      progress: 85,
      isUnlocked: true,
      isCompleted: false,
      requirement: 'Bench mastery',
    },
  ];

  const categories = [
    { id: 'all' as const, label: 'All Skills', icon: Trophy, color: 'text-purple-400' },
    { id: 'strength' as const, label: 'Strength', icon: Dumbbell, color: 'text-orange-400' },
    { id: 'volume' as const, label: 'Volume', icon: BarChart3, color: 'text-blue-400' },
    { id: 'consistency' as const, label: 'Consistency', icon: Flame, color: 'text-red-400' },
    { id: 'endurance' as const, label: 'Endurance', icon: Activity, color: 'text-green-400' },
    { id: 'technique' as const, label: 'Technique', icon: Target, color: 'text-cyan-400' },
  ];

  const getTierColor = (tier: SkillTier) => {
    switch (tier) {
      case 'beginner':
        return { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400' };
      case 'novice':
        return { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400' };
      case 'intermediate':
        return { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400' };
      case 'advanced':
        return { bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', text: 'text-orange-400' };
      case 'elite':
        return { bg: 'from-red-500/20 to-pink-500/20', border: 'border-red-500/30', text: 'text-red-400' };
      case 'legendary':
        return { bg: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    }
  };

  const getTierIcon = (tier: SkillTier) => {
    switch (tier) {
      case 'beginner': return Shield;
      case 'novice': return Award;
      case 'intermediate': return Star;
      case 'advanced': return Trophy;
      case 'elite': return Zap;
      case 'legendary': return Crown;
    }
  };

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  const completedSkills = filteredSkills.filter(s => s.isCompleted);
  const inProgressSkills = filteredSkills.filter(s => s.isUnlocked && !s.isCompleted);
  const lockedSkills = filteredSkills.filter(s => !s.isUnlocked);

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Skills & Milestones"
          description="Track your training achievements and unlock new milestones"
          icon={<Trophy className="w-8 h-8 text-yellow-400" />}
          action={
            <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Custom Goal
            </button>
          }
        />

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Points */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Points</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    {userStats.totalPoints.toLocaleString()}
                  </p>
                </div>
              </div>
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-sm text-gray-400">From {userStats.completedSkills} completed skills</div>
          </div>

          {/* Unlocked Skills */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Unlocked Skills</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {userStats.unlockedSkills}
                  </p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Completed: {userStats.completedSkills}</span>
              <span className="text-purple-400">In Progress: {userStats.inProgress}</span>
            </div>
          </div>

          {/* Next Milestone */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Next Milestone</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent truncate">
                    {userStats.nextMilestone}
                  </p>
                </div>
              </div>
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                style={{ width: `${userStats.nextProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-900/50 text-gray-400 border border-slate-800 hover:border-slate-700 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="space-y-6">
          {/* In Progress Skills */}
          {inProgressSkills.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                In Progress ({inProgressSkills.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressSkills.map((skill) => {
                  const tierColors = getTierColor(skill.tier);
                  const TierIcon = getTierIcon(skill.tier);
                  return (
                    <div
                      key={skill.id}
                      className={`bg-gradient-to-br ${tierColors.bg} border ${tierColors.border} rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TierIcon className={`w-5 h-5 ${tierColors.text}`} />
                          <span className={`text-xs font-medium ${tierColors.text} uppercase`}>
                            {skill.tier}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${tierColors.text}`}>
                          {skill.points} pts
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{skill.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{skill.description}</p>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className={`font-medium ${tierColors.text}`}>{skill.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${tierColors.bg.replace('/20', '')} h-2 rounded-full transition-all`}
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                      </div>
                      {skill.currentValue && skill.targetValue && (
                        <div className="text-sm text-gray-400">
                          {skill.currentValue.toLocaleString()} / {skill.targetValue.toLocaleString()}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">{skill.requirement}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Skills */}
          {completedSkills.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Completed ({completedSkills.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedSkills.map((skill) => {
                  const tierColors = getTierColor(skill.tier);
                  const TierIcon = getTierIcon(skill.tier);
                  return (
                    <div
                      key={skill.id}
                      className={`bg-gradient-to-br ${tierColors.bg} border ${tierColors.border} rounded-xl p-6 relative overflow-hidden`}
                    >
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TierIcon className={`w-5 h-5 ${tierColors.text}`} />
                          <span className={`text-xs font-medium ${tierColors.text} uppercase`}>
                            {skill.tier}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${tierColors.text}`}>
                          {skill.points} pts
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{skill.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{skill.description}</p>
                      {skill.earnedDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Earned {skill.earnedDate}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Locked Skills */}
          {lockedSkills.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-gray-500" />
                Locked ({lockedSkills.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedSkills.map((skill) => {
                  const TierIcon = getTierIcon(skill.tier);
                  return (
                    <div
                      key={skill.id}
                      className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 opacity-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TierIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {skill.tier}
                          </span>
                        </div>
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-400">{skill.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{skill.description}</p>
                      <div className="text-xs text-gray-600">
                        Requirement: {skill.requirement}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </AppLayout>
  );
}
