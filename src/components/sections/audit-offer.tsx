'use client';

import type { FC } from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, FileSearch, Layers3, Route, ShieldCheck, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandCard, BrandSection } from '@/components/ui/design-system';

const copy = {
  uz: {
    eyebrow: 'Bepul Brend Tahlil: Siz nima olasiz',
    title: "5 daqiqada brendingiz nega sotmayotganini ko'rasiz.",
    description:
      "Siz shunchaki maslahat emas — aniq PDF hisobot + shaxsiy video sharh olasiz. Qayerda pul yo'qotayotganingiz va birinchi nima tuzatish kerakligini 72 soat ichida ko'rsatamiz.",
    cta: 'Bepul Tahlil + Video Sharh olish',
    promise: "Agar foydali bo'lmasa — hech narsa to'lamaysiz, hech narsa majburiy emas.",
    items: [
      {
        title: "PDF: 5 ta ishonch yo'qotadigan nuqta",
        desc: "Mijoz sizga qaraganda nimadan shubhalanishi — har biri screenshot + tushuntirish bilan.",
        icon: FileSearch,
      },
      {
        title: "Video: Shaxsiy 3-5 daqiqalik sharh",
        desc: "Jon.Branding asoschisi brendingizni ekranda ko'rsatib, og'zaki tushuntiradi.",
        icon: Target,
      },
      {
        title: "Raqobatchi taqqoslash",
        desc: "Sizning brend vs raqobatchingiz — qayerda yutayapsiz va qayerda yutqazayapsiz.",
        icon: Layers3,
      },
      {
        title: "1 ta birinchi qadam",
        desc: "100 ta ish emas — faqat 1 ta eng katta ta'sir beradigan harakatni aytamiz.",
        icon: Route,
      },
    ],
    proof: ['72 soat ichida javob', 'Majburiyatsiz', 'Sotuv bosimisiz'],
  },
  ru: {
    eyebrow: 'Внутри бесплатного анализа',
    title: 'Узнайте, где ваш бренд теряет доверие.',
    description:
      'Мы проверяем ваше имя, лого, упаковку, сайт и коммуникацию глазами покупателя и показываем, что нужно исправить в первую очередь.',
    cta: 'Записаться на анализ',
    promise: 'Никаких обязательств, если анализ не будет полезен.',
    items: [
      { title: '5 trust gaps', desc: 'Where the brand looks cheap, unclear, or unreliable.', icon: FileSearch },
      { title: 'Competitor mirror', desc: 'How to look stronger and more valuable in your category.', icon: Target },
      { title: 'What you need now', desc: 'Logo, naming, brandbook, packaging, or strategy - ranked by impact.', icon: Layers3 },
      { title: 'Next-step roadmap', desc: 'Simple priorities for improving the brand.', icon: Route },
    ],
    proof: ['No obligation', 'No pressure', 'Plain language'],
  },
  en: {
    eyebrow: 'Inside the free brand analysis',
    title: 'See where your brand loses trust.',
    description:
      'We review your name, logo, packaging, website, and message through the eyes of a buyer and show what should be fixed first.',
    cta: 'Book the free analysis',
    promise: 'No obligation if the analysis is not useful.',
    items: [
      { title: '5 trust gaps', desc: 'Where the brand looks cheap, unclear, or unreliable.', icon: FileSearch },
      { title: 'Competitor mirror', desc: 'How to look stronger and more valuable in your category.', icon: Target },
      { title: 'What you need now', desc: 'Logo, naming, brandbook, packaging, or strategy - ranked by impact.', icon: Layers3 },
      { title: 'Next-step roadmap', desc: 'Simple priorities for improving the brand.', icon: Route },
    ],
    proof: ['No obligation', 'No pressure', 'Plain language'],
  },
  zh: {
    eyebrow: '免费品牌分析内容',
    title: '看看您的品牌在哪里失去信任。',
    description:
      '我们从买家的视角审查您的名称、标志、包装、网站和信息，并展示应该首先修复什么。',
    cta: '预约免费分析',
    promise: '如果分析没有帮助，无任何义务。',
    items: [
      { title: '5 trust gaps', desc: 'Where the brand looks cheap, unclear, or unreliable.', icon: FileSearch },
      { title: 'Competitor mirror', desc: 'How to look stronger and more valuable in your category.', icon: Target },
      { title: 'What you need now', desc: 'Logo, naming, brandbook, packaging, or strategy - ranked by impact.', icon: Layers3 },
      { title: 'Next-step roadmap', desc: 'Simple priorities for improving the brand.', icon: Route },
    ],
    proof: ['No obligation', 'No pressure', 'Plain language'],
  },
};

const AuditOffer: FC<{ lang: string; onCtaClick: () => void }> = ({ lang, onCtaClick }) => {
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  return (
    <BrandSection id="audit-offer" tone="light" className="min-h-0 bg-[#f7f4ee] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(37,99,235,0.1),transparent_32rem),radial-gradient(circle_at_90%_10%,rgba(58,225,255,0.1),transparent_30rem)]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-brand-line bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-brand-blue shadow-sm">
              {t.eyebrow}
            </div>
            <h2 className="text-balance text-4xl font-black tracking-[-0.055em] text-brand-ink sm:text-6xl">
              {t.title}
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-brand-slate">{t.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onCtaClick} size="lg" className="h-14 rounded-2xl bg-brand-ink px-7 text-base font-black text-white hover:bg-brand-blue">
                {t.cta}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 rounded-2xl border border-brand-line bg-white/70 px-4 py-3 text-sm font-bold text-brand-slate">
                <ShieldCheck className="h-5 w-5 text-brand-blue" />
                {t.promise}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {t.items.map((item) => (
              <BrandCard key={item.title} className="group p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue ring-1 ring-brand-blue/15">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black tracking-[-0.03em] text-brand-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-slate">{item.desc}</p>
              </BrandCard>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-3 lg:justify-end">
          {t.proof.map((proof) => (
            <div key={proof} className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white/75 px-4 py-2 text-sm font-black text-brand-ink">
              <CheckCircle2 className="h-4 w-4 text-brand-blue" />
              {proof}
            </div>
          ))}
        </div>
      </div>
    </BrandSection>
  );
};

export default AuditOffer;
