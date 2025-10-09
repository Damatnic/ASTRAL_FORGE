'use client';

import { useState } from 'react';
import { X, Moon, Apple, Droplet, Activity, AlertTriangle, Plus } from 'lucide-react';

type ActivityType = 'sleep' | 'meal' | 'water' | 'injury' | 'workout';

interface HealthActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityType?: ActivityType;
}

export function HealthActivityModal({
  isOpen,
  onClose,
  activityType = 'sleep',
}: HealthActivityModalProps) {
  const [selectedType, setSelectedType] = useState<ActivityType>(activityType);
  
  // Sleep form state
  const [sleepHours, setSleepHours] = useState('7.5');
  const [sleepQuality, setSleepQuality] = useState('8');
  const [bedTime, setBedTime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:30');
  
  // Meal form state
  const [mealName, setMealName] = useState('');
  const [mealTime, setMealTime] = useState('12:00');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealQuality, setMealQuality] = useState('7');
  
  // Water form state
  const [waterAmount, setWaterAmount] = useState('500');
  const [waterTime, setWaterTime] = useState(new Date().toTimeString().slice(0, 5));
  
  // Injury form state
  const [injuryName, setInjuryName] = useState('');
  const [injuryArea, setInjuryArea] = useState('');
  const [injurySeverity, setInjurySeverity] = useState('mild');
  const [injuryNotes, setInjuryNotes] = useState('');
  
  // Workout form state
  const [workoutType, setWorkoutType] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutIntensity, setWorkoutIntensity] = useState('moderate');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would make API calls to save the data
    console.log('Logging activity:', selectedType);
    
    // Mock success - in real app, this would be after successful API call
    alert(`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} logged successfully!`);
    onClose();
  };

  const activityTypes = [
    { id: 'sleep' as const, label: 'Sleep', icon: Moon, color: 'blue' },
    { id: 'meal' as const, label: 'Meal', icon: Apple, color: 'green' },
    { id: 'water' as const, label: 'Water', icon: Droplet, color: 'cyan' },
    { id: 'injury' as const, label: 'Injury', icon: AlertTriangle, color: 'red' },
    { id: 'workout' as const, label: 'Activity', icon: Activity, color: 'amber' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border-2 border-amber-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b-2 border-amber-700/50 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-wider text-amber-400 flex items-center gap-3">
            <Plus className="w-7 h-7" />
            Log Health Activity
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 border-2 border-neutral-700 hover:border-amber-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-neutral-400 hover:text-amber-400" />
          </button>
        </div>

        {/* Activity Type Selector */}
        <div className="p-6 border-b-2 border-neutral-800">
          <label className="block text-sm font-black uppercase tracking-wider text-amber-400 mb-3">
            Activity Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {activityTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 border-2 transition-all ${
                    selectedType === type.id
                      ? 'bg-amber-950/50 border-amber-600 text-amber-400'
                      : 'bg-neutral-800/30 border-neutral-700 text-neutral-400 hover:border-amber-700/50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Sleep Form */}
          {selectedType === 'sleep' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Bed Time
                  </label>
                  <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Wake Time
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Total Hours: {sleepHours} hrs
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Sleep Quality: {sleepQuality}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1 font-medium">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          )}

          {/* Meal Form */}
          {selectedType === 'meal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Meal Name
                  </label>
                  <select
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Pre-Workout">Pre-Workout</option>
                    <option value="Post-Workout">Post-Workout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g., 650"
                  className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="e.g., 40"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="e.g., 60"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Meal Quality: {mealQuality}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mealQuality}
                  onChange={(e) => setMealQuality(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Water Form */}
          {selectedType === 'water' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Amount (ml)
                </label>
                <select
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(e.target.value)}
                  className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                  required
                >
                  <option value="250">250ml (1 cup)</option>
                  <option value="500">500ml (2 cups)</option>
                  <option value="750">750ml (3 cups)</option>
                  <option value="1000">1000ml (1 liter)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={waterTime}
                  onChange={(e) => setWaterTime(e.target.value)}
                  className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Injury Form */}
          {selectedType === 'injury' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Injury Name
                </label>
                <input
                  type="text"
                  value={injuryName}
                  onChange={(e) => setInjuryName(e.target.value)}
                  placeholder="e.g., Lower Back Strain"
                  className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Affected Area
                  </label>
                  <select
                    value={injuryArea}
                    onChange={(e) => setInjuryArea(e.target.value)}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Lower Back">Lower Back</option>
                    <option value="Upper Back">Upper Back</option>
                    <option value="Shoulder">Shoulder</option>
                    <option value="Elbow">Elbow</option>
                    <option value="Wrist">Wrist</option>
                    <option value="Hip">Hip</option>
                    <option value="Knee">Knee</option>
                    <option value="Ankle">Ankle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Severity
                  </label>
                  <select
                    value={injurySeverity}
                    onChange={(e) => setInjurySeverity(e.target.value)}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={injuryNotes}
                  onChange={(e) => setInjuryNotes(e.target.value)}
                  placeholder="Describe the injury, how it happened, and any immediate actions taken..."
                  rows={4}
                  className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Workout/Activity Form */}
          {selectedType === 'workout' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Activity Type
                </label>
                <select
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Stretching">Stretching</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Walking">Walking</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Recovery">Recovery Work</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    placeholder="e.g., 30"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Intensity
                  </label>
                  <select
                    value={workoutIntensity}
                    onChange={(e) => setWorkoutIntensity(e.target.value)}
                    className="w-full bg-neutral-800 border-2 border-neutral-700 focus:border-amber-600 px-4 py-2.5 text-neutral-100 font-medium outline-none transition-colors"
                    required
                  >
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="intense">Intense</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t-2 border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700 hover:border-neutral-600 font-bold uppercase tracking-wider text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black border-2 border-amber-600 font-black uppercase tracking-wider transition-colors"
            >
              Log {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
