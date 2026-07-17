'use client';
import type { FC } from 'react';
import Image from 'next/image';
import AtRatings from '@/components/sections/at-ratings';

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    founderLabel: 'Asoschi',
    founderName: 'Baxtiyorjon Gaziyev',
    founderTitle: 'Asoschi va Bosh Dizayner',
    founderQuote: "Brend — bu faqat ko'rinish emas. Bu biznesingiz nima haqida gapirishi. Biz shu gapni to'g'ri shakllantiramiz.",
    founderSince: '2019 yildan',
    sectionN: '§ 01',
    label: 'Haqimizda',
    heading: 'Brendning',
    headingEm: 'kuchini',
    headingEnd: 'biz yaratamiz.',
    subtext: "2019 yildan Markaziy Osiyodagi premium brending agentligi. Biznes identifikatsiyasini yaratish — bu faqat dizayn emas, bu strategiya.",
    stats: [
      { n: '7+', l: 'Yil tajriba' },
      { n: '120+', l: 'Brend yaratildi' },
      { n: '240+', l: 'Loyiha tugallandi' },
      { n: '4', l: 'Til (uz/ru/en/zh)' },
    ],
    missionLabel: 'Missiyamiz',
    mission: "Markaziy Osiyodagi har bir biznesga professional brend identifikatsiyasi yaratish imkonini berish. Bizning maqsadimiz — mijoz brendini uzoq muddatli biznes vositasiga aylantirish.",
    valuesLabel: 'Qadriyatlarimiz',
    values: [
      { n: '01', title: 'Sifat', text: "Har bir pixel, har bir qator matn maqsadli. Tasodifiy element yo'q." },
      { n: '02', title: 'Tezlik', text: "14 kun — brend tashxisi. 30 kun — to'liq vizual identifikatsiya." },
      { n: '03', title: 'Shaffoflik', text: "Ish bosqichlari, muddatlar va narxlar oldindan aniq. Yashirin to'lovlar yo'q." },
      { n: '04', title: 'Natija', text: 'Brendingiz bozorda farqlanishi — bizning mas\'uliyatimiz.' },
    ],
    processLabel: 'Qanday ishlaymiz',
    steps: [
      { n: '01', title: 'Online brifing', text: "Loyiha haqida barcha ma'lumot quiz orqali yig'iladi. 10 daqiqa." },
      { n: '02', title: 'Tashxis va taklif', text: 'Brend auditi va aniq taklif — 24 soat ichida.' },
      { n: '03', title: 'Shartnoma', text: "Shartnoma imzolanadi, avans to'lov amalga oshiriladi." },
      { n: '04', title: 'Ishlab chiqarish', text: 'Belgilangan muddat va bosqichlarda. Har bosqich kelishiladi.' },
      { n: '05', title: 'Topshirish', text: 'Barcha fayl formatlari + hujjat + 30 kun kafolat.' },
    ],
    ctaLabel: 'Hamkorlikni boshlash',
    cta: 'Bepul brifing →',
    footerNote: "Jon.Branding Agency · Toshkent, O'zbekiston · +998 33 645 00 97",
  },
  ru: {
    founderLabel: 'Основатель',
    founderName: 'Baxtiyorjon Gaziyev',
    founderTitle: 'Основатель и Главный Дизайнер',
    founderQuote: 'Бренд — это не просто внешний вид. Это то, о чём говорит ваш бизнес. Мы правильно формулируем эту речь.',
    founderSince: 'С 2019 года',
    sectionN: '§ 01',
    label: 'О нас',
    heading: 'Силу',
    headingEm: 'бренда',
    headingEnd: 'создаём мы.',
    subtext: 'Премиум брендинговое агентство Центральной Азии с 2019 года. Создание бренд-идентичности — это не просто дизайн, это стратегия.',
    stats: [
      { n: '7+', l: 'Лет опыта' },
      { n: '120+', l: 'Создано брендов' },
      { n: '240+', l: 'Завершено проектов' },
      { n: '4', l: 'Языка (uz/ru/en/zh)' },
    ],
    missionLabel: 'Наша миссия',
    mission: 'Дать каждому бизнесу Центральной Азии возможность создать профессиональную бренд-идентичность. Наша цель — превратить бренд клиента в долгосрочный бизнес-инструмент.',
    valuesLabel: 'Наши ценности',
    values: [
      { n: '01', title: 'Качество', text: 'Каждый пиксель, каждая строка текста — целенаправленны. Случайных элементов нет.' },
      { n: '02', title: 'Скорость', text: '14 дней — диагностика бренда. 30 дней — полная визуальная идентичность.' },
      { n: '03', title: 'Прозрачность', text: 'Этапы работы, сроки и цены известны заранее. Скрытых платежей нет.' },
      { n: '04', title: 'Результат', text: 'Выделение вашего бренда на рынке — наша ответственность.' },
    ],
    processLabel: 'Как мы работаем',
    steps: [
      { n: '01', title: 'Онлайн брифинг', text: 'Вся информация о проекте собирается через quiz. 10 минут.' },
      { n: '02', title: 'Диагностика и предложение', text: 'Аудит бренда и конкретное предложение — в течение 24 часов.' },
      { n: '03', title: 'Договор', text: 'Подписывается договор, вносится авансовый платёж.' },
      { n: '04', title: 'Производство', text: 'По согласованным срокам и этапам. Каждый этап согласовывается.' },
      { n: '05', title: 'Сдача', text: 'Все форматы файлов + документация + 30 дней гарантии.' },
    ],
    ctaLabel: 'Начать сотрудничество',
    cta: 'Бесплатный брифинг →',
    footerNote: 'Jon.Branding Agency · Ташкент, Узбекистан · +998 33 645 00 97',
  },
  en: {
    founderLabel: 'Founder',
    founderName: 'Baxtiyorjon Gaziyev',
    founderTitle: 'Founder & Chief Designer',
    founderQuote: "A brand is not just about appearance. It's about what your business says. We shape that message right.",
    founderSince: 'Since 2019',
    sectionN: '§ 01',
    label: 'About us',
    heading: 'Brand',
    headingEm: 'power',
    headingEnd: 'is what we build.',
    subtext: "Central Asia's premium branding agency since 2019. Creating brand identity isn't just design — it's strategy.",
    stats: [
      { n: '7+', l: 'Years experience' },
      { n: '120+', l: 'Brands created' },
      { n: '240+', l: 'Projects completed' },
      { n: '4', l: 'Languages (uz/ru/en/zh)' },
    ],
    missionLabel: 'Our mission',
    mission: "To give every business in Central Asia the ability to create professional brand identity. Our goal is to turn the client's brand into a long-term business tool.",
    valuesLabel: 'Our values',
    values: [
      { n: '01', title: 'Quality', text: 'Every pixel, every line of text is purposeful. No accidental elements.' },
      { n: '02', title: 'Speed', text: '14 days — brand diagnostics. 30 days — full visual identity.' },
      { n: '03', title: 'Transparency', text: 'Work stages, timelines and prices are clear upfront. No hidden fees.' },
      { n: '04', title: 'Results', text: 'Making your brand stand out in the market is our responsibility.' },
    ],
    processLabel: 'How we work',
    steps: [
      { n: '01', title: 'Online briefing', text: 'All project info is collected via quiz. 10 minutes.' },
      { n: '02', title: 'Diagnosis & proposal', text: 'Brand audit and specific proposal — within 24 hours.' },
      { n: '03', title: 'Contract', text: 'Contract is signed, advance payment is made.' },
      { n: '04', title: 'Production', text: 'Per agreed timelines and stages. Each stage is approved.' },
      { n: '05', title: 'Delivery', text: 'All file formats + documentation + 30-day warranty.' },
    ],
    ctaLabel: 'Start collaboration',
    cta: 'Free briefing →',
    footerNote: 'Jon.Branding Agency · Tashkent, Uzbekistan · +998 33 645 00 97',
  },
  zh: {
    founderLabel: '创始人',
    founderName: 'Baxtiyorjon Gaziyev',
    founderTitle: '创始人兼首席设计师',
    founderQuote: '品牌不仅仅是外观。它是您的企业在说什么。我们帮助您正确塑造这种表达。',
    founderSince: '自2019年',
    sectionN: '§ 01',
    label: '关于我们',
    heading: '品牌',
    headingEm: '力量',
    headingEnd: '由我们打造。',
    subtext: '中亚高端品牌机构，成立于2019年。打造品牌识别不仅仅是设计——更是战略。',
    stats: [
      { n: '7+', l: '年经验' },
      { n: '120+', l: '品牌创建' },
      { n: '240+', l: '完成项目' },
      { n: '4', l: '种语言 (uz/ru/en/zh)' },
    ],
    missionLabel: '我们的使命',
    mission: '让中亚每一个企业都能创建专业的品牌识别系统。我们的目标是将客户的品牌转变为长期商业工具。',
    valuesLabel: '我们的价值观',
    values: [
      { n: '01', title: '质量', text: '每一个像素，每一行文字都有目的。没有随意元素。' },
      { n: '02', title: '速度', text: '14天——品牌诊断。30天——完整视觉识别系统。' },
      { n: '03', title: '透明度', text: '工作阶段、时间表和价格预先清晰。没有隐藏费用。' },
      { n: '04', title: '成果', text: '让您的品牌在市场上脱颖而出是我们的责任。' },
    ],
    processLabel: '我们如何工作',
    steps: [
      { n: '01', title: '在线简报', text: '通过问卷收集所有项目信息。10分钟完成。' },
      { n: '02', title: '诊断与提案', text: '品牌审计和具体提案——24小时内。' },
      { n: '03', title: '合同', text: '签署合同，支付预付款。' },
      { n: '04', title: '制作', text: '按照商定的时间表和阶段。每个阶段均需确认。' },
      { n: '05', title: '交付', text: '所有文件格式 + 文档 + 30天保修。' },
    ],
    ctaLabel: '开始合作',
    cta: '免费简报 →',
    footerNote: 'Jon.Branding Agency · 塔什干，乌兹别克斯坦 · +998 33 645 00 97',
  },
} as const;

interface Props { lang: string; }

const HaqimizClient: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  const quizHref = lang === 'uz' ? '/quiz' : `/${lang}/quiz`;

  return (
    <div style={{ background: 'var(--at-bg)', color: 'var(--at-ink)', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="pt-16 pb-0 md:pt-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
          <div className="flex items-center gap-2 mb-8" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--at-green)] animate-pulse" />
            <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>{l.sectionN}</span>
            <span>{l.label}</span>
          </div>
          <h1 className="font-bold text-[var(--at-ink)] mb-8" style={{ fontSize: 'clamp(52px, 8.5vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
            <span className="block">{l.heading}</span>
            <span className="block text-[var(--at-accent)] font-[family-name:var(--font-serif)] italic">{l.headingEm}</span>
            <span className="block">{l.headingEnd}</span>
          </h1>
          <p className="text-[var(--at-ink-2)] text-base md:text-lg leading-relaxed max-w-[600px]">{l.subtext}</p>
        </div>
      </section>

      {/* Stats */}
      <div className="py-7 border-b border-[var(--at-line)] bg-[var(--at-bg)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {l.stats.map((s, i) => (
              <div key={i}>
                <div className="font-bold text-[var(--at-ink)] leading-none mb-2" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.03em' }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 md:py-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[260px_1fr] gap-12 md:gap-20 items-start">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)', paddingTop: 4 }}>{l.missionLabel}</div>
            <p className="font-bold text-[var(--at-ink)]" style={{ fontSize: 'clamp(22px, 3vw, 36px)', lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 680 }}>{l.mission}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="mb-12" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}>{l.valuesLabel}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ borderTop: '1px solid var(--at-line)' }}>
            {l.values.map((v) => (
              <div key={v.n} className="py-8 pr-8" style={{ borderBottom: '1px solid var(--at-line)', borderRight: '1px solid var(--at-line)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', marginBottom: 16 }}>{v.n}</div>
                <div className="font-bold text-[var(--at-ink)] mb-3" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{v.title}</div>
                <p style={{ fontSize: 14, color: 'var(--at-ink-2)', lineHeight: 1.6 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ratings */}
      <AtRatings lang={lang} />

      {/* Founder */}
      <section className="py-16 md:py-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[260px_1fr] gap-12 md:gap-20 items-start">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)', paddingTop: 4 }}>{l.founderLabel}</div>
            <div className="grid sm:grid-cols-[280px_1fr] gap-10 items-start">
              <div className="relative">
                <Image
                  src="/images/cms/founder-portrait.webp"
                  alt={l.founderName}
                  width={280}
                  height={360}
                  className="w-full rounded-xl object-cover grayscale"
                  style={{ aspectRatio: '7/9' }}
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-lg p-3" style={{ background: 'var(--at-bg)', border: '1px solid var(--at-line)' }}>
                  <div className="font-bold text-[var(--at-ink)] text-sm">{l.founderName}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{l.founderSince}</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-[var(--at-ink)] mb-3" style={{ fontSize: 18, letterSpacing: '-0.01em' }}>{l.founderTitle}</div>
                <blockquote className="font-[family-name:var(--font-serif)] italic text-[var(--at-ink-2)]" style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                  &ldquo;{l.founderQuote}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="mb-12" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}>{l.processLabel}</div>
          <div style={{ borderTop: '1px solid var(--at-line)' }}>
            {l.steps.map((s) => (
              <div key={s.n} className="grid grid-cols-[48px_1fr_1fr] gap-6 py-6" style={{ borderBottom: '1px solid var(--at-line)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', paddingTop: 2 }}>{s.n}</span>
                <span className="font-semibold text-[var(--at-ink)]" style={{ fontSize: 16 }}>{s.title}</span>
                <span style={{ fontSize: 14, color: 'var(--at-ink-2)', lineHeight: 1.6 }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center justify-between">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)', marginBottom: 12 }}>{l.ctaLabel}</div>
              <div className="font-bold text-[var(--at-ink)]" style={{ fontSize: 'clamp(28px, 4vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1 }}>Jon.Branding</div>
              <p style={{ fontSize: 13, color: 'var(--at-muted)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>{l.footerNote}</p>
            </div>
            <a href={quizHref} className="inline-flex items-center justify-center gap-2 bg-[var(--at-accent)] text-white rounded-full px-8 py-4 font-semibold text-sm hover:-translate-y-0.5 transition-transform">{l.cta}</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HaqimizClient;
