// Performance Optimization Utilities
import { useEffect, useRef, useState } from 'react'

// Debounce function for reducing function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for rate limiting
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Lazy load images
export function lazyLoadImage(
  src: string,
  placeholder?: string
): {
  src: string
  loading: 'lazy' | 'eager'
  onLoad?: () => void
} {
  return {
    src: placeholder || '/placeholder.png',
    loading: 'lazy',
    onLoad: () => {
      // Image loaded
    }
  }
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

// Performance metrics tracking
export interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

export function trackPerformanceMetrics(): PerformanceMetrics {
  const metrics: Partial<PerformanceMetrics> = {}

  // Get navigation timing
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (navigation) {
    metrics.ttfb = navigation.responseStart - navigation.requestStart
  }

  // Get paint timing
  const paintEntries = performance.getEntriesByType('paint')
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
  if (fcp) {
    metrics.fcp = fcp.startTime
  }

  // LCP observer
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      metrics.lcp = lastEntry.renderTime || lastEntry.loadTime
    })
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (e) {
    console.warn('LCP observer not supported')
  }

  // FID observer
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        metrics.fid = entry.processingStart - entry.startTime
      })
    })
    observer.observe({ entryTypes: ['first-input'] })
  } catch (e) {
    console.warn('FID observer not supported')
  }

  // CLS observer
  try {
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          metrics.cls = clsValue
        }
      })
    })
    observer.observe({ entryTypes: ['layout-shift'] })
  } catch (e) {
    console.warn('CLS observer not supported')
  }

  return metrics as PerformanceMetrics
}

// Memory usage tracking
export function trackMemoryUsage(): {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  percent: number
} {
  const memory = (performance as any).memory
  
  if (!memory) {
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      percent: 0
    }
  }

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    percent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
  }
}

// Bundle size analyzer
export async function analyzeBundleSize(): Promise<{
  total: number
  chunks: Array<{ name: string; size: number }>
}> {
  try {
    const response = await fetch('/_next/build-manifest.json')
    const manifest = await response.json()
    
    const chunks = Object.entries(manifest.pages).map(([name, files]) => ({
      name,
      size: (files as string[]).reduce((acc, file) => {
        // Estimate size based on filename (rough approximation)
        return acc + file.length * 100
      }, 0)
    }))

    const total = chunks.reduce((acc, chunk) => acc + chunk.size, 0)

    return { total, chunks }
  } catch (error) {
    console.error('Failed to analyze bundle size:', error)
    return { total: 0, chunks: [] }
  }
}

// Component render tracking
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    console.log(`${componentName} rendered ${renderCount.current} times`)
  })

  return renderCount.current
}

// Hook to track component lifecycle
export function useComponentLifecycle(componentName: string) {
  useEffect(() => {
    const mountTime = performance.now()
    console.log(`${componentName} mounted at ${mountTime}ms`)

    return () => {
      const unmountTime = performance.now()
      const lifetime = unmountTime - mountTime
      console.log(`${componentName} unmounted after ${lifetime}ms`)
    }
  }, [componentName])
}

// Prefetch resources
export function prefetchResource(url: string, type: 'script' | 'style' | 'image' | 'fetch' = 'fetch') {
  if (type === 'fetch') {
    // Prefetch via fetch
    fetch(url, { priority: 'low' } as any).catch(() => {
      // Ignore errors for prefetch
    })
  } else {
    // Prefetch via link tag
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = type
    link.href = url
    document.head.appendChild(link)
  }
}

// Preload critical resources
export function preloadResource(url: string, type: 'script' | 'style' | 'image' | 'font') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = type
  link.href = url
  
  if (type === 'font') {
    link.crossOrigin = 'anonymous'
  }
  
  document.head.appendChild(link)
}

// Virtual scrolling utility
export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
): {
  visibleItems: T[]
  startIndex: number
  endIndex: number
  totalHeight: number
  offsetY: number
  onScroll: (scrollTop: number) => void
} {
  const [scrollTop, setScrollTop] = useState(0)
  const { itemHeight, containerHeight, overscan = 3 } = options

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const onScroll = (newScrollTop: number) => {
    setScrollTop(newScrollTop)
  }

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    onScroll
  }
}

// Memoization helper
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Clear cache periodically
export function createCacheWithTTL<K, V>(ttlMs: number = 60000): Map<K, V> {
  const cache = new Map<K, V>()
  const timestamps = new Map<K, number>()

  setInterval(() => {
    const now = Date.now()
    timestamps.forEach((timestamp, key) => {
      if (now - timestamp > ttlMs) {
        cache.delete(key)
        timestamps.delete(key)
      }
    })
  }, ttlMs)

  return new Proxy(cache, {
    get(target, prop) {
      if (prop === 'set') {
        return (key: K, value: V) => {
          timestamps.set(key, Date.now())
          return target.set(key, value)
        }
      }
      return (target as any)[prop]
    }
  })
}
