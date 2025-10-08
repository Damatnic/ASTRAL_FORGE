"use client";

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts";

interface TrainingLoadData {
  date: string;
  tss: number;
  trimp: number;
  acuteLoad: number;
  chronicLoad: number;
  acr: number;
}

interface TrainingLoadRenderProps {
  data: TrainingLoadData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-3">
        <p className="text-white font-black uppercase tracking-wider mb-2">{new Date(data.date).toLocaleDateString()}</p>
        <p className="text-amber-400 text-sm">TSS: {data.tss}</p>
        <p className="text-amber-400 text-sm">Acute Load: {data.acuteLoad.toFixed(0)}</p>
        <p className="text-amber-400 text-sm">Chronic Load: {data.chronicLoad.toFixed(0)}</p>
        <p className="text-amber-400 text-sm">ACR: {data.acr.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function TrainingLoadRender({ data }: TrainingLoadRenderProps) {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="acrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5A155" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#E5A155" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#525252" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#737373"
            style={{ fontSize: '11px' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            yAxisId="left"
            stroke="#737373"
            style={{ fontSize: '12px' }}
            label={{ value: 'Load', angle: -90, position: 'insideLeft', style: { fill: '#737373' } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#737373"
            style={{ fontSize: '12px' }}
            domain={[0.5, 1.5]}
            label={{ value: 'ACR', angle: 90, position: 'insideRight', style: { fill: '#737373' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="acuteLoad"
            fill="url(#acrGradient)"
            stroke="#E5A155"
            strokeWidth={2}
            name="Acute Load (7-day)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="chronicLoad"
            stroke="#d97706"
            strokeWidth={2}
            name="Chronic Load (28-day)"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="acr"
            stroke="#f59e0b"
            strokeWidth={2}
            name="ACR"
            dot={{ fill: '#f59e0b', r: 3 }}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
