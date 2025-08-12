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

    const handleScroll = () => {
        if(window.scrollY / (document.body.scrollHeight - window.innerHeight) > 0.6) {
            scrollTimeoutId = setTimeout(trigger, 20000); // 20 seconds after 60% scroll
        }
    }

    const removeListeners = () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
    }

    let scrollTimeoutId: NodeJS.Timeout | null = null;
    
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
        removeListeners();
    };
  }, [onExitIntent]);
};
