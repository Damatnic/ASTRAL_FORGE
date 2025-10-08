'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MeasurementProgressChartRenderProps {
  data: Array<{
    date: string
    value: number | undefined
  }>
  selectedMetric: string
  formatDate: (date: string) => string
  getMetricLabel: (metric: string) => string
}

export default function MeasurementProgressChartRender({
  data,
  selectedMetric,
  formatDate,
  getMetricLabel,
}: MeasurementProgressChartRenderProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
          label={{
            value: getMetricLabel(selectedMetric),
            angle: -90,
            position: 'insideLeft',
            fill: '#9ca3af',
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', r: 5 }}
          name={getMetricLabel(selectedMetric)}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
