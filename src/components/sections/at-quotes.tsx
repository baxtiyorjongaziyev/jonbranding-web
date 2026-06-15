const quotes = [
  { q: "Logotip chizdirdik. 3 oyda sotuv 41% oshdi. Buni kutmagan edim — biz shunchaki ko'rinishni o'zgartirdik.", who: "Sardor Ro'ziyev", role: "Qumri Coffee, asoschi", result: "+41% sotuv" },
  { q: "Raqibimiz bizning nomni o'ziga olmoqchi bo'ldi. Jon o'sha paytda saqlab qoldi — aks holda hamma narsani yo'qotardik.", who: "Malika Karimova", role: "Oltin Bulut, marketing direktor", result: "Nom himoyalandi" },
  { q: "Supermarket javonida yangi qadoqdan keyin mahsulotimiz 2 barobar ko'proq ko'rindi. Sotuv ham shu bilan oshdi.", who: "Rustam Xolmatov", role: "Nur Sopol, asoschi", result: "2× ko'rinish" },
  { q: "6 oy ichida 3 ta raqibimiz yopildi. Biz hali ham ishlaymiz. Farq faqat ko'rinishda edi.", who: "Bekzod Aliyev", role: "Humo, rahbar", result: "Bozorda qoldik" },
];

export default function AtQuotes() {
  return (
    <section className="py-16 md:py-24 border-t border-[var(--at-line)]" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-16 mb-12">
          <h2 className="font-bold leading-none" style={{ fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}>
            Mijozlar<br />
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>o&apos;z so&apos;zlari bilan.</span>
          </h2>
          <p className="self-end" style={{ color: 'var(--at-ink-2)', fontSize: 16, lineHeight: 1.65 }}>
            Har bir gap real biznes egasidan, real loyiha haqida.{' '}
            <strong style={{ color: 'var(--at-ink)' }}>Yolg&apos;on yoki bo&apos;rttirma yo&apos;q</strong> — tekshirishingiz mumkin.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {quotes.map((q,i)=>(
            <div key={i} className="flex flex-col justify-between gap-8 p-7 rounded-2xl" style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)' }}>
              <div>
                <div className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 48, lineHeight: 1, color: 'var(--at-line)' }}>&#8220;</div>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--at-ink)' }}>{q.q}</p>
              </div>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--at-ink)' }}>{q.who}</div>
                  <div style={{ fontSize: 13, color: 'var(--at-muted)', fontFamily: 'var(--font-mono)' }}>{q.role}</div>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--at-green-soft)', color: 'var(--at-green)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{q.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
