import { FortuneType, FortuneResult, ZodiacSign } from '../types';
import { dailyFortunes } from '../data/daily-fortunes';
import { zodiacSigns, zodiacFortunes } from '../data/zodiac-fortunes';
import { tarotCards } from '../data/tarot-cards';
import { loveFortunes } from '../data/love-fortunes';

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getDailyFortune(): FortuneResult {
  const today = getTodayString();
  const index = hashCode(today + 'daily') % dailyFortunes.length;
  const fortune = dailyFortunes[index];

  return {
    type: 'daily',
    grade: fortune.grade,
    title: fortune.title,
    description: fortune.description,
    scores: [
      { label: '종합운', value: fortune.overall },
      { label: '재물운', value: fortune.wealth },
      { label: '연애운', value: fortune.love },
      { label: '건강운', value: fortune.health },
    ],
    luckyItems: {
      color: fortune.luckyColor,
      number: fortune.luckyNumber,
      direction: fortune.luckyDirection,
      time: fortune.luckyTime,
    },
    advice: fortune.advice,
    premiumContent: {
      weeklyFortune: fortune.weeklyFortune,
    },
  };
}

export function getZodiacFortune(signId: string): FortuneResult {
  const today = getTodayString();
  const index = hashCode(today + signId) % 10;
  const signIndex = zodiacSigns.findIndex(s => s.id === signId);
  const fortuneIndex = signIndex * 10 + index;
  const fortune = zodiacFortunes[fortuneIndex];

  return {
    type: 'zodiac',
    grade: fortune.grade,
    title: fortune.title,
    description: fortune.description,
    scores: [
      { label: '종합운', value: fortune.overall },
      { label: '직장운', value: fortune.career },
      { label: '연애운', value: fortune.love },
      { label: '건강운', value: fortune.health },
    ],
    luckyItems: {
      color: fortune.luckyColor,
      number: fortune.luckyNumber,
      direction: fortune.luckyDirection,
      time: fortune.luckyTime,
    },
    advice: fortune.advice,
    premiumContent: {
      compatibility: fortune.compatibility,
    },
  };
}

export function getTarotFortune(): { card: typeof tarotCards[0]; isReversed: boolean; result: FortuneResult } {
  const randomIndex = Math.floor(Math.random() * tarotCards.length);
  const card = tarotCards[randomIndex];
  const isReversed = Math.random() < 0.3;

  const reading = isReversed ? card.reversed : card.upright;
  const gradeMap: Record<number, 'S' | 'A' | 'B' | 'C' | 'D'> = {
    0: 'A', 1: 'S', 2: 'B', 3: 'A', 4: 'C',
    5: 'A', 6: 'S', 7: 'B', 8: 'A', 9: 'B',
    10: 'S', 11: 'A', 12: 'C', 13: 'D', 14: 'A',
    15: 'D', 16: 'D', 17: 'S', 18: 'C', 19: 'S',
    20: 'A', 21: 'S',
  };

  const baseGrade = gradeMap[card.id] || 'B';
  const grade = isReversed
    ? (baseGrade === 'S' ? 'B' : baseGrade === 'A' ? 'C' : baseGrade === 'B' ? 'C' : 'D')
    : baseGrade;

  const gradeScoreMap: Record<string, number> = { S: 95, A: 82, B: 68, C: 52, D: 38 };
  const baseScore = gradeScoreMap[grade];

  return {
    card,
    isReversed,
    result: {
      type: 'tarot',
      grade,
      title: `${card.nameKr}${isReversed ? ' (역방향)' : ''}`,
      description: reading.description,
      scores: [
        { label: '핵심 메시지', value: baseScore },
        { label: '실현 가능성', value: Math.max(20, baseScore + Math.floor(Math.random() * 20 - 10)) },
        { label: '에너지', value: Math.max(20, baseScore + Math.floor(Math.random() * 20 - 10)) },
      ],
      luckyItems: {
        color: ['보라', '남색', '금색', '은색', '흰색'][card.id % 5],
        number: (card.id * 3 + 7) % 45 + 1,
        direction: ['동', '서', '남', '북'][card.id % 4],
        time: ['오전 6시', '오전 10시', '오후 2시', '오후 6시', '오후 10시'][card.id % 5],
      },
      advice: reading.advice,
    },
  };
}

export function getLoveFortune(): FortuneResult {
  const today = getTodayString();
  const index = hashCode(today + 'love') % loveFortunes.length;
  const fortune = loveFortunes[index];

  return {
    type: 'love',
    grade: fortune.grade,
    title: fortune.title,
    description: fortune.description,
    scores: [
      { label: '매력운', value: fortune.charm },
      { label: '만남운', value: fortune.encounter },
      { label: '케미운', value: fortune.chemistry },
    ],
    luckyItems: {
      color: fortune.luckyColor,
      number: fortune.luckyNumber,
      direction: fortune.luckyDirection,
      time: fortune.luckyTime,
    },
    advice: fortune.advice,
    premiumContent: {
      compatibility: fortune.compatibilitySign,
    },
  };
}

export function getZodiacSigns(): ZodiacSign[] {
  return zodiacSigns;
}
