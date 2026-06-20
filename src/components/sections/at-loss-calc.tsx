'use client';
import { useState } from 'react';
import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { onOpen: () => void; lang?: string; }

function fmtSom(val: number, lang: string): string {
  const mln = lang === 'zh' ? '百万' : lang === 'en' ? 'M' : lang === 'ru' ? 'млн' : 'mln';
  const thou = lang === 'zh' ? '千' : lang === 'en' ? 'K' : lang === 'ru' ? 'тыс' : 'ming';
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)} ${mln}`;
  if (val >= 1_000) return `${Math.round(val / 1_000)} ${thou}`;
  return String(Math.round(val));
}

const t = {
  uz: {
    sectionLabel: '§ 02 · Kalkulyator',
    heading: 'Zaif brend sizga\nqancha turadi?',
    sub: "Hoziroq hisoblang — brend muammolari tufayli har oyda qancha daromad yo'qotilayotganini ko'ring.",
    monthlyLabel: "Oylik yo'qotish (taxminiy)",
    currency: "so'm",
    yearlyPrefix: "Yillik: ~",
    yearlySuffix: " so'm",
    cta: "Mening biznesim uchun aniqlash ↗",
    sliders: [
      { label: 'Oylik mijozlar soni', lo: '50', hi: '3 000' },
      { label: "O'rtacha chek (ming so'm)", lo: '20K', hi: '500K' },
      { label: "Brend ta'siri darajasi", lo: '5%', hi: '35%' },
    ],
  },
  ru: {
    sectionLabel: '§ 02 · Калькулятор',
    heading: 'Во сколько вам\nобходится слабый бренд?',
    sub: 'Посчитайте прямо сейчас — сколько дохода теряется каждый месяц из-за проблем с брендом.',
    monthlyLabel: 'Ежемесячные потери (приблизительно)',
    currency: "сум",
    yearlyPrefix: "Годовые: ~",
    yearlySuffix: " сум",
    cta: 'Определить для моего бизнеса ↗',
    sliders: [
      { label: 'Клиентов в месяц', lo: '50', hi: '3 000' },
      { label: 'Средний чек (тыс. сум)', lo: '20K', hi: '500K' },
      { label: 'Влияние бренда', lo: '5%', hi: '35%' },
    ],
  },
  en: {
    sectionLabel: '§ 02 · Calculator',
    heading: 'How much does\na weak brand cost you?',
    sub: 'Calculate right now — see how much revenue you lose every month due to brand problems.',
    monthlyLabel: 'Monthly loss (estimated)',
    currency: "UZS",
    yearlyPrefix: "Yearly: ~",
    yearlySuffix: " UZS",
    cta: 'Calculate for my business ↗',
    sliders: [
      { label: 'Monthly clients', lo: '50', hi: '3,000' },
      { label: 'Average order (K UZS)', lo: '20K', hi: '500K' },
      { label: 'Brand impact level', lo: '5%', hi: '35%' },
    ],
  },
  zh: {
    sectionLabel: '§ 02 · 计算器',
    heading: '薄弱品牌\n让您损失多少？',
    sub: '立即计算——了解每月因品牌问题损失多少收入。',
    monthlyLabel: '月度损失（估算）',
    currency: "UZS",
    yearlyPrefix: "年度：~",
    yearlySuffix: " UZS",
    cta: '为我的业务计算 ↗',
    sliders: [
      { label: '月客户数', lo: '50', hi: '3,000' },
      { label: '平均订单（千UZS）', lo: '20K', hi: '500K' },
      { label: '品牌影响级别', lo: '5%', hi: '35%' },
    ],
  },
} as const;

const AtLossCalc: FC<Props> = ({ onOpen, lang = 'uz' }) => {
  const [clients, setClients] = useState(200);
  const [check, setCheck] = useState(80);
  const [impact, setImpact] = useState(15);
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  const loss = clients * check * 1000 * (impact / 100);
  return (
    <section className="py-16 md:py-24 bg-[var(--at-bg-2)] border-t border-[var(--at-line)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">{l.sectionLabel}</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>
              {l.heading.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <p className="mt-4 text-[var(--at-ink-2)] leading-relaxed">{l.sub}</p>
            <div className="mt-8 p-6 bg-[var(--at-paper)] border border-[var(--at-line)] rounded-2xl">
              <div className="mb-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">{l.monthlyLabel}</div>
              <div className="text-4xl md:text-5xl font-bold text-[var(--at-accent)]" style={{ letterSpacing: '-0.03em' }}>~{fmtSom(loss, lang)} {l.currency}</div>
              <div className="mt-2 text-[var(--at-muted)] text-sm">{l.yearlyPrefix}{fmtSom(loss * 12, lang)}{l.yearlySuffix}</div>
            </div>
            <button onClick={onOpen} className="mt-6 bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform">{l.cta}</button>
          </div>
          <div className="space-y-8">
            {[
              { ...l.sliders[0], min: 50, max: 3000, step: 10, value: clients, set: setClients, display: String(clients) },
              { ...l.sliders[1], min: 20, max: 500, step: 5, value: check, set: setCheck, display: `${check}K` },
              { ...l.sliders[2], min: 5, max: 35, step: 1, value: impact, set: setImpact, display: `${impact}%` },
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
