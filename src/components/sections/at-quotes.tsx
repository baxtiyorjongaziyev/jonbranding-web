type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { lang?: string; }

const t = {
  uz: {
    heading: 'Mijozlar',
    headingEm: "o'z so'zlari bilan.",
    sub: "Har bir gap real biznes egasidan, real loyiha haqida.",
    subStrong: "Yolg'on yoki bo'rttirma yo'q",
    subEnd: "— tekshirishingiz mumkin.",
    quotes: [
      { q: "Logotip chizdirdik. 3 oyda sotuv 41% oshdi. Buni kutmagan edim — biz shunchaki ko'rinishni o'zgartirdik.", who: "Sardor Ro'ziyev", role: "Qumri Coffee, asoschi", result: "+41% sotuv" },
      { q: "Raqibimiz bizning nomni o'ziga olmoqchi bo'ldi. Jon o'sha paytda saqlab qoldi — aks holda hamma narsani yo'qotardik.", who: "Malika Karimova", role: "Oltin Bulut, marketing direktor", result: "Nom himoyalandi" },
      { q: "Supermarket javonida yangi qadoqdan keyin mahsulotimiz 2 barobar ko'proq ko'rindi. Sotuv ham shu bilan oshdi.", who: "Rustam Xolmatov", role: "Nur Sopol, asoschi", result: "2× ko'rinish" },
      { q: "6 oy ichida 3 ta raqibimiz yopildi. Biz hali ham ishlaymiz. Farq faqat ko'rinishda edi.", who: "Bekzod Aliyev", role: "Humo, rahbar", result: "Bozorda qoldik" },
    ],
  },
  ru: {
    heading: 'Клиенты',
    headingEm: 'своими словами.',
    sub: 'Каждое слово от реального владельца бизнеса, о реальном проекте.',
    subStrong: 'Никакой лжи и преувеличений',
    subEnd: '— можете проверить.',
    quotes: [
      { q: "Заказали логотип. За 3 месяца продажи выросли на 41%. Я не ожидал — мы просто изменили внешний вид.", who: "Sardor Ro'ziyev", role: "Qumri Coffee, основатель", result: "+41% продаж" },
      { q: "Конкурент хотел присвоить наше название. Jon спасли нас тогда — иначе мы бы потеряли всё.", who: "Malika Karimova", role: "Oltin Bulut, директор по маркетингу", result: "Название защищено" },
      { q: "После новой упаковки наш продукт стал в 2 раза заметнее на полке супермаркета. Продажи выросли вместе с этим.", who: "Rustam Xolmatov", role: "Nur Sopol, основатель", result: "2× видимость" },
      { q: "За 6 месяцев закрылись 3 наших конкурента. Мы всё ещё работаем. Разница была только во внешнем виде.", who: "Bekzod Aliyev", role: "Humo, руководитель", result: "Остались на рынке" },
    ],
  },
  en: {
    heading: 'Clients',
    headingEm: 'in their own words.',
    sub: 'Every quote from a real business owner, about a real project.',
    subStrong: 'No fabrications or exaggerations',
    subEnd: '— you can verify.',
    quotes: [
      { q: "We got a logo. Sales up 41% in 3 months. Didn't expect that — we just changed the look.", who: "Sardor Ro'ziyev", role: "Qumri Coffee, founder", result: "+41% sales" },
      { q: "A competitor tried to steal our brand name. Jon saved us then — otherwise we'd have lost everything.", who: "Malika Karimova", role: "Oltin Bulut, marketing director", result: "Name protected" },
      { q: "After new packaging, our product was 2× more visible on the supermarket shelf. Sales followed.", who: "Rustam Xolmatov", role: "Nur Sopol, founder", result: "2× visibility" },
      { q: "In 6 months, 3 competitors shut down. We're still running. The difference was only in appearance.", who: "Bekzod Aliyev", role: "Humo, director", result: "Stayed in market" },
    ],
  },
  zh: {
    heading: '客户',
    headingEm: '用自己的话说。',
    sub: '每句话来自真实的企业主，关于真实的项目。',
    subStrong: '没有谎言或夸大其词',
    subEnd: '——您可以核实。',
    quotes: [
      { q: "我们设计了一个标志。3个月内销售额增长了41%。这出乎我的意料——我们只是改变了外观。", who: "Sardor Ro'ziyev", role: "Qumri Coffee，创始人", result: "+41%销售额" },
      { q: "竞争对手想窃取我们的品牌名称。Jon当时拯救了我们——否则我们会失去一切。", who: "Malika Karimova", role: "Oltin Bulut，市场总监", result: "名称已保护" },
      { q: "新包装后，我们的产品在超市货架上的可见度提高了2倍。销售额也随之增长。", who: "Rustam Xolmatov", role: "Nur Sopol，创始人", result: "2×可见度" },
      { q: "6个月内，3个竞争对手关闭了。我们仍在运营。区别只在于外观。", who: "Bekzod Aliyev", role: "Humo，负责人", result: "留在市场" },
    ],
  },
} as const;

export default function AtQuotes({ lang = 'uz' }: Props) {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section className="py-16 md:py-24 border-t border-[var(--at-line)]" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-16 mb-12">
          <h2 className="font-bold leading-none" style={{ fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}>
            {l.heading}<br />
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>{l.headingEm}</span>
          </h2>
          <p className="self-end" style={{ color: 'var(--at-ink-2)', fontSize: 16, lineHeight: 1.65 }}>
            {l.sub}{' '}
            <strong style={{ color: 'var(--at-ink)' }}>{l.subStrong}</strong>{' '}{l.subEnd}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {l.quotes.map((q, i) => (
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
