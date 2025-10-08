'use client';

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { ChartSkeleton } from '@/components/charts/chart-loading';

const VolumeAnalysisRender = lazy(() => import('./volume-analysis-render'));

interface VolumeData {
  date: string;
  chest: number;
  back: number;
  legs: number;
  shoulders: number;
  arms: number;
  total: number;
}

interface VolumeAnalysisProps {
  userId?: string;
  aggregation?: 'weekly' | 'monthly';
}

export function VolumeAnalysis({ userId: _userId, aggregation = 'weekly' }: VolumeAnalysisProps) {
  const [data, setData] = useState<VolumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAggregation, setSelectedAggregation] = useState<'weekly' | 'monthly'>(aggregation);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('3m');

  useEffect(() => {
    loadVolumeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAggregation, timeRange]);

  const loadVolumeData = async () => {
    setIsLoading(true);
    try {
      // Map time range to period format
      const periodMap = { '3m': '3M', '6m': '6M', '1y': '1Y' };
      const period = periodMap[timeRange];
      
      const response = await fetch(
        `/api/analytics/volume-history?aggregation=${selectedAggregation}&period=${period}`
      );
      if (response.ok) {
        const result = await response.json();
        // Add total to each data point
        const dataWithTotals = result.data.map((point: VolumeData) => ({
          ...point,
          total: point.chest + point.back + point.legs + point.shoulders + point.arms,
        }));
        setData(dataWithTotals);
      } else {
        setData(getMockData());
      }
    } catch (_error) {
      setData(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockData = (): VolumeData[] => {
    const weeks = selectedAggregation === 'weekly' ? 12 : 6;
    const mockData: VolumeData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    for (let i = 0; i < weeks; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 7);
      
      const variance = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 variance
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        chest: Math.round(12000 * variance),
        back: Math.round(15000 * variance),
        legs: Math.round(20000 * variance),
        shoulders: Math.round(8000 * variance),
        arms: Math.round(6000 * variance),
        total: Math.round(61000 * variance),
      });
    }

    return mockData;
  };

  const calculateTotalStats = () => {
    if (data.length === 0) return { total: 0, average: 0, trend: 0 };

    const total = data.reduce((sum, d) => sum + d.total, 0);
    const average = total / data.length;
    
    if (data.length < 2) return { total, average, trend: 0 };
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.total, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.total, 0) / secondHalf.length;
    
    const trend = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    return { total, average, trend };
  };

  const stats = calculateTotalStats();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (selectedAggregation === 'weekly') {
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

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<Record<string, unknown>>; label?: string }) => {
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

  if (isLoading && data.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-800 w-1/3"></div>
          <div className="h-80 bg-neutral-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-950/20 border-2 border-amber-700 flex items-center justify-center">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">VOLUME ANALYSIS</h3>
            <p className="text-sm font-bold uppercase tracking-wider text-neutral-400">TRACK TRAINING VOLUME BY MUSCLE GROUP</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Aggregation Selector */}
          <div className="flex items-center gap-2 bg-neutral-900 border-2 border-neutral-700 p-1">
            <button
              onClick={() => setSelectedAggregation('weekly')}
              className={`px-3 py-1 text-sm font-black uppercase tracking-wider transition-colors ${
                selectedAggregation === 'weekly'
                  ? 'bg-amber-950/20 text-amber-400 border-2 border-amber-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              WEEKLY
            </button>
            <button
              onClick={() => setSelectedAggregation('monthly')}
              className={`px-3 py-1 text-sm font-black uppercase tracking-wider transition-colors ${
                selectedAggregation === 'monthly'
                  ? 'bg-amber-950/20 text-amber-400 border-2 border-amber-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              MONTHLY
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-neutral-900 border-2 border-neutral-700 p-1">
            {[
              { value: '3m' as const, label: '3M' },
              { value: '6m' as const, label: '6M' },
              { value: '1y' as const, label: '1Y' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm font-black uppercase tracking-wider transition-colors ${
                  timeRange === range.value
                    ? 'bg-amber-950/20 text-amber-400 border-2 border-amber-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">TOTAL VOLUME</div>
          <div className="text-2xl font-black text-white">{formatVolume(stats.total)} KG</div>
        </div>
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">AVERAGE PER {selectedAggregation === 'weekly' ? 'WEEK' : 'MONTH'}</div>
          <div className="text-2xl font-black text-white">{formatVolume(Math.round(stats.average))} KG</div>
        </div>
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">TREND</div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${stats.trend > 0 ? 'text-amber-400' : 'text-neutral-400'}`} />
            <div className={`text-2xl font-black ${stats.trend > 0 ? 'text-amber-400' : 'text-neutral-400'}`}>
              {stats.trend > 0 ? '+' : ''}{stats.trend.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <VolumeAnalysisRender data={data} aggregation={selectedAggregation} />
      </Suspense>

      {/* Insights */}
      {data.length > 0 && (
        <div className="bg-amber-950/20 border-2 border-amber-700 p-4">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <div className="font-black uppercase tracking-wider text-amber-400 mb-1">VOLUME INSIGHTS</div>
              <div className="text-sm font-bold text-neutral-300">
                {stats.trend > 5 ? (
                  <>YOUR TRAINING VOLUME HAS INCREASED BY {stats.trend.toFixed(1)}% - GREAT PROGRESSIVE OVERLOAD!</>
                ) : stats.trend < -5 ? (
                  <>YOUR VOLUME HAS DECREASED BY {Math.abs(stats.trend).toFixed(1)}%. CONSIDER IF THIS IS INTENTIONAL DELOAD OR IF YOU NEED TO INCREASE TRAINING INTENSITY.</>
                ) : (
                  <>YOUR VOLUME IS STABLE. CONSIDER PLANNED VARIATION TO CONTINUE MAKING PROGRESS AND AVOID PLATEAUS.</>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
