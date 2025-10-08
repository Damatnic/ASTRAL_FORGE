'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExerciseData {
  date: string;
  estimated1RM: number;
  actualWeight: number;
  reps: number;
}

interface StrengthChartProps {
  data: ExerciseData[];
}

export default function StrengthChart({ data }: StrengthChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<Record<string, unknown>> }) => {
    if (active && payload && payload.length) {
      const data = payload[0] as unknown as { payload: ExerciseData };
      const exerciseData = data.payload;
      return (
        <div className="bg-neutral-900 border-2 border-neutral-800 p-3 shadow-xl">
          <p className="text-white font-black uppercase tracking-wider mb-2">{formatDate(exerciseData.date)}</p>
          <p className="text-amber-400 text-sm font-bold uppercase tracking-wider">
            EST. 1RM: <span className="font-black">{exerciseData.estimated1RM} KG</span>
          </p>
          <p className="text-neutral-400 text-sm font-bold uppercase tracking-wider">
            ACTUAL: {exerciseData.actualWeight} KG × {exerciseData.reps} REPS
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#737373"
            style={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <YAxis
            stroke="#737373"
            style={{ fontSize: '12px', fontWeight: 'bold' }}
            label={{ value: '1RM (KG)', angle: -90, position: 'insideLeft', style: { fill: '#737373', fontWeight: 'bold' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="estimated1RM"
            stroke="#E5A155"
            strokeWidth={3}
            dot={{ fill: '#E5A155', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#E5A155', stroke: '#CD7F32', strokeWidth: 2 }}
            name="ESTIMATED 1RM"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
