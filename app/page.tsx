'use client'

import Link from 'next/link'
import { ParticleBackground } from '@/components/particle-background'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-b from-gray-900 via-indigo-950 to-black">
      {/* Particle Background */}
      {mounted && (
        <ParticleBackground
          particleCount={100}
          colors={['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']}
          speed={0.4}
          connectionDistance={120}
          showConnections={true}
        />
      )}

      {/* Animated Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        {/* Epic Hero Section with Cinematic Title */}
        <div className="space-y-6 animate-fade-in">
          {/* Glowing Title with Epic Effects */}
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-black mb-4 relative">
              <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent opacity-50 animate-pulse">
                🔨 ASTRAL FORGE
              </span>
              <span className="relative bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
                🔨 ASTRAL FORGE
              </span>
            </h1>
            {/* Epic Subtitle */}
            <div className="relative">
              <p className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
                Forge Your Legend. Dominate Your Destiny.
              </p>
              <p className="text-lg md:text-xl text-gray-300 mt-3 font-medium">
                Where Warriors Are Forged, Heroes Rise, and Legends Never Die
              </p>
            </div>
          </div>

          {/* Epic Battle Stats */}
          <div className="flex justify-center gap-8 mt-8 flex-wrap">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-md px-6 py-3 rounded-lg border border-blue-400/30 shadow-lg shadow-blue-500/20">
              <div className="text-3xl font-black text-blue-400">100K+</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider">Warriors Forged</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md px-6 py-3 rounded-lg border border-purple-400/30 shadow-lg shadow-purple-500/20">
              <div className="text-3xl font-black text-purple-400">10M+</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider">Reps Conquered</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-md px-6 py-3 rounded-lg border border-orange-400/30 shadow-lg shadow-orange-500/20">
              <div className="text-3xl font-black text-orange-400">∞</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider">Potential Unlocked</div>
            </div>
          </div>
        </div>

        {/* Gaming Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 animate-slide-up">
          {/* Feature 1 - Progressive Power */}
          <div className="group relative bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-md p-8 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:border-blue-400/60">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">⚔️</div>
              <h3 className="text-xl font-black mb-3 text-blue-300">PROGRESSIVE POWER</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Advanced RPG-style progression algorithms that level up your strength with scientific precision. Each workout makes you stronger.
              </p>
              <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-bold">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                ACTIVE BUFF
              </div>
            </div>
          </div>

          {/* Feature 2 - Real-Time Combat */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-md p-8 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:border-purple-400/60">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-xl font-black mb-3 text-purple-300">REAL-TIME COMBAT</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Turn every set into an epic battle. Real-time RPE feedback adapts your training like a boss fight adjusting to your power level.
              </p>
              <div className="mt-4 flex items-center gap-2 text-purple-400 text-xs font-bold">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                LEGENDARY SYSTEM
              </div>
            </div>
          </div>

          {/* Feature 3 - Achievement Empire */}
          <div className="group relative bg-gradient-to-br from-orange-900/40 to-orange-950/40 backdrop-blur-md p-8 rounded-2xl border border-orange-500/30 shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:border-orange-400/60">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/10 group-hover:to-orange-600/10 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">👑</div>
              <h3 className="text-xl font-black mb-3 text-orange-300">ACHIEVEMENT EMPIRE</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Build your legacy with streaks, achievements, guild battles, and leaderboards. Become a legend in the iron kingdom.
              </p>
              <div className="mt-4 flex items-center gap-2 text-orange-400 text-xs font-bold">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                EPIC TIER
              </div>
            </div>
          </div>
        </div>

        {/* Epic CTA Section */}
        <div className="flex flex-col items-center gap-6 mt-16">
          {/* Main CTA Button */}
          <Link
            href="/auth/signin"
            className="group relative px-12 py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl font-black text-2xl hover:scale-105 transition-all duration-300 text-black shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/80 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-3">
              <span className="text-3xl animate-bounce">🔨</span>
              ENTER THE FORGE
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>⚔️</span>
            </span>
          </Link>

          {/* Supporting Text */}
          <p className="text-gray-400 text-sm max-w-md">
            Join thousands of warriors transforming their bodies through the power of gamified training.{' '}
            <span className="text-blue-400 font-bold">No subscription. No limits. Just gains.</span>
          </p>
        </div>

        {/* Power Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mt-20 pt-12 border-t border-gray-700/50">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Epic Abilities</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              &lt;3s
            </div>
            <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Combat Speed</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              100%
            </div>
            <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Science-Forged</div>
          </div>
        </div>

        {/* Epic Forge Philosophy */}
        <div className="mt-20 relative group">
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          
          {/* Content Card */}
          <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-10 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="text-5xl">⚡</div>
              <h3 className="text-4xl font-black ml-4 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                THE FORGE PHILOSOPHY
              </h3>
              <div className="text-5xl ml-4">🔥</div>
            </div>
            
            <p className="text-gray-200 text-xl leading-relaxed max-w-4xl mx-auto">
              Every legendary warrior was forged through relentless dedication and strategic combat.{' '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Astral Forge
              </span>{' '}
              transforms cutting-edge exercise science into an{' '}
              <span className="font-bold text-orange-400">epic RPG adventure</span>
              {' '}— where each training session is a boss battle, every rep is an attack, and progressive overload 
              is your ultimate weapon. No shortcuts. No excuses.{' '}
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                Just you, the iron, and your unstoppable rise to greatness.
              </span>
            </p>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-4 gap-4 mt-10">
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <div className="text-2xl mb-2">🎮</div>
                <div className="text-xs text-blue-300 font-bold">Full RPG Experience</div>
              </div>
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-xs text-purple-300 font-bold">Science-Backed</div>
              </div>
              <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-500/20">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-xs text-orange-300 font-bold">Endless Achievements</div>
              </div>
              <div className="text-center p-4 bg-pink-900/20 rounded-lg border border-pink-500/20">
                <div className="text-2xl mb-2">⚔️</div>
                <div className="text-xs text-pink-300 font-bold">Guild Battles</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
