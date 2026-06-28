'use client';

interface Props {
  onOpen: () => void;
  lang?: string;
}

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    label: 'Bepul',
    heading: 'Brendingiz tayyormi?',
    headingEm: 'tekshirib oling.',
    sub: "150$ o'rniga bepul · 1 kun",
    badge: 'Bepul',
    items: [
      "12 mezon bo'yicha tezkor audit",
      "Yo'qotilgan daromad hisobi",
      "1 soatlik prezentatsiya",
      "Hech qanday majburiyatsiz",
    ],
    cta: 'Bepul audit olish',
    guarantees: [
      "100% kafolat — foydali bo'lmasa, pul qaytadi",
      'Maxfiylik — NDA ixtiyoriy',
    ],
  },
  ru: {
    label: 'Бесплатно',
    heading: 'Ваш бренд готов?',
    headingEm: 'проверьте.',
    sub: 'вместо $150 · 1 день',
    badge: 'Бесплатно',
    items: [
      'Быстрый аудит по 12 критериям',
      'Расчет упущенной прибыли',
      '1-часовая презентация',
      'Без обязательств',
    ],
    cta: 'Получить аудит бесплатно',
    guarantees: [
      '100% гарантия — если не поможет, вернём деньги',
      'Конфиденциальность — NDA по желанию',
    ],
  },
  en: {
    label: 'Free',
    heading: 'Is your brand ready?',
    headingEm: 'find out.',
    sub: 'instead of $150 · 1 day',
    badge: 'Free',
    items: [
      'Quick audit across 12 criteria',
      'Lost revenue calculation',
      '1-hour presentation session',
      'No obligations',
    ],
    cta: 'Get Free Audit',
    guarantees: [
      "100% guarantee — full refund if not helpful",
      'Confidentiality — NDA optional',
    ],
  },
  zh: {
    label: '免费',
    heading: '您的品牌准备好了吗？',
    headingEm: '立即检测。',
    sub: '原价 $150 · 1天完成',
    badge: '免费',
    items: [
      '基于12项标准的快速审计',
      '流失利润精确计算',
      '1小时现场演示',
      '无任何强制条件',
    ],
    cta: '免费获取审计报告',
    guarantees: [
      '100%保证——无效全额退款',
      '保密性——可选签署保密协议',
    ],
  },
} as const;

export default function AtPricing({ onOpen, lang = 'uz' }: Props) {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];

  return (
    <section className="py-20 md:py-28" id="brand-audit" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[720px] mx-auto px-8 sm:px-5 text-center">
        <div
          className="inline-flex items-center gap-2 mb-5"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
        >
          <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
          <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 06</span>
          <span>{l.label}</span>
        </div>

        <h2
          className="font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(32px, 4.4vw, 56px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
        >
          {l.heading}{' '}
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
            {l.headingEm}
          </span>
        </h2>

        <div
          className="relative rounded-2xl p-8 sm:p-10 text-left mx-auto"
          style={{
            maxWidth: 480,
            background: 'var(--at-ink)',
            border: '2px solid var(--at-accent)',
          }}
        >
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: 'var(--at-accent)', color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
          >
            {l.badge}
          </div>

          <div className="flex items-baseline justify-center gap-1 mb-2 mt-4">
            <span className="font-bold" style={{ fontSize: 'clamp(36px, 5vw, 48px)', letterSpacing: '-0.03em', color: '#fff' }}>
              {l.label}
            </span>
          </div>
          <p className="text-center text-sm mb-7" style={{ color: 'rgba(244,241,232,.5)' }}>{l.sub}</p>

          <ul className="flex flex-col gap-3 mb-8">
            {l.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(244,241,232,.8)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--at-green)', fontSize: 14 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={onOpen}
            className="w-full font-semibold text-sm rounded-full py-4 transition-all hover:opacity-90"
            style={{ background: 'var(--at-accent)', color: '#fff', border: 'none' }}
          >
            {l.cta} ↗
          </button>
        </div>

        <div
          className="mt-6 rounded-2xl p-5 grid sm:grid-cols-2 gap-3 text-left"
          style={{ background: 'var(--at-green-soft)', border: '1px solid var(--at-green)' }}
        >
          {l.guarantees.map((g, i) => (
            <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--at-ink)' }}>
              <span style={{ color: 'var(--at-green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
              {g}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
