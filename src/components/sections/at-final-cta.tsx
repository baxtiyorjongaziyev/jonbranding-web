interface Props { onOpen: () => void; }

export default function AtFinalCta({ onOpen }: Props) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--at-ink)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(27,77,255,0.18) 0%, transparent 70%)' }} />
      <div className="relative max-w-[1320px] mx-auto px-8 sm:px-5 text-center">
        <div className="inline-block mb-6 px-4 py-2 rounded-full text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(244,241,232,.5)', border: '1px solid rgba(244,241,232,.12)' }}>Boshlashga tayyormisiz?</div>
        <h2 className="font-bold leading-none mb-8" style={{ fontSize: 'clamp(48px, 7vw, 112px)', letterSpacing: '-0.04em', color: 'var(--at-bg)' }}>
          Tashxis qiling —<br />
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>keyin tuzating.</span>
        </h2>
        <p className="mx-auto mb-10 text-lg leading-relaxed" style={{ maxWidth: 520, color: 'rgba(244,241,232,.65)' }}>
          14 kun ichida hisobot tayyor. 50% boshida, 50% prezentatsiyada. Foydali tavsiya topilmasa —{' '}
          <strong style={{ color: 'var(--at-bg)' }}>100% pulni qaytaramiz.</strong>
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <button onClick={onOpen} className="inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5" style={{ padding: '17px 28px', fontSize: 16, background: 'var(--at-accent)', color: '#fff', boxShadow: '0 18px 40px -10px rgba(27,77,255,0.45)' }}>
            Bepul mini-tashxis olish ↗
          </button>
          <a href="mailto:salom@jonbranding.uz" className="inline-flex items-center gap-2 font-semibold rounded-full" style={{ padding: '17px 28px', fontSize: 16, color: 'var(--at-bg)', border: '1px solid rgba(244,241,232,.25)' }}>
            salom@jonbranding.uz
          </a>
        </div>
        <div className="flex flex-wrap gap-8 justify-center" style={{ borderTop: '1px solid rgba(244,241,232,.1)', paddingTop: 32 }}>
          {[{ k: 'Bu oyda', v: '4', s: '/6 joy qoldi' },{ k: 'Tashxis muddati', v: '14', s: ' kun ichida' },{ k: 'Mini-tashxis', v: '30', s: ' daqiqa' }].map((m,i)=>(
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
