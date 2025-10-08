/**
 * Chart Skeleton Loader
 * 
 * Loading state placeholder for chart components during dynamic import
 * Provides better UX while charts are being loaded
 */

export function ChartSkeleton() {
  return (
    <div className="w-full h-64 animate-pulse">
      <div className="h-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-400 uppercase tracking-wider font-bold">Loading chart...</p>
        </div>
      </div>
    </div>
  );
}

export function SmallChartSkeleton() {
  return (
    <div className="w-full h-48 animate-pulse">
      <div className="h-full bg-neutral-900 border-2 border-neutral-800" />
    </div>
  );
}

export function LargeChartSkeleton() {
  return (
    <div className="w-full h-96 animate-pulse">
      <div className="h-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-400 uppercase tracking-wider font-bold">Loading visualization...</p>
        </div>
      </div>
    </div>
  );
}
