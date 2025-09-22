
'use client';

import { useEffect } from 'react';

const SESSION_STORAGE_KEY = 'scroll_intent_shown';

export const useScrollIntent = (onScrollIntent: () => void, scrollThreshold = 0.8) => {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrolledPercentage = (scrollPosition + windowHeight) / documentHeight;

      if (scrolledPercentage >= scrollThreshold) {
        trigger();
      }
    };

    const trigger = () => {
        if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
            onScrollIntent();
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
            removeListeners();
        }
    };

    const removeListeners = () => {
        window.removeEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('scroll', handleScroll);

    return () => {
        removeListeners();
    };
  }, [onScrollIntent, scrollThreshold]);
};
