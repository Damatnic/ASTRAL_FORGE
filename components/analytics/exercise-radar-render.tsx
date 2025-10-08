"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface ExerciseMetrics {
  metric: string;
  value: number;
  fullMark: number;
}

interface ExerciseRadarRenderProps {
  metrics: ExerciseMetrics[];
}

export default function ExerciseRadarRender({ metrics }: ExerciseRadarRenderProps) {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={metrics}>
          <PolarGrid stroke="#525252" />
          <PolarAngleAxis 
            dataKey="metric" 
            stroke="#737373"
            style={{ fontSize: '12px' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            stroke="#737373"
            style={{ fontSize: '12px' }}
          />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#E5A155"
            fill="#E5A155"
            fillOpacity={0.6}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
