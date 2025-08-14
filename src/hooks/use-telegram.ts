'use client';

import { useEffect, useState } from 'react';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
    };
    // ... and other fields
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    // ... theme parameters
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    // ... MainButton properties and methods
  };
  HapticFeedback: {
    // ... HapticFeedback properties and methods
  };
  ready: () => void;
  // ... and other methods
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        }
    }
}

export const useTelegram = () => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram) {
      const telegramApp = window.Telegram.WebApp;
      telegramApp.ready();
      setTg(telegramApp);
    }
  }, []);

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
  };
};
