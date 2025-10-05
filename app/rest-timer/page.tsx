'use client';

import RestTimer from '@/components/rest-timer';

export default function RestTimerPage() {
  const handleComplete = () => {
    console.log('Rest timer completed!');
  };

  const handleSkip = () => {
    console.log('Rest timer skipped');
  };

  return (
    <RestTimer
      onComplete={handleComplete}
      onSkip={handleSkip}
      autoStart={false}
      exerciseType="hypertrophy"
      showNotifications={true}
      embedded={false}
    />
  );
}
