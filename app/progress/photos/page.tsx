'use client'

import Link from 'next/link'
import { ArrowLeft, Camera, Upload, Image as ImageIcon } from 'lucide-react'

export default function ProgressPhotosPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/progress"
              className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Progress Photos</h1>
              <p className="text-gray-400">Track your transformation</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold flex items-center gap-2 transition-all">
            <Upload className="w-5 h-5" />
            Upload Photo
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Progress Photos Yet</h2>
          <p className="text-gray-400 mb-6">
            Upload photos to track your physical transformation over time
          </p>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors">
            <Upload className="w-5 h-5" />
            Upload Your First Photo
          </button>
        </div>

        {/* Photo Grid Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center"
            >
              <ImageIcon className="w-12 h-12 text-slate-700" />
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Photo Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Take photos in the same lighting and location for consistency</li>
            <li>• Front, side, and back angles provide the most complete view</li>
            <li>• Upload photos weekly or bi-weekly to track changes</li>
            <li>• Photos are private and only visible to you</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
