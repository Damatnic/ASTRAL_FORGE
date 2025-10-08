'use client'

import { lazy, Suspense } from 'react'
import { ChartSkeleton } from '@/components/charts/chart-loading'

const WeightChartRender = lazy(() => import('./weight-chart-render'))

interface WeightChartProps {
  data: Array<{
    date: string
    weight?: number
  }>
}

export default function WeightChart({ data }: WeightChartProps) {
  return (
    <div className="bg-astral-gray border-2 border-neutral-800 p-6">
      <h3 className="text-lg font-black uppercase tracking-wider mb-4">WEIGHT PROGRESS</h3>
      <Suspense fallback={<ChartSkeleton />}>
        <WeightChartRender data={data} />
      </Suspense>
    </div>
  )
}
