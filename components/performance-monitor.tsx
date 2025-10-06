'use client'

import { useEffect, useState } from 'react'
import {
  trackPerformanceMetrics,
  trackMemoryUsage,
  type PerformanceMetrics
} from '@/lib/performance'

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [memory, setMemory] = useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
    percent: 0
  })
  const [showMonitor, setShowMonitor] = useState(false)

  useEffect(() => {
    // Track metrics on mount
    const tracked = trackPerformanceMetrics()
    setMetrics(tracked)

    // Update memory usage every 5 seconds
    const interval = setInterval(() => {
      setMemory(trackMemoryUsage())
    }, 5000)

    // Check for dev mode
    setShowMonitor(process.env.NODE_ENV === 'development')

    return () => clearInterval(interval)
  }, [])

  if (!showMonitor || !metrics) {
    return null
  }

  const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) {
      return `${ms.toFixed(0)}ms`
    }
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getScoreColor = (score: number, thresholds: { good: number; poor: number }) => {
    if (score <= thresholds.good) return 'text-green-400'
    if (score <= thresholds.poor) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="fixed bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-xs text-white shadow-xl max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-sm">Performance Monitor</div>
        <button
          onClick={() => setShowMonitor(false)}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {/* Core Web Vitals */}
        <div className="bg-slate-800/50 rounded p-2">
          <div className="font-semibold mb-2 text-slate-300">Core Web Vitals</div>
          
          {metrics.fcp !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">FCP (First Contentful Paint)</span>
              <span className={getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })}>
                {formatTime(metrics.fcp)}
              </span>
            </div>
          )}

          {metrics.lcp !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">LCP (Largest Contentful Paint)</span>
              <span className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}>
                {formatTime(metrics.lcp)}
              </span>
            </div>
          )}

          {metrics.fid !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">FID (First Input Delay)</span>
              <span className={getScoreColor(metrics.fid, { good: 100, poor: 300 })}>
                {formatTime(metrics.fid)}
              </span>
            </div>
          )}

          {metrics.cls !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">CLS (Cumulative Layout Shift)</span>
              <span className={getScoreColor(metrics.cls * 1000, { good: 100, poor: 250 })}>
                {metrics.cls.toFixed(3)}
              </span>
            </div>
          )}

          {metrics.ttfb !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">TTFB (Time to First Byte)</span>
              <span className={getScoreColor(metrics.ttfb, { good: 800, poor: 1800 })}>
                {formatTime(metrics.ttfb)}
              </span>
            </div>
          )}
        </div>

        {/* Memory Usage */}
        {memory.jsHeapSizeLimit > 0 && (
          <div className="bg-slate-800/50 rounded p-2">
            <div className="font-semibold mb-2 text-slate-300">Memory Usage</div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Used Heap</span>
              <span>{formatBytes(memory.usedJSHeapSize)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Heap</span>
              <span>{formatBytes(memory.totalJSHeapSize)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Heap Limit</span>
              <span>{formatBytes(memory.jsHeapSizeLimit)}</span>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Usage</span>
                <span className={memory.percent > 80 ? 'text-red-400' : 'text-green-400'}>
                  {memory.percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    memory.percent > 80 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(memory.percent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
          <div className="font-semibold mb-1 text-blue-400">Performance Tips</div>
          <ul className="text-slate-300 space-y-1">
            <li>• Green = Good, Yellow = Needs Improvement, Red = Poor</li>
            <li>• FCP target: &lt;1.8s</li>
            <li>• LCP target: &lt;2.5s</li>
            <li>• FID target: &lt;100ms</li>
            <li>• CLS target: &lt;0.1</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Development-only toggle button
export function PerformanceMonitorToggle() {
  const [show, setShow] = useState(false)

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="fixed bottom-4 left-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition-all z-40"
      >
        📊 Performance
      </button>
      {show && <PerformanceMonitor />}
    </>
  )
}
