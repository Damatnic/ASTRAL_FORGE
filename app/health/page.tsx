'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Heart,
  Activity,
  Moon,
  Apple,
  Droplet,
  Flame,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Target,
  Zap,
  Shield,
} from 'lucide-react';

type HealthTab = 'overview' | 'sleep' | 'nutrition' | 'injuries' | 'goals';

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState<HealthTab>('overview');

  // Mock data - replace with real API calls
  const healthStats = {
    overallHealth: 85,
    sleepScore: 78,
    nutritionScore: 82,
    hydration: 65,
    activeInjuries: 1,
    recoveryDays: 3,
  };

  const sleepData = [
    { date: '2024-10-01', hours: 7.5, quality: 8, deep: 2.1, rem: 1.8 },
    { date: '2024-10-02', hours: 6.2, quality: 6, deep: 1.5, rem: 1.2 },
    { date: '2024-10-03', hours: 8.1, quality: 9, deep: 2.5, rem: 2.0 },
    { date: '2024-10-04', hours: 7.8, quality: 8, deep: 2.2, rem: 1.9 },
    { date: '2024-10-05', hours: 7.0, quality: 7, deep: 1.8, rem: 1.5 },
  ];

  const nutritionLog = [
    { meal: 'Breakfast', time: '07:30 AM', calories: 450, protein: 25, carbs: 45, fats: 18, quality: 9 },
    { meal: 'Lunch', time: '12:30 PM', calories: 620, protein: 42, carbs: 55, fats: 22, quality: 8 },
    { meal: 'Snack', time: '03:30 PM', calories: 180, protein: 12, carbs: 15, fats: 8, quality: 7 },
    { meal: 'Dinner', time: '06:30 PM', calories: 580, protein: 38, carbs: 50, fats: 20, quality: 9 },
  ];

  const injuries = [
    {
      id: 1,
      name: 'Lower Back Strain',
      severity: 'moderate',
      affectedArea: 'Lower Back',
      startDate: '2024-09-28',
      estimatedRecovery: '2024-10-12',
      status: 'recovering',
      restrictedExercises: ['Deadlifts', 'Heavy Squats', 'Good Mornings'],
      notes: 'Focus on core stability work and stretching. Avoid heavy spinal loading.',
    },
  ];

  const wellnessGoals = [
    { id: 1, name: '8 Hours Sleep/Night', current: 7.3, target: 8.0, unit: 'hrs', progress: 91 },
    { id: 2, name: 'Daily Hydration', current: 2.4, target: 3.5, unit: 'L', progress: 69 },
    { id: 3, name: 'Weekly Mobility Work', current: 3, target: 5, unit: 'sessions', progress: 60 },
  ];

  const recentActivities = [
    { date: '2024-10-05', type: 'Sleep', value: '7.0 hrs', quality: 7, icon: Moon },
    { date: '2024-10-05', type: 'Hydration', value: '2.8 L', quality: 8, icon: Droplet },
    { date: '2024-10-05', type: 'Nutrition', value: '1830 cal', quality: 8, icon: Apple },
    { date: '2024-10-04', type: 'Recovery', value: 'Stretching 20min', quality: 9, icon: Activity },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Heart },
    { id: 'sleep' as const, label: 'Sleep', icon: Moon },
    { id: 'nutrition' as const, label: 'Nutrition', icon: Apple },
    { id: 'injuries' as const, label: 'Injuries', icon: AlertTriangle },
    { id: 'goals' as const, label: 'Goals', icon: Target },
  ];

  const avgSleepHours = sleepData.reduce((sum, day) => sum + day.hours, 0) / sleepData.length;
  const avgSleepQuality = sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length;
  const totalCalories = nutritionLog.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = nutritionLog.reduce((sum, meal) => sum + meal.protein, 0);

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Health Hub"
          description="Track your wellness, recovery, and overall health"
          icon={<Heart className="w-8 h-8 text-red-400" />}
          action={
            <button className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Log Activity
            </button>
          }
        />

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Health Score */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                  <Heart className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Overall Health</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {healthStats.overallHealth}
                  </p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${healthStats.overallHealth}%` }}
              />
            </div>
          </div>

          {/* Sleep Score */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                  <Moon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Sleep Score</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {healthStats.sleepScore}
                  </p>
                </div>
              </div>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Avg: {avgSleepHours.toFixed(1)} hrs</span>
              <span className="text-blue-400">Quality: {avgSleepQuality.toFixed(1)}/10</span>
            </div>
          </div>

          {/* Nutrition Score */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg">
                  <Apple className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nutrition Score</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    {healthStats.nutritionScore}
                  </p>
                </div>
              </div>
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{totalCalories} cal</span>
              <span className="text-orange-400">{totalProtein}g protein</span>
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                  <Droplet className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Hydration</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {healthStats.hydration}%
                  </p>
                </div>
              </div>
              <TrendingDown className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${healthStats.hydration}%` }}
              />
            </div>
          </div>

          {/* Active Injuries */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Injuries</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {healthStats.activeInjuries}
                  </p>
                </div>
              </div>
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-sm text-gray-400">
              Est. Recovery: {healthStats.recoveryDays} days
            </div>
          </div>

          {/* Recovery Status */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Recovery</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Good
                  </p>
                </div>
              </div>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-sm text-gray-400">Ready for training</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-900/50 text-gray-400 border border-slate-800 hover:border-slate-700 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-purple-400" />
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg">
                              <Icon className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.type}</p>
                              <p className="text-sm text-gray-400">{activity.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{activity.value}</p>
                            <p className="text-sm text-gray-400">Quality: {activity.quality}/10</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Injuries */}
                {injuries.length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      Active Injuries
                    </h2>
                    <div className="space-y-4">
                      {injuries.map((injury) => (
                        <div key={injury.id} className="p-4 bg-slate-800/50 rounded-lg border border-yellow-500/20">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-lg">{injury.name}</h3>
                              <p className="text-sm text-gray-400">{injury.affectedArea}</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                              {injury.severity}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                            <div>
                              <p className="text-gray-400">Started</p>
                              <p className="font-medium">{injury.startDate}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Est. Recovery</p>
                              <p className="font-medium">{injury.estimatedRecovery}</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-gray-400 mb-2">Restricted Exercises:</p>
                            <div className="flex flex-wrap gap-2">
                              {injury.restrictedExercises.map((exercise, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                                  {exercise}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{injury.notes}</p>
                          <Link
                            href="/health/injuries"
                            className="inline-block mt-3 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            View Details →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Wellness Goals */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    Wellness Goals
                  </h2>
                  <div className="space-y-4">
                    {wellnessGoals.map((goal) => (
                      <div key={goal.id}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">{goal.name}</p>
                          <p className="text-sm text-gray-400">
                            {goal.current}/{goal.target} {goal.unit}
                          </p>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-400" />
                      Log Sleep
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors flex items-center gap-2">
                      <Apple className="w-4 h-4 text-orange-400" />
                      Log Meal
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-cyan-400" />
                      Log Water
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      Report Injury
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sleep Tab */}
          {activeTab === 'sleep' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Moon className="w-6 h-6 text-blue-400" />
                Sleep Tracking
              </h2>
              <div className="space-y-4">
                {sleepData.map((day, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{day.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Quality: {day.quality}/10</span>
                        <span className="font-medium text-blue-400">{day.hours} hrs</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                      <div className="p-2 bg-slate-700/50 rounded">
                        <p className="text-gray-400">Total</p>
                        <p className="font-medium">{day.hours} hrs</p>
                      </div>
                      <div className="p-2 bg-slate-700/50 rounded">
                        <p className="text-gray-400">Deep</p>
                        <p className="font-medium">{day.deep} hrs</p>
                      </div>
                      <div className="p-2 bg-slate-700/50 rounded">
                        <p className="text-gray-400">REM</p>
                        <p className="font-medium">{day.rem} hrs</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Apple className="w-6 h-6 text-orange-400" />
                Nutrition Log
              </h2>
              <div className="space-y-4">
                {nutritionLog.map((meal, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-lg">{meal.meal}</h3>
                        <p className="text-sm text-gray-400">{meal.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-400">{meal.calories} cal</p>
                        <p className="text-sm text-gray-400">Quality: {meal.quality}/10</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="p-2 bg-slate-700/50 rounded text-center">
                        <p className="text-gray-400">Protein</p>
                        <p className="font-medium text-blue-400">{meal.protein}g</p>
                      </div>
                      <div className="p-2 bg-slate-700/50 rounded text-center">
                        <p className="text-gray-400">Carbs</p>
                        <p className="font-medium text-green-400">{meal.carbs}g</p>
                      </div>
                      <div className="p-2 bg-slate-700/50 rounded text-center">
                        <p className="text-gray-400">Fats</p>
                        <p className="font-medium text-yellow-400">{meal.fats}g</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Injuries Tab */}
          {activeTab === 'injuries' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  Injury Management
                </h2>
                <Link
                  href="/health/injuries"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  View Full History
                </Link>
              </div>
              {injuries.length > 0 ? (
                <div className="space-y-4">
                  {injuries.map((injury) => (
                    <div key={injury.id} className="p-6 bg-slate-800/50 rounded-lg border border-yellow-500/20">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-xl mb-1">{injury.name}</h3>
                          <p className="text-gray-400">{injury.affectedArea}</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                          {injury.severity}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-slate-700/50 rounded">
                          <p className="text-sm text-gray-400 mb-1">Started</p>
                          <p className="font-medium">{injury.startDate}</p>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded">
                          <p className="text-sm text-gray-400 mb-1">Est. Recovery</p>
                          <p className="font-medium">{injury.estimatedRecovery}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Restricted Exercises:</p>
                        <div className="flex flex-wrap gap-2">
                          {injury.restrictedExercises.map((exercise, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm">
                              {exercise}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-700/30 rounded">
                        <p className="text-sm text-gray-300">{injury.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Active Injuries</h3>
                  <p className="text-gray-400">You're injury-free! Keep up the good work.</p>
                </div>
              )}
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6 text-red-400" />
                  Wellness Goals
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all">
                  Add Goal
                </button>
              </div>
              <div className="space-y-4">
                {wellnessGoals.map((goal) => (
                  <div key={goal.id} className="p-6 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-lg">{goal.name}</h3>
                      <span className="text-sm font-medium text-red-400">{goal.progress}%</span>
                    </div>
                    <div className="mb-3">
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Current: {goal.current} {goal.unit}
                      </span>
                      <span className="text-gray-400">
                        Target: {goal.target} {goal.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </AppLayout>
  );
}
