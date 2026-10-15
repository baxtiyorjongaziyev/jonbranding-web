import { getSalesFlow } from '@/lib/sales-flow';

interface Props { onOpen: () => void; lang?: string; }

export default function AtFinalCta({ onOpen, lang = 'uz' }: Props) {
  const l = getSalesFlow(lang).final;
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#08090C] border-t border-white/10">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,84,255,0.2) 0%, transparent 70%)' }} />
      <div className="relative max-w-[1320px] mx-auto px-8 sm:px-5 text-center">
        <div className="inline-block mb-6 px-4 py-2 rounded-full text-xs tracking-widest uppercase font-[family-name:var(--font-mono)] text-white/50 border border-white/10">{l.badge}</div>
        <h2 className="font-bold leading-none mb-8 text-white" style={{ fontSize: 'clamp(48px, 7vw, 112px)', letterSpacing: '-0.04em' }}>
          {l.h2a}<br />
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>{l.h2b}</span>
        </h2>
        <p className="mx-auto mb-10 text-lg leading-relaxed text-white/70" style={{ maxWidth: 520 }}>
          {l.body}{' '}
          <strong className="text-white font-semibold">{l.bodyStrong}</strong>
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <button onClick={onOpen} className="inline-flex items-center gap-2 font-semibold rounded-full px-8 py-4 text-base bg-[#2554FF] hover:bg-[#1C46E6] text-white shadow-[0_18px_40px_-10px_rgba(37,84,255,0.45)] transition-all hover:-translate-y-0.5">
            {l.cta}
          </button>
          <a href="mailto:salom@jonbranding.uz" className="inline-flex items-center gap-2 font-semibold rounded-full px-8 py-4 text-base text-white/90 border border-white/20 hover:border-white/40 hover:bg-white/[0.04] transition-all">
            salom@jonbranding.uz
          </a>
        </div>
        <div className="flex flex-wrap gap-8 justify-center border-t border-white/10 pt-8">
          {l.stats.map((m, i) => (
            <div key={i} className="text-center">
              <div className="mb-1 uppercase tracking-widest font-[family-name:var(--font-mono)] text-[10px] text-white/40">{m.k}</div>
              <div className="font-bold text-[22px] text-white">
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--at-accent)' }}>{m.v}</span>{m.s}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
