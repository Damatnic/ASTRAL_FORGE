'use client'

/**
 * COMBAT ENCOUNTER - WORKOUT SESSION
 * 
 * Epic real-time battle UI where each set is an attack and rest periods are cooldowns.
 * Features combat animations, damage numbers, boss battles, and victory screens.
 * 
 * Combat System:
 * - Each set = Attack with damage calculation
 * - Rest periods = Cooldown timers
 * - HP/Stamina drain during sets
 * - Boss enemy with health bar
 * - Combo counter for consecutive sets
 * - Critical hits for PRs
 * - XP/Loot rewards on completion
 * - Victory/Defeat screens
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SessionPlayer } from '@/components/session-player'
import { ParticleBackground } from '@/components/particle-background'

// TypeScript interfaces for combat system
interface DamageNumber {
  id: string
  value: number
  isCritical: boolean
  x: number
  y: number
}

interface CombatStats {
  playerHP: number
  playerMaxHP: number
  playerStamina: number
  playerMaxStamina: number
  bossHP: number
  bossMaxHP: number
  combo: number
  totalDamage: number
}

interface BattlePhase {
  phase: 'preparation' | 'combat' | 'recovery' | 'victory' | 'defeat'
  message: string
}

export default function WorkoutSession() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const programId = searchParams.get('programId')
  
  const [workoutComplete, setWorkoutComplete] = useState(false)
  const [workout, setWorkout] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Combat state
  const [combatMode, setCombatMode] = useState(false)
  const [combatStats, setCombatStats] = useState<CombatStats>({
    playerHP: 2500,
    playerMaxHP: 2500,
    playerStamina: 1800,
    playerMaxStamina: 1800,
    bossHP: 10000,
    bossMaxHP: 10000,
    combo: 0,
    totalDamage: 0
  })
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([])
  const [battlePhase, setBattlePhase] = useState<BattlePhase>({
    phase: 'preparation',
    message: 'Preparing for battle...'
  })
  const [showVictoryScreen, setShowVictoryScreen] = useState(false)
  const [attackFlash, setAttackFlash] = useState(false)
  const [screenShake, setScreenShake] = useState(false)

  // Fetch workout from database (with optional programId)
  useEffect(() => {
    async function loadWorkout() {
      try {
        // Build API URL with programId if provided
        const url = programId 
          ? `/api/workout/start?programId=${programId}`
          : `/api/workout/start`
        
        const response = await fetch(url, { method: 'POST' })
        
        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'No workout found')
          setLoading(false)
          return
        }

        const data = await response.json()
        
        // Transform to expected format for SessionPlayer
        const formattedWorkout = {
          id: data.id,
          name: data.name || 'Iron Titan',
          exercises: data.exercises.map((ex: any) => ({
            id: ex.id,
            name: ex.name,
            sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: ex.weight || 0,
              reps: ex.reps || 10,
              targetRPE: ex.targetRPE || 7.5,
              restSeconds: ex.restSeconds || 90,
            })),
            notes: ex.notes,
            muscleGroup: ex.muscleGroup,
            equipment: ex.equipment,
          })),
        }

        setWorkout(formattedWorkout)
        setLoading(false)
        
        // Initialize combat mode
        setTimeout(() => {
          setCombatMode(true)
          setBattlePhase({ phase: 'combat', message: 'Battle has begun!' })
        }, 2000)
      } catch (err) {
        console.error('Error loading workout:', err)
        setError('Failed to load workout')
        setLoading(false)
      }
    }

    loadWorkout()
  }, [programId])

  // Combat system functions
  function dealDamage(baseDamage: number, isCritical: boolean = false) {
    const damage = isCritical ? baseDamage * 2.15 : baseDamage
    
    // Create damage number animation
    const damageNum: DamageNumber = {
      id: Math.random().toString(36),
      value: Math.round(damage),
      isCritical,
      x: Math.random() * 300 + 150,
      y: Math.random() * 100 + 200
    }
    
    setDamageNumbers(prev => [...prev, damageNum])
    
    // Remove damage number after animation
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== damageNum.id))
    }, 2000)
    
    // Update boss HP
    setCombatStats(prev => ({
      ...prev,
      bossHP: Math.max(0, prev.bossHP - damage),
      totalDamage: prev.totalDamage + damage,
      combo: prev.combo + 1
    }))
    
    // Visual effects
    setAttackFlash(true)
    setTimeout(() => setAttackFlash(false), 200)
    
    if (isCritical) {
      setScreenShake(true)
      setTimeout(() => setScreenShake(false), 500)
    }
    
    // Check for victory
    if (combatStats.bossHP - damage <= 0) {
      setBattlePhase({ phase: 'victory', message: 'Victory!' })
      setShowVictoryScreen(true)
    }
  }

  function consumeStamina(amount: number) {
    setCombatStats(prev => ({
      ...prev,
      playerStamina: Math.max(0, prev.playerStamina - amount)
    }))
  }

  function recoverStamina(amount: number) {
    setCombatStats(prev => ({
      ...prev,
      playerStamina: Math.min(prev.playerMaxStamina, prev.playerStamina + amount)
    }))
  }

  const handleWorkoutComplete = async () => {
    if (!workout) return

    try {
      // Mark workout as complete
      const response = await fetch(`/api/sessions/${workout.id}/complete`, {
        method: 'POST',
      })

      if (response.ok) {
        setWorkoutComplete(true)
        
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh() // Refresh to show updated stats
        }, 3000)
      }
    } catch (err) {
      console.error('Error completing workout:', err)
      // Still redirect even if API call fails
      setWorkoutComplete(true)
      setTimeout(() => router.push('/dashboard'), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground
          colors={['#dc2626', '#ea580c', '#f59e0b']}
          particleCount={50}
          connectionDistance={100}
          speed={0.5}
        />
        
        {/* Loading Screen */}
        <div className="text-center space-y-6 relative z-10">
          <div className="text-8xl animate-bounce">⚔️</div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 animate-pulse">
              Entering the Arena...
            </div>
            <div className="text-lg text-red-400/60 animate-pulse delay-100">
              Preparing your battle strategy
            </div>
            <div className="text-lg text-orange-400/60 animate-pulse delay-200">
              Boss enemy approaching...
            </div>
          </div>
          <div className="inline-block w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md text-center space-y-4 sm:space-y-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-red-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-500/20">
          <div className="text-5xl sm:text-6xl">⚠️</div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quest Unavailable</h1>
          <p className="text-sm sm:text-base text-gray-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold hover:scale-105 transition shadow-lg shadow-red-500/50 touch-manipulation min-h-[48px] text-sm sm:text-base"
          >
            Return to Base
          </button>
        </div>
      </div>
    )
  }

  if (showVictoryScreen || workoutComplete) {
    const xpGained = Math.round(combatStats.totalDamage * 0.5)
    const goldGained = Math.round(combatStats.totalDamage * 0.1)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-yellow-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Victory Particles */}
        <ParticleBackground
          colors={['#eab308', '#f59e0b', '#fb923c']}
          particleCount={100}
          connectionDistance={150}
          speed={0.8}
        />
        
        {/* Victory Screen */}
        <div className="text-center space-y-8 animate-fade-in relative z-10">
          <div className="text-9xl animate-bounce">�</div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
            VICTORY!
          </h1>
          <p className="text-2xl text-yellow-400 font-bold">
            The {workout?.name || 'Boss'} has been defeated!
          </p>
          
          {/* Combat Stats */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8 shadow-2xl shadow-yellow-500/20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Battle Summary</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-2">⚔️</div>
                <div className="text-3xl font-black text-white">{combatStats.totalDamage.toLocaleString()}</div>
                <div className="text-sm text-yellow-400">Total Damage</div>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-2">🔥</div>
                <div className="text-3xl font-black text-white">{combatStats.combo}x</div>
                <div className="text-sm text-orange-400">Max Combo</div>
              </div>
            </div>
          </div>
          
          {/* Rewards */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8 shadow-2xl shadow-yellow-500/20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Rewards</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">✨</div>
                <div className="text-2xl font-bold text-white">+{xpGained}</div>
                <div className="text-xs text-blue-400">XP</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-2xl font-bold text-white">+{goldGained}</div>
                <div className="text-xs text-yellow-400">Gold</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">🎁</div>
                <div className="text-2xl font-bold text-white">+1</div>
                <div className="text-xs text-purple-400">Loot Chest</div>
              </div>
            </div>
          </div>
          
          <div className="text-xl text-gray-400">
            Returning to base...
          </div>
          <div className="inline-block w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!workout) {
    return null
  }

  return (
    <div className={`relative ${screenShake ? 'animate-shake' : ''}`}>
      {/* Combat Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 -z-10">
        <ParticleBackground
          colors={['#dc2626', '#ea580c', '#f59e0b']}
          particleCount={60}
          connectionDistance={120}
          speed={0.4}
        />
      </div>
      
      {/* Attack Flash */}
      {attackFlash && (
        <div className="fixed inset-0 bg-red-500/30 animate-pulse pointer-events-none z-50" />
      )}
      
      {/* Combat HUD Overlay */}
      <div className="fixed top-0 left-0 right-0 z-40 p-2 sm:p-3 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Boss Health Bar */}
          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-red-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl shadow-red-500/20 mb-2 sm:mb-3 md:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
              <div className="text-3xl sm:text-4xl md:text-5xl">👹</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <h2 className="text-base sm:text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 truncate">
                    {workout.name || 'Boss Enemy'}
                  </h2>
                  <span className="text-sm sm:text-base md:text-xl font-bold text-white ml-2 flex-shrink-0">
                    {combatStats.bossHP.toLocaleString()} / {combatStats.bossMaxHP.toLocaleString()}
                  </span>
                </div>
                <div className="h-4 sm:h-5 md:h-6 bg-slate-800/80 rounded-full overflow-hidden border-2 border-red-500/50 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 transition-all duration-500 relative overflow-hidden"
                    style={{ width: `${(combatStats.bossHP / combatStats.bossMaxHP) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Battle Stats */}
            <div className="flex gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-yellow-400">⚔️</span>
                <span className="text-white font-semibold hidden sm:inline">Damage:</span>
                <span className="text-yellow-400 font-bold">{combatStats.totalDamage.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-orange-400">🔥</span>
                <span className="text-white font-semibold hidden sm:inline">Combo:</span>
                <span className="text-orange-400 font-bold">{combatStats.combo}x</span>
              </div>
            </div>
          </div>
          
          {/* Player Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {/* Health Bar */}
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-green-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-xl">
              <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                <span className="text-green-400 font-semibold">❤️ Health</span>
                <span className="text-white font-bold text-xs sm:text-sm">{combatStats.playerHP} / {combatStats.playerMaxHP}</span>
              </div>
              <div className="h-2 sm:h-3 bg-slate-800/80 rounded-full overflow-hidden border border-green-500/30">
                <div 
                  className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-500"
                  style={{ width: `${(combatStats.playerHP / combatStats.playerMaxHP) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Stamina Bar */}
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-xl">
              <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                <span className="text-cyan-400 font-semibold">⚡ Stamina</span>
                <span className="text-white font-bold text-xs sm:text-sm">{combatStats.playerStamina} / {combatStats.playerMaxStamina}</span>
              </div>
              <div className="h-2 sm:h-3 bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/30">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(combatStats.playerStamina / combatStats.playerMaxStamina) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Damage Numbers */}
      {damageNumbers.map(dmg => (
        <div
          key={dmg.id}
          className={`fixed z-50 pointer-events-none animate-damage-float ${
            dmg.isCritical ? 'text-6xl font-black text-orange-400' : 'text-4xl font-bold text-yellow-400'
          }`}
          style={{
            left: `${dmg.x}px`,
            top: `${dmg.y}px`,
            textShadow: dmg.isCritical 
              ? '0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.5)' 
              : '0 0 10px rgba(234, 179, 8, 0.8)'
          }}
        >
          {dmg.isCritical && '💥 '}
          {dmg.value}
          {dmg.isCritical && ' CRIT!'}
        </div>
      ))}
      
      {/* Session Player */}
      <div className="pt-64">
        <SessionPlayer
          workout={workout}
          userId="demo-user-id"
          onComplete={handleWorkoutComplete}
        />
      </div>
      
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes damage-float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-50px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.8);
            opacity: 0;
          }
        }
        .animate-damage-float {
          animation: damage-float 2s ease-out forwards;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
