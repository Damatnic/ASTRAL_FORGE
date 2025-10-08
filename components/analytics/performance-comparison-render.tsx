"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  change: number;
}

interface PerformanceComparisonRenderProps {
  data: ComparisonData[];
}

export default function PerformanceComparisonRender({ data }: PerformanceComparisonRenderProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
          <XAxis dataKey="metric" stroke="#737373" />
          <YAxis stroke="#737373" />
          <Tooltip contentStyle={{ backgroundColor: "#404040", border: "2px solid #525252" }} />
          <Legend />
          <Bar dataKey="current" fill="#E5A155" name="Current" radius={[8, 8, 0, 0]} />
          <Bar dataKey="previous" fill="#737373" name="Previous" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
