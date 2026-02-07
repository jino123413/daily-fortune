import React from 'react';
import { generateHapticFeedback } from '@apps-in-toss/web-framework';
import { FortuneType, StreakData } from '../types';

interface HomeScreenProps {
  streak: StreakData;
  onSelectFortune: (type: FortuneType) => void;
}

const FORTUNE_TYPES: {
  type: FortuneType;
  emoji: string;
  title: string;
  desc: string;
  className: string;
}[] = [
  { type: 'daily', emoji: '✨', title: '오늘의 운세', desc: '매일 새로운 운세', className: 'daily' },
  { type: 'zodiac', emoji: '⭐', title: '별자리 운세', desc: '12궁 별자리별', className: 'zodiac' },
  { type: 'tarot', emoji: '🃏', title: '타로 한 장', desc: '메이저 아르카나', className: 'tarot' },
  { type: 'love', emoji: '💕', title: '연애운', desc: '오늘의 사랑 운세', className: 'love' },
];

const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  duration: `${2 + Math.random() * 4}s`,
  delay: `${Math.random() * 3}s`,
  maxOpacity: Math.random() * 0.5 + 0.3,
  large: Math.random() > 0.7,
}));

const HomeScreen: React.FC<HomeScreenProps> = ({ streak, onSelectFortune }) => {
  return (
    <>
      <div className="stars-bg">
        {STARS.map((star) => (
          <div
            key={star.id}
            className={`star${star.large ? ' large' : ''}`}
            style={{
              left: star.left,
              top: star.top,
              '--duration': star.duration,
              '--delay': star.delay,
              '--max-opacity': star.maxOpacity,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="home-screen">
        <div className="home-header">
          <div className="home-header-icon">🔮</div>
          <h1 className="home-title">오늘의 운세</h1>
          <p className="home-subtitle">매일 새로운 운세를 확인해보세요</p>
          {streak.currentStreak > 0 && (
            <div className="streak-badge">
              <i className="ri-fire-fill"></i>
              {streak.currentStreak}일 연속 방문
            </div>
          )}
        </div>

        <div className="fortune-grid">
          {FORTUNE_TYPES.map(({ type, emoji, title, desc, className }) => (
            <div
              key={type}
              className={`fortune-card ${className}`}
              onClick={() => {
                generateHapticFeedback({ type: 'softMedium' });
                onSelectFortune(type);
              }}
            >
              <div className="fortune-card-emoji">{emoji}</div>
              <div className="fortune-card-title">{title}</div>
              <div className="fortune-card-desc">{desc}</div>
            </div>
          ))}
        </div>

        <div className="home-footer">
          운세는 재미로만 봐주세요 :)
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
