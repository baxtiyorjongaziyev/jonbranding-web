import type { FC } from 'react';

const QUOTES = [
  { initial: 'S', color: 'var(--at-terra)', quote: '3 oyda sotuv 41% oshdi', name: 'Sardor R.', company: 'Qumri Coffee', result: '+41% sotuv' },
  { initial: 'M', color: 'var(--at-accent)', quote: "Nomimizni saqlab qoldi", name: 'Malika K.', company: 'Oltin Bulut', result: 'Himoyalandi' },
  { initial: 'R', color: 'var(--at-green)', quote: "Javonda 2× ko'rindik", name: 'Rustam X.', company: 'Nur Sopol', result: "2× ko'rinish" },
];

const AtMiniQuotes: FC = () => (
  <div className="border-t border-b border-[var(--at-line)] bg-[var(--at-paper)] py-6">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="flex flex-col gap-1">
          <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] uppercase tracking-widest">Mijozlar bahosi</div>
          <div className="text-2xl font-bold text-[var(--at-ink)]">4.9<span className="text-base font-normal text-[var(--at-muted)]">/5</span></div>
          <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)]">240+ mijoz</div>
        </div>
        {QUOTES.map((q) => (
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

export default AtMiniQuotes;
