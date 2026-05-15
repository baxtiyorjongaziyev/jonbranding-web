'use client';

import { useEffect, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

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

  }, [sessionKey]);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (hasTriggered) return;

    if (latest >= threshold) {
      setHasTriggered(true);
      sessionStorage.setItem(sessionKey, 'true');
      onTrigger();
    }
  });

  return null;
};

export default ScrollDepthTrigger;
