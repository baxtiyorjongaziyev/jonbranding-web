'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CheckCircle2, FileSearch, ShieldCheck, Sparkles, Target, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';

const portfolioImages: GalleryImage[] = projects
  .filter((project) => !project.hiddenInHero)
  .flatMap((project) => project.galleryImages || [])
  .filter((image) => !image.src.toLowerCase().endsWith('.gif'))
  .slice(0, 10);

interface HeroProps {
  onOpenContact: () => void;
  lang: string;
  dictionary: any;
  renderHeadline: (headline: string, className?: string) => React.ReactNode;
}

const heroCopyByLang = {
  uz: {
    preHeadline: 'Bepul Brend Tahlil',
    urgencyBadge: "Cheklangan — haftalik limit bor",
    title: "Brendingiz **arzon ko'rinmasin**.",
    description:
      "Biz 5 daqiqada brendingiz qayerda ishonch yo'qotayotganini aniqlaymiz — va qaysi bitta tuzatish eng katta ta'sir berishini aytamiz.",
    cta: 'Bepul Tahlil + Video Sharh olish',
    ctaSecondary: "Tahlilda nima olaman?",
    socialProof: "",
    proofItems: ["5 ta ishonch yo'qotadigan nuqta", "Raqobatchiga nisbatan ko'rinish", "Qaysi xizmat hozir kerakligini bilasiz"],
    reportTitle: 'Brend Tahlil Natijasi',
    reportSubtitle: "Mijoz ko'zidagi ishonch diagnostikasi",
    scoreLabel: 'Ishonch signali',
    score: '68%',
    issues: [
      'Premiumlik signali sust',
      'Vaada bir qarashda tushunarsiz',
      "Farq qiladigan sabab ko'rinmaydi",
    ],
  },
  ru: {
    preHeadline: 'Бесплатный Анализ Бренда',
    urgencyBadge: "Ограничено — недельный лимит",
    title: 'Ваш бренд не должен выглядеть дёшево.',
    description: 'Мы покажем, где ваше имя, лого, упаковка, сайт и коммуникация теряют доверие клиента или замедляют решение о покупке.',
    cta: 'Получить бесплатный анализ',
    ctaSecondary: 'Что внутри?',
    socialProof: "",
    proofItems: ['5 точек потери доверия', 'Взгляд на конкурентов', 'Чёткий следующий шаг'],
    reportTitle: 'Результат Анализа Бренда',
    reportSubtitle: 'Диагностика доверия',
    scoreLabel: 'Сигнал доверия',
    score: '68%',
    issues: ['Сигнал премиальности слабый', 'Обещание непонятно', 'Отличие не видно'],
  },
  en: {
    preHeadline: 'Free Brand Analysis',
    urgencyBadge: "Limited — weekly cap",
    title: 'Your brand should not look cheap.',
    description: 'We show where your name, logo, packaging, website, and message lose trust or slow down the buying decision.',
    cta: 'Get free brand analysis',
    ctaSecondary: 'What is inside?',
    socialProof: "",
    proofItems: ['5 trust gaps', 'Competitor view', 'Clear next step'],
    reportTitle: 'Brand Analysis Snapshot',
    reportSubtitle: 'Trust diagnosis',
    scoreLabel: 'Trust signal',
    score: '68%',
    issues: ['Premium signal is weak', 'Promise is unclear', 'Differentiation is not visible'],
  },
  zh: {
    preHeadline: '免费品牌分析',
    urgencyBadge: "限量 — 每周限额",
    title: '您的品牌不应该看起来廉价。',
    description: '我们展示您的名称、标志、包装、网站和信息在哪里失去信任或减缓购买决策。',
    cta: '获取免费品牌分析',
    ctaSecondary: '里面有什么?',
    socialProof: "",
    proofItems: ['5个信任缺口', '竞争对手视角', '明确的下一步'],
    reportTitle: '品牌分析快照',
    reportSubtitle: '信任诊断',
    scoreLabel: '信任信号',
    score: '68%',
    issues: ['高端信号薄弱', '承诺不清晰', '差异化不明显'],
  },
};

const diagnosticBadges = [
  { label: 'Diagnostika', icon: FileSearch },
  { label: 'Aniq ustuvorlik', icon: BadgeCheck },
  { label: 'Majburiyatsiz', icon: ShieldCheck },
];

const Hero: FC<HeroProps> = ({ onOpenContact, lang, dictionary, renderHeadline }) => {
  if (!dictionary) return null;

  const heroCopy = heroCopyByLang[(lang as keyof typeof heroCopyByLang) || 'uz'] || heroCopyByLang.uz;

  return (
    <section className="relative isolate max-w-[100vw] overflow-hidden bg-[#080b14] pt-10 text-white sm:pt-12 lg:pt-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.35),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(58,225,255,0.18),transparent_28rem),linear-gradient(135deg,#070a13_0%,#0b1020_45%,#111827_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-44 bg-gradient-to-t from-[#f7f4ee] to-transparent" />

      <div className="container mx-auto max-w-[1360px] overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100svh-8rem)] items-start gap-6 py-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-10 lg:py-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[292px] text-center sm:max-w-3xl lg:mx-0 lg:w-full lg:text-left"
          >
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur sm:text-[11px] sm:tracking-[0.24em]">
                <Sparkles className="h-4 w-4 text-brand-cyan" />
                <span className="min-w-0 text-balance">{heroCopy.preHeadline}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white sm:text-[11px]">
                <Zap className="h-3.5 w-3.5" />
                {heroCopy.urgencyBadge}
              </div>
            </div>

            <h1 className="mx-auto max-w-[292px] text-balance text-[35px] font-black leading-[0.94] tracking-[-0.05em] text-white sm:max-w-none sm:text-[72px] sm:tracking-[-0.075em] lg:mx-0 lg:text-[88px] xl:text-[104px]">
              {renderHeadline(heroCopy.title, 'text-white')}
            </h1>

            <p className="mx-auto mt-6 max-w-[292px] text-pretty text-base leading-8 text-slate-300 sm:max-w-2xl sm:text-xl lg:mx-0">
              {heroCopy.description}
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-[292px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:mx-0 lg:justify-start">
              <Button
                onClick={onOpenContact}
                size="lg"
                className="h-14 w-full animate-pulse-glow rounded-2xl !bg-blue-700 px-5 text-base font-black !text-white shadow-[0_25px_70px_-32px_rgba(37,99,235,0.95)] hover:!bg-brand-cyan hover:!text-slate-950 sm:h-16 sm:w-auto sm:px-9"
              >
                {heroCopy.cta}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 w-full rounded-2xl border-white/14 bg-white/8 px-5 text-base font-black text-white shadow-none hover:bg-white/14 sm:h-16 sm:w-auto sm:px-7"
              >
                <Link href="#audit-offer">{heroCopy.ctaSecondary}</Link>
              </Button>
            </div>

            {heroCopy.socialProof && (
              <div className="mx-auto mt-4 flex w-full max-w-[292px] items-center justify-center gap-2 sm:max-w-none lg:mx-0 lg:justify-start">
                <Users className="h-4 w-4 text-brand-cyan" />
                <span className="text-sm font-bold text-slate-300">{heroCopy.socialProof}</span>
              </div>
            )}

            <div className="mx-auto mt-6 grid w-full max-w-[292px] gap-2 sm:max-w-none sm:grid-cols-3">
              {heroCopy.proofItems.map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/7 px-3 py-3 text-sm font-bold text-slate-200 shadow-sm backdrop-blur lg:justify-start">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="relative mx-auto w-full max-w-[292px] sm:max-w-2xl lg:max-w-none"
          >
            <div className="relative rounded-[2rem] border border-white/12 bg-white/8 p-3 shadow-[0_35px_100px_-55px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:rounded-[2.4rem] sm:p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <CaseWall images={portfolioImages} />
                <div className="rounded-[1.45rem] border border-white/12 bg-slate-950/95 p-4 text-white shadow-[0_24px_70px_-35px_rgba(0,0,0,0.95)] sm:col-span-2 sm:p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-brand-cyan">
                    <ShieldCheck className="h-4 w-4" />
                    Siz oladigan natija
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr] sm:items-center">
                    <div>
                      <p className="text-base font-black text-white">{heroCopy.reportTitle}</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">{heroCopy.reportSubtitle}</p>
                      <div className="mt-4 inline-flex rounded-full bg-brand-lime px-3 py-1 text-xs font-black text-slate-950">{heroCopy.score}</div>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{heroCopy.scoreLabel}</p>
                    </div>
                    <div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-brand-cyan to-brand-lime" />
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {heroCopy.issues.map((issue) => (
                          <div key={issue} className="flex gap-2 rounded-2xl bg-white/7 p-3 text-xs leading-5 text-white/72">
                            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-cyan" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:mt-6">
              {diagnosticBadges.map((item) => (
                <div key={item.label} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/7 px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/70">
                  <item.icon className="h-4 w-4 text-brand-cyan" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function CaseWall({ images }: { images: GalleryImage[] }) {
  const firstColumn = images.filter((_, index) => index % 2 === 0);
  const secondColumn = images.filter((_, index) => index % 2 === 1);

  return (
    <div className="col-span-full grid h-[250px] gap-3 overflow-hidden rounded-[1.65rem] sm:h-[520px] sm:grid-cols-2">
      <CaseColumn images={firstColumn} duration={28} priority />
      <CaseColumn images={secondColumn.length ? secondColumn : firstColumn} duration={34} reverse className="hidden sm:block" />
    </div>
  );
}

function CaseColumn({
  images,
  duration,
  reverse = false,
  priority = false,
  className = '',
}: {
  images: GalleryImage[];
  duration: number;
  reverse?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const loopImages = [...images, ...images];

  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      <motion.div
        className="flex flex-col gap-3"
        animate={{ y: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {loopImages.map((image, index) => (
          <PortfolioTile
            key={`${image?.src || 'fallback'}-${index}`}
            image={image}
            priority={priority && index < 2}
            ratioClass={index % 3 === 0 ? 'aspect-[4/3]' : index % 3 === 1 ? 'aspect-[16/10]' : 'aspect-[5/4]'}
          />
        ))}
      </motion.div>
    </div>
  );
}

function PortfolioTile({ image, ratioClass, priority = false }: { image?: GalleryImage; ratioClass: string; priority?: boolean }) {
  if (!image) {
    return (
      <div className={`${ratioClass} flex items-center justify-center rounded-[1.45rem] bg-white/8 p-8 text-center text-sm font-bold text-white/50`}>
        Portfolio namunasi
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[1.45rem] bg-white p-3 ring-1 ring-white/10 sm:rounded-[1.65rem] ${ratioClass}`}>
      <Image
        src={image.src}
        alt={image.alt || 'Jon.Branding portfolio namunasi'}
        fill
        priority={priority}
        sizes="(max-width: 768px) 92vw, 48vw"
        className="object-contain p-2 saturate-[0.96]"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-slate-950/8 via-transparent to-white/10" />
    </div>
  );
}

export default Hero;
