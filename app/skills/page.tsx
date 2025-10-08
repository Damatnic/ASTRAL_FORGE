'use client'

import Link from 'next/link'
import { Trophy, Target, Flame, Zap, Shield, Sword, Award, Star } from 'lucide-react'

export default function SkillsPage() {
  // Placeholder skill categories
  const skillCategories = [
    {
      name: 'STRENGTH',
      icon: Sword,
      color: 'from-red-600 to-red-500',
      borderColor: 'border-red-600',
      description: 'Master the art of power',
      skills: ['Warrior\'s Might', 'Iron Resolve', 'Titan\'s Grip'],
      unlocked: 0,
      total: 3
    },
    {
      name: 'ENDURANCE',
      icon: Shield,
      color: 'from-blue-600 to-blue-500',
      borderColor: 'border-blue-600',
      description: 'Build unbreakable stamina',
      skills: ['Marathon Runner', 'Endless Energy', 'Survivor'],
      unlocked: 0,
      total: 3
    },
    {
      name: 'DISCIPLINE',
      icon: Target,
      color: 'from-amber-600 to-amber-500',
      borderColor: 'border-amber-600',
      description: 'Forge unwavering dedication',
      skills: ['Streak Master', 'Daily Warrior', 'Consistent Champion'],
      unlocked: 0,
      total: 3
    },
    {
      name: 'POWER',
      icon: Zap,
      color: 'from-purple-600 to-purple-500',
      borderColor: 'border-purple-600',
      description: 'Unleash explosive force',
      skills: ['PR Crusher', 'Peak Performance', 'Maximum Output'],
      unlocked: 0,
      total: 3
    },
  ]

  const achievements = [
    { name: 'First Victory', icon: Trophy, earned: false },
    { name: 'Week Warrior', icon: Flame, earned: false },
    { name: 'Strength Master', icon: Sword, earned: false },
    { name: 'Perfect Week', icon: Star, earned: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-3">
              <Trophy className="w-10 h-10 text-amber-500" />
              WARRIOR SKILLS
            </h1>
            <p className="text-neutral-400 uppercase tracking-wider font-bold">
              Unlock your true potential through training
            </p>
          </div>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider border-2 border-amber-600 transition-colors"
            aria-label="Back to Dashboard"
          >
            ← Back
          </Link>
        </div>

        {/* Progress Summary */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-amber-600 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-black text-amber-400">0</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Skills Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-amber-400">12</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Total Skills</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-amber-400">0</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Skill Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-amber-400">0%</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Completion</div>
            </div>
          </div>
        </div>

        {/* Skill Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-amber-500">Skill Trees</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.name}
                  className={`bg-neutral-900 border-2 ${category.borderColor} p-6 hover:border-opacity-100 transition-all`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-4 bg-gradient-to-br ${category.color}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black uppercase tracking-wider mb-1">
                        {category.name}
                      </h3>
                      <p className="text-neutral-400 text-sm font-bold">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-2 mb-4">
                    {category.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-neutral-950 border-2 border-neutral-800 p-3"
                      >
                        <span className="text-neutral-400 uppercase tracking-wider font-bold text-sm">
                          {skill}
                        </span>
                        <span className="text-neutral-600 text-xs uppercase tracking-wider font-bold">
                          Locked
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400 font-bold uppercase tracking-wider">
                      Progress
                    </span>
                    <span className="text-amber-400 font-black">
                      {category.unlocked} / {category.total}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-neutral-800 border-2 border-neutral-700">
                    <div 
                      className={`h-full bg-gradient-to-r ${category.color} transition-all`}
                      style={{ width: `${(category.unlocked / category.total) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-neutral-900 border-2 border-amber-600 p-6">
          <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-amber-500">
            Recent Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.name}
                  className={`text-center p-4 border-2 ${
                    achievement.earned
                      ? 'border-amber-600 bg-amber-900/20'
                      : 'border-neutral-800 bg-neutral-950 opacity-50'
                  }`}
                >
                  <Icon className={`w-12 h-12 mx-auto mb-2 ${
                    achievement.earned ? 'text-amber-400' : 'text-neutral-600'
                  }`} />
                  <div className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                    {achievement.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 border-2 border-amber-700/20 p-8 text-center">
          <Award className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-black uppercase tracking-wider mb-2 text-neutral-400">
            Skill System In Development
          </h3>
          <p className="text-neutral-500">
            Complete workouts and hit milestones to unlock powerful skills and abilities
          </p>
        </div>
      </div>
    </div>
  )
}
