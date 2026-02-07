import React from 'react';
import { FortuneType, FortuneResult } from '../types';

interface ResultScreenProps {
  result: FortuneResult;
  premiumUnlocked: boolean;
  onOtherFortune: () => void;
  onUnlockPremium: () => void;
  adLoading: boolean;
}

const TYPE_LABELS: Record<FortuneType, string> = {
  daily: '오늘의 운세',
  zodiac: '별자리 운세',
  tarot: '타로 한 장',
  love: '연애운',
};

const PREMIUM_LABELS: Record<FortuneType, { locked: string; desc: string; title: string }> = {
  daily: {
    locked: '이번 주 상세 운세',
    desc: '이번 주 전체 운세를 확인해보세요',
    title: '이번 주 운세',
  },
  zodiac: {
    locked: '궁합 보기',
    desc: '나와 잘 맞는 별자리를 확인해보세요',
    title: '별자리 궁합',
  },
  tarot: {
    locked: '심화 해석',
    desc: '카드의 숨겨진 의미를 확인해보세요',
    title: '심화 타로 해석',
  },
  love: {
    locked: '궁합 별자리',
    desc: '오늘 나와 잘 맞는 별자리를 확인해보세요',
    title: '연애 궁합',
  },
};

const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  premiumUnlocked,
  onOtherFortune,
  onUnlockPremium,
  adLoading,
}) => {
  const premiumLabel = PREMIUM_LABELS[result.type];
  const hasPremiumContent = result.premiumContent && (result.premiumContent.weeklyFortune || result.premiumContent.compatibility);

  return (
    <div className="result-screen">
      <div className="result-card">
        <span className={`result-type-badge ${result.type}`}>
          {TYPE_LABELS[result.type]}
        </span>

        <div className={`result-grade ${result.grade}`}>
          {result.grade}
        </div>

        <h1 className="result-title">{result.title}</h1>
        <p className="result-description">{result.description}</p>

        {/* Score Bars */}
        <div className="scores-section">
          <h3 className="scores-title">
            <i className="ri-bar-chart-2-line"></i>
            운세 지수
          </h3>
          {result.scores.map((score, index) => (
            <div key={index} className="score-row">
              <span className="score-label">{score.label}</span>
              <div className="score-bar-bg">
                <div
                  className="score-bar-fill"
                  style={{ width: `${score.value}%`, animationDelay: `${index * 0.15}s` }}
                />
              </div>
              <span className="score-value">{score.value}</span>
            </div>
          ))}
        </div>

        {/* Lucky Items */}
        <div className="lucky-section">
          <h3 className="lucky-title">
            <i className="ri-sparkle-line"></i>
            행운 아이템
          </h3>
          <div className="lucky-grid">
            <div className="lucky-item">
              <div className="lucky-item-icon">🎨</div>
              <div className="lucky-item-label">행운의 색</div>
              <div className="lucky-item-value">{result.luckyItems.color}</div>
            </div>
            <div className="lucky-item">
              <div className="lucky-item-icon">🔢</div>
              <div className="lucky-item-label">행운의 숫자</div>
              <div className="lucky-item-value">{result.luckyItems.number}</div>
            </div>
            <div className="lucky-item">
              <div className="lucky-item-icon">🧭</div>
              <div className="lucky-item-label">행운의 방향</div>
              <div className="lucky-item-value">{result.luckyItems.direction}</div>
            </div>
            <div className="lucky-item">
              <div className="lucky-item-icon">⏰</div>
              <div className="lucky-item-label">행운의 시간</div>
              <div className="lucky-item-value">{result.luckyItems.time}</div>
            </div>
          </div>
        </div>

        {/* Advice */}
        <div className="advice-section">
          <div className="advice-card">
            <span className="advice-icon">💡</span>
            <p className="advice-text">{result.advice}</p>
          </div>
        </div>
      </div>

      {/* Premium Section */}
      {hasPremiumContent && (
        <div className="premium-section">
          <div className={`premium-card${premiumUnlocked ? ' unlocked' : ''}`}>
            {premiumUnlocked ? (
              <div className="premium-unlocked-content">
                <h3 className="premium-content-title">
                  <i className="ri-vip-crown-line"></i>
                  {premiumLabel.title}
                </h3>
                <p className="premium-content-text">
                  {result.premiumContent?.weeklyFortune || result.premiumContent?.compatibility}
                </p>
              </div>
            ) : (
              <>
                <div className="premium-locked-icon">
                  <i className="ri-lock-line"></i>
                </div>
                <p className="premium-locked-title">{premiumLabel.locked}</p>
                <p className="premium-locked-desc">{premiumLabel.desc}</p>
                <button
                  className="btn-premium"
                  onClick={onUnlockPremium}
                  disabled={adLoading}
                >
                  <span className="ad-badge">AD</span>
                  {adLoading ? '로딩 중...' : `${premiumLabel.locked} 보기`}
                </button>
                <p className="ad-notice" style={{ marginTop: 8 }}>광고 시청 후 확인할 수 있습니다</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-group">
        <button
          className="btn-primary"
          onClick={onOtherFortune}
          disabled={adLoading}
        >
          <span className="ad-badge">AD</span>
          {adLoading ? '로딩 중...' : '다른 운세 보기'}
        </button>
        <p className="ad-notice">광고 시청 후 다른 운세를 확인합니다</p>
      </div>
    </div>
  );
};

export default ResultScreen;
