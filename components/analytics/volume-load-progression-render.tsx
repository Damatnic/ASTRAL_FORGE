"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface VolumeDataPoint {
  date: string;
  totalVolume: number;
  trendLine: number;
  workouts: number;
}

interface VolumeLoadProgressionRenderProps {
  data: VolumeDataPoint[];
}

export default function VolumeLoadProgressionRender({ data }: VolumeLoadProgressionRenderProps) {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: "12px" }}
            label={{
              value: "Volume (lbs)",
              angle: -90,
              position: "insideLeft",
              fill: "#64748b",
            }}
            tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => {
              if (name === "totalVolume") return [`${(value / 1000).toFixed(1)}k lbs`, "Total Volume"];
              if (name === "trendLine") return [`${(value / 1000).toFixed(1)}k lbs`, "Trend"];
              if (name === "workouts") return [value, "Workouts"];
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            iconType="line"
          />
          
          <Line
            type="monotone"
            dataKey="totalVolume"
            stroke="#a855f7"
            strokeWidth={3}
            dot={{ fill: "#a855f7", r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Volume"
          />
          
          <Line
            type="monotone"
            dataKey="trendLine"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Trend Line"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
