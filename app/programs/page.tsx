'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppLayout, PageContainer, PageHeader } from '@/components/layout'
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Dumbbell,
  Clock,
  Target,
  Flame,
  Star,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'

// Mock data - would come from database
const programCategories = [
  'All Programs',
  'Strength',
  'Hypertrophy',
  'Powerlifting',
  'Bodybuilding',
  'Athletic',
  'Beginner',
  'Custom',
]

const mockPrograms = [
  {
    id: 1,
    name: 'Starting Strength',
    description: 'Classic beginner strength program focusing on compound lifts',
    category: 'Strength',
    difficulty: 'Beginner',
    duration: '12 weeks',
    daysPerWeek: 3,
    popularity: 4.8,
    enrolledUsers: 1250,
    progress: 0,
    imageColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'PPL - Push Pull Legs',
    description: 'High volume hypertrophy program with 6-day split',
    category: 'Hypertrophy',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    daysPerWeek: 6,
    popularity: 4.9,
    enrolledUsers: 2100,
    progress: 45,
    imageColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    name: 'Powerlifting Peaking',
    description: 'Advanced program for competition preparation',
    category: 'Powerlifting',
    difficulty: 'Advanced',
    duration: '16 weeks',
    daysPerWeek: 4,
    popularity: 4.7,
    enrolledUsers: 850,
    progress: 0,
    imageColor: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    name: 'Bodyweight Mastery',
    description: 'No equipment needed - master calisthenics and gymnastics',
    category: 'Athletic',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    daysPerWeek: 5,
    popularity: 4.6,
    enrolledUsers: 950,
    progress: 0,
    imageColor: 'from-green-500 to-emerald-500',
  },
  {
    id: 5,
    name: 'Upper/Lower Split',
    description: 'Balanced 4-day program for strength and size',
    category: 'Hypertrophy',
    difficulty: 'Intermediate',
    duration: '12 weeks',
    daysPerWeek: 4,
    popularity: 4.8,
    enrolledUsers: 1500,
    progress: 0,
    imageColor: 'from-indigo-500 to-purple-500',
  },
  {
    id: 6,
    name: 'My Custom Program',
    description: 'Your personalized training program',
    category: 'Custom',
    difficulty: 'Custom',
    duration: 'Ongoing',
    daysPerWeek: 4,
    popularity: 0,
    enrolledUsers: 1,
    progress: 23,
    imageColor: 'from-yellow-500 to-orange-500',
  },
]

const difficultyColors = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
  Intermediate: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
  Custom: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
}

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Programs')
  const [showFilters, setShowFilters] = useState(false)

  const filteredPrograms = mockPrograms.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Programs' || program.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const activePrograms = mockPrograms.filter(p => p.progress > 0)

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Training Programs"
          description="Choose a structured program or create your own custom training plan"
          icon="💪"
          action={
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Program</span>
            </button>
          }
        />

        {/* Active Programs Section */}
        {activePrograms.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Continue Training</h2>
              <Link href="/programs/active" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activePrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{program.name}</h3>
                      <p className="text-sm text-gray-400">{program.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${difficultyColors[program.difficulty as keyof typeof difficultyColors]}`}>
                      {program.difficulty}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{program.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${program.imageColor} transition-all duration-500`}
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href={`/programs/${program.id}`}
                    className="block w-full py-2 text-center bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-400 font-medium transition-all"
                  >
                    Continue Program
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search & Filter Bar */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                showFilters
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-900/50 text-gray-400 border border-slate-800 hover:border-blue-500/50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h3 className="text-sm font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {programCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800/50 text-gray-400 border border-slate-700 hover:border-blue-500/30'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Programs Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {selectedCategory === 'All Programs' ? 'All Programs' : selectedCategory}
              <span className="text-sm text-gray-400 ml-2">({filteredPrograms.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <Link
                key={program.id}
                href={`/programs/${program.id}`}
                className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all"
              >
                {/* Gradient Header */}
                <div className={`h-32 bg-gradient-to-br ${program.imageColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border bg-black/30 backdrop-blur-sm ${difficultyColors[program.difficulty as keyof typeof difficultyColors]}`}>
                      {program.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Dumbbell className="w-12 h-12 text-white/30" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {program.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{program.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Dumbbell className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{program.daysPerWeek}x/week</span>
                    </div>
                    {program.popularity > 0 && (
                      <>
                        <div className="flex items-center space-x-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300">{program.popularity}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{program.enrolledUsers.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                      View Details
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No programs found</h3>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold">Active Programs</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400">{activePrograms.length}</p>
              <p className="text-sm text-gray-400 mt-1">Programs in progress</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Flame className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold">Completion Rate</h3>
              </div>
              <p className="text-3xl font-bold text-green-400">87%</p>
              <p className="text-sm text-gray-400 mt-1">Average completion</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
                <h3 className="font-semibold">Total Workouts</h3>
              </div>
              <p className="text-3xl font-bold text-orange-400">142</p>
              <p className="text-sm text-gray-400 mt-1">Across all programs</p>
            </div>
          </div>
        </section>
      </PageContainer>
    </AppLayout>
  )
}

