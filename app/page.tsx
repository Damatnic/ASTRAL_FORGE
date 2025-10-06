'use client'

import Link from 'next/link'
import { Dumbbell, TrendingUp, Award, Users, Target, Zap, Sparkles, Flame, Trophy, Swords } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Next-Gen Fitness RPG</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ASTRAL FORGE
                </span>
              </h1>
              <p className="text-2xl md:text-4xl text-gray-200 font-bold">
                Where <span className="text-purple-400">Warriors</span> Are Forged
              </p>
            </div>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transform your training journey into an epic quest. Track progress, earn achievements, and level up your gains with the ultimate gamified fitness platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/auth/signin"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60"
              >
                <span className="flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5" />
                  Enter The Forge
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl font-semibold text-lg transition-all hover:scale-105 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <Swords className="w-5 h-5" />
                  View Demo
                </span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">Smart</div>
                <div className="text-sm text-gray-500">AI-Powered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">Fast</div>
                <div className="text-sm text-gray-500">Real-Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">Epic</div>
                <div className="text-sm text-gray-500">Gamified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full mb-6">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Core Abilities</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Arsenal</span> of Power
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to level up your training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent rounded-xl transition-all" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                  <Dumbbell className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Workout Tracking</h3>
                <p className="text-gray-400">
                  Log every rep, set, and workout with precision. Track your progressive overload and watch your strength soar.
                </p>
              </div>
            </div>

            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent rounded-xl transition-all" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Advanced Analytics</h3>
                <p className="text-gray-400">
                  Visualize your ascension with detailed charts, progress graphs, and performance metrics that matter.
                </p>
              </div>
            </div>

            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent rounded-xl transition-all" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">Quest System</h3>
                <p className="text-gray-400">
                  Set challenging goals, complete epic quests, and unlock legendary achievements as you conquer your fitness journey.
                </p>
              </div>
            </div>

            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:to-transparent rounded-xl transition-all" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/50">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">Trophy Collection</h3>
                <p className="text-gray-400">
                  Earn badges, unlock trophies, and showcase your legendary accomplishments. Your victories deserve recognition.
                </p>
              </div>
            </div>

            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent rounded-xl transition-all" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">Guild System</h3>
                <p className="text-gray-400">
                  Join fellow warriors, share victories, compete on leaderboards, and forge bonds in your quest for greatness.
                </p>
              </div>
            </div>

            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent rounded-xl transition-all" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/50">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">Battle Programs</h3>
                <p className="text-gray-400">
                  Follow expertly crafted training campaigns designed to maximize gains and transform you into a champion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-300">Ascend to Greatness</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Become Legendary</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of warriors transforming their bodies and minds. Your epic journey begins now.
          </p>
          <Link
            href="/auth/signin"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl shadow-blue-500/50 hover:shadow-purple-500/60"
          >
            <Flame className="w-6 h-6" />
            Begin Your Quest
            <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>&copy; 2025 Astral Forge. Track your fitness journey.</p>
        </div>
      </footer>
    </main>
  )
}
