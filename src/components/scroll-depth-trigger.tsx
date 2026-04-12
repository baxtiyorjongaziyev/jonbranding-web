'use client';

import { useEffect, useState } from 'react';

interface ScrollDepthTriggerProps {
  onTrigger: () => void;
  threshold?: number; // 0 to 1
  sessionKey?: string;
}

export const ScrollDepthTrigger: React.FC<ScrollDepthTriggerProps> = ({ 
  onTrigger, 
  threshold = 0.85, 
  sessionKey = 'contact_form_auto_popup' 
}) => {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if already triggered in this session
    const triggered = sessionStorage.getItem(sessionKey);
    if (triggered) {
      setHasTriggered(true);
      return;
    }

    const handleScroll = () => {
      if (hasTriggered) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

      if (scrollPercentage >= threshold) {
        setHasTriggered(true);
        sessionStorage.setItem(sessionKey, 'true');
        onTrigger();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onTrigger, threshold, sessionKey, hasTriggered]);

  return null;
};

export default ScrollDepthTrigger;
