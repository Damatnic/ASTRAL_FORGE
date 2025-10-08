'use client'

import { lazy, Suspense } from 'react'
import { ChartSkeleton } from '@/components/charts/chart-loading'

const BodyFatChartRender = lazy(() => import('./body-fat-chart-render'))

interface BodyFatChartProps {
  data: Array<{
    date: string
    bodyFat?: number
  }>
}

export default function BodyFatChart({ data }: BodyFatChartProps) {
  return (
    <div className="bg-astral-gray border-2 border-neutral-800 p-6">
      <h3 className="text-lg font-black uppercase tracking-wider mb-4">BODY FAT PROGRESS</h3>
      <Suspense fallback={<ChartSkeleton />}>
        <BodyFatChartRender data={data} />
      </Suspense>
    </div>
  )
}
