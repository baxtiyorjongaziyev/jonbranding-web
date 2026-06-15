'use client';

interface Props {
  onOpen: () => void;
}

const plans = [
  {
    id: 'tezkor',
    label: 'Tezkor',
    price: 'Bepul',
    sub: '30 daqiqa · Onlayn',
    badge: null,
    featured: false,
    items: [
      '30 daqiqalik suhbat',
      'Eng katta 3 ta zaif nuqta',
      'Og\'zaki tavsiyalar',
      'Keyingi qadam rejasi',
    ],
    cta: 'Bepul boshlash',
  },
  {
    id: 'toliq',
    label: "To'liq tashxis",
    price: '4.8M',
    sub: "so'm · 14 kun",
    badge: '87% mijoz tanlaydi',
    featured: true,
    items: [
      '12 mezon bo\'yicha audit',
      '48 betlik PDF hisobot',
      'Yo\'qotilgan daromad hisob-kitobi',
      '90 kunlik harakat rejasi',
      'Prezentatsiya + Q&A sessiya',
      'Huquqiy himoya tekshiruvi',
    ],
    cta: 'Buyurtma berish',
  },
  {
    id: 'strategik',
    label: "Tashxis + Yo'l xaritasi",
    price: '12M',
    sub: "so'm · 4 hafta",
    badge: null,
    featured: false,
    items: [
      "To'liq tashxis (barcha yuqoridagilar)",
      '3 yillik brend strategiyasi',
      'Kompetitor xaritasi',
      'Biznes modeli tahlili',
      'Investor briefi uchun tayyor',
    ],
    cta: 'Murojaat qilish',
  },
];

const guarantees = [
  '100% kafolat — foydali tavsiya bo\'lmasa, pul qaytadi',
  'Kechikish bo\'lmaydi — har kun kechiksa 10% chegirma',
  'Maxfiylik — NDA imzolash ixtiyoriy',
];

export default function AtPricing({ onOpen }: Props) {
  return (
    <section className="py-16 md:py-24" id="narxlar" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div
              className="inline-flex items-center gap-2 mb-4"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
            >
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 06</span>
              <span>Narxlar</span>
            </div>
            <h2
              className="font-bold leading-none"
              style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
            >
              Investitsiya,{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
                natija.
              </span>
            </h2>
          </div>
          <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 320 }}>
            Iyul oyida faqat 4 ta joy. Hozir band qiling — kechiktirsangiz narx o'zgarishi mumkin.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {plans.map((p) => (
            <div
              key={p.id}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: p.featured ? 'var(--at-ink)' : 'var(--at-paper)',
                border: p.featured ? '2px solid var(--at-accent)' : '1px solid var(--at-line)',
              }}
            >
              {p.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  style={{ background: 'var(--at-accent)', color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
                >
                  {p.badge}
                </div>
              )}

              <div className="mb-6">
                <div
                  className="text-xs font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: p.featured ? 'var(--at-accent)' : 'var(--at-muted)' }}
                >
                  {p.label}
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-bold"
                    style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.03em', color: p.featured ? '#fff' : 'var(--at-ink)' }}
                  >
                    {p.price}
                  </span>
                  {p.price !== 'Bepul' && (
                    <span style={{ fontSize: 13, color: p.featured ? 'rgba(244,241,232,.5)' : 'var(--at-muted)' }}>{p.sub}</span>
                  )}
                </div>
                {p.price === 'Bepul' && (
                  <div style={{ fontSize: 13, color: p.featured ? 'rgba(244,241,232,.5)' : 'var(--at-muted)' }}>{p.sub}</div>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                {p.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: p.featured ? 'rgba(244,241,232,.75)' : 'var(--at-ink-2)' }}>
                    <span className="mt-0.5 shrink-0" style={{ color: p.featured ? 'var(--at-green)' : 'var(--at-green)', fontSize: 12 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpen}
                className="w-full font-semibold text-sm rounded-full py-3.5 transition-all hover:opacity-90"
                style={{
                  background: p.featured ? 'var(--at-accent)' : 'transparent',
                  color: p.featured ? '#fff' : 'var(--at-ink)',
                  border: p.featured ? 'none' : '1px solid var(--at-line)',
                }}
              >
                {p.cta} →
              </button>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div
          className="rounded-2xl p-6 grid md:grid-cols-3 gap-4"
          style={{ background: 'var(--at-green-soft)', border: '1px solid var(--at-green)' }}
        >
          {guarantees.map((g, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--at-ink)' }}>
              <span style={{ color: 'var(--at-green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
              {g}
            </div>
          ))}
        </div>

        {/* Payment strip */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span style={{ fontSize: 12, color: 'var(--at-muted)', fontFamily: 'var(--font-mono)' }}>To'lov usullari:</span>
          {['Payme', 'Click', 'Bank o\'tkazmasi'].map((m) => (
            <span
              key={m}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}
            >
              {m}
            </span>
          ))}
          <span style={{ fontSize: 12, color: 'var(--at-muted)', marginLeft: 'auto' }}>Yuridik shaxs uchun shartnoma ✓</span>
        </div>
      </div>
    </section>
  );
}
