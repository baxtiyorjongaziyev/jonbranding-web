import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { lang?: string; }

const STATS: Record<Lang, { n: string; s: string; l: string }[]> = {
  uz: [
    { n: '240', s: '+', l: "Tashxis o'tkazildi · 2019—2026" },
    { n: '3.2', s: 'M', l: "O'rtacha topilgan yo'qotish, so'm" },
    { n: '21', s: ' kun', l: 'Tashxisdan ilk natijagacha' },
    { n: '96', s: '%', l: "Mijoz tavsiyalarni qo'llaydi" },
  ],
  ru: [
    { n: '240', s: '+', l: 'Диагностик проведено · 2019—2026' },
    { n: '3.2', s: 'М', l: 'Среднее выявленных потерь, сум' },
    { n: '21', s: ' дн', l: 'От диагностики до первого результата' },
    { n: '96', s: '%', l: 'Клиентов применяют рекомендации' },
  ],
  en: [
    { n: '240', s: '+', l: 'Diagnostics completed · 2019—2026' },
    { n: '3.2', s: 'M', l: 'Average losses discovered, UZS' },
    { n: '21', s: ' days', l: 'From diagnosis to first results' },
    { n: '96', s: '%', l: 'Clients implement recommendations' },
  ],
  zh: [
    { n: '240', s: '+', l: '已完成诊断 · 2019—2026' },
    { n: '3.2', s: 'M', l: '平均发现损失（乌兹别克斯坦苏姆）' },
    { n: '21', s: ' 天', l: '从诊断到首次成果' },
    { n: '96', s: '%', l: '客户实施建议' },
  ],
};

const AtStats: FC<Props> = ({ lang = 'uz' }) => {
  const stats = STATS[(lang as Lang) in STATS ? (lang as Lang) : 'uz'];
  return (
    <section className="border-t border-[var(--at-line)] bg-[var(--at-paper)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--at-line)]">
          {stats.map((s, i) => (
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
};

export default AtStats;
