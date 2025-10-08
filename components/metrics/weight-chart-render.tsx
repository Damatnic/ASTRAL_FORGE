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

interface WeightChartRenderProps {
  data: Array<{
    date: string
    weight?: number
  }>
}

export default function WeightChartRender({ data }: WeightChartRenderProps) {
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
            dataKey="weight"
            stroke="#E5A155"
            strokeWidth={3}
            dot={{ fill: '#E5A155', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#E5A155', stroke: '#CD7F32', strokeWidth: 2 }}
            name="WEIGHT (KG)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
