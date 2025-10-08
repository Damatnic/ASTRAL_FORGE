'use client'

import { lazy, Suspense } from 'react'
import { ChartSkeleton } from '@/components/charts/chart-loading'

const ChartRender = lazy(() => import('./progress-chart-render'))

interface MeasurementProgressChartProps {
  data: Array<{
    date: string
    value: number | undefined
  }>
  selectedMetric: string
  formatDate: (date: string) => string
  getMetricLabel: (metric: string) => string
}

export default function MeasurementProgressChart({
  data,
  selectedMetric,
  formatDate,
  getMetricLabel,
}: MeasurementProgressChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartRender
        data={data}
        selectedMetric={selectedMetric}
        formatDate={formatDate}
        getMetricLabel={getMetricLabel}
      />
    </Suspense>
  )
}
