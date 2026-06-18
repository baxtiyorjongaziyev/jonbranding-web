'use client';
import type { FC } from 'react';
import Image from 'next/image';

interface Props { onOpen: () => void; lang?: string; }

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const translations = {
  uz: {
    tagline: 'Markaziy Osiyo · Brand atelier · Est. 2019',
    badge: '2026 · Yangi paketlar mavjud',
    h1a: 'Brendingiz',
    h1b: 'aslida',
    h1c: "qancha yo'qotyapti?",
    desc: "Brend tashxisi — biznesingizning ko'rinmas yo'qotishlarini topish. |14 kun · 12 mezon · 30–50 betlik hisobot.",
    cta1: 'Bepul mini-tashxis boshlash ↗',
    cta2: "Paketlarni ko'rish →",
    stats: [
      { label: "O'tkazildi", value: '240+' },
      { label: 'Bu oyda', value: '4 joy' },
      { label: 'Muddati', value: '14 kun' },
    ],
  },
  ru: {
    tagline: 'Центральная Азия · Brand atelier · Est. 2019',
    badge: '2026 · Новые пакеты доступны',
    h1a: 'Сколько теряет',
    h1b: 'ваш',
    h1c: 'бренд на самом деле?',
    desc: 'Бренд-диагностика — выявление скрытых потерь вашего бизнеса. |14 дней · 12 критериев · отчёт 30–50 страниц.',
    cta1: 'Начать бесплатно ↗',
    cta2: 'Посмотреть пакеты →',
    stats: [
      { label: 'Выполнено', value: '240+' },
      { label: 'В этом месяце', value: '4 места' },
      { label: 'Срок', value: '14 дней' },
    ],
  },
  en: {
    tagline: 'Central Asia · Brand atelier · Est. 2019',
    badge: '2026 · New packages available',
    h1a: 'How much is',
    h1b: 'your',
    h1c: 'brand actually losing?',
    desc: 'Brand diagnostics — discovering the invisible losses of your business. |14 days · 12 criteria · 30–50 page report.',
    cta1: 'Start free mini-diagnosis ↗',
    cta2: 'View packages →',
    stats: [
      { label: 'Completed', value: '240+' },
      { label: 'This month', value: '4 spots' },
      { label: 'Timeline', value: '14 days' },
    ],
  },
  zh: {
    tagline: '中亚 · 品牌工坊 · 2019年成立',
    badge: '2026 · 新套餐已上线',
    h1a: '您的品牌',
    h1b: '实际上',
    h1c: '在损失多少？',
    desc: '品牌诊断 — 发现您业务中的隐形损失。|14天 · 12个标准 · 30–50页报告。',
    cta1: '开始免费迷你诊断 ↗',
    cta2: '查看套餐 →',
    stats: [
      { label: '已完成', value: '240+' },
      { label: '本月', value: '4个名额' },
      { label: '时限', value: '14天' },
    ],
  },
} as const;

const AtHero: FC<Props> = ({ onOpen, lang = 'uz' }) => {
  const l = translations[(lang as Lang) in translations ? (lang as Lang) : 'uz'];

  return (
    <section className="bg-[var(--at-bg)] pt-16 pb-0 md:pt-24">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1fr_400px] gap-0 items-end">
          {/* LEFT — copy */}
          <div className="pb-12 md:pb-20">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--at-green)] animate-pulse" />
                {l.tagline}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest border border-[var(--at-line)] rounded-full px-3 py-1 text-[var(--at-ink-2)] bg-[var(--at-paper)]">
                {l.badge}
              </span>
            </div>

            <h1
              className="font-bold text-[var(--at-ink)] mb-8"
              style={{ fontSize: 'clamp(52px, 8.5vw, 140px)', lineHeight: 0.9, letterSpacing: '-0.045em' }}
            >
              <span className="block">{l.h1a}</span>
              <span className="block text-[var(--at-accent)] font-[family-name:var(--font-serif)] italic">
                {l.h1b}
                <sup className="font-[family-name:var(--font-mono)] not-italic text-[var(--at-muted)]" style={{ fontSize: '0.22em', top: '-0.6em', letterSpacing: '0' }}>*</sup>
              </span>
              <span className="block">{l.h1c}</span>
            </h1>

            <p className="text-[var(--at-ink-2)] text-base md:text-lg leading-relaxed max-w-[520px] mb-8">
              {l.desc.split('|')[0]}
              <strong className="text-[var(--at-ink)]">{l.desc.split('|')[1]}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={onOpen}
                className="inline-flex items-center justify-center gap-2 bg-[var(--at-accent)] text-white rounded-full px-7 py-4 font-semibold text-sm hover:-translate-y-0.5 transition-transform"
              >
                {l.cta1}
              </button>
              <button
                onClick={() => document.getElementById('narxlar')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 border border-[var(--at-line)] rounded-full px-7 py-4 text-sm text-[var(--at-ink-2)] hover:text-[var(--at-ink)] hover:border-[var(--at-ink)] transition-colors bg-[var(--at-paper)]"
              >
                {l.cta2}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-[var(--at-line)] pt-6">
              {l.stats.map((m) => (
                <div key={m.label}>
                  <div className="font-bold text-[var(--at-ink)] text-2xl md:text-3xl leading-none mb-1" style={{ letterSpacing: '-0.03em' }}>{m.value}</div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--at-muted)] uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — real portfolio visual */}
          <div className="relative hidden md:block self-end">
            <div
              className="absolute top-4 left-4 z-10 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] flex gap-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5"
              style={{ color: 'rgba(255,255,255,.85)' }}
            >
              <span>Beyaz · 2026</span>
              <span className="text-[#C2552A]">Premium brend</span>
            </div>
            <div
              className="rounded-t-2xl overflow-hidden"
              style={{ height: 500 }}
            >
              <Image
                src="/images/cms/beyaz-gold.jpg"
                alt="Beyaz premium brend — Jon Branding"
                width={400}
                height={500}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtHero;
