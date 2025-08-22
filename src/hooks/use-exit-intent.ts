'use client';

import { useEffect } from 'react';

const SESSION_STORAGE_KEY = 'exit_intent_shown';

export const useExitIntent = (onExitIntent: () => void) => {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        trigger();
      }
    };
    
    const trigger = () => {
        if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
            onExitIntent();
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
            removeListeners();
        }
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
