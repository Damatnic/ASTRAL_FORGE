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

interface MeasurementsChartRenderProps {
  data: Array<{
    date: string
    waist?: number
    chest?: number
    arms?: number
  }>
}

export default function MeasurementsChartRender({ data }: MeasurementsChartRenderProps) {
  return (
    <div className="h-96">
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
          {data.some(d => d.waist) && (
            <Line
              type="monotone"
              dataKey="waist"
              stroke="#d97706"
              strokeWidth={3}
              dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#d97706', stroke: '#CD7F32', strokeWidth: 2 }}
              name="WAIST (CM)"
            />
          )}
          {data.some(d => d.chest) && (
            <Line
              type="monotone"
              dataKey="chest"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#f59e0b', stroke: '#CD7F32', strokeWidth: 2 }}
              name="CHEST (CM)"
            />
          )}
          {data.some(d => d.arms) && (
            <Line
              type="monotone"
              dataKey="arms"
              stroke="#E5A155"
              strokeWidth={3}
              dot={{ fill: '#E5A155', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#E5A155', stroke: '#CD7F32', strokeWidth: 2 }}
              name="ARMS (CM)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
