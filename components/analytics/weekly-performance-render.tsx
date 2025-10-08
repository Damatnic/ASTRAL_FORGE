"use client";

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts";

interface DailyPerformance {
  date: string;
  dayOfWeek: string;
  volume: number;
  workouts: number;
  sets: number;
  avgIntensity: number;
}

interface WeeklyPerformanceRenderProps {
  days: DailyPerformance[];
  avgVolume: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-3">
        <p className="text-white font-black uppercase tracking-wider mb-1">{payload[0].payload.dayOfWeek}</p>
        <p className="text-amber-400 text-sm">Volume: {payload[0].value.toLocaleString()} kg</p>
        <p className="text-amber-400 text-sm">Sets: {payload[1]?.value || 0}</p>
        <p className="text-amber-400 text-sm">Intensity: {payload[2]?.value || 0}/10</p>
      </div>
    );
  }
  return null;
};

export default function WeeklyPerformanceRender({ days, avgVolume }: WeeklyPerformanceRenderProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={days}>
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5A155" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#E5A155" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#525252" opacity={0.3} />
          <XAxis 
            dataKey="dayOfWeek" 
            stroke="#737373"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#737373"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#737373"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar 
            yAxisId="left"
            dataKey="volume" 
            fill="url(#volumeGradient)"
            name="Volume (kg)"
            radius={[8, 8, 0, 0]}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="sets" 
            stroke="#d97706"
            strokeWidth={2}
            name="Sets"
            dot={{ fill: '#d97706', r: 4 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="avgIntensity" 
            stroke="#f59e0b"
            strokeWidth={2}
            name="Avg Intensity"
            dot={{ fill: '#f59e0b', r: 4 }}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
