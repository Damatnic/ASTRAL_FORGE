'use client'

import Link from 'next/link'
import { Sword, Shield, TrendingUp, BarChart3, Users, Target, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Hero Section - Full Screen Warrior */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-amber-900/20">
        {/* Dark Metal Texture Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-neutral-950/80" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,#CD7F32_50%,transparent_100%)] opacity-5" />
        </div>

        {/* Warrior Silhouette Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-full bg-[url('/warrior-texture.svg')] bg-center bg-no-repeat bg-contain mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 border-2 border-amber-800/40 bg-neutral-900/60 backdrop-blur-sm">
            <div className="w-2 h-2 bg-amber-600 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.3em] text-amber-200/90 uppercase">
              Fitness Warrior Training System
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 mb-12">
            <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-none">
              <span className="block text-amber-100 drop-shadow-[0_0_30px_rgba(205,127,50,0.3)]">
                FORGE YOUR
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 drop-shadow-2xl">
                WARRIOR BODY
              </span>
            </h1>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
          </div>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-neutral-400 font-light mb-8 max-w-3xl mx-auto tracking-wide">
            Train like the ancients. <span className="text-amber-500 font-semibold">Track like a champion.</span>
          </p>

          <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Master your strength. Discipline your body. Earn your victories through sweat, iron, and unwavering commitment to the warrior's path.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/auth/signin"
              className="group relative px-12 py-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 border-2 border-amber-500/50 shadow-[0_0_30px_rgba(205,127,50,0.3)] hover:shadow-[0_0_50px_rgba(205,127,50,0.5)] transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-3 text-lg font-bold tracking-wider uppercase text-neutral-950">
                <Sword className="w-6 h-6" />
                Enter The Forge
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="group px-12 py-5 border-2 border-neutral-700 hover:border-amber-700/50 bg-neutral-900/40 hover:bg-neutral-800/60 backdrop-blur-sm transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-3 text-lg font-semibold tracking-wider uppercase text-neutral-300 group-hover:text-amber-400">
                <Shield className="w-6 h-6" />
                View Arsenal
              </span>
            </Link>
          </div>

          {/* Stats Ticker */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-neutral-800/50">
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-amber-500">EARN</div>
              <div className="text-xs text-neutral-600 uppercase tracking-widest">Real Achievements</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-amber-500">TRACK</div>
              <div className="text-xs text-neutral-600 uppercase tracking-widest">Every Victory</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-amber-500">CONQUER</div>
              <div className="text-xs text-neutral-600 uppercase tracking-widest">Your Limits</div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
      </section>

      {/* The Warrior's Path - Features Section */}
      <section className="relative py-32 border-b border-amber-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 border-2 border-amber-800/30 bg-neutral-900/40">
              <div className="w-1.5 h-1.5 bg-amber-600" />
              <span className="text-xs font-bold tracking-[0.3em] text-amber-400/80 uppercase">
                The Warrior&apos;s Path
              </span>
              <div className="w-1.5 h-1.5 bg-amber-600" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="text-amber-100">YOUR </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">ARSENAL</span>
            </h2>
            <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-6" />
            <p className="text-neutral-500 text-lg max-w-2xl mx-auto font-light">
              Four pillars of strength. Master them all.
            </p>
          </div>

          {/* 2x2 Grid - Core Features */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1: Track */}
            <div className="group relative bg-neutral-900/40 border-2 border-neutral-800 hover:border-amber-700/50 p-10 transition-all duration-300 hover:bg-neutral-900/60">
              <div className="absolute top-6 right-6">
                <Sword className="w-12 h-12 text-neutral-800 group-hover:text-amber-900/50 transition-colors" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 border-2 border-amber-700 bg-amber-950/50 flex items-center justify-center">
                    <Sword className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-amber-100 uppercase">Track</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed font-light">
                  Log every battle. Record each set, rep, and weight. Monitor your progressive overload with warrior precision. The iron never lies.
                </p>
              </div>
            </div>

            {/* Feature 2: Progress */}
            <div className="group relative bg-neutral-900/40 border-2 border-neutral-800 hover:border-amber-700/50 p-10 transition-all duration-300 hover:bg-neutral-900/60">
              <div className="absolute top-6 right-6">
                <TrendingUp className="w-12 h-12 text-neutral-800 group-hover:text-amber-900/50 transition-colors" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 border-2 border-amber-700 bg-amber-950/50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-amber-100 uppercase">Progress</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed font-light">
                  Visualize your evolution. Advanced analytics reveal your strength gains, volume progression, and performance trends over time.
                </p>
              </div>
            </div>

            {/* Feature 3: Compete */}
            <div className="group relative bg-neutral-900/40 border-2 border-neutral-800 hover:border-amber-700/50 p-10 transition-all duration-300 hover:bg-neutral-900/60">
              <div className="absolute top-6 right-6">
                <Users className="w-12 h-12 text-neutral-800 group-hover:text-amber-900/50 transition-colors" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 border-2 border-amber-700 bg-amber-950/50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-amber-100 uppercase">Compete</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed font-light">
                  Challenge yourself and others. Join training crews, compete on leaderboards, and prove your strength in fitness battles.
                </p>
              </div>
            </div>

            {/* Feature 4: Analyze */}
            <div className="group relative bg-neutral-900/40 border-2 border-neutral-800 hover:border-amber-700/50 p-10 transition-all duration-300 hover:bg-neutral-900/60">
              <div className="absolute top-6 right-6">
                <Target className="w-12 h-12 text-neutral-800 group-hover:text-amber-900/50 transition-colors" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 border-2 border-amber-700 bg-amber-950/50 flex items-center justify-center">
                    <Target className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-amber-100 uppercase">Analyze</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed font-light">
                  Master your metrics. Deep performance analysis shows what works, what doesn&apos;t, and where to push harder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Call to Battle */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-amber-950/10 to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#CD7F32_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />
        
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 border-2 border-amber-800/30 bg-neutral-900/40">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold tracking-[0.3em] text-amber-400/80 uppercase">
              Your Destiny Awaits
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
            <span className="block text-amber-100">EARN YOUR </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
              WARRIOR STATUS
            </span>
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-8" />
          
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Discipline. Strength. Honor. Join the warriors transforming their bodies through iron and determination.
          </p>
          
          <Link
            href="/auth/signin"
            className="group inline-flex items-center gap-4 px-14 py-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 border-2 border-amber-500/50 shadow-[0_0_40px_rgba(205,127,50,0.3)] hover:shadow-[0_0_60px_rgba(205,127,50,0.5)] transition-all duration-300"
          >
            <Sword className="w-7 h-7 text-neutral-950" />
            <span className="text-2xl font-black tracking-wider uppercase text-neutral-950">
              Begin Your Journey
            </span>
            <ChevronRight className="w-6 h-6 text-neutral-950 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-black tracking-tight text-amber-500 mb-2">ASTRAL FORGE</div>
              <p className="text-neutral-600 text-sm font-light">Where Warriors Are Forged</p>
            </div>
            <div className="text-neutral-600 text-sm">
              &copy; 2025 Astral Forge. All victories earned, not given.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
