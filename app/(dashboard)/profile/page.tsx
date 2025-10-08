'use client'

import { useCharacter } from '@/hooks/use-data'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'
import { 
  User, 
  Sword, 
  Shield, 
  Zap, 
  Target,
  TrendingUp,
  Award,
} from 'lucide-react'
import { CLASS_INFO, CharacterClass } from '@/lib/api/character'

export default function ProfilePage() {
  const { data: character, loading } = useCharacter()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-neutral-400 uppercase tracking-wider font-bold">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Profile Found</h2>
          <p className="text-gray-400">Start training to create your profile!</p>
        </Card>
      </div>
    )
  }

  const classInfo = CLASS_INFO[character.characterClass as CharacterClass]
  const progressPercent = (character.currentXP / character.xpToNextLevel) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-amber-400 to-amber-500 text-transparent bg-clip-text mb-2 uppercase tracking-wider">
          Athlete Profile
        </h1>
        <p className="text-neutral-400 uppercase tracking-wider font-bold">Your training progression and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-900/50 to-amber-800/50 flex items-center justify-center border-2 border-amber-500/50">
                  <span className="text-6xl">{classInfo.icon}</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider">{classInfo.name}</h2>
                  <span className="px-3 py-1 bg-amber-900/50 border-2 border-amber-500/50 text-sm font-black text-amber-300 uppercase tracking-wider">
                    Level {character.level}
                  </span>
                </div>
                <p className="text-neutral-400 mb-4 uppercase tracking-wider font-bold">{classInfo.description}</p>

                {/* Progress Points */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-neutral-400 uppercase tracking-wider font-bold">Progress to Next Tier</span>
                    <span className="font-black text-amber-400 uppercase tracking-wider">
                      {character.currentXP.toLocaleString()} / {character.xpToNextLevel.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="w-full bg-neutral-700 h-3">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-amber-500 h-3 transition-all"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
                    {(character.xpToNextLevel - character.currentXP).toLocaleString()} pts to next tier
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Link href="/profile/skills">
                    <Button variant="primary" size="sm">
                      <Target className="w-4 h-4 mr-2" />
                      Milestones
                    </Button>
                  </Link>
                  <Link href="/profile/achievements">
                    <Button variant="secondary" size="sm">
                      <Award className="w-4 h-4 mr-2" />
                      Achievements
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sword className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider">Strength</h3>
              </div>
              <p className="text-3xl font-black text-white uppercase tracking-wider">{character.stats.strength}</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
                +{Math.round((classInfo.bonuses.strength - 1) * 100)}% bonus
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider">Endurance</h3>
              </div>
              <p className="text-3xl font-black text-white uppercase tracking-wider">{character.stats.endurance}</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
                +{Math.round((classInfo.bonuses.endurance - 1) * 100)}% bonus
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider">Power</h3>
              </div>
              <p className="text-3xl font-black text-white uppercase tracking-wider">{character.stats.power}</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
                +{Math.round((classInfo.bonuses.power - 1) * 100)}% bonus
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider">Technique</h3>
              </div>
              <p className="text-3xl font-black text-white uppercase tracking-wider">{character.stats.technique}</p>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Total Progress */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-black text-white mb-4 uppercase tracking-wider">Career Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold">Total Progress Points</span>
                  <span className="font-black text-amber-400 uppercase tracking-wider">
                    {character.totalXP.toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold">Training Tier</span>
                  <span className="font-black text-white uppercase tracking-wider">{character.level}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Class Bonuses */}
          <Card className="p-6">
            <h3 className="text-lg font-black text-white mb-4 uppercase tracking-wider">Class Bonuses</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Strength</span>
                <span className={`font-black uppercase tracking-wider ${
                  classInfo.bonuses.strength > 1 ? 'text-amber-400' : 
                  classInfo.bonuses.strength < 1 ? 'text-red-400' : 
                  'text-neutral-400'
                }`}>
                  {classInfo.bonuses.strength > 1 ? '+' : ''}
                  {Math.round((classInfo.bonuses.strength - 1) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Endurance</span>
                <span className={`font-black uppercase tracking-wider ${
                  classInfo.bonuses.endurance > 1 ? 'text-amber-400' : 
                  classInfo.bonuses.endurance < 1 ? 'text-red-400' : 
                  'text-neutral-400'
                }`}>
                  {classInfo.bonuses.endurance > 1 ? '+' : ''}
                  {Math.round((classInfo.bonuses.endurance - 1) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Power</span>
                <span className={`font-black uppercase tracking-wider ${
                  classInfo.bonuses.power > 1 ? 'text-amber-400' : 
                  classInfo.bonuses.power < 1 ? 'text-red-400' : 
                  'text-neutral-400'
                }`}>
                  {classInfo.bonuses.power > 1 ? '+' : ''}
                  {Math.round((classInfo.bonuses.power - 1) * 100)}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Your class provides passive bonuses to your training effectiveness
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
