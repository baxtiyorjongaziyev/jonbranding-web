'use client';

import { FC } from 'react';
import { X } from 'lucide-react';
import type { SectionProps } from './types';

export const ATMiniQuotes: FC = () => {
  const items = [
    {
      avatar: 'S',
      color: '#C2552A',
      text: '"3 oyda sotuv 41% oshdi"',
      who: 'Sardor R. · Qumri Coffee',
      res: '+41% sotuv',
    },
    {
      avatar: 'M',
      color: '#1B4DFF',
      text: '"Nomimizni saqlab qoldi"',
      who: 'Malika K. · Oltin Bulut',
      res: 'Himoyalandi',
    },
    {
      avatar: 'R',
      color: '#2C6E49',
      text: '"Javonda 2× ko\'rindik"',
      who: 'Rustam X. · Nur Sopol',
      res: "2× ko'rinish",
    },
  ];

  return (
    <section className="miniq">
      <div className="wrap">
        <div className="miniq-inner">
          <div className="miniq-label">
            <span className="miniq-stars">★★★★★</span>
            <span>240+ mijoz · 4.9/5</span>
          </div>
          <div className="miniq-list">
            {items.map((q, i) => (
              <div key={i} className="miniq-q">
                <div className="miniq-avatar" style={{ background: q.color }}>
                  {q.avatar}
                </div>
                <div>
                  <div className="miniq-text">{q.text}</div>
                  <div className="miniq-who">{q.who}</div>
                  <div className="miniq-res">↳ {q.res}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── LOSS CALCULATOR ───────────────────────────── */
interface ATLossCalcProps {
  dictionary: any;
  onOpen: () => void;
  lang?: string;
}
