'use client';

import { useState } from 'react';
import Link from 'next/link';
import WorkoutTemplates from '@/components/workout-templates';

export default function ProgramsPage() {
  const [notification, setNotification] = useState('');

  const handleSelectProgram = (program: any) => {
    console.log('Program selected:', program);
  };

  const handleStartProgram = (program: any, customizations?: any) => {
    console.log('Starting program:', program.name);
    console.log('Customizations:', customizations);
    setNotification(`🚀 Started ${program.name}! Your first workout is ready.`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right flex items-center gap-2">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Template Marketplace Banner */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link href="/programs/templates">
          <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 border-2 border-purple-500/40 rounded-xl p-6 hover:border-purple-400/60 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-3 flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 flex items-center gap-2 flex-wrap">
                    🏪 Program Template Marketplace
                    <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">NEW</span>
                  </h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Browse 10 proven workout programs • One-click setup • StrongLifts, PPL, 5/3/1 & more
                  </p>
                </div>
              </div>
              <div className="text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <WorkoutTemplates
        onSelectProgram={handleSelectProgram}
        onStartProgram={handleStartProgram}
      />

      {/* Info Section */}
      <div className="max-w-7xl mx-auto p-6 mt-12">
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Workout Programs Guide</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Column 1 */}
            <div className="space-y-6">
              {/* Program Categories */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">⚡ Program Categories</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Powerlifting:</strong> Focus on squat, bench, deadlift strength</li>
                  <li>• <strong>Bodybuilding:</strong> Muscle growth and aesthetics</li>
                  <li>• <strong>Athletic:</strong> Balanced strength and work capacity</li>
                  <li>• <strong>Specialization:</strong> Intense programs for specific goals</li>
                </ul>
              </div>

              {/* Progression Types */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">📈 Progression Types</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Linear:</strong> Add weight each session (best for beginners)</li>
                  <li>• <strong>Wave:</strong> Undulating intensity across weeks (5/3/1 style)</li>
                  <li>• <strong>Block:</strong> Focus phases (hypertrophy → strength → peak)</li>
                  <li>• <strong>Daily Undulating:</strong> Vary intensity each session</li>
                </ul>
              </div>

              {/* Popular Programs */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-green-400">🌟 Popular Programs</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>StrongLifts 5×5:</strong> Best beginner strength program</li>
                  <li>• <strong>PPL:</strong> Most popular bodybuilding split</li>
                  <li>• <strong>Wendler 5/3/1:</strong> Top intermediate strength program</li>
                  <li>• <strong>GZCLP:</strong> Excellent balance of strength and size</li>
                  <li>• <strong>nSuns 531:</strong> High-volume strength specialization</li>
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              {/* Choosing the Right Program */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-amber-400">🎯 Choosing the Right Program</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Beginners:</strong> Start with 5×5, Starting Strength, or GZCLP</li>
                  <li>• <strong>Muscle Building:</strong> PPL, PHUL, or Arnold Split</li>
                  <li>• <strong>Pure Strength:</strong> Wendler 5/3/1, Texas Method, or nSuns</li>
                  <li>• <strong>Limited Time:</strong> 3-4 day programs (5×5, PHUL, Upper/Lower)</li>
                  <li>• <strong>High Volume Tolerance:</strong> PPL 6-day or nSuns</li>
                </ul>
              </div>

              {/* Training Max */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">💯 Training Max (TM)</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>What is it?</strong> Percentage of your 1RM used for calculations</li>
                  <li>• <strong>Why use it?</strong> Prevents burnout, ensures progression room</li>
                  <li>• <strong>Common TM:</strong> 85-90% of true 1RM</li>
                  <li>• <strong>Adjustment:</strong> Increase after successful cycles</li>
                </ul>
              </div>

              {/* Deload Weeks */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-cyan-400">🔄 Deload Weeks</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>What:</strong> Planned recovery weeks with reduced intensity/volume</li>
                  <li>• <strong>When:</strong> Every 4-8 weeks or after stalling</li>
                  <li>• <strong>Why:</strong> Prevents overtraining, allows adaptation</li>
                  <li>• <strong>How:</strong> Reduce weight 40-60% or cut volume in half</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-bold mb-2 text-purple-300">🎓 Master the Basics</h4>
              <p className="text-sm text-gray-300">
                Don't jump to advanced programs too early. Build a strong foundation with beginner programs first.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-bold mb-2 text-blue-300">📊 Track Your Progress</h4>
              <p className="text-sm text-gray-300">
                Log every workout. Progressive overload requires knowing your numbers.
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-bold mb-2 text-green-300">⏰ Be Consistent</h4>
              <p className="text-sm text-gray-300">
                The best program is the one you can stick to. Choose based on your schedule and preferences.
              </p>
            </div>
          </div>

          {/* Program Comparison */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-center">📊 Quick Program Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-purple-400">Program</th>
                    <th className="text-left p-3 text-blue-400">Level</th>
                    <th className="text-left p-3 text-green-400">Days/Week</th>
                    <th className="text-left p-3 text-amber-400">Goal</th>
                    <th className="text-left p-3 text-purple-400">Progression</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="p-3 font-semibold">StrongLifts 5×5</td>
                    <td className="p-3">Beginner</td>
                    <td className="p-3">3</td>
                    <td className="p-3">Strength Foundation</td>
                    <td className="p-3">Linear (+5lbs/session)</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 font-semibold">Wendler 5/3/1</td>
                    <td className="p-3">Intermediate</td>
                    <td className="p-3">4</td>
                    <td className="p-3">Strength</td>
                    <td className="p-3">Wave (monthly cycles)</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 font-semibold">PPL</td>
                    <td className="p-3">Intermediate</td>
                    <td className="p-3">6</td>
                    <td className="p-3">Muscle Growth</td>
                    <td className="p-3">Linear (weekly)</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 font-semibold">PHUL</td>
                    <td className="p-3">Intermediate</td>
                    <td className="p-3">4</td>
                    <td className="p-3">Strength + Size</td>
                    <td className="p-3">Linear (weekly)</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 font-semibold">GZCLP</td>
                    <td className="p-3">Beginner</td>
                    <td className="p-3">4</td>
                    <td className="p-3">Balanced</td>
                    <td className="p-3">Linear (auto-regulated)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">nSuns 531</td>
                    <td className="p-3">Intermediate</td>
                    <td className="p-3">5</td>
                    <td className="p-3">Max Strength</td>
                    <td className="p-3">Linear (high volume)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3 text-amber-400">⚠️ Important Notes</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong>Test Your 1RM Safely:</strong> Use a 1RM calculator or test with a spotter</li>
              <li>• <strong>Start Light:</strong> Better to start too light than too heavy</li>
              <li>• <strong>Follow the Program:</strong> Don't add random exercises or change the structure</li>
              <li>• <strong>Nutrition Matters:</strong> Programs work best with proper diet and sleep</li>
              <li>• <strong>Form First:</strong> Never sacrifice form for weight or reps</li>
              <li>• <strong>Be Patient:</strong> Programs take 8-16 weeks to show real results</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

