'use client';

import type { FC } from 'react';
import { ArrowRight, CheckCircle2, Clock, FileSearch, Route, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

const copy = {
  uz: {
    eyebrow: 'Bepul audit ichida',
    title: '15 daqiqada brendingizdagi 3 ta eng qimmat xatoni topamiz.',
    description:
      'Bu shunchaki “konsultatsiya” emas. Siz biznesingiz nega ishonch, narx yoki tanilishda yutqazayotganini aniqroq ko‘rasiz.',
    cta: 'Auditga yozilish',
    items: [
      { title: '3 ta xato', desc: 'Logo, nom, qadoq yoki sayt mijoz ishonchiga qayerda zarar berayotganini aytamiz.', icon: FileSearch },
      { title: '3 ta imkoniyat', desc: 'Qaysi joyni tuzatsangiz, brendingiz tezroq professional ko‘rinishini ko‘rsatamiz.', icon: CheckCircle2 },
      { title: '1 ta yo‘l xarita', desc: 'Sizga hozir logo, naming, brandbook yoki to‘liq branding kerakligini ajratamiz.', icon: Route },
      { title: 'Risk yo‘q', desc: 'Majburiyat yo‘q. Agar foyda ko‘rmasangiz, davom ettirmaysiz.', icon: ShieldCheck },
    ],
  },
  ru: {
    eyebrow: 'Что внутри аудита',
    title: 'За 15 минут найдем 3 самые дорогие ошибки вашего бренда.',
    description: 'Это не просто консультация. Вы увидите, где бренд теряет доверие, цену и узнаваемость.',
    cta: 'Записаться на аудит',
    items: [
      { title: '3 ошибки', desc: 'Покажем, где логотип, имя, упаковка или сайт мешают доверию.', icon: FileSearch },
      { title: '3 возможности', desc: 'Покажем, что исправить первым, чтобы бренд выглядел профессиональнее.', icon: CheckCircle2 },
      { title: '1 карта действий', desc: 'Определим, что нужно сейчас: логотип, нейминг, брендбук или полный брендинг.', icon: Route },
      { title: 'Без риска', desc: 'Без обязательств. Если не видите ценности, не продолжаете.', icon: ShieldCheck },
    ],
  },
  en: {
    eyebrow: 'Inside the free audit',
    title: 'In 15 minutes, we find the 3 most expensive brand mistakes.',
    description: 'Not a generic call. You see where trust, pricing, and recognition are leaking.',
    cta: 'Book the audit',
    items: [
      { title: '3 issues', desc: 'We show where logo, name, packaging, or site hurts trust.', icon: FileSearch },
      { title: '3 opportunities', desc: 'We show what to fix first for a more professional brand.', icon: CheckCircle2 },
      { title: '1 roadmap', desc: 'We clarify whether you need logo, naming, brandbook, or full branding.', icon: Route },
      { title: 'No risk', desc: 'No obligation. If there is no value, you do not continue.', icon: ShieldCheck },
    ],
  },
  zh: {
    eyebrow: '免费审计包含',
    title: '15 分钟找出品牌中最昂贵的 3 个问题。',
    description: '不是普通咨询，而是明确看到信任、价格和识别度在哪里流失。',
    cta: '预约审计',
    items: [
      { title: '3 个问题', desc: '指出 Logo、名称、包装或网站哪里影响信任。', icon: FileSearch },
      { title: '3 个机会', desc: '说明首先修复哪里能让品牌更专业。', icon: CheckCircle2 },
      { title: '1 个路线图', desc: '明确现在需要 Logo、命名、品牌手册还是完整品牌。', icon: Route },
      { title: '无风险', desc: '没有义务。如果没有价值，可以不继续。', icon: ShieldCheck },
    ],
  },
};

const AuditOffer: FC<{ lang: string; onCtaClick: () => void }> = ({ lang, onCtaClick }) => {
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  return (
    <BrandSection tone="dark" className="min-h-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(58,225,255,0.2),transparent_34rem)]" />
      <div className="container relative z-10 mx-auto px-4">
        <SectionIntro eyebrow={t.eyebrow} title={t.title} description={t.description} className="[&_h2]:text-white [&_p]:text-white/72" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item) => (
            <BrandCard key={item.title} className="border-white/10 bg-white/8 p-6 text-white">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-cyan ring-1 ring-white/10">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black tracking-[-0.03em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/68">{item.desc}</p>
            </BrandCard>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button onClick={onCtaClick} size="lg" className="rounded-2xl bg-white text-brand-ink hover:bg-brand-lime">
            <Clock className="h-5 w-5" />
            {t.cta}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </BrandSection>
  );
};

export default AuditOffer;
