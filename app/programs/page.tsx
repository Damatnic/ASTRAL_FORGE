'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { AppLayout, PageContainer, PageHeader } from '@/components/layout'
import { QuickActionMenu, ContextMenu } from '@/components/quick-action-menu'
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
  Zap,
  Eye,
  Bookmark,
} from 'lucide-react'

// Dynamic imports for heavy modal/wizard components
const ProgramModal = dynamic(
  () => import('@/components/program-modal').then(mod => ({ default: mod.ProgramModal })),
  { ssr: false }
)

const ProgramCreatorWizard = dynamic(
  () => import('@/components/program-creator-wizard'),
  { ssr: false }
)

const CalendarPreview = dynamic(
  () => import('@/components/calendar-preview'),
  { ssr: false }
)

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
    imageColor: 'from-amber-600 to-amber-500',
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
    isActive: true,
    imageColor: 'from-amber-600 to-amber-500',
    schedule: {
      monday: 'Push',
      tuesday: 'Pull',
      wednesday: 'Legs',
      thursday: 'Push',
      friday: 'Pull',
      saturday: 'Legs',
      sunday: 'Rest',
    },
    equipment: ['Barbell', 'Dumbbells', 'Cables', 'Bench', 'Squat Rack'],
    goals: ['Muscle Hypertrophy', 'Strength Gains', 'Athletic Performance'],
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
    imageColor: 'from-amber-600 to-amber-500',
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
    imageColor: 'from-amber-600 to-amber-500',
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
    imageColor: 'from-amber-600 to-amber-500',
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
    imageColor: 'from-amber-600 to-amber-500',
  },
]

const difficultyColors = {
  Beginner: 'text-amber-400 bg-amber-950/50 border-amber-800/50',
  Intermediate: 'text-amber-500 bg-amber-950/70 border-amber-700',
  Advanced: 'text-amber-600 bg-amber-950 border-amber-600',
  Custom: 'text-neutral-400 bg-neutral-950 border-neutral-700',
}

// Recommendation Algorithm
function getRecommendedPrograms(programs: typeof mockPrograms, userLevel: string = 'Intermediate', userGoals: string[] = ['Muscle Hypertrophy']) {
  // Score each program based on user profile
  const scoredPrograms = programs.map(program => {
    let score = 0
    
    // Difficulty match (highest weight)
    if (program.difficulty === userLevel) score += 50
    else if (userLevel === 'Beginner' && program.difficulty === 'Intermediate') score += 20
    else if (userLevel === 'Intermediate' && program.difficulty === 'Advanced') score += 20
    else if (userLevel === 'Advanced' && program.difficulty === 'Intermediate') score += 15
    
    // Popularity boost
    score += program.popularity * 5
    
    // Category alignment with goals
    if (userGoals.includes('Muscle Hypertrophy') && program.category === 'Hypertrophy') score += 30
    if (userGoals.includes('Strength Gains') && (program.category === 'Strength' || program.category === 'Powerlifting')) score += 30
    if (userGoals.includes('Athletic Performance') && program.category === 'Athletic') score += 30
    
    // Frequency preference (moderate frequency for most users)
    if (program.daysPerWeek >= 3 && program.daysPerWeek <= 5) score += 15
    
    // Don't recommend active programs or custom programs
    if (program.isActive) score = 0
    if (program.category === 'Custom') score = 0
    
    return { ...program, recommendationScore: score }
  })
  
  // Sort by score and return top 3
  return scoredPrograms
    .filter(p => p.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 3)
}

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Programs')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<typeof mockPrograms[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'browse'>('browse')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; programId: number } | null>(null)
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0)

  // Modal handlers
  const handleProgramClick = useCallback((program: typeof mockPrograms[0]) => {
    setSelectedProgram(program)
    setIsModalOpen(true)
  }, [])

  function handleStartProgram() {
    if (selectedProgram) {
      console.log('Starting program:', selectedProgram.name)
      // In real app: enroll user, update state, show success toast
    }
    setIsModalOpen(false)
  }

  function handleSaveProgram(programData: any) {
    console.log('Saving new program:', programData)
    // In real app: save to database, add to programs list, show success toast
    setIsWizardOpen(false)
  }

  const toggleFavorite = useCallback((programId: number) => {
    setFavorites(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    )
  }, [])

  function handleShare(program: typeof mockPrograms[0]) {
    // In real app: open share dialog or copy link
    const url = `${window.location.origin}/programs/${program.id}`
    navigator.clipboard.writeText(url)
    console.log('Shared program:', program.name, url)
    // Show toast notification
  }

  function handleContextMenu(e: React.MouseEvent, programId: number) {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, programId })
  }

  function handleCopyLink(program: typeof mockPrograms[0]) {
    const url = `${window.location.origin}/programs/${program.id}`
    navigator.clipboard.writeText(url)
    console.log('Copied link:', url)
  }

  function handleExportSchedule(program: typeof mockPrograms[0]) {
    console.log('Exporting schedule for:', program.name)
    // In real app: generate ICS file or PDF
  }

  function handlePrintDetails(program: typeof mockPrograms[0]) {
    console.log('Printing details for:', program.name)
    // In real app: open print dialog with program details
  }

  const activePrograms = mockPrograms.filter(p => p.isActive)
  
  // Get personalized recommendations (would use real user data in production)
  const recommendedPrograms = getRecommendedPrograms(
    mockPrograms,
    'Intermediate', // Would come from user profile
    ['Muscle Hypertrophy', 'Strength Gains'] // Would come from user goals
  )
  
  const filteredPrograms = mockPrograms.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Programs' || program.category === selectedCategory
    const matchesTab = activeTab === 'browse' || (activeTab === 'active' && program.isActive)
    return matchesSearch && matchesCategory && matchesTab
  })

  // Keyboard navigation - must be after filteredPrograms
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isModalOpen || isWizardOpen) return

      const visiblePrograms = filteredPrograms
      if (visiblePrograms.length === 0) return

      switch (e.key) {
        case 'ArrowRight':
          setFocusedCardIndex(prev => Math.min(prev + 1, visiblePrograms.length - 1))
          break
        case 'ArrowLeft':
          setFocusedCardIndex(prev => Math.max(prev - 1, 0))
          break
        case 'ArrowDown':
          setFocusedCardIndex(prev => Math.min(prev + 3, visiblePrograms.length - 1))
          break
        case 'ArrowUp':
          setFocusedCardIndex(prev => Math.max(prev - 3, 0))
          break
        case 'Enter':
          if (focusedCardIndex >= 0 && focusedCardIndex < visiblePrograms.length) {
            handleProgramClick(visiblePrograms[focusedCardIndex])
          }
          break
        case ' ':
          e.preventDefault()
          if (focusedCardIndex >= 0 && focusedCardIndex < visiblePrograms.length) {
            toggleFavorite(visiblePrograms[focusedCardIndex].id)
          }
          break
        case 'Escape':
          if (contextMenu) {
            setContextMenu(null)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredPrograms, focusedCardIndex, isModalOpen, isWizardOpen, contextMenu, toggleFavorite, handleProgramClick])

  // Keyboard navigation - moved after filteredPrograms definition
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isModalOpen || isWizardOpen) return

      const visiblePrograms = filteredPrograms
      if (visiblePrograms.length === 0) return

      switch (e.key) {
        case 'ArrowRight':
          setFocusedCardIndex(prev => Math.min(prev + 1, visiblePrograms.length - 1))
          break
        case 'ArrowLeft':
          setFocusedCardIndex(prev => Math.max(prev - 1, 0))
          break
        case 'ArrowDown':
          setFocusedCardIndex(prev => Math.min(prev + 3, visiblePrograms.length - 1))
          break
        case 'ArrowUp':
          setFocusedCardIndex(prev => Math.max(prev - 3, 0))
          break
        case 'Enter':
          if (focusedCardIndex >= 0 && focusedCardIndex < visiblePrograms.length) {
            handleProgramClick(visiblePrograms[focusedCardIndex])
          }
          break
        case ' ':
          e.preventDefault()
          if (focusedCardIndex >= 0 && focusedCardIndex < visiblePrograms.length) {
            toggleFavorite(visiblePrograms[focusedCardIndex].id)
          }
          break
        case 'Escape':
          if (contextMenu) {
            setContextMenu(null)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredPrograms, focusedCardIndex, isModalOpen, isWizardOpen, contextMenu])

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Training Campaigns"
          description="Choose a structured battle plan or forge your own path to glory"
          icon="⚔️"
          action={
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="px-6 py-3 bg-amber-950/50 hover:bg-amber-950/70 border-2 border-amber-700 hover:border-amber-600 font-bold transition-all flex items-center space-x-2 text-amber-400 uppercase tracking-wider"
            >
              <Plus className="w-5 h-5" />
              <span>Create Campaign</span>
            </button>
          }
        />

        {/* Tabs Navigation */}
        <section className="mb-6">
          <div className="flex items-center space-x-2 border-b-2 border-neutral-800">
            <button
              onClick={() => setActiveTab('browse')}
              className={`relative px-6 py-3 font-bold uppercase tracking-wider transition-all ${
                activeTab === 'browse'
                  ? 'text-amber-400'
                  : 'text-neutral-400 hover:text-amber-400'
              }`}
            >
              Browse All
              {activeTab === 'browse' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
              <span className="ml-2 px-2 py-0.5 text-xs bg-neutral-900 border-2 border-neutral-800 text-neutral-400">
                {mockPrograms.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`relative px-6 py-3 font-bold uppercase tracking-wider transition-all ${
                activeTab === 'active'
                  ? 'text-amber-400'
                  : 'text-neutral-400 hover:text-amber-400'
              }`}
            >
              Active Campaigns
              {activeTab === 'active' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
              {activePrograms.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-amber-950/50 border-2 border-amber-700 text-amber-400 font-bold">
                  {activePrograms.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Active Programs Quick View - Only show in Browse tab */}
        {activeTab === 'browse' && activePrograms.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400">Continue Training</h2>
              <Link href="/programs/active" className="text-sm text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activePrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-neutral-900 border-2 border-neutral-800 p-6 hover:border-amber-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1 text-amber-100 uppercase tracking-wide">{program.name}</h3>
                      <p className="text-sm text-neutral-400">{program.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold border-2 uppercase tracking-wider ${difficultyColors[program.difficulty as keyof typeof difficultyColors]}`}>
                      {program.difficulty}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                      <span className="uppercase tracking-wider">Progress</span>
                      <span className="font-bold text-amber-400">{program.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-950 border-2 border-neutral-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 transition-all duration-500"
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href={`/programs/${program.id}`}
                    className="block w-full py-2 text-center bg-amber-950/50 hover:bg-amber-950/70 border-2 border-amber-700 hover:border-amber-600 text-amber-400 font-bold uppercase tracking-wider transition-all"
                  >
                    Continue Campaign
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Programs Section - Only show in Browse tab */}
        {activeTab === 'browse' && recommendedPrograms.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h2 className="text-lg font-black uppercase tracking-wider">Recommended for You</h2>
              </div>
              <span className="text-xs text-neutral-400 flex items-center space-x-1 uppercase tracking-wider font-bold">
                <Target className="w-3 h-3" />
                <span>Based on your level & goals</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {recommendedPrograms.map((program) => (
                <div
                  key={program.id}
                  onClick={() => handleProgramClick(program)}
                  className="group relative bg-neutral-900/50 border-2 border-amber-500/30 p-6 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer overflow-hidden"
                >
                  {/* Recommended Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-amber-600 to-amber-500 text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-black" />
                    <span>RECOMMENDED</span>
                  </div>

                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.imageColor} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-16">
                        <h3 className="text-lg font-black uppercase tracking-wider mb-1 group-hover:text-amber-400 transition-colors">
                          {program.name}
                        </h3>
                        <p className="text-sm text-neutral-400 line-clamp-2">
                          {program.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="text-neutral-300 font-bold uppercase tracking-wider">{program.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Dumbbell className="w-4 h-4 text-amber-400" />
                        <span className="text-neutral-300 font-bold uppercase tracking-wider">{program.daysPerWeek}x/week</span>
                      </div>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 ${difficultyColors[program.difficulty as keyof typeof difficultyColors]}`}>
                        {program.difficulty}
                      </span>
                      
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-sm font-black">{program.popularity}</span>
                      </div>
                    </div>

                    {/* Why Recommended */}
                    <div className="mt-4 pt-4 border-t-2 border-neutral-700">
                      <div className="text-xs text-neutral-400 mb-2 uppercase tracking-wider font-bold">Why we recommend this:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {program.difficulty === 'Intermediate' && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs border-2 border-amber-500/20 font-bold uppercase tracking-wider">
                            Matches your level
                          </span>
                        )}
                        {program.category === 'Hypertrophy' && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs border-2 border-amber-500/20 font-bold uppercase tracking-wider">
                            Aligns with goals
                          </span>
                        )}
                        {program.popularity >= 4.7 && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs border-2 border-amber-500/20 font-bold uppercase tracking-wider">
                            Highly rated
                          </span>
                        )}
                        {program.daysPerWeek >= 3 && program.daysPerWeek <= 5 && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs border-2 border-amber-500/20 font-bold uppercase tracking-wider">
                            Optimal frequency
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action */}
                    <button className="mt-4 w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-black font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center space-x-2">
                      <span>Start This Program</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="search"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:border-amber-700 transition-colors font-medium"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 font-bold uppercase tracking-wider transition-all flex items-center space-x-2 border-2 ${
                showFilters
                  ? 'bg-amber-950/50 text-amber-400 border-amber-700'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-amber-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-neutral-900 border-2 border-neutral-800">
              <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-neutral-400">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {programCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border-2 ${
                      selectedCategory === category
                        ? 'bg-amber-950/50 text-amber-400 border-amber-700'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-amber-700'
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
            <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400">
              {activeTab === 'active' ? 'Your Active Campaigns' : (selectedCategory === 'All Programs' ? 'All Campaigns' : selectedCategory)}
              <span className="text-sm text-neutral-400 ml-2">({filteredPrograms.length})</span>
            </h2>
            {activeTab === 'active' && filteredPrograms.length > 0 && (
              <span className="text-sm text-neutral-400 uppercase tracking-wider">
                Keep Fighting! ⚔️
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, index) => (
              <div
                key={program.id}
                onClick={() => handleProgramClick(program)}
                onContextMenu={(e) => handleContextMenu(e, program.id)}
                className={`group bg-neutral-900 border-2 overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-600/20 relative ${
                  index === focusedCardIndex 
                    ? 'border-amber-700 ring-2 ring-amber-700/50' 
                    : 'border-neutral-800 hover:border-amber-700'
                }`}
              >
                {/* Status Badge - Top Left */}
                {program.isActive && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-1 text-xs font-bold bg-amber-950/50 border-2 border-amber-700 text-amber-400 shadow-lg flex items-center space-x-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse"></span>
                      <span>ACTIVE</span>
                    </span>
                  </div>
                )}

                {/* Progress Ring - Active Programs */}
                {program.isActive && program.progress !== undefined && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative w-12 h-12">
                      {/* Background ring */}
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-neutral-800"
                        />
                        {/* Progress ring */}
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - program.progress / 100)}`}
                          className="text-amber-600 transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percentage text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-amber-400">{program.progress}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gradient Header */}
                <div className="h-32 bg-gradient-to-br from-amber-900 via-amber-800 to-neutral-900 relative overflow-hidden group-hover:brightness-110 transition-all duration-300">
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Difficulty Badge - Now positioned better when progress ring exists */}
                  <div className={`absolute ${program.isActive ? 'top-16' : 'top-4'} right-4`}>
                    <span className={`px-3 py-1 text-xs font-bold border-2 bg-black/30 backdrop-blur-sm uppercase tracking-wider ${difficultyColors[program.difficulty as keyof typeof difficultyColors]}`}>
                      {program.difficulty}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 group-hover:scale-110 transition-transform duration-300">
                    <Dumbbell className="w-12 h-12 text-white/30" />
                  </div>

                  {/* Sparkle effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 animate-ping"></div>
                    <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-amber-400 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-amber-400 animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold group-hover:text-amber-400 transition-colors flex-1 uppercase tracking-wide">
                      {program.name}
                    </h3>
                    {/* Popular Badge */}
                    {program.popularity >= 4.8 && (
                      <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-amber-950/50 border-2 border-amber-700 text-amber-400 whitespace-nowrap uppercase tracking-wider">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{program.description}</p>

                  {/* Progress bar for active programs */}
                  {program.isActive && program.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-neutral-400 uppercase tracking-wider">Progress</span>
                        <span className="text-amber-400 font-bold">{program.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-950 border-2 border-neutral-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 transition-all duration-1000"
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                      <span className="text-neutral-300 font-medium">{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Dumbbell className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                      <span className="text-neutral-300 font-medium">{program.daysPerWeek}x/week</span>
                    </div>
                    {program.popularity > 0 && (
                      <>
                        <div className="flex items-center space-x-2 text-sm">
                          <Star className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-neutral-300 font-medium">{program.popularity}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                          <span className="text-neutral-300 font-medium">{program.enrolledUsers.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Weekly Calendar Preview */}
                  <div className="mb-4">
                    <CalendarPreview
                      workouts={[
                        { day: 'Mon', type: program.category.toLowerCase().includes('push') ? 'push' : program.category.toLowerCase().includes('upper') ? 'upper' : 'strength' },
                        { day: 'Tue', type: program.category.toLowerCase().includes('pull') ? 'pull' : program.category.toLowerCase().includes('cardio') ? 'cardio' : 'strength' },
                        { day: 'Wed', type: program.category.toLowerCase().includes('legs') ? 'legs' : 'rest' },
                        { day: 'Thu', type: program.category.toLowerCase().includes('push') ? 'push' : 'strength' },
                        { day: 'Fri', type: program.category.toLowerCase().includes('pull') ? 'pull' : 'strength' },
                        { day: 'Sat', type: program.daysPerWeek >= 6 ? 'legs' : 'rest' },
                        { day: 'Sun', type: 'rest' }
                      ]}
                      variant="compact"
                    />
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-800">
                    <span className="text-sm text-amber-400 group-hover:text-amber-300 transition-colors font-bold uppercase tracking-wider">
                      View Details
                    </span>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Quick Action Menu - Modern hover menu */}
                  <QuickActionMenu
                    onViewDetails={() => handleProgramClick(program)}
                    onStartProgram={() => handleStartProgram()}
                    onToggleFavorite={() => toggleFavorite(program.id)}
                    onShare={() => handleShare(program)}
                    isFavorite={favorites.includes(program.id)}
                    position="bottom-right"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-900/50 flex items-center justify-center mx-auto mb-4 border-2 border-neutral-700">
                {activeTab === 'active' ? (
                  <Target className="w-8 h-8 text-neutral-400" />
                ) : (
                  <Search className="w-8 h-8 text-neutral-400" />
                )}
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider mb-2">
                {activeTab === 'active' ? 'No active programs yet' : 'No programs found'}
              </h3>
              <p className="text-sm text-neutral-400 mb-4 uppercase tracking-wider font-bold">
                {activeTab === 'active' 
                  ? 'Start a program from the Browse tab to begin your training journey' 
                  : 'Try adjusting your search or filters'}
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 font-black uppercase tracking-wider transition-all"
                >
                  Browse Programs
                </button>
              )}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-2 border-amber-500/30 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6 text-amber-400" />
                <h3 className="font-black uppercase tracking-wider">Active Programs</h3>
              </div>
              <p className="text-3xl font-black text-amber-400">{activePrograms.length}</p>
              <p className="text-sm text-neutral-400 mt-1 uppercase tracking-wider font-bold">Programs in progress</p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-2 border-amber-500/30 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Flame className="w-6 h-6 text-amber-400" />
                <h3 className="font-black uppercase tracking-wider">Completion Rate</h3>
              </div>
              <p className="text-3xl font-black text-amber-400">87%</p>
              <p className="text-sm text-neutral-400 mt-1 uppercase tracking-wider font-bold">Average completion</p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-2 border-amber-500/30 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-amber-400" />
                <h3 className="font-black uppercase tracking-wider">Total Workouts</h3>
              </div>
              <p className="text-3xl font-black text-amber-400">142</p>
              <p className="text-sm text-neutral-400 mt-1 uppercase tracking-wider font-bold">Across all programs</p>
            </div>
          </div>
        </section>
      </PageContainer>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStart={handleStartProgram}
        />
      )}

      {/* Program Creator Wizard */}
      <ProgramCreatorWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleSaveProgram}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenNewTab={() => {
            const program = mockPrograms.find(p => p.id === contextMenu.programId)
            if (program) {
              window.open(`/programs/${program.id}`, '_blank')
            }
          }}
          onToggleFavorite={() => {
            toggleFavorite(contextMenu.programId)
          }}
          onShare={() => {
            const program = mockPrograms.find(p => p.id === contextMenu.programId)
            if (program) handleShare(program)
          }}
          onCopyLink={() => {
            const program = mockPrograms.find(p => p.id === contextMenu.programId)
            if (program) handleCopyLink(program)
          }}
          onExportSchedule={() => {
            const program = mockPrograms.find(p => p.id === contextMenu.programId)
            if (program) handleExportSchedule(program)
          }}
          onPrintDetails={() => {
            const program = mockPrograms.find(p => p.id === contextMenu.programId)
            if (program) handlePrintDetails(program)
          }}
          isFavorite={favorites.includes(contextMenu.programId)}
        />
      )}

      {/* Keyboard Shortcuts Tooltip */}
      <div className="fixed bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3 text-xs text-gray-400 max-w-xs z-30 opacity-0 hover:opacity-100 transition-opacity">
        <div className="font-semibold mb-2 text-white">Keyboard Shortcuts</div>
        <div className="space-y-1">
          <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">←→</kbd> Navigate cards</div>
          <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Enter</kbd> Open details</div>
          <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Space</kbd> Toggle favorite</div>
          <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Esc</kbd> Close menu</div>
        </div>
      </div>
    </AppLayout>
  )
}

