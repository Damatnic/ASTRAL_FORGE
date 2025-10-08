'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Types
type ChartType = 'strength' | 'volume' | 'frequency';

interface ExerciseDataPoint {
  date: string;
  weight: number;
  volume: number;
  reps: number;
  estimatedOneRM: number;
  sets: number;
}

interface ExercisePerformanceChartRenderProps {
  chartType: ChartType;
  filteredData: ExerciseDataPoint[];
  formatDate: (dateStr: string) => string;
  CustomTooltip: React.ComponentType<{ active?: boolean; payload?: unknown[] }>;
}

export default function ExercisePerformanceChartRender({
  chartType,
  filteredData,
  formatDate,
  CustomTooltip,
}: ExercisePerformanceChartRenderProps) {
  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available for this time period
      </div>
    );
  }

  return (
    <>
      {/* Strength Chart */}
      {chartType === 'strength' && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#A78BFA"
              strokeWidth={2}
              name="Max Weight"
              dot={{ fill: '#A78BFA', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="estimatedOneRM"
              stroke="#FB923C"
              strokeWidth={2}
              name="Est. 1RM"
              dot={{ fill: '#FB923C', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Volume Chart */}
      {chartType === 'volume' && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="volume" fill="#60A5FA" name="Total Volume (lbs)" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Frequency Chart */}
      {chartType === 'frequency' && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="sets" fill="#34D399" name="Sets Performed" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
