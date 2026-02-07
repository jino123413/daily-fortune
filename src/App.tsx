import React, { useState, useCallback, useEffect } from 'react';
import { Screen, FortuneType, FortuneResult, StreakData } from './types';
import { getStreakData, updateStreak, hasViewedAnyToday, addViewedType } from './utils/storage';
import { useInterstitialAd } from './hooks/useInterstitialAd';
import { DeviceViewport } from './components/DeviceViewport';
import HomeScreen from './components/HomeScreen';
import FortuneScreen from './components/FortuneScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [fortuneType, setFortuneType] = useState<FortuneType>('daily');
  const [fortuneResult, setFortuneResult] = useState<FortuneResult | null>(null);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    lastVisitDate: '',
    totalVisits: 0,
    fortuneHistory: [],
  });
  const [hasViewedToday, setHasViewedToday] = useState(false);
  const { loading: adLoading, showInterstitialAd } = useInterstitialAd();

  // Load streak data and viewed status on mount and when returning to home
  useEffect(() => {
    const loadData = async () => {
      const [streakData, viewed] = await Promise.all([
        getStreakData(),
        hasViewedAnyToday(),
      ]);
      setStreak(streakData);
      setHasViewedToday(viewed);
    };
    if (screen === 'home') {
      loadData();
    }
  }, [screen]);

  const handleSelectFortune = useCallback((type: FortuneType) => {
    const startFortune = () => {
      setFortuneType(type);
      setFortuneResult(null);
      setPremiumUnlocked(false);
      setScreen('fortune');
    };

    // First fortune of the day = no ad. Subsequent types = AD
    if (hasViewedToday) {
      showInterstitialAd({ onDismiss: startFortune });
    } else {
      startFortune();
    }
  }, [hasViewedToday, showInterstitialAd]);

  const handleFortuneResult = useCallback(async (result: FortuneResult) => {
    setFortuneResult(result);
    const updatedStreak = await updateStreak(result.type);
    setStreak(updatedStreak);
    await addViewedType(result.type);
    setHasViewedToday(true);
    setScreen('result');
  }, []);

  const handleOtherFortune = useCallback(() => {
    showInterstitialAd({
      onDismiss: () => {
        setFortuneResult(null);
        setPremiumUnlocked(false);
        setScreen('home');
      },
    });
  }, [showInterstitialAd]);

  const handleUnlockPremium = useCallback(() => {
    showInterstitialAd({
      onDismiss: () => {
        setPremiumUnlocked(true);
      },
    });
  }, [showInterstitialAd]);

  const handleBackToHome = useCallback(() => {
    setFortuneResult(null);
    setPremiumUnlocked(false);
    setScreen('home');
  }, []);

  return (
    <>
      <DeviceViewport />
      <div className="app">
        {screen === 'home' && (
        <HomeScreen
          streak={streak}
          onSelectFortune={handleSelectFortune}
        />
      )}
      {screen === 'fortune' && (
        <FortuneScreen
          fortuneType={fortuneType}
          onResult={handleFortuneResult}
          onBack={handleBackToHome}
        />
      )}
      {screen === 'result' && fortuneResult && (
        <ResultScreen
          result={fortuneResult}
          premiumUnlocked={premiumUnlocked}
          onOtherFortune={handleOtherFortune}
          onUnlockPremium={handleUnlockPremium}
          adLoading={adLoading}
        />
      )}
      </div>
    </>
  );
};

export default App;
