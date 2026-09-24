'use client';

import { FC } from 'react';

export const ATStats: FC<{ dictionary: any }> = ({ dictionary }) => {
  const statsItems = dictionary?.stats || [];
  const tips = [
    dictionary?.stats_tip_1 ||
      "2019—2026 davrida 240 ta haqiqiy mijoz. Mahalliy ro'yxat va sharhlar bilan tasdiqlangan.",
    dictionary?.stats_tip_2 ||
      "Qumri Coffee (2.8M), Oltin Bulut (3.7M), Humo (4.1M) o'rtachasi. Auditda aniq raqam.",
    dictionary?.stats_tip_3 ||
      "Brif yuborilgandan so'ng — birinchi tavsiya 21 kun ichida amalga oshadi.",
    dictionary?.stats_tip_4 ||
      'PDF hisobotdagi tavsiyalarning kamida 60% 90 kun ichida amalga oshiriladi.',
  ];

  return (
    <section className="stats wrap">
      <div className="stats-row">
        {statsItems.map((s: any, i: number) => (
          <div key={i} className="stat">
            <div className="n">
              {s.n}
              <span className="s">{s.s}</span>
            </div>
            <div className="l">{s.l}</div>
            <div className="stat-tip">{tips[i] || ''}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
