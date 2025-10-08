/**
 * Chart Loading Skeleton
 * 
 * Displays while chart components are being lazy-loaded
 */

export function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center animate-pulse">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent animate-spin mx-auto mb-2" />
        <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider">LOADING CHART...</p>
      </div>
    </div>
  )
}

export function ChartSkeletonSmall() {
  return (
    <div className="w-full h-[200px] bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center animate-pulse">
      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent animate-spin" />
    </div>
  )
}
