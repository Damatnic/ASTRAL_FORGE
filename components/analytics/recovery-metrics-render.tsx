"use client";

import {
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Line,
} from "recharts";

interface RecoveryData {
  date: string;
  sleepQuality: number;
  sorenessLevel: number;
  hrvScore: number;
  recoveryScore: number;
}

interface RecoveryMetricsRenderProps {
  data: RecoveryData[];
}

export default function RecoveryMetricsRender({ data }: RecoveryMetricsRenderProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Recovery Score Trend */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Recovery Score Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="recoveryScore"
                fill="#a855f7"
                fillOpacity={0.2}
                stroke="#a855f7"
                strokeWidth={3}
                name="Recovery Score"
              />
              <Line
                type="monotone"
                dataKey="hrvScore"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="HRV Score"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sleep & Soreness */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Sleep Quality & Soreness</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis stroke="#94a3b8" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="sleepQuality" fill="#3b82f6" name="Sleep Quality" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sorenessLevel" fill="#ef4444" name="Soreness" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
