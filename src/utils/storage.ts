import { Storage } from '@apps-in-toss/web-framework';
import { FortuneType, StreakData } from '../types';

const STREAK_KEY = 'daily-fortune-streak';
const FORTUNE_COUNT_KEY = 'daily-fortune-count';
const TODAY_TYPES_KEY = 'daily-fortune-today-types';

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getYesterdayString(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  lastVisitDate: '',
  totalVisits: 0,
  fortuneHistory: [],
};

export async function getStreakData(): Promise<StreakData> {
  try {
    const stored = await Storage.getItem(STREAK_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return { ...DEFAULT_STREAK };
}

export async function updateStreak(type: FortuneType): Promise<StreakData> {
  const data = await getStreakData();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (data.lastVisitDate === today) {
    if (!data.fortuneHistory.some(h => h.date === today && h.type === type)) {
      data.fortuneHistory.push({ date: today, type });
    }
  } else {
    if (data.lastVisitDate === yesterday) {
      data.currentStreak += 1;
    } else {
      data.currentStreak = 1;
    }
    data.lastVisitDate = today;
    data.totalVisits += 1;
    data.fortuneHistory.push({ date: today, type });
  }

  try {
    await Storage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {}

  return data;
}

export async function getTodayFortuneCount(): Promise<number> {
  try {
    const stored = await Storage.getItem(FORTUNE_COUNT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === getTodayString()) {
        return parsed.count;
      }
    }
  } catch {}
  return 0;
}

export async function incrementFortuneCount(): Promise<number> {
  const today = getTodayString();
  let count = 0;
  try {
    const stored = await Storage.getItem(FORTUNE_COUNT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        count = parsed.count;
      }
    }
  } catch {}

  count += 1;
  try {
    await Storage.setItem(FORTUNE_COUNT_KEY, JSON.stringify({ date: today, count }));
  } catch {}

  return count;
}

export async function getTodayViewedTypes(): Promise<FortuneType[]> {
  try {
    const stored = await Storage.getItem(TODAY_TYPES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === getTodayString()) {
        return parsed.types;
      }
    }
  } catch {}
  return [];
}

export async function addViewedType(type: FortuneType): Promise<FortuneType[]> {
  const today = getTodayString();
  const types = await getTodayViewedTypes();

  if (!types.includes(type)) {
    types.push(type);
  }

  try {
    await Storage.setItem(TODAY_TYPES_KEY, JSON.stringify({ date: today, types }));
  } catch {}

  return types;
}

export async function hasViewedAnyToday(): Promise<boolean> {
  const types = await getTodayViewedTypes();
  return types.length > 0;
}

export async function hasViewedTypeToday(type: FortuneType): Promise<boolean> {
  const types = await getTodayViewedTypes();
  return types.includes(type);
}
