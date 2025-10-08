"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VolumeData {
  date: string;
  chest: number;
  back: number;
  legs: number;
  shoulders: number;
  arms: number;
  total: number;
}

interface VolumeAnalysisRenderProps {
  data: VolumeData[];
  aggregation: 'weekly' | 'monthly';
}

const CustomTooltip = ({ active, payload, label, aggregation }: { 
  active?: boolean; 
  payload?: Array<Record<string, unknown>>; 
  label?: string;
  aggregation: 'weekly' | 'monthly';
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (aggregation === 'weekly') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const formatVolume = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  if (active && payload && payload.length) {
    const total = payload.reduce((sum, item) => {
      const value = item.value;
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);

    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-3 shadow-xl">
        <p className="text-white font-black uppercase tracking-wider mb-2">{label && formatDate(label)}</p>
        <p className="text-amber-400 font-black uppercase tracking-wider mb-2">TOTAL: {formatVolume(total)} KG</p>
        <div className="space-y-1">
          {payload.map((item, index) => {
            const value = item.value;
            const displayValue = typeof value === 'number' ? value : 0;
            const itemName = typeof item.name === 'string' ? item.name : 'Unknown';
            return (
              <p key={index} className="text-sm font-bold uppercase tracking-wider" style={{ color: item.color as string }}>
                {itemName}: {formatVolume(displayValue)} KG
              </p>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function VolumeAnalysisRender({ data, aggregation }: VolumeAnalysisRenderProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (aggregation === 'weekly') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const formatVolume = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorChest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLegs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E5A155" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#E5A155" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorShoulders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b45309" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#b45309" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorArms" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#92400e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#92400e" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={formatVolume}
            label={{ value: 'VOLUME (KG)', angle: -90, position: 'insideLeft', style: { fill: '#737373', fontWeight: 'bold' } }}
          />
          <Tooltip content={<CustomTooltip aggregation={aggregation} />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area
            type="monotone"
            dataKey="legs"
            stackId="1"
            stroke="#E5A155"
            fill="url(#colorLegs)"
            name="LEGS"
          />
          <Area
            type="monotone"
            dataKey="back"
            stackId="1"
            stroke="#f59e0b"
            fill="url(#colorBack)"
            name="BACK"
          />
          <Area
            type="monotone"
            dataKey="chest"
            stackId="1"
            stroke="#d97706"
            fill="url(#colorChest)"
            name="CHEST"
          />
          <Area
            type="monotone"
            dataKey="shoulders"
            stackId="1"
            stroke="#b45309"
            fill="url(#colorShoulders)"
            name="SHOULDERS"
          />
          <Area
            type="monotone"
            dataKey="arms"
            stackId="1"
            stroke="#92400e"
            fill="url(#colorArms)"
            name="ARMS"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
