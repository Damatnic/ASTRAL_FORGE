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

interface BodyFatChartRenderProps {
  data: Array<{
    date: string
    bodyFat?: number
  }>
}

export default function BodyFatChartRender({ data }: BodyFatChartRenderProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
          <XAxis dataKey="date" stroke="#737373" />
          <YAxis stroke="#737373" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#262626',
              border: '2px solid #404040',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="bodyFat"
            stroke="#E5A155"
            strokeWidth={3}
            dot={{ fill: '#E5A155', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#E5A155', stroke: '#CD7F32', strokeWidth: 2 }}
            name="BODY FAT (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
