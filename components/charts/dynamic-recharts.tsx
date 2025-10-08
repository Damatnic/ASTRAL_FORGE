/**
 * Dynamic Recharts Helper
 * 
 * Helper to dynamically import recharts only when needed.
 * This reduces initial bundle size by deferring chart loading.
 * 
 * Usage in components:
 * ```tsx
 * import { lazy, Suspense } from 'react';
 * import { ChartSkeleton } from '@/components/charts/chart-loading';
 * 
 * const Chart = lazy(() => import('./chart-impl'));
 * 
 * // In component:
 * <Suspense fallback={<ChartSkeleton />}>
 *   <Chart data={data} />
 * </Suspense>
 * ```
 */

'use client';

/**
 * Re-export recharts for type safety
 * These are NOT bundled - they're just type definitions
 */
export type {
  LineProps,
  BarProps,
  AreaProps,
  PieProps,
  RadarProps,
} from 'recharts';

/**
 * Helper function to dynamically import recharts
 * Use this in components that need charts
 */
export const loadRecharts = () => import('recharts');
