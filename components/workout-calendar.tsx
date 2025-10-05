'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Flame } from 'lucide-react';

// Types
type CalendarView = 'month' | 'week';

interface WorkoutDay {
  date: Date;
  workouts: WorkoutSummary[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface WorkoutSummary {
  id: string;
  name: string;
  duration: number; // minutes
  xpEarned: number;
  totalVolume: number; // lbs or kg
  exerciseCount: number;
  setCount: number;
}

interface WorkoutCalendarProps {
  workouts: WorkoutSummary[];
  onDateClick?: (date: Date) => void;
  onWorkoutClick?: (workoutId: string) => void;
}

export default function WorkoutCalendar({
  workouts = [],
  onDateClick,
  onWorkoutClick,
}: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  // Helper functions
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date): WorkoutDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: WorkoutDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add previous month's days to fill the grid
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: dayDate,
        workouts: getWorkoutsForDate(dayDate),
        isToday: false,
        isCurrentMonth: false,
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const isToday = dayDate.getTime() === today.getTime();
      days.push({
        date: dayDate,
        workouts: getWorkoutsForDate(dayDate),
        isToday,
        isCurrentMonth: true,
      });
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      const dayDate = new Date(year, month + 1, day);
      days.push({
        date: dayDate,
        workouts: getWorkoutsForDate(dayDate),
        isToday: false,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getWeekDays = (date: Date): WorkoutDay[] => {
    const days: WorkoutDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the start of the week (Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const isToday = dayDate.getTime() === today.getTime();
      days.push({
        date: dayDate,
        workouts: getWorkoutsForDate(dayDate),
        isToday,
        isCurrentMonth: true,
      });
    }

    return days;
  };

  const getWorkoutsForDate = (date: Date): WorkoutSummary[] => {
    // Mock data - in real app, filter workouts by date
    const dateStr = date.toISOString().split('T')[0];
    // For demo, add workouts to random dates
    if (Math.random() > 0.7) {
      return [
        {
          id: `workout-${dateStr}`,
          name: 'Push Day',
          duration: 65,
          xpEarned: 350,
          totalVolume: 12500,
          exerciseCount: 5,
          setCount: 18,
        },
      ];
    }
    return [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: WorkoutDay) => {
    if (onDateClick) {
      onDateClick(day.date);
    }
  };

  const handleWorkoutClick = (e: React.MouseEvent, workoutId: string) => {
    e.stopPropagation();
    if (onWorkoutClick) {
      onWorkoutClick(workoutId);
    }
  };

  const days = view === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate stats for current view period
  const totalWorkouts = days.reduce((sum, day) => sum + day.workouts.length, 0);
  const totalXP = days.reduce(
    (sum, day) => sum + day.workouts.reduce((s, w) => s + w.xpEarned, 0),
    0
  );
  const totalVolume = days.reduce(
    (sum, day) => sum + day.workouts.reduce((s, w) => s + w.totalVolume, 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-500/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (view === 'month' ? navigateMonth('prev') : navigateWeek('prev'))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold min-w-[200px] text-center">
            {view === 'month' ? getMonthName(currentDate) : `Week of ${currentDate.toLocaleDateString()}`}
          </h2>

          <button
            onClick={() => (view === 'month' ? navigateMonth('next') : navigateWeek('next'))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-md transition-colors touch-manipulation min-h-[44px] ${
                view === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md transition-colors touch-manipulation min-h-[44px] ${
                view === 'week'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Week
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors touch-manipulation min-h-[44px] flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Today
          </button>
        </div>
      </div>

      {/* Period Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Workouts</span>
          </div>
          <div className="text-2xl font-bold">{totalWorkouts}</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Total XP</span>
          </div>
          <div className="text-2xl font-bold">{totalXP.toLocaleString()}</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">Total Volume</span>
          </div>
          <div className="text-2xl font-bold">{(totalVolume / 1000).toFixed(1)}K lbs</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-px bg-gray-700">
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-gray-800 p-2 text-center text-sm font-semibold text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-700">
          {days.map((day, index) => {
            const hasWorkouts = day.workouts.length > 0;
            const workoutCount = day.workouts.length;

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  min-h-[100px] p-2 bg-gray-800/50 cursor-pointer transition-all
                  hover:bg-gray-700/50 relative
                  ${!day.isCurrentMonth ? 'opacity-40' : ''}
                  ${day.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
                  ${hasWorkouts ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' : ''}
                `}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`
                    text-sm font-semibold
                    ${day.isToday ? 'bg-blue-600 px-2 py-0.5 rounded-full' : ''}
                    ${!day.isCurrentMonth ? 'text-gray-600' : 'text-gray-300'}
                  `}
                  >
                    {day.date.getDate()}
                  </span>

                  {workoutCount > 0 && (
                    <span className="text-xs bg-purple-600 px-1.5 py-0.5 rounded-full font-medium">
                      {workoutCount}
                    </span>
                  )}
                </div>

                {/* Workout Indicators */}
                {hasWorkouts && (
                  <div className="space-y-1">
                    {day.workouts.map((workout) => (
                      <button
                        key={workout.id}
                        onClick={(e) => handleWorkoutClick(e, workout.id)}
                        className="w-full text-left px-2 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded text-xs transition-colors border border-purple-500/20"
                      >
                        <div className="font-medium truncate">{workout.name}</div>
                        <div className="text-gray-400 flex items-center gap-2">
                          <span>{workout.duration}m</span>
                          <span>•</span>
                          <span>{workout.xpEarned} XP</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Workout Streak Indicator */}
                {hasWorkouts && (
                  <div className="absolute bottom-1 right-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-blue-500"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
          <span>Has Workout</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Streak Day</span>
        </div>
      </div>
    </div>
  );
}
