'use client';
import type { FC } from 'react';

interface Props { lang?: string; }

const CONTENT: Record<string, { label: string; sub: string; pre: string; strike: string; mid: string; italic: string; post: string; bold: string }> = {
  uz: {
    label: '— Manifest',
    sub: "Tashxis — bu professional ko'rik. Aniq raqamlar, aniq xulosalar, aniq harakat. Taxmin va his bilan biznesni yo'qotmaymiz.",
    pre: 'Tashxissiz', strike: 'tuzatish', mid: '—\nbu', italic: "qorong'ida", post: "o'q otish.\nAvval ko'rinmagan teshikni topamiz, keyin yopamiz. Tartib shu —\naks holda",
    bold: "siz pul to'laysiz, raqib daromad oladi.",
  },
  ru: {
    label: '— Манифест',
    sub: 'Диагностика — это профессиональный осмотр. Чёткие цифры, чёткие выводы, чёткие действия. Не теряем бизнес на догадках.',
    pre: 'Без диагностики', strike: 'лечение', mid: '—\nэто', italic: 'стрельба', post: 'в темноте.\nСначала находим невидимую дыру, потом закрываем. Порядок такой —\nиначе',
    bold: 'вы платите, конкурент зарабатывает.',
  },
  en: {
    label: '— Manifesto',
    sub: 'Diagnosis is a professional audit. Clear numbers, clear conclusions, clear action. We don\'t lose business on guesses.',
    pre: 'Without diagnosis', strike: 'fixing', mid: '—\nit\'s', italic: 'shooting', post: 'in the dark.\nFirst we find the invisible hole, then we close it. That\'s the order —\notherwise',
    bold: 'you pay, your competitor earns.',
  },
  zh: {
    label: '— 宣言',
    sub: '诊断是专业的审查。明确数字，明确结论，明确行动。我们不会在猜测中损失业务。',
    pre: '没有诊断的', strike: '修复', mid: '——\n这是', italic: '黑暗中', post: '射击。\n先找到看不见的漏洞，再堵住它。顺序就是这样——\n否则',
    bold: '您付钱，竞争对手赚钱。',
  },
};

const AtManifesto: FC<Props> = ({ lang = 'uz' }) => {
  const c = CONTENT[lang] ?? CONTENT.uz;
  return (
    <section className="py-[120px] relative z-[2] border-b border-[var(--at-line)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8 md:gap-14 items-start">
          <div className="pt-3">
            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)] mb-3.5">
              {c.label}
            </div>
            <div className="text-sm leading-[1.55] text-[var(--at-ink-2)] max-w-[240px]">
              {c.sub}
            </div>
          </div>
          <p
            className="font-medium text-[var(--at-ink)] leading-[1.04] whitespace-pre-line"
            style={{ fontSize: 'clamp(32px, 4.6vw, 72px)', letterSpacing: '-0.03em' }}
          >
            {c.pre}{' '}
            <span className="line-through decoration-[var(--at-terra)] decoration-[4px] text-[var(--at-muted)] font-normal">
              {c.strike}
            </span>{' '}
            {c.mid}{' '}
            <span className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-accent)]">
              {c.italic}
            </span>{' '}
            {c.post}{' '}
            <strong className="font-semibold">{c.bold}</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AtManifesto;
