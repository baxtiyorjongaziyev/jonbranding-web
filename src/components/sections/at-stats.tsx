import type { FC } from 'react';

const STATS = [
  { n: '240', s: '+', l: "Tashxis o'tkazildi · 2019—2026" },
  { n: '3.2', s: 'M', l: "O'rtacha topilgan yo'qotish, so'm" },
  { n: '21', s: ' kun', l: 'Tashxisdan ilk natijagacha' },
  { n: '96', s: '%', l: "Mijoz tavsiyalarni qo'llaydi" },
];

const AtStats: FC = () => (
  <section className="border-t border-[var(--at-line)] bg-[var(--at-paper)]">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--at-line)]">
        {STATS.map((s,i)=>(
          <div key={i} className="py-10 px-6 first:pl-0">
            <div className="font-bold text-[var(--at-ink)] leading-none mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.04em' }}>
              {s.n}<span className="text-[var(--at-accent)]">{s.s}</span>
            </div>
            <div className="text-xs text-[var(--at-muted)] leading-relaxed font-[family-name:var(--font-mono)] uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AtStats;
