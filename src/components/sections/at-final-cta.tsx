type Lang = 'uz' | 'ru' | 'en' | 'zh';

interface Props { onOpen: () => void; lang?: string; }

const t = {
  uz: {
    badge: 'Boshlashga tayyormisiz?',
    h2a: 'Tashxis qiling —',
    h2b: 'keyin tuzating.',
    body: '14 kun ichida hisobot tayyor. 50% boshida, 50% prezentatsiyada. Foydali tavsiya topilmasa —',
    bodyStrong: '100% pulni qaytaramiz.',
    cta: 'Bepul mini-tashxis olish ↗',
    stats: [
      { k: 'Bu oyda', v: '4', s: '/6 joy qoldi' },
      { k: 'Tashxis muddati', v: '14', s: ' kun ichida' },
      { k: 'Mini-tashxis', v: '30', s: ' daqiqa' },
    ],
  },
  ru: {
    badge: 'Готовы начать?',
    h2a: 'Диагностика —',
    h2b: 'потом исправление.',
    body: 'Отчёт за 14 дней. 50% предоплата, 50% на презентации. Если полезных рекомендаций нет —',
    bodyStrong: 'вернём 100%.',
    cta: 'Бесплатная мини-диагностика ↗',
    stats: [
      { k: 'В этом месяце', v: '4', s: '/6 мест' },
      { k: 'Срок диагностики', v: '14', s: ' дней' },
      { k: 'Мини-диагностика', v: '30', s: ' мин' },
    ],
  },
  en: {
    badge: 'Ready to start?',
    h2a: 'Diagnose first —',
    h2b: 'then fix.',
    body: 'Report ready in 14 days. 50% upfront, 50% at presentation. If no useful recommendations found —',
    bodyStrong: '100% money back.',
    cta: 'Free mini-diagnosis ↗',
    stats: [
      { k: 'This month', v: '4', s: '/6 spots left' },
      { k: 'Diagnosis timeline', v: '14', s: ' days' },
      { k: 'Mini-diagnosis', v: '30', s: ' min' },
    ],
  },
  zh: {
    badge: '准备好开始了吗？',
    h2a: '先诊断 —',
    h2b: '再修复。',
    body: '14天内报告准备好。50%预付款，50%在演示时支付。如果没有找到有用的建议 —',
    bodyStrong: '100%退款。',
    cta: '免费迷你诊断 ↗',
    stats: [
      { k: '本月', v: '4', s: '/6个名额' },
      { k: '诊断时限', v: '14', s: ' 天' },
      { k: '迷你诊断', v: '30', s: ' 分钟' },
    ],
  },
} as const;

export default function AtFinalCta({ onOpen, lang = 'uz' }: Props) {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--at-ink)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(27,77,255,0.18) 0%, transparent 70%)' }} />
      <div className="relative max-w-[1320px] mx-auto px-8 sm:px-5 text-center">
        <div className="inline-block mb-6 px-4 py-2 rounded-full text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(244,241,232,.5)', border: '1px solid rgba(244,241,232,.12)' }}>{l.badge}</div>
        <h2 className="font-bold leading-none mb-8" style={{ fontSize: 'clamp(48px, 7vw, 112px)', letterSpacing: '-0.04em', color: 'var(--at-bg)' }}>
          {l.h2a}<br />
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>{l.h2b}</span>
        </h2>
        <p className="mx-auto mb-10 text-lg leading-relaxed" style={{ maxWidth: 520, color: 'rgba(244,241,232,.65)' }}>
          {l.body}{' '}
          <strong style={{ color: 'var(--at-bg)' }}>{l.bodyStrong}</strong>
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <button onClick={onOpen} className="inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5" style={{ padding: '17px 28px', fontSize: 16, background: 'var(--at-accent)', color: '#fff', boxShadow: '0 18px 40px -10px rgba(27,77,255,0.45)' }}>
            {l.cta}
          </button>
          <a href="mailto:salom@jonbranding.uz" className="inline-flex items-center gap-2 font-semibold rounded-full" style={{ padding: '17px 28px', fontSize: 16, color: 'var(--at-bg)', border: '1px solid rgba(244,241,232,.25)' }}>
            salom@jonbranding.uz
          </a>
        </div>
        <div className="flex flex-wrap gap-8 justify-center" style={{ borderTop: '1px solid rgba(244,241,232,.1)', paddingTop: 32 }}>
          {l.stats.map((m, i) => (
            <div key={i} className="text-center">
              <div className="mb-1 uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(244,241,232,.4)' }}>{m.k}</div>
              <div className="font-bold" style={{ fontSize: 22, color: 'var(--at-bg)' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--at-accent)' }}>{m.v}</span>{m.s}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
