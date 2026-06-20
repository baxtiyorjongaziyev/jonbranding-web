'use client';

interface Props {
  onOpen: () => void;
  lang?: string;
}

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const translations = {
  uz: {
    sectionLabel: 'Narxlar',
    heading: 'Investitsiya,',
    headingEm: 'natija.',
    subtext: "Iyul oyida faqat 4 ta joy. Hozir band qiling — kechiktirsangiz narx o'zgarishi mumkin.",
    paymentLabel: "To'lov usullari:",
    paymentLegal: "Yuridik shaxs uchun shartnoma ✓",
    payments: ['Payme', 'Click', "Bank o'tkazmasi"],
    plans: [
      {
        id: 'tezkor',
        label: 'Tezkor',
        price: 'Bepul',
        sub: '30 daqiqa · Onlayn',
        badge: null,
        featured: false,
        items: [
          '30 daqiqalik suhbat',
          "Eng katta 3 ta zaif nuqta",
          "Og'zaki tavsiyalar",
          'Keyingi qadam rejasi',
        ],
        cta: 'Bepul boshlash',
        isFree: true,
      },
      {
        id: 'toliq',
        label: "To'liq tashxis",
        price: '4.8M',
        sub: "so'm · 14 kun",
        badge: '87% mijoz tanlaydi',
        featured: true,
        items: [
          "12 mezon bo'yicha audit",
          '48 betlik PDF hisobot',
          "Yo'qotilgan daromad hisob-kitobi",
          '90 kunlik harakat rejasi',
          'Prezentatsiya + Q&A sessiya',
          'Huquqiy himoya tekshiruvi',
        ],
        cta: 'Buyurtma berish',
        isFree: false,
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
        isFree: false,
      },
    ],
    guarantees: [
      "100% kafolat — foydali tavsiya bo'lmasa, pul qaytadi",
      "Kechikish bo'lmaydi — har kun kechiksa 10% chegirma",
      'Maxfiylik — NDA imzolash ixtiyoriy',
    ],
  },
  ru: {
    sectionLabel: 'Цены',
    heading: 'Инвестиция,',
    headingEm: 'результат.',
    subtext: 'Только 4 места в июле. Бронируйте сейчас — цены могут измениться.',
    paymentLabel: 'Способы оплаты:',
    paymentLegal: 'Договор для юридических лиц ✓',
    payments: ['Payme', 'Click', 'Банковский перевод'],
    plans: [
      {
        id: 'tezkor',
        label: 'Экспресс',
        price: 'Бесплатно',
        sub: '30 мин · Онлайн',
        badge: null,
        featured: false,
        items: [
          '30-минутная беседа',
          '3 главных слабых места',
          'Устные рекомендации',
          'План следующего шага',
        ],
        cta: 'Начать бесплатно',
        isFree: true,
      },
      {
        id: 'toliq',
        label: 'Полная диагностика',
        price: '4.8M',
        sub: 'сум · 14 дней',
        badge: '87% клиентов выбирают',
        featured: true,
        items: [
          'Аудит по 12 критериям',
          'PDF-отчёт 48 страниц',
          'Расчёт упущенной прибыли',
          'План действий на 90 дней',
          'Презентация + сессия Q&A',
          'Проверка правовой защиты',
        ],
        cta: 'Заказать',
        isFree: false,
      },
      {
        id: 'strategik',
        label: 'Диагностика + Дорожная карта',
        price: '12M',
        sub: 'сум · 4 недели',
        badge: null,
        featured: false,
        items: [
          'Полная диагностика (всё выше)',
          'Бренд-стратегия на 3 года',
          'Карта конкурентов',
          'Анализ бизнес-модели',
          'Готово для инвестиционного брифа',
        ],
        cta: 'Связаться',
        isFree: false,
      },
    ],
    guarantees: [
      'Гарантия 100% — если рекомендации не помогут, деньги вернём',
      'Без задержек — каждый день просрочки = скидка 10%',
      'Конфиденциальность — NDA по желанию',
    ],
  },
  en: {
    sectionLabel: 'Pricing',
    heading: 'Investment,',
    headingEm: 'results.',
    subtext: 'Only 4 spots in July. Book now — prices may change if you wait.',
    paymentLabel: 'Payment methods:',
    paymentLegal: 'Contract for legal entities ✓',
    payments: ['Payme', 'Click', 'Bank transfer'],
    plans: [
      {
        id: 'tezkor',
        label: 'Express',
        price: 'Free',
        sub: '30 min · Online',
        badge: null,
        featured: false,
        items: [
          '30-minute consultation',
          'Top 3 weak points',
          'Verbal recommendations',
          'Next step plan',
        ],
        cta: 'Start for free',
        isFree: true,
      },
      {
        id: 'toliq',
        label: 'Full Diagnosis',
        price: '4.8M',
        sub: 'UZS · 14 days',
        badge: '87% clients choose',
        featured: true,
        items: [
          'Audit across 12 criteria',
          '48-page PDF report',
          'Lost revenue calculation',
          '90-day action plan',
          'Presentation + Q&A session',
          'Legal protection check',
        ],
        cta: 'Order now',
        isFree: false,
      },
      {
        id: 'strategik',
        label: 'Diagnosis + Roadmap',
        price: '12M',
        sub: 'UZS · 4 weeks',
        badge: null,
        featured: false,
        items: [
          'Full diagnosis (all above)',
          '3-year brand strategy',
          'Competitor mapping',
          'Business model analysis',
          'Ready for investor brief',
        ],
        cta: 'Get in touch',
        isFree: false,
      },
    ],
    guarantees: [
      "100% guarantee — if recommendations don't help, full refund",
      'No delays — every day late = 10% discount',
      'Confidentiality — NDA optional',
    ],
  },
  zh: {
    sectionLabel: '定价',
    heading: '投资，',
    headingEm: '成效。',
    subtext: '七月份仅剩4个名额。立即预约——等待可能导致价格变动。',
    paymentLabel: '付款方式：',
    paymentLegal: '支持企业签订合同 ✓',
    payments: ['Payme', 'Click', '银行转账'],
    plans: [
      {
        id: 'tezkor',
        label: '快速',
        price: '免费',
        sub: '30分钟 · 在线',
        badge: null,
        featured: false,
        items: [
          '30分钟咨询',
          '3大薄弱环节',
          '口头建议',
          '下一步行动计划',
        ],
        cta: '免费开始',
        isFree: true,
      },
      {
        id: 'toliq',
        label: '全面诊断',
        price: '4.8M',
        sub: '乌元 · 14天',
        badge: '87%客户选择',
        featured: true,
        items: [
          '12项标准审计',
          '48页PDF报告',
          '损失收益计算',
          '90天行动计划',
          '演示 + 问答环节',
          '法律保护检查',
        ],
        cta: '立即预订',
        isFree: false,
      },
      {
        id: 'strategik',
        label: '诊断 + 路线图',
        price: '12M',
        sub: '乌元 · 4周',
        badge: null,
        featured: false,
        items: [
          '全面诊断（以上全部）',
          '3年品牌战略',
          '竞争对手分析',
          '商业模式分析',
          '为投资者简报做好准备',
        ],
        cta: '联系我们',
        isFree: false,
      },
    ],
    guarantees: [
      '100%保证——如果建议无效，全额退款',
      '无延迟——每延迟一天优惠10%',
      '保密性——可选签署保密协议',
    ],
  },
} as const;

export default function AtPricing({ onOpen, lang = 'uz' }: Props) {
  const l = translations[(lang as Lang) in translations ? (lang as Lang) : 'uz'];

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
              <span>{l.sectionLabel}</span>
            </div>
            <h2
              className="font-bold leading-none"
              style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
            >
              {l.heading}{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
                {l.headingEm}
              </span>
            </h2>
          </div>
          <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 320 }}>
            {l.subtext}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {l.plans.map((p) => (
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
                  {!p.isFree && (
                    <span style={{ fontSize: 13, color: p.featured ? 'rgba(244,241,232,.5)' : 'var(--at-muted)' }}>{p.sub}</span>
                  )}
                </div>
                {p.isFree && (
                  <div style={{ fontSize: 13, color: p.featured ? 'rgba(244,241,232,.5)' : 'var(--at-muted)' }}>{p.sub}</div>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                {p.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: p.featured ? 'rgba(244,241,232,.75)' : 'var(--at-ink-2)' }}>
                    <span className="mt-0.5 shrink-0" style={{ color: 'var(--at-green)', fontSize: 12 }}>✓</span>
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
          {l.guarantees.map((g, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--at-ink)' }}>
              <span style={{ color: 'var(--at-green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
              {g}
            </div>
          ))}
        </div>

        {/* Payment strip */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span style={{ fontSize: 12, color: 'var(--at-muted)', fontFamily: 'var(--font-mono)' }}>{l.paymentLabel}</span>
          {l.payments.map((m) => (
            <span
              key={m}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)', color: 'var(--at-ink)' }}
            >
              {m}
            </span>
          ))}
          <span style={{ fontSize: 12, color: 'var(--at-muted)', marginLeft: 'auto' }}>{l.paymentLegal}</span>
        </div>
      </div>
    </section>
  );
}
