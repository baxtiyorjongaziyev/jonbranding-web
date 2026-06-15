'use client';
import { useState } from 'react';
import type { FC } from 'react';

interface Props { onOpen: () => void; }

function fmtSom(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)} mln`;
  if (val >= 1_000) return `${Math.round(val / 1_000)} ming`;
  return String(Math.round(val));
}

const AtLossCalc: FC<Props> = ({ onOpen }) => {
  const [clients, setClients] = useState(200);
  const [check, setCheck] = useState(80);
  const [impact, setImpact] = useState(15);
  const loss = clients * check * 1000 * (impact / 100);
  return (
    <section className="py-16 md:py-24 bg-[var(--at-bg-2)] border-t border-[var(--at-line)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">§ 02 · Kalkulyator</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>Zaif brend sizga<br />qancha turadi?</h2>
            <p className="mt-4 text-[var(--at-ink-2)] leading-relaxed">Hoziroq hisoblang — brend muammolari tufayli har oyda qancha daromad yo'qotilayotganini ko'ring.</p>
            <div className="mt-8 p-6 bg-[var(--at-paper)] border border-[var(--at-line)] rounded-2xl">
              <div className="mb-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">Oylik yo'qotish (taxminiy)</div>
              <div className="text-4xl md:text-5xl font-bold text-[var(--at-accent)]" style={{ letterSpacing: '-0.03em' }}>~{fmtSom(loss)} so'm</div>
              <div className="mt-2 text-[var(--at-muted)] text-sm">Yillik: ~{fmtSom(loss * 12)} so'm</div>
            </div>
            <button onClick={onOpen} className="mt-6 bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform">Mening biznesim uchun aniqlash ↗</button>
          </div>
          <div className="space-y-8">
            {[{ label: 'Oylik mijozlar soni', min: 50, max: 3000, step: 10, value: clients, set: setClients, display: String(clients), lo: '50', hi: '3 000' },
              { label: "O'rtacha chek (ming so'm)", min: 20, max: 500, step: 5, value: check, set: setCheck, display: `${check}K`, lo: '20K', hi: '500K' },
              { label: "Brend ta'siri darajasi", min: 5, max: 35, step: 1, value: impact, set: setImpact, display: `${impact}%`, lo: '5%', hi: '35%' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-[var(--at-ink)]">{s.label}</label>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--at-ink)]">{s.display}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-[var(--at-accent)] cursor-pointer" />
                <div className="flex justify-between text-xs text-[var(--at-muted)] mt-1"><span>{s.lo}</span><span>{s.hi}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtLossCalc;
