'use client';

interface Props {
  onOpen: () => void;
}

const chapters = [
  { n: '01', title: 'Ijroiya xulosasi', pages: '3–5' },
  { n: '02', title: 'Vizual identifikatsiya auditi', pages: '6–14' },
  { n: '03', title: 'Raqamli mavjudlik tahlili', pages: '15–22' },
  { n: '04', title: 'Raqobat matritsasi', pages: '23–30' },
  { n: '05', title: "Yo'qotilgan daromad hisob-kitobi", pages: '31–38' },
  { n: '06', title: '90 kunlik harakat rejasi', pages: '39–48' },
];

const bars = [
  { label: "O'qish", score: 82, color: 'var(--at-green)' },
  { label: 'Esda qolish', score: 64, color: 'var(--at-accent)' },
  { label: 'Farqlanish', score: 38, color: 'var(--at-terra)' },
  { label: 'Masshtablanish', score: 91, color: 'var(--at-green)' },
  { label: 'Konseptual', score: 55, color: 'var(--at-accent)' },
];

const recs = [
  { dot: 'var(--at-terra)', text: 'Logotip versiyalarini birlashtirish zarur' },
  { dot: 'var(--at-accent)', text: "Raqamli kanallar uchun adaptatsiya yo'q" },
  { dot: 'var(--at-green)', text: 'Brand voice hujjati yaratish tavsiya etiladi' },
];

export default function AtSampleReport({ onOpen }: Props) {
  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        <div className="grid md:grid-cols-[320px_1fr] gap-12 md:gap-20 items-start">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-5"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
            >
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 05</span>
              <span>Namuna hisobot</span>
            </div>
            <h2
              className="font-bold leading-none mb-5"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
            >
              Nima olasiz —{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
                ko'ring.
              </span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 300, marginBottom: 28 }}>
              48 betlik PDF hisobot: har bir mezon bo'yicha ball, yo'qotish hisob-kitobi va 90 kunlik aniq reja.
            </p>

            {/* TOC */}
            <div className="flex flex-col gap-0" style={{ borderTop: '1px solid var(--at-line)' }}>
              {chapters.map((c) => (
                <div key={c.n} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--at-line)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', minWidth: 20 }}>{c.n}</span>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--at-ink)' }}>{c.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)' }}>{c.pages}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpen}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-sm rounded-full px-5 py-3 transition-colors"
              style={{ border: '1px solid var(--at-line)', background: 'var(--at-paper)', color: 'var(--at-ink)' }}
            >
              Namuna so'rash <span style={{ color: 'var(--at-accent)' }}>↗</span>
            </button>
          </div>

          {/* Right: PDF mockup */}
          <div className="flex gap-4">
            {/* Cover */}
            <div
              className="flex-none w-44 md:w-52 rounded-xl p-5 flex flex-col justify-between"
              style={{ background: 'var(--at-ink)', minHeight: 320, aspectRatio: '1/1.41' }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(244,241,232,.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32 }}>
                  Brend Tashxisi · To'liq
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
                  68<span style={{ fontSize: 18, fontWeight: 400, opacity: 0.4 }}>/100</span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--at-terra)', marginTop: 4 }}>
                  O'rta daraja
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(244,241,232,.5)', marginBottom: 4 }}>Mijoz</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>Qumri Coffee.</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(244,241,232,.3)', marginTop: 8 }}>2024 · Jon Atelier</div>
              </div>
            </div>

            {/* Inner page */}
            <div
              className="flex-1 rounded-xl p-5 flex flex-col gap-4"
              style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)', minHeight: 320 }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                §02 · Vizual identifikatsiya
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {bars.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: 12, color: 'var(--at-ink-2)' }}>{b.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-ink)', fontWeight: 600 }}>{b.score}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--at-line)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${b.score}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid var(--at-line)' }}>
                {recs.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.dot }} />
                    <span style={{ fontSize: 11, color: 'var(--at-ink-2)', lineHeight: 1.4 }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
