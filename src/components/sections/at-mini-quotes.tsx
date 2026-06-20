import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { lang?: string; }

const t = {
  uz: {
    ratingLabel: 'Mijozlar bahosi',
    ratingCount: '240+ mijoz',
    quotes: [
      { initial: 'S', color: 'var(--at-terra)', quote: '3 oyda sotuv 41% oshdi', name: 'Sardor R.', company: 'Qumri Coffee', result: '+41% sotuv' },
      { initial: 'M', color: 'var(--at-accent)', quote: "Nomimizni saqlab qoldi", name: 'Malika K.', company: 'Oltin Bulut', result: 'Himoyalandi' },
      { initial: 'R', color: 'var(--at-green)', quote: "Javonda 2× ko'rindik", name: 'Rustam X.', company: 'Nur Sopol', result: "2× ko'rinish" },
    ],
  },
  ru: {
    ratingLabel: 'Оценка клиентов',
    ratingCount: '240+ клиентов',
    quotes: [
      { initial: 'S', color: 'var(--at-terra)', quote: 'Продажи выросли на 41% за 3 месяца', name: 'Sardor R.', company: 'Qumri Coffee', result: '+41% продаж' },
      { initial: 'M', color: 'var(--at-accent)', quote: 'Защитили наше название', name: 'Malika K.', company: 'Oltin Bulut', result: 'Защищено' },
      { initial: 'R', color: 'var(--at-green)', quote: 'Стали заметнее в 2 раза на полке', name: 'Rustam X.', company: 'Nur Sopol', result: '2× видимость' },
    ],
  },
  en: {
    ratingLabel: 'Client rating',
    ratingCount: '240+ clients',
    quotes: [
      { initial: 'S', color: 'var(--at-terra)', quote: 'Sales up 41% in 3 months', name: 'Sardor R.', company: 'Qumri Coffee', result: '+41% sales' },
      { initial: 'M', color: 'var(--at-accent)', quote: 'Protected our brand name', name: 'Malika K.', company: 'Oltin Bulut', result: 'Protected' },
      { initial: 'R', color: 'var(--at-green)', quote: '2× more visible on shelf', name: 'Rustam X.', company: 'Nur Sopol', result: '2× visibility' },
    ],
  },
  zh: {
    ratingLabel: '客户评分',
    ratingCount: '240+客户',
    quotes: [
      { initial: 'S', color: 'var(--at-terra)', quote: '3个月内销售额增长41%', name: 'Sardor R.', company: 'Qumri Coffee', result: '+41%销售' },
      { initial: 'M', color: 'var(--at-accent)', quote: '保护了我们的品牌名称', name: 'Malika K.', company: 'Oltin Bulut', result: '已保护' },
      { initial: 'R', color: 'var(--at-green)', quote: '货架可见度提升2倍', name: 'Rustam X.', company: 'Nur Sopol', result: '2×可见度' },
    ],
  },
} as const;

const AtMiniQuotes: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <div className="border-t border-b border-[var(--at-line)] bg-[var(--at-paper)] py-6">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col gap-1">
            <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] uppercase tracking-widest">{l.ratingLabel}</div>
            <div className="text-2xl font-bold text-[var(--at-ink)]">4.9<span className="text-base font-normal text-[var(--at-muted)]">/5</span></div>
            <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)]">{l.ratingCount}</div>
          </div>
          {l.quotes.map((q) => (
            <div key={q.name} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: q.color }}>{q.initial}</div>
              <div>
                <p className="text-sm text-[var(--at-ink-2)] leading-snug mb-1">&ldquo;{q.quote}&rdquo;</p>
                <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)]">{q.name} · {q.company}</div>
                <div className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[var(--at-green)] mt-0.5">{q.result}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AtMiniQuotes;
