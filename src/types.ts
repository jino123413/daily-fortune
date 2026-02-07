export type Screen = 'home' | 'fortune' | 'result';

export type FortuneType = 'daily' | 'zodiac' | 'tarot' | 'love';

export interface ZodiacSign {
  id: string;
  name: string;
  emoji: string;
  dateRange: string;
  element: string;
}

export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  emoji: string;
  upright: {
    keyword: string;
    description: string;
    advice: string;
  };
  reversed: {
    keyword: string;
    description: string;
    advice: string;
  };
}

export interface FortuneResult {
  type: FortuneType;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  description: string;
  scores: {
    label: string;
    value: number;
  }[];
  luckyItems: {
    color: string;
    number: number;
    direction: string;
    time: string;
  };
  advice: string;
  premiumContent?: {
    weeklyFortune?: string;
    compatibility?: string;
  };
}

export interface DailyFortune {
  id: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  description: string;
  overall: number;
  wealth: number;
  love: number;
  health: number;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  luckyTime: string;
  advice: string;
  weeklyFortune: string;
}

export interface ZodiacFortune {
  id: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  description: string;
  overall: number;
  career: number;
  love: number;
  health: number;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  luckyTime: string;
  advice: string;
  compatibility: string;
}

export interface LoveFortune {
  id: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  description: string;
  charm: number;
  encounter: number;
  chemistry: number;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  luckyTime: string;
  advice: string;
  compatibilitySign: string;
}

export interface StreakData {
  currentStreak: number;
  lastVisitDate: string;
  totalVisits: number;
  fortuneHistory: {
    date: string;
    type: FortuneType;
  }[];
}
