'use client'

import { lazy, Suspense } from 'react'
import { ChartSkeleton } from '@/components/charts/chart-loading'

const MeasurementsChartRender = lazy(() => import('./measurements-chart-render'))

interface MeasurementsChartProps {
  data: Array<{
    date: string
    waist?: number
    chest?: number
    arms?: number
  }>
}

export default function MeasurementsChart({ data }: MeasurementsChartProps) {
  return (
    <div className="bg-astral-gray border-2 border-neutral-800 p-6">
      <h3 className="text-lg font-black uppercase tracking-wider mb-4">BODY MEASUREMENTS PROGRESS</h3>
      <Suspense fallback={<ChartSkeleton />}>
        <MeasurementsChartRender data={data} />
      </Suspense>
    </div>
  )
}
