"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MuscleDistribution {
  name: string;
  volume: number;
  percentage: number;
  color: string;
}

interface TrainingDistributionRenderProps {
  distribution: MuscleDistribution[];
}

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: MuscleDistribution }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-3">
        <p className="font-black uppercase tracking-wider text-white mb-1">{data.name}</p>
        <p className="text-sm text-neutral-300">{data.volume.toLocaleString()} kg</p>
        <p className="text-sm text-neutral-400">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-black"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function TrainingDistributionRender({ distribution }: TrainingDistributionRenderProps) {
  return (
    <div className="bg-neutral-900 p-6 border-2 border-neutral-800">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={110}
              innerRadius={70}
              fill="#8884d8"
              dataKey="volume"
              animationBegin={0}
              animationDuration={800}
            >
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => {
                const item = distribution.find(d => d.name === value);
                return (
                  <span className="text-sm text-neutral-300">
                    {value} ({item?.percentage}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
