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

interface ProgressionData {
  date: string;
  weight: number;
  reps: number;
  estimatedMax: number;
}

interface ProgressiveOverloadTrackerRenderProps {
  data: ProgressionData[];
}

export default function ProgressiveOverloadTrackerRender({ data }: ProgressiveOverloadTrackerRenderProps) {
  return (
    <div className="h-80">
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
            label={{ value: "Weight (lbs)", angle: -90, position: "insideLeft", fill: "#64748b" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => {
              if (name === "estimatedMax") return [`${value.toFixed(1)} lbs`, "Est. 1RM"];
              if (name === "weight") return [`${value} lbs`, "Weight"];
              if (name === "reps") return [value, "Reps"];
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="estimatedMax"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
            name="Est. 1RM"
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 3 }}
            strokeDasharray="5 5"
            name="Working Weight"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
