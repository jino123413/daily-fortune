import React, { useState, useEffect, useCallback } from 'react';
import { generateHapticFeedback } from '@apps-in-toss/web-framework';
import { FortuneType, FortuneResult, ZodiacSign } from '../types';
import { getDailyFortune, getZodiacFortune, getTarotFortune, getLoveFortune, getZodiacSigns } from '../utils/fortune-engine';

interface FortuneScreenProps {
  fortuneType: FortuneType;
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

const TYPE_LABELS: Record<FortuneType, string> = {
  daily: '오늘의 운세',
  zodiac: '별자리 운세',
  tarot: '타로 한 장',
  love: '연애운',
};

const FortuneScreen: React.FC<FortuneScreenProps> = ({ fortuneType, onResult, onBack }) => {
  const [phase, setPhase] = useState<'loading' | 'select' | 'reveal'>('loading');
  const [tarotFlipped, setTarotFlipped] = useState(false);
  const [tarotData, setTarotData] = useState<ReturnType<typeof getTarotFortune> | null>(null);

  useEffect(() => {
    if (fortuneType === 'zodiac') {
      setPhase('select');
    } else if (fortuneType === 'tarot') {
      const data = getTarotFortune();
      setTarotData(data);
      setPhase('reveal');
    } else {
      const timer = setTimeout(() => {
        if (fortuneType === 'daily') {
          onResult(getDailyFortune());
        } else if (fortuneType === 'love') {
          onResult(getLoveFortune());
        }
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [fortuneType, onResult]);

  const handleZodiacSelect = useCallback((sign: ZodiacSign) => {
    generateHapticFeedback({ type: 'softMedium' });
    setPhase('loading');
    setTimeout(() => {
      onResult(getZodiacFortune(sign.id));
    }, 1500);
  }, [onResult]);

  const handleTarotFlip = useCallback(() => {
    if (tarotFlipped || !tarotData) return;
    generateHapticFeedback({ type: 'softMedium' });
    setTarotFlipped(true);
    setTimeout(() => {
      onResult(tarotData.result);
    }, 1500);
  }, [tarotFlipped, tarotData, onResult]);

  const zodiacSigns = getZodiacSigns();

  return (
    <div className="fortune-screen">
      <div className="fortune-header">
        <button className="back-button" onClick={onBack}>
          <i className="ri-arrow-left-s-line"></i>
        </button>
        <span className="fortune-header-title">{TYPE_LABELS[fortuneType]}</span>
      </div>

      <div className="fortune-content">
        {phase === 'loading' && (
          <div className="loading-container">
            <div className="loading-orb" />
            <p className="loading-text">
              {fortuneType === 'daily' && '오늘의 기운을 읽고 있어요...'}
              {fortuneType === 'zodiac' && '별의 위치를 확인하고 있어요...'}
              {fortuneType === 'tarot' && '카드를 섞고 있어요...'}
              {fortuneType === 'love' && '사랑의 기운을 느끼고 있어요...'}
            </p>
          </div>
        )}

        {phase === 'select' && fortuneType === 'zodiac' && (
          <div style={{ width: '100%' }}>
            <h2 className="zodiac-select-title">나의 별자리를 선택하세요</h2>
            <div className="zodiac-grid">
              {zodiacSigns.map((sign) => (
                <div
                  key={sign.id}
                  className="zodiac-card"
                  onClick={() => handleZodiacSelect(sign)}
                >
                  <div className="zodiac-card-emoji">{sign.emoji}</div>
                  <div className="zodiac-card-name">{sign.name}</div>
                  <div className="zodiac-card-date">{sign.dateRange}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'reveal' && fortuneType === 'tarot' && tarotData && (
          <div>
            <div className="tarot-container" onClick={handleTarotFlip}>
              <div className={`tarot-card-3d${tarotFlipped ? ' flipped' : ''}`}>
                <div className="tarot-face tarot-back">
                  <div className="tarot-back-pattern">
                    <span className="tarot-back-symbol">🔮</span>
                  </div>
                </div>
                <div className="tarot-face tarot-front">
                  <div className="tarot-front-emoji">{tarotData.card.emoji}</div>
                  <div className="tarot-front-name">{tarotData.card.nameKr}</div>
                  <div className="tarot-front-keyword">
                    {tarotData.isReversed ? tarotData.card.reversed.keyword : tarotData.card.upright.keyword}
                  </div>
                  {tarotData.isReversed && (
                    <div className="tarot-front-reversed">역방향</div>
                  )}
                </div>
              </div>
            </div>
            {!tarotFlipped && (
              <p className="tarot-instruction">카드를 탭하여 뒤집어보세요</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FortuneScreen;
