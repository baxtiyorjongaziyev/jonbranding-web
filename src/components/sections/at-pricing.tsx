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
        id: 'audit',
        label: 'Brand Audit',
        price: 'Bepul',
        sub: "150$ o'rniga bepul · 1 kun",
        badge: 'Tavsiya etiladi',
        featured: true,
        items: [
          "12 mezon bo'yicha to'liq audit",
          "30—50 betlik PDF hisobot",
          "Yo'qotilgan daromad hisobi",
          "90 kunlik harakat rejasi",
          "1 soatlik prezentatsiya",
          "Hech qanday majburiyatsiz",
        ],
        cta: 'Bepul audit olish ↗',
        isFree: true,
      },
      {
        id: 'aydentika',
        label: 'Visual System',
        price: '10M+',
        sub: "so'mdan boshlab · 3-4 hafta",
        badge: null,
        featured: false,
        items: [
          "Logotip va aydentika dizayni",
          "Ranglar palitrasi va tipografika",
          "Brendbuk (40+ betlik qo'llanma)",
          "Real misollarda qo'llash tizimi",
          "Barcha manbalar (Vector fayllar)",
        ],
        cta: 'Loyiha boshlash ↗',
        isFree: false,
      },
      {
        id: 'full_branding',
        label: 'Full Branding',
        price: '28M+',
        sub: "so'mdan boshlab · 6-8 hafta",
        badge: 'Eng mukammal yechim',
        featured: false,
        items: [
          "Neyming (Bozorda farqlanuvchi nom)",
          "Aydentika va Tovar belgisi",
          "Premium Qadoq dizayni (SKU tizimi)",
          "Sotuvchi Veb-sayt (Sales Machine)",
          "3 oy kuratorlik va strategiya",
        ],
        cta: 'Murojaat qilish ↗',
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
        id: 'audit',
        label: 'Бренд-Аудит',
        price: 'Бесплатно',
        sub: 'вместо $150 · 1 день',
        badge: 'Рекомендуется',
        featured: true,
        items: [
          'Полный аудит по 12 критериям',
          'PDF-отчет на 30–50 страниц',
          'Расчет упущенной прибыли',
          'План действий на 90 дней',
          '1-часовая презентация',
          'Без каких-либо обязательств',
        ],
        cta: 'Получить аудит бесплатно ↗',
        isFree: true,
      },
      {
        id: 'aydentika',
        label: 'Visual System',
        price: '10M+',
        sub: 'от сум · 3-4 недели',
        badge: null,
        featured: false,
        items: [
          'Дизайн логотипа и айдентики',
          'Цветовая палитра и типографика',
          'Брендбук (40+ страниц руководства)',
          'Система применения на практике',
          'Все исходные файлы (вектор)',
        ],
        cta: 'Начать проект ↗',
        isFree: false,
      },
      {
        id: 'full_branding',
        label: 'Full Branding',
        price: '28M+',
        sub: 'от сум · 6-8 недель',
        badge: 'Лучшее решение',
        featured: false,
        items: [
          'Нейминг (выделяющееся имя)',
          'Айдентика и Товарный знак',
          'Премиум дизайн упаковки (SKU)',
          'Продающий веб-сайт (Sales Machine)',
          '3 месяца кураторства и стратегия',
        ],
        cta: 'Связаться ↗',
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
        id: 'audit',
        label: 'Brand Audit',
        price: 'Free',
        sub: 'instead of $150 · 1 day',
        badge: 'Recommended',
        featured: true,
        items: [
          'Full audit across 12 criteria',
          '30–50 page PDF report',
          'Lost revenue calculation',
          '90-day action plan',
          '1-hour presentation session',
          'No obligations whatsoever',
        ],
        cta: 'Get Free Audit ↗',
        isFree: true,
      },
      {
        id: 'aydentika',
        label: 'Visual System',
        price: '10M+',
        sub: 'from UZS · 3-4 weeks',
        badge: null,
        featured: false,
        items: [
          'Logo & visual identity design',
          'Color palette & typography',
          'Brandbook (40+ pages guide)',
          'Practical application system',
          'All source files (vector format)',
        ],
        cta: 'Start Project ↗',
        isFree: false,
      },
      {
        id: 'full_branding',
        label: 'Full Branding',
        price: '28M+',
        sub: 'from UZS · 6-8 weeks',
        badge: 'Complete Solution',
        featured: false,
        items: [
          'Naming (distinct & memorable name)',
          'Identity & Trademark registration',
          'Premium Packaging design (SKU)',
          'Conversion-driven site (Sales Machine)',
          '3 months curation & strategy',
        ],
        cta: 'Get in Touch ↗',
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
        id: 'audit',
        label: '品牌审计',
        price: '免费',
        sub: '原价 $150 · 1天完成',
        badge: '推荐首选',
        featured: true,
        items: [
          '基于12项标准的全面审计',
          '30-50页的详细PDF报告',
          '流失利润精确计算',
          '90天落地执行行动计划',
          '1小时现场或线上演示',
          '无任何强制绑定条件',
        ],
        cta: '免费获取审计报告 ↗',
        isFree: true,
      },
      {
        id: 'aydentika',
        label: '视觉系统',
        price: '10M+',
        sub: '乌币起 · 3-4周',
        badge: null,
        featured: false,
        items: [
          '标志及视觉识别系统设计',
          '专属色彩板及字体规范体系',
          '品牌规范手册（40多页指南）',
          '实际场景应用落地系统',
          '提供全部矢量格式源文件',
        ],
        cta: '启动项目 ↗',
        isFree: false,
      },
      {
        id: 'full_branding',
        label: '全案品牌建设',
        price: '28M+',
        sub: '乌币起 · 6-8周',
        badge: '最完善的解决方案',
        featured: false,
        items: [
          '品牌命名（独特且易记）',
          '视觉识别与商标合规化注册',
          '高端包装线系统设计（SKU）',
          '转化型营销网站（销售机器）',
          '3个月的战略落地指导与跟进',
        ],
        cta: '获取咨询 ↗',
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
