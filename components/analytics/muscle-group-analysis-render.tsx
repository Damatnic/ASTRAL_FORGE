"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface MuscleGroupData {
  muscleGroup: string;
  volume: number;
  sets: number;
  percentage: number;
  color: string;
}

interface MuscleGroupAnalysisRenderProps {
  muscleGroups: MuscleGroupData[];
}

export default function MuscleGroupAnalysisRender({ muscleGroups }: MuscleGroupAnalysisRenderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Volume Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={muscleGroups}
                dataKey="volume"
                nameKey="muscleGroup"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ muscleGroup, percentage }: { muscleGroup: string; percentage: number }) => 
                  `${muscleGroup} ${percentage}%`
                }
                labelLine={{ stroke: "#475569" }}
              >
                {muscleGroups.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => `${Math.round(value).toLocaleString()} kg`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Sets per Muscle Group</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={muscleGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="muscleGroup" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="sets" radius={[8, 8, 0, 0]}>
                {muscleGroups.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
