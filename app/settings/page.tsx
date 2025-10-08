'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Dumbbell,
  Shield,
  Download,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle2,
  Moon,
  Zap,
  Target,
  Sliders,
} from 'lucide-react';

type SettingsTab = 'profile' | 'preferences' | 'training' | 'account';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@astralforge.app');
  const [units, setUnits] = useState('kg');
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [level, setLevel] = useState('intermediate');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Additional preference states
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [restDayReminder, setRestDayReminder] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          const prefs = typeof data.profile.preferences === 'string'
            ? JSON.parse(data.profile.preferences)
            : data.profile.preferences || {};
          
          setUnits(prefs.units || 'kg');
          setNotifications(prefs.notifications !== false);
          setTheme(prefs.theme || 'dark');
          setLevel(data.profile.level || 'intermediate');
          
          // Load additional preferences
          setWorkoutReminders(prefs.workoutReminders !== false);
          setAchievementNotifications(prefs.achievementNotifications !== false);
          setWeeklyReport(prefs.weeklyReport !== false);
          setRestDayReminder(prefs.restDayReminder || false);
          setSoundEffects(prefs.soundEffects !== false);
          setAutoSave(prefs.autoSave !== false);
        }
        setName(data.name || 'Demo User');
        setEmail(data.email || 'demo@astralforge.app');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          level,
          preferences: {
            units,
            notifications,
            theme,
            workoutReminders,
            achievementNotifications,
            weeklyReport,
            restDayReminder,
            soundEffects,
            autoSave,
          },
        }),
      });

      if (response.ok) {
        showToast('Settings saved successfully!', 'success');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'preferences' as const, label: 'Preferences', icon: Sliders },
    { id: 'training' as const, label: 'Training', icon: Dumbbell },
    { id: 'account' as const, label: 'Account', icon: Shield },
  ];

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center transition-colors ${
        checked ? 'bg-gradient-to-r from-amber-700 to-amber-600 border-2 border-amber-500' : 'bg-neutral-800 border-2 border-neutral-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Settings"
          description="Manage your account, preferences, and battle configurations"
          icon={<SettingsIcon className="w-8 h-8 text-amber-400" />}
          action={
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-amber-950/50 border-2 border-amber-700 hover:bg-amber-900/50 font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 text-amber-400"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          }
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-2 font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-amber-400">
                  <User className="w-6 h-6 text-amber-400" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950 border-2 border-neutral-800 focus:outline-none focus:border-amber-700 text-white"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 bg-neutral-950/50 border-2 border-neutral-800 text-neutral-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-amber-400">Account Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-950 border-2 border-neutral-800">
                    <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Member Since</div>
                    <div className="text-lg font-bold text-amber-400">Aug 2024</div>
                  </div>
                  <div className="p-4 bg-neutral-950 border-2 border-neutral-800">
                    <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Total Battles</div>
                    <div className="text-lg font-bold text-amber-400">156</div>
                  </div>
                  <div className="p-4 bg-neutral-950 border-2 border-neutral-800">
                    <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Current Streak</div>
                    <div className="text-lg font-bold text-amber-400">12 days</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Units & Display */}
              <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-amber-400">
                  <Globe className="w-6 h-6 text-amber-400" />
                  Units & Display
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Weight Units
                    </label>
                    <select
                      value={units}
                      onChange={(e) => setUnits(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950 border-2 border-neutral-800 focus:outline-none focus:border-amber-700 text-white"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="lbs">Pounds (lbs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    >
                      <option value="dark">Dark Theme</option>
                      <option value="light" disabled>Light Theme (Coming Soon)</option>
                    </select>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Moon className="w-3 h-3" />
                      Dark theme optimized for low-light training environments
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-amber-400" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-2 border-neutral-700">
                    <div>
                      <div className="font-black uppercase tracking-wider">All Notifications</div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Master toggle for all notifications</div>
                    </div>
                    <ToggleSwitch checked={notifications} onChange={() => setNotifications(!notifications)} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-2 border-neutral-700">
                    <div>
                      <div className="font-black uppercase tracking-wider">Workout Reminders</div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Get reminded about scheduled workouts</div>
                    </div>
                    <ToggleSwitch 
                      checked={workoutReminders} 
                      onChange={() => setWorkoutReminders(!workoutReminders)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-2 border-neutral-700">
                    <div>
                      <div className="font-black uppercase tracking-wider">Achievement Unlocked</div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Celebrate when you unlock achievements</div>
                    </div>
                    <ToggleSwitch 
                      checked={achievementNotifications} 
                      onChange={() => setAchievementNotifications(!achievementNotifications)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-2 border-neutral-700">
                    <div>
                      <div className="font-black uppercase tracking-wider">Weekly Progress Report</div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Receive weekly training summaries</div>
                    </div>
                    <ToggleSwitch checked={weeklyReport} onChange={() => setWeeklyReport(!weeklyReport)} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-2 border-neutral-700">
                    <div>
                      <div className="font-black uppercase tracking-wider">Rest Day Reminder</div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Remind you to take rest days</div>
                    </div>
                    <ToggleSwitch 
                      checked={restDayReminder} 
                      onChange={() => setRestDayReminder(!restDayReminder)} 
                    />
                  </div>
                </div>
              </div>

              {/* App Behavior */}
              <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-amber-400" />
                  App Behavior
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-2 border-neutral-700">
                    <div>
                      <div className="font-black uppercase tracking-wider">Sound Effects</div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Play sounds for achievements and actions</div>
                    </div>
                    <ToggleSwitch checked={soundEffects} onChange={() => setSoundEffects(!soundEffects)} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-2 border-neutral-700">
                    <div>
                      <div className="font-black uppercase tracking-wider">Auto-Save Workouts</div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Automatically save workout progress</div>
                    </div>
                    <ToggleSwitch checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="space-y-6">
              {/* Training Level */}
                            {/* Training Level */}
              <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-amber-400" />
                  Training Level
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setLevel('beginner')}
                    className={`w-full p-4 border-2 text-left transition-all ${
                      level === 'beginner'
                        ? 'bg-amber-900/20 border-amber-500/50'
                        : 'bg-neutral-800/50 border-neutral-700 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 
                        className={`w-5 h-5 mt-0.5 ${
                          level === 'beginner' ? 'text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-black uppercase tracking-wider mb-2">Beginner</div>
                        <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
                          New to strength training or returning after a break
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setLevel('intermediate')}
                    className={`w-full p-4 border-2 text-left transition-all ${
                      level === 'intermediate'
                        ? 'bg-amber-900/20 border-amber-500/50'
                        : 'bg-neutral-800/50 border-neutral-700 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 
                        className={`w-5 h-5 mt-0.5 ${
                          level === 'intermediate' ? 'text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-black uppercase tracking-wider mb-2">Intermediate</div>
                        <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
                          6+ months of consistent training experience
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setLevel('advanced')}
                    className={`w-full p-4 border-2 text-left transition-all ${
                      level === 'advanced'
                        ? 'bg-amber-900/20 border-amber-500/50'
                        : 'bg-neutral-800/50 border-neutral-700 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 
                        className={`w-5 h-5 mt-0.5 ${
                          level === 'advanced' ? 'text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-black uppercase tracking-wider mb-2">Advanced</div>
                        <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
                          2+ years of structured training, focusing on specific goals
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Training Preferences */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Training Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Preferred Training Days</div>
                    <div className="text-lg font-bold">4-5 days/week</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Session Duration</div>
                    <div className="text-lg font-bold">60-90 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Data Management */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Download className="w-6 h-6 text-cyan-400" />
                  Data Management
                </h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-left">
                    <div>
                      <div className="font-medium">Export All Data</div>
                      <div className="text-sm text-gray-400">Download all your workout data as JSON</div>
                    </div>
                    <Download className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-left">
                    <div>
                      <div className="font-medium">Export Workout History</div>
                      <div className="text-sm text-gray-400">Download workout sessions as CSV</div>
                    </div>
                    <Download className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-left">
                    <div>
                      <div className="font-medium">Export Progress Photos</div>
                      <div className="text-sm text-gray-400">Download all progress photos as ZIP</div>
                    </div>
                    <Download className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                  Danger Zone
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  These actions are permanent and cannot be undone. Please proceed with caution.
                </p>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-lg transition-colors text-left">
                    <div>
                      <div className="font-medium text-red-400">Clear Workout History</div>
                      <div className="text-sm text-gray-400">Delete all completed workout sessions</div>
                    </div>
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-lg transition-colors text-left">
                    <div>
                      <div className="font-medium text-red-400">Reset All Progress</div>
                      <div className="text-sm text-gray-400">Clear all stats, achievements, and data</div>
                    </div>
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-lg transition-colors text-left">
                    <div>
                      <div className="font-medium text-red-400">Delete Account</div>
                      <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
                    </div>
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>

              {/* App Information */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">App Information</h2>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Version</span>
                    <span className="font-medium text-white">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Build</span>
                    <span className="font-medium text-white">2024.10.06</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium text-white">October 6, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </AppLayout>
  );
}
