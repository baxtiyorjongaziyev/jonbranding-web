'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const ATMasthead: FC = () => {
  const [time, setTime] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tashkent = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tashkent',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      setTime(tashkent);
    };
    tick();
    if (!isInView) return;
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <div ref={ref} className="masthead">
      <div className="wrap">
        <div className="masthead-row">
          <div className="masthead-left">
            <span>Jon · Atelier</span>
            <span className="hide-m">Toshkent · 41.3°N 69.3°E</span>
            <span>{time} TST</span>
          </div>
          <div className="masthead-right">
            <span className="hide-m">MMXXVI · vol. VI</span>
            <span className="live">Yangi loyihalar uchun ochiq</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── NAV ───────────────────────────────────────── */
interface ATNavProps {
  dictionary: any;
  onOpen: () => void;
  theme: string;
  setTheme: (t: string) => void;
}
