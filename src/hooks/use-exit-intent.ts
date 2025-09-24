
'use client';

import { useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'exit_intent_shown_at';
const COOLDOWN_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // 7 kun

export const useExitIntent = (onExitIntent: () => void) => {
  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
    }

    const lastShownString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastShownString) {
        const lastShownTime = new Date(lastShownString).getTime();
        if (Date.now() - lastShownTime < COOLDOWN_PERIOD_MS) {
            return; // Cooldown davrida bo'lsa, hech narsa qilmaymiz
        }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        trigger();
      }
    };
    
    const trigger = () => {
        const lastShownString = localStorage.getItem(LOCAL_STORAGE_KEY);
         if (lastShownString) {
            const lastShownTime = new Date(lastShownString).getTime();
            if (Date.now() - lastShownTime < COOLDOWN_PERIOD_MS) {
                return;
            }
        }
        
        onExitIntent();
        localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toISOString());
        removeListeners();
    };

    const removeListeners = () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
    }
    
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        removeListeners();
    };
  }, [onExitIntent]);
};
