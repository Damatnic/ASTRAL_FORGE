'use client';

import React, { useState } from 'react';
import TitleBadgeSystem from '@/components/title-badge-system';

export default function TitlesPage() {
  // Sample titles with emoji icons
  const [titles, setTitles] = useState([
    // STRENGTH TITLES
    { id: 'iron-warrior', name: 'Iron Warrior', description: 'Master of the barbell, crusher of heavy weights', category: 'strength' as const, rarity: 'common' as const, unlockCondition: 'Complete 100 strength workouts', unlocked: true, equipped: false, unlockedAt: new Date('2024-09-15'), icon: '💪', color: 'text-gray-400' },
    { id: 'deadlift-demon', name: 'Deadlift Demon', description: 'Pull from the earth with demonic strength', category: 'strength' as const, rarity: 'rare' as const, unlockCondition: 'Deadlift 2x your bodyweight', unlocked: true, equipped: false, unlockedAt: new Date('2024-10-01'), icon: '⚡', color: 'text-blue-400' },
    { id: 'titan-of-strength', name: 'Titan of Strength', description: 'Legendary strength that moves mountains', category: 'strength' as const, rarity: 'epic' as const, unlockCondition: 'Join the 1000lb club (squat + bench + deadlift)', unlocked: false, equipped: false, icon: '👑', color: 'text-purple-400' },
    { id: 'strength-god', name: 'Strength God', description: 'Ascended beyond mortal limits', category: 'strength' as const, rarity: 'legendary' as const, unlockCondition: 'Join the 1500lb club at Prestige 5+', unlocked: false, equipped: false, icon: '🏆', color: 'text-amber-400', animated: true },
    
    // ENDURANCE TITLES
    { id: 'cardio-crusher', name: 'Cardio Crusher', description: 'Heart of a champion, lungs of steel', category: 'endurance' as const, rarity: 'common' as const, unlockCondition: 'Complete 50 cardio workouts', unlocked: true, equipped: false, unlockedAt: new Date('2024-08-20'), icon: '🏃', color: 'text-gray-400' },
    { id: 'murph-legend', name: 'Murph Legend', description: 'Conquered the hero WOD with honor', category: 'endurance' as const, rarity: 'rare' as const, unlockCondition: 'Complete Murph in under 60 minutes', unlocked: true, equipped: true, unlockedAt: new Date('2024-09-28'), icon: '⭐', color: 'text-blue-400' },
    { id: 'endurance-beast', name: 'Endurance Beast', description: 'Unstoppable engine of destruction', category: 'endurance' as const, rarity: 'epic' as const, unlockCondition: 'Complete 10 workouts over 60 minutes', unlocked: false, equipped: false, icon: '🔥', color: 'text-purple-400' },
    { id: 'marathon-master', name: 'Marathon Master', description: 'The long road is your domain', category: 'endurance' as const, rarity: 'legendary' as const, unlockCondition: 'Complete a marathon or equivalent endurance feat', unlocked: false, equipped: false, icon: '📈', color: 'text-amber-400', animated: true },
    
    // CONSISTENCY TITLES
    { id: 'daily-disciple', name: 'Daily Disciple', description: 'Discipline is your greatest strength', category: 'consistency' as const, rarity: 'common' as const, unlockCondition: 'Maintain a 7-day workout streak', unlocked: true, equipped: false, unlockedAt: new Date('2024-09-10'), icon: '📅', color: 'text-gray-400' },
    { id: 'streak-master', name: 'Streak Master', description: 'Consistency breeds excellence', category: 'consistency' as const, rarity: 'rare' as const, unlockCondition: 'Maintain a 30-day workout streak', unlocked: true, equipped: false, unlockedAt: new Date('2024-10-02'), icon: '🔥', color: 'text-blue-400' },
    { id: 'training-titan', name: 'Training Titan', description: 'Your dedication knows no bounds', category: 'consistency' as const, rarity: 'epic' as const, unlockCondition: 'Maintain a 90-day workout streak', unlocked: false, equipped: false, icon: '🏆', color: 'text-purple-400' },
    { id: 'eternal-warrior', name: 'Eternal Warrior', description: 'The grind never stops, the fire never dies', category: 'consistency' as const, rarity: 'legendary' as const, unlockCondition: 'Maintain a 365-day workout streak', unlocked: false, equipped: false, icon: '👑', color: 'text-amber-400', animated: true },
    
    // COMPETITION TITLES
    { id: 'arena-fighter', name: 'Arena Fighter', description: 'Stepped into the PvP arena', category: 'competition' as const, rarity: 'common' as const, unlockCondition: 'Complete your first PvP challenge', unlocked: true, equipped: false, unlockedAt: new Date('2024-09-25'), icon: '⚔️', color: 'text-gray-400' },
    { id: 'duel-master', name: 'Duel Master', description: 'Victor in many one-on-one battles', category: 'competition' as const, rarity: 'rare' as const, unlockCondition: 'Win 10 PvP duels', unlocked: true, equipped: false, unlockedAt: new Date('2024-10-03'), icon: '🥇', color: 'text-blue-400' },
    { id: 'tournament-champion', name: 'Tournament Champion', description: 'Crowned in competitive glory', category: 'competition' as const, rarity: 'epic' as const, unlockCondition: 'Win a tournament bracket', unlocked: false, equipped: false, icon: '🏆', color: 'text-purple-400' },
    { id: 'grandmaster', name: 'Grandmaster', description: 'Peak of competitive achievement', category: 'competition' as const, rarity: 'legendary' as const, unlockCondition: 'Reach Grandmaster Division in ranked PvP', unlocked: false, equipped: false, icon: '👑', color: 'text-amber-400', animated: true },
    
    // ACHIEVEMENT TITLES
    { id: 'first-blood', name: 'First Blood', description: 'Completed your first workout', category: 'achievement' as const, rarity: 'common' as const, unlockCondition: 'Complete 1 workout', unlocked: true, equipped: false, unlockedAt: new Date('2024-08-01'), icon: '✅', color: 'text-gray-400' },
    { id: 'century-club', name: 'Century Club', description: 'Reached the milestone of 100 workouts', category: 'achievement' as const, rarity: 'rare' as const, unlockCondition: 'Complete 100 workouts', unlocked: true, equipped: false, unlockedAt: new Date('2024-09-20'), icon: '🎯', color: 'text-blue-400' },
    { id: 'level-50', name: 'Ascended', description: 'Reached Level 50 through dedication', category: 'achievement' as const, rarity: 'epic' as const, unlockCondition: 'Reach Level 50', unlocked: false, equipped: false, icon: '⭐', color: 'text-purple-400' },
    { id: 'completionist', name: 'Completionist', description: 'Mastered every aspect of the forge', category: 'achievement' as const, rarity: 'legendary' as const, unlockCondition: 'Unlock all achievements and defeat all bosses', unlocked: false, equipped: false, icon: '💎', color: 'text-amber-400', animated: true },
    
    // PRESTIGE TITLES
    { id: 'reborn', name: 'Reborn', description: 'Started the journey anew', category: 'prestige' as const, rarity: 'rare' as const, unlockCondition: 'Prestige once', unlocked: false, equipped: false, icon: '⚡', color: 'text-blue-400' },
    { id: 'phoenix', name: 'Phoenix', description: 'Risen from the ashes, stronger than before', category: 'prestige' as const, rarity: 'epic' as const, unlockCondition: 'Reach Prestige 3', unlocked: false, equipped: false, icon: '🔥', color: 'text-purple-400' },
    { id: 'legend', name: 'Legend', description: 'Your name will echo through eternity', category: 'prestige' as const, rarity: 'legendary' as const, unlockCondition: 'Reach Prestige 10', unlocked: false, equipped: false, icon: '👑', color: 'text-amber-400', animated: true },
  ]);

  // Sample badges
  const [badges, setBadges] = useState([
    // PERFORMANCE BADGES
    { id: 'squat-bronze', name: 'Bronze Squatter', description: 'Squatted your bodyweight', category: 'performance' as const, rarity: 'common' as const, unlockCondition: 'Squat 1x bodyweight', unlocked: true, unlockedAt: new Date('2024-08-15'), icon: '🏋️', color: 'text-gray-400', setBonus: 'Strength Milestone Set' },
    { id: 'squat-silver', name: 'Silver Squatter', description: 'Squatted 1.5x your bodyweight', category: 'performance' as const, rarity: 'rare' as const, unlockCondition: 'Squat 1.5x bodyweight', unlocked: true, unlockedAt: new Date('2024-09-10'), icon: '🏋️', color: 'text-blue-400', setBonus: 'Strength Milestone Set' },
    { id: 'squat-gold', name: 'Gold Squatter', description: 'Squatted 2x your bodyweight', category: 'performance' as const, rarity: 'epic' as const, unlockCondition: 'Squat 2x bodyweight', unlocked: false, icon: '🏋️', color: 'text-purple-400', progress: 185, maxProgress: 200, setBonus: 'Strength Milestone Set' },
    { id: 'bench-bronze', name: 'Bronze Bencher', description: 'Bench pressed your bodyweight', category: 'performance' as const, rarity: 'common' as const, unlockCondition: 'Bench 1x bodyweight', unlocked: true, unlockedAt: new Date('2024-08-20'), icon: '💪', color: 'text-gray-400', setBonus: 'Strength Milestone Set' },
    { id: 'bench-silver', name: 'Silver Bencher', description: 'Bench pressed 1.25x your bodyweight', category: 'performance' as const, rarity: 'rare' as const, unlockCondition: 'Bench 1.25x bodyweight', unlocked: false, icon: '💪', color: 'text-blue-400', progress: 110, maxProgress: 125, setBonus: 'Strength Milestone Set' },
    { id: 'deadlift-bronze', name: 'Bronze Puller', description: 'Deadlifted 1.5x your bodyweight', category: 'performance' as const, rarity: 'common' as const, unlockCondition: 'Deadlift 1.5x bodyweight', unlocked: true, unlockedAt: new Date('2024-08-25'), icon: '⚡', color: 'text-gray-400', setBonus: 'Strength Milestone Set' },
    
    // MILESTONE BADGES
    { id: 'level-10', name: 'Apprentice', description: 'Reached Level 10', category: 'milestone' as const, rarity: 'common' as const, unlockCondition: 'Reach Level 10', unlocked: true, unlockedAt: new Date('2024-08-10'), icon: '⭐', color: 'text-gray-400' },
    { id: 'level-25', name: 'Adept', description: 'Reached Level 25', category: 'milestone' as const, rarity: 'rare' as const, unlockCondition: 'Reach Level 25', unlocked: true, unlockedAt: new Date('2024-09-15'), icon: '⭐', color: 'text-blue-400' },
    { id: 'level-50', name: 'Expert', description: 'Reached Level 50', category: 'milestone' as const, rarity: 'epic' as const, unlockCondition: 'Reach Level 50', unlocked: false, icon: '⭐', color: 'text-purple-400', progress: 32, maxProgress: 50 },
    { id: 'level-100', name: 'Master', description: 'Reached Level 100', category: 'milestone' as const, rarity: 'legendary' as const, unlockCondition: 'Reach Level 100', unlocked: false, icon: '👑', color: 'text-amber-400', progress: 32, maxProgress: 100 },
    
    // EVENT BADGES
    { id: 'new-year-2024', name: 'New Year Warrior', description: 'Completed workouts during New Year 2024 event', category: 'event' as const, rarity: 'rare' as const, unlockCondition: 'Complete 5 workouts Jan 1-7, 2024', unlocked: false, icon: '🎉', color: 'text-blue-400' },
    { id: 'summer-shred-2024', name: 'Summer Shredder', description: 'Participated in Summer Shred challenge', category: 'event' as const, rarity: 'epic' as const, unlockCondition: 'Complete Summer Shred challenge', unlocked: false, icon: '☀️', color: 'text-purple-400' },
    
    // SEASONAL BADGES
    { id: 'spring-2024', name: 'Spring Warrior', description: 'Trained through Spring 2024', category: 'seasonal' as const, rarity: 'common' as const, unlockCondition: 'Complete 20 workouts in Spring 2024', unlocked: true, unlockedAt: new Date('2024-05-15'), icon: '🌸', color: 'text-gray-400' },
    { id: 'summer-2024', name: 'Summer Soldier', description: 'Trained through Summer 2024', category: 'seasonal' as const, rarity: 'common' as const, unlockCondition: 'Complete 20 workouts in Summer 2024', unlocked: true, unlockedAt: new Date('2024-08-20'), icon: '☀️', color: 'text-gray-400' },
    { id: 'fall-2024', name: 'Autumn Champion', description: 'Trained through Fall 2024', category: 'seasonal' as const, rarity: 'common' as const, unlockCondition: 'Complete 20 workouts in Fall 2024', unlocked: false, icon: '🍂', color: 'text-gray-400', progress: 15, maxProgress: 20 },
    
    // SECRET BADGES
    { id: 'midnight-warrior', name: 'Midnight Warrior', description: 'Trained between midnight and 3am', category: 'secret' as const, rarity: 'rare' as const, unlockCondition: '???', unlocked: false, icon: '🌙', color: 'text-blue-400' },
    { id: 'perfect-week', name: 'Perfect Week', description: 'Completed all planned workouts in a week', category: 'secret' as const, rarity: 'epic' as const, unlockCondition: '???', unlocked: true, unlockedAt: new Date('2024-09-30'), icon: '✅', color: 'text-purple-400' },
    { id: 'triple-threat', name: 'Triple Threat', description: 'Completed 3 workouts in one day', category: 'secret' as const, rarity: 'legendary' as const, unlockCondition: '???', unlocked: false, icon: '💎', color: 'text-amber-400' },
  ]);

  // Badge sets
  const badgeSets = [
    { id: 'strength-milestones', name: 'Strength Milestone Set', description: 'Master the big three: squat, bench, and deadlift', badges: ['squat-bronze', 'squat-silver', 'squat-gold', 'bench-bronze', 'bench-silver', 'deadlift-bronze'], bonus: '+10% XP on all strength workouts', completed: false },
    { id: 'level-progression', name: 'Level Progression Set', description: 'Climb the levels from apprentice to master', badges: ['level-10', 'level-25', 'level-50', 'level-100'], bonus: '+5% XP on all workouts', completed: false },
    { id: 'seasonal-warrior', name: 'Seasonal Warrior Set', description: 'Train consistently through all four seasons', badges: ['spring-2024', 'summer-2024', 'fall-2024'], bonus: '+1 Freeze Token per season completed', completed: false },
    { id: 'secret-collector', name: 'Secret Collector Set', description: 'Discover all hidden achievements', badges: ['midnight-warrior', 'perfect-week', 'triple-threat'], bonus: 'Unlock exclusive "Mystery Master" title', completed: false },
  ];

  const currentUser = {
    id: 'user-1',
    username: 'IronWarrior',
    level: 32,
    totalXP: 125000,
    prestige: 0,
  };

  const handleEquipTitle = (titleId: string) => {
    setTitles(prevTitles =>
      prevTitles.map(title => ({
        ...title,
        equipped: title.id === titleId,
      }))
    );
  };

  return (
    <div className="min-h-screen">
      <TitleBadgeSystem
        currentUser={currentUser}
        titles={titles}
        badges={badges}
        badgeSets={badgeSets}
        onEquipTitle={handleEquipTitle}
      />

      {/* Educational Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="mt-12 space-y-8">
          {/* How It Works */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">📖 How Titles & Badges Work</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">🏆 Titles</h3>
                <p className="text-sm">
                  Titles are prestigious honors that showcase your greatest achievements. Unlock titles by completing
                  specific challenges, reaching milestones, or demonstrating exceptional consistency. You can equip ONE
                  title at a time to display on your profile, in leaderboards, and during PvP challenges.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">🛡️ Badges</h3>
                <p className="text-sm">
                  Badges are collectible achievements that track your progress across all aspects of training. Each badge
                  represents a specific accomplishment, from performance milestones to seasonal participation. Collect
                  them all to prove your dedication!
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">💎 Badge Sets</h3>
                <p className="text-sm">
                  Some badges belong to themed sets. Complete an entire set to earn powerful bonus rewards! Set bonuses
                  provide permanent benefits like increased XP, freeze tokens, or exclusive titles.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">✨ Rarities</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li className="text-gray-400">• <span className="font-semibold">Common</span> - Achievable through regular training</li>
                  <li className="text-blue-400">• <span className="font-semibold">Rare</span> - Requires dedication and consistency</li>
                  <li className="text-purple-400">• <span className="font-semibold">Epic</span> - Demonstrates exceptional achievement</li>
                  <li className="text-amber-400">• <span className="font-semibold">Legendary</span> - Reserved for the elite few (some are animated!)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">🎯 Categories</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-semibold">Titles:</span> Strength, Endurance, Consistency, Competition, Achievement, Prestige</div>
                  <div><span className="font-semibold">Badges:</span> Performance, Milestone, Event, Seasonal, Secret</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">💡 Pro Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-semibold text-white mb-1">Target Specific Sets</div>
                  <p>Focus on completing badge sets for powerful permanent bonuses. The Strength Milestone Set is great for powerlifters!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">👑</span>
                <div>
                  <div className="font-semibold text-white mb-1">Show Off Your Best</div>
                  <p>Equip your most impressive title to intimidate opponents in PvP and climb the leaderboards with style.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="font-semibold text-white mb-1">Consistency is Key</div>
                  <p>Many rare and epic titles require long streaks. Use freeze tokens wisely to protect your progress!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="font-semibold text-white mb-1">Hunt for Secrets</div>
                  <p>Secret badges don't show unlock conditions until discovered. Experiment with unusual training patterns!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold text-white mb-1">Track Your Progress</div>
                  <p>Many badges show progress bars. Check regularly to see how close you are to your next unlock!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-semibold text-white mb-1">Legendary Animations</div>
                  <p>Legendary titles feature special animated effects. They're the ultimate status symbols!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-6 border-2 border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-center">🔥 Your Legacy Awaits</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto">
              Every title tells a story. Every badge marks a victory. Build your collection through dedication,
              consistency, and relentless pursuit of excellence. The legends of tomorrow are forged in the fires
              of today's training. <span className="text-purple-400 font-bold">What will YOUR legacy be?</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
