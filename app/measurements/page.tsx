'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Scale,
  Ruler,
  Camera,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Upload,
  Download,
  Maximize2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Types
interface Measurement {
  id: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi: number;
  measurements: {
    neck?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    bicepLeft?: number;
    bicepRight?: number;
    thighLeft?: number;
    thighRight?: number;
    calfLeft?: number;
    calfRight?: number;
  };
  notes?: string;
}

interface ProgressPhoto {
  id: string;
  date: Date;
  type: 'front' | 'side' | 'back';
  imageUrl: string;
  notes?: string;
}

type MeasurementType = 'weight' | 'bodyFat' | 'muscleMass' | 'bmi' | 'waist' | 'chest';

export default function BodyMeasurementsPage() {
  const [selectedMetric, setSelectedMetric] = useState<MeasurementType>('weight');
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Mock measurement data - last 90 days
  const mockMeasurements: Measurement[] = useMemo(() => {
    const measurements: Measurement[] = [];
    const today = new Date();
    const startWeight = 185;
    const startBodyFat = 18;
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Weekly measurements
      if (date.getDay() === 0) {
        const progress = (89 - i) / 89;
        const weight = startWeight - progress * 8 + Math.random() * 2;
        const bodyFat = startBodyFat - progress * 3 + Math.random() * 0.5;
        const muscleMass = 150 + progress * 5 + Math.random() * 1;
        const bmi = (weight / (72 * 72)) * 703;
        
        measurements.push({
          id: `measurement-${i}`,
          date,
          weight: Number(weight.toFixed(1)),
          bodyFat: Number(bodyFat.toFixed(1)),
          muscleMass: Number(muscleMass.toFixed(1)),
          bmi: Number(bmi.toFixed(1)),
          measurements: {
            neck: 15.5 + Math.random() * 0.5,
            chest: 42 + progress * 1.5 + Math.random() * 0.5,
            waist: 34 - progress * 2 + Math.random() * 0.5,
            hips: 40 - progress * 1 + Math.random() * 0.5,
            bicepLeft: 15 + progress * 0.8 + Math.random() * 0.3,
            bicepRight: 15 + progress * 0.8 + Math.random() * 0.3,
            thighLeft: 24 + progress * 0.5 + Math.random() * 0.3,
            thighRight: 24 + progress * 0.5 + Math.random() * 0.3,
            calfLeft: 15.5 + Math.random() * 0.3,
            calfRight: 15.5 + Math.random() * 0.3,
          },
          notes: i % 4 === 0 ? 'Feeling great! Seeing good progress.' : undefined,
        });
      }
    }
    
    return measurements;
  }, []);

  // Mock progress photos
  const mockPhotos: ProgressPhoto[] = useMemo(() => {
    const photos: ProgressPhoto[] = [];
    const photoCount = 12;
    
    for (let i = 0; i < photoCount; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      
      ['front', 'side', 'back'].forEach((type, idx) => {
        photos.push({
          id: `photo-${i}-${type}`,
          date,
          type: type as 'front' | 'side' | 'back',
          imageUrl: `https://via.placeholder.com/400x600/8b5cf6/ffffff?text=${type.toUpperCase()}+Week+${i + 1}`,
          notes: i === 0 ? 'Latest progress photo' : undefined,
        });
      });
    }
    
    return photos;
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    if (mockMeasurements.length === 0) return null;
    
    const latest = mockMeasurements[mockMeasurements.length - 1];
    const first = mockMeasurements[0];
    
    const weightChange = latest.weight - first.weight;
    const bodyFatChange = (latest.bodyFat || 0) - (first.bodyFat || 0);
    const muscleMassChange = (latest.muscleMass || 0) - (first.muscleMass || 0);
    const waistChange = (latest.measurements.waist || 0) - (first.measurements.waist || 0);
    
    return {
      current: {
        weight: latest.weight,
        bodyFat: latest.bodyFat || 0,
        muscleMass: latest.muscleMass || 0,
        bmi: latest.bmi,
        waist: latest.measurements.waist || 0,
        chest: latest.measurements.chest || 0,
      },
      changes: {
        weight: weightChange,
        bodyFat: bodyFatChange,
        muscleMass: muscleMassChange,
        waist: waistChange,
      },
      goal: {
        weight: 175,
        bodyFat: 12,
        waist: 32,
      },
    };
  }, [mockMeasurements]);

  // Chart data for selected metric
  const chartData = useMemo(() => {
    return mockMeasurements.map(m => ({
      date: m.date.toISOString().split('T')[0],
      value: selectedMetric === 'weight' ? m.weight
        : selectedMetric === 'bodyFat' ? m.bodyFat
        : selectedMetric === 'muscleMass' ? m.muscleMass
        : selectedMetric === 'bmi' ? m.bmi
        : selectedMetric === 'waist' ? m.measurements.waist
        : selectedMetric === 'chest' ? m.measurements.chest
        : m.weight,
    })).filter(d => d.value !== undefined);
  }, [mockMeasurements, selectedMetric]);

  // Group photos by date
  const photosByDate = useMemo(() => {
    const grouped = mockPhotos.reduce((acc, photo) => {
      const dateKey = photo.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(photo);
      return acc;
    }, {} as Record<string, ProgressPhoto[]>);
    
    return Object.entries(grouped)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, photos]) => ({ date, photos }));
  }, [mockPhotos]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getMetricLabel = (metric: MeasurementType) => {
    switch (metric) {
      case 'weight': return 'Weight (lbs)';
      case 'bodyFat': return 'Body Fat (%)';
      case 'muscleMass': return 'Muscle Mass (lbs)';
      case 'bmi': return 'BMI';
      case 'waist': return 'Waist (inches)';
      case 'chest': return 'Chest (inches)';
      default: return 'Value';
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(selectedPhotos.filter(id => id !== photoId));
    } else if (selectedPhotos.length < 4) {
      setSelectedPhotos([...selectedPhotos, photoId]);
    }
  };

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <Ruler className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
            Body Measurements
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg px-4">
            Track your transformation with measurements and progress photos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap px-2">
          <button
            onClick={() => setShowAddMeasurement(!showAddMeasurement)}
            className="px-4 sm:px-6 py-3 sm:py-3.5 min-h-[48px] bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-purple-500/50 flex items-center gap-2 text-sm sm:text-base touch-manipulation"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Add </span>Measurement
          </button>
          <button
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            className="px-4 sm:px-6 py-3 sm:py-3.5 min-h-[48px] bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-cyan-500/50 flex items-center gap-2 text-sm sm:text-base touch-manipulation"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Upload </span>Photo
          </button>
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-4 sm:px-6 py-3 sm:py-3.5 min-h-[48px] rounded-lg font-medium transition-all flex items-center gap-2 text-sm sm:text-base touch-manipulation ${
              comparisonMode
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-500/50'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            {comparisonMode ? 'Exit' : 'Compare'}<span className="hidden sm:inline"> Photos</span>
          </button>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-500/20 rounded-lg">
                <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Weight</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stats.current.weight}</div>
              <div className="text-gray-400 mb-1 text-sm sm:text-base">lbs</div>
            </div>
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${
              stats.changes.weight < 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.changes.weight < 0 ? (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {Math.abs(stats.changes.weight).toFixed(1)} lbs
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-400">
              Goal: {stats.goal.weight} lbs ({(stats.current.weight - stats.goal.weight).toFixed(1)} to go)
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 rounded-lg border border-cyan-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-cyan-500/20 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Body Fat</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stats.current.bodyFat.toFixed(1)}</div>
              <div className="text-gray-400 mb-1 text-sm sm:text-base">%</div>
            </div>
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${
              stats.changes.bodyFat < 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.changes.bodyFat < 0 ? (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {Math.abs(stats.changes.bodyFat).toFixed(1)}%
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-400">
              Goal: {stats.goal.bodyFat}% ({(stats.current.bodyFat - stats.goal.bodyFat).toFixed(1)}% to go)
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-lg border border-green-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg">
                <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Waist</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stats.current.waist.toFixed(1)}</div>
              <div className="text-gray-400 mb-1 text-sm sm:text-base">in</div>
            </div>
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${
              stats.changes.waist < 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.changes.waist < 0 ? (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {Math.abs(stats.changes.waist).toFixed(1)} in
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-400">
              Goal: {stats.goal.waist} in ({(stats.current.waist - stats.goal.waist).toFixed(1)} in to go)
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-lg border border-yellow-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-yellow-500/20 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Muscle Mass</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stats.current.muscleMass.toFixed(1)}</div>
              <div className="text-gray-400 mb-1 text-sm sm:text-base">lbs</div>
            </div>
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${
              stats.changes.muscleMass > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.changes.muscleMass > 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {Math.abs(stats.changes.muscleMass).toFixed(1)} lbs
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-400">
              Gaining muscle while cutting fat!
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 rounded-lg border border-orange-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-orange-500/20 rounded-lg">
                <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Chest</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stats.current.chest.toFixed(1)}</div>
              <div className="text-gray-400 mb-1 text-sm sm:text-base">in</div>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-green-400">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              Building chest size
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/20 rounded-lg border border-pink-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-pink-500/20 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">BMI</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stats.current.bmi.toFixed(1)}</div>
            </div>
            <div className="text-xs sm:text-sm text-green-400">
              Healthy Range (18.5 - 24.9)
            </div>
          </div>
        </div>

        {/* Measurement Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Measurement Trends</h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MeasurementType)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 touch-manipulation"
            >
              <option value="weight">Weight</option>
              <option value="bodyFat">Body Fat %</option>
              <option value="muscleMass">Muscle Mass</option>
              <option value="bmi">BMI</option>
              <option value="waist">Waist</option>
              <option value="chest">Chest</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: getMetricLabel(selectedMetric), angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                name={getMetricLabel(selectedMetric)}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Photos */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
              Progress Photos
            </h2>
            {comparisonMode && selectedPhotos.length > 0 && (
              <div className="text-xs sm:text-sm text-gray-400">
                {selectedPhotos.length}/4 photos selected
              </div>
            )}
          </div>

          {/* Comparison View */}
          {comparisonMode && selectedPhotos.length > 0 && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Photo Comparison</h3>
              <div className={`grid gap-3 sm:gap-4 ${
                selectedPhotos.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                selectedPhotos.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
              }`}>
                {selectedPhotos.map(photoId => {
                  const photo = mockPhotos.find(p => p.id === photoId);
                  if (!photo) return null;
                  return (
                    <div key={photoId} className="space-y-2">
                      <img
                        src={photo.imageUrl}
                        alt={`Progress ${photo.type}`}
                        className="w-full h-auto rounded-lg"
                      />
                      <div className="text-center">
                        <div className="text-white font-medium capitalize text-sm sm:text-base">{photo.type}</div>
                        <div className="text-xs sm:text-sm text-gray-400">
                          {photo.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          <div className="space-y-4 sm:space-y-6">
            {photosByDate.map(({ date, photos }) => (
              <div key={date} className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {photos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => comparisonMode && togglePhotoSelection(photo.id)}
                      className={`relative group cursor-pointer touch-manipulation ${
                        comparisonMode && selectedPhotos.includes(photo.id)
                          ? 'ring-4 ring-purple-500 rounded-lg'
                          : ''
                      }`}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={`Progress ${photo.type}`}
                        className="w-full h-auto rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white font-medium capitalize text-sm sm:text-base">
                          {photo.type} View
                        </div>
                      </div>
                      {comparisonMode && selectedPhotos.includes(photo.id) && (
                        <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Measurements Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-5 md:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Detailed Measurements</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full text-xs sm:text-sm text-gray-300">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">Date</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">Weight</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">Body Fat</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">Waist</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">Chest</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">Bicep (L/R)</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {mockMeasurements.slice().reverse().map(m => (
                      <tr key={m.id} className="hover:bg-gray-700/50">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          {m.date.toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">{m.weight} lbs</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">{m.bodyFat?.toFixed(1)}%</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">{m.measurements.waist?.toFixed(1)} in</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">{m.measurements.chest?.toFixed(1)} in</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">
                          {m.measurements.bicepLeft?.toFixed(1)} / {m.measurements.bicepRight?.toFixed(1)} in
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-400">{m.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
