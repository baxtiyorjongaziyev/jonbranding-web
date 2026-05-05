'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CheckCircle2, FileSearch, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';

const portfolioImages: GalleryImage[] = projects
  .filter((project) => !project.hiddenInHero)
  .flatMap((project) => project.galleryImages || [])
  .filter((image) => !image.src.toLowerCase().endsWith('.gif'))
  .slice(0, 4);

interface HeroProps {
  onOpenContact: () => void;
  lang: string;
  dictionary: any;
  renderHeadline: (headline: string, className?: string) => React.ReactNode;
}

const heroCopyByLang = {
  uz: {
    preHeadline: 'Bepul Brand Audit',
    title: "Brendingiz **arzon ko'rinmasin**.",
    description:
      "Nom, logo, qadoq, sayt va kommunikatsiyangiz mijozda ishonch uyg'otyaptimi yoki sotuvni sekinlashtiryaptimi - aniq ko'rsatib beramiz.",
    cta: 'Bepul Brand Audit olish',
    ctaSecondary: "Auditda nima olaman?",
    proofItems: ["5 ta ishonch yo'qotadigan nuqta", "Raqobatchiga nisbatan ko'rinish", "Qaysi xizmat hozir kerakligini bilasiz"],
    reportTitle: 'Brand Audit Snapshot',
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
    preHeadline: 'Free Brand Audit',
    title: 'Your brand should not look cheap.',
    description: 'We show where your name, logo, packaging, website, and message lose trust or slow down the buying decision.',
    cta: 'Get the free brand audit',
    ctaSecondary: 'What is inside?',
    proofItems: ['5 trust gaps', 'Competitor view', 'Clear next step'],
    reportTitle: 'Brand Audit Snapshot',
    reportSubtitle: 'Trust diagnosis',
    scoreLabel: 'Trust signal',
    score: '68%',
    issues: ['Premium signal is weak', 'Promise is unclear', 'Differentiation is not visible'],
  },
  en: {
    preHeadline: 'Free Brand Audit',
    title: 'Your brand should not look cheap.',
    description: 'We show where your name, logo, packaging, website, and message lose trust or slow down the buying decision.',
    cta: 'Get the free brand audit',
    ctaSecondary: 'What is inside?',
    proofItems: ['5 trust gaps', 'Competitor view', 'Clear next step'],
    reportTitle: 'Brand Audit Snapshot',
    reportSubtitle: 'Trust diagnosis',
    scoreLabel: 'Trust signal',
    score: '68%',
    issues: ['Premium signal is weak', 'Promise is unclear', 'Differentiation is not visible'],
  },
  zh: {
    preHeadline: 'Free Brand Audit',
    title: 'Your brand should not look cheap.',
    description: 'We show where your name, logo, packaging, website, and message lose trust or slow down the buying decision.',
    cta: 'Get the free brand audit',
    ctaSecondary: 'What is inside?',
    proofItems: ['5 trust gaps', 'Competitor view', 'Clear next step'],
    reportTitle: 'Brand Audit Snapshot',
    reportSubtitle: 'Trust diagnosis',
    scoreLabel: 'Trust signal',
    score: '68%',
    issues: ['Premium signal is weak', 'Promise is unclear', 'Differentiation is not visible'],
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
    <section className="relative isolate max-w-[100vw] overflow-hidden bg-[#080b14] pt-20 text-white sm:pt-24 lg:pt-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.35),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(58,225,255,0.18),transparent_28rem),linear-gradient(135deg,#070a13_0%,#0b1020_45%,#111827_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-44 bg-gradient-to-t from-[#f7f4ee] to-transparent" />

      <div className="container mx-auto max-w-[1360px] overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100svh-6rem)] items-center gap-10 py-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[280px] text-center sm:max-w-3xl lg:mx-0 lg:w-full lg:text-left"
          >
            <div className="mb-5 inline-flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2.5 text-center text-[10px] font-black uppercase tracking-[0.12em] text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur sm:w-auto sm:max-w-full sm:text-[11px] sm:tracking-[0.24em]">
              <Sparkles className="h-4 w-4 text-brand-cyan" />
              <span className="min-w-0 text-balance">{heroCopy.preHeadline}</span>
            </div>

            <h1 className="mx-auto max-w-[280px] text-balance text-[35px] font-black leading-[0.94] tracking-[-0.05em] text-white sm:max-w-none sm:text-[72px] sm:tracking-[-0.075em] lg:mx-0 lg:text-[88px] xl:text-[104px]">
              {renderHeadline(heroCopy.title, 'text-white')}
            </h1>

            <p className="mx-auto mt-6 max-w-[280px] text-pretty text-base leading-8 text-slate-300 sm:max-w-2xl sm:text-xl lg:mx-0">
              {heroCopy.description}
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-[280px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:mx-0 lg:justify-start">
              <Button
                onClick={onOpenContact}
                size="lg"
                className="h-14 w-full rounded-2xl !bg-blue-700 px-5 text-base font-black !text-white shadow-[0_25px_70px_-32px_rgba(37,99,235,0.95)] hover:!bg-brand-cyan hover:!text-slate-950 sm:h-16 sm:w-auto sm:px-9"
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

            <div className="mx-auto mt-6 grid w-full max-w-[280px] gap-2 sm:max-w-none sm:grid-cols-3">
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
            className="relative mx-auto w-full max-w-[330px] sm:max-w-2xl lg:max-w-none"
          >
            <div className="relative rounded-[2rem] border border-white/12 bg-white/8 p-3 shadow-[0_35px_100px_-55px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:rounded-[2.4rem] sm:p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <PortfolioTile image={portfolioImages[0]} className="h-[250px] sm:h-[520px] sm:row-span-2" priority />
                <PortfolioTile image={portfolioImages[1]} className="hidden h-[250px] sm:block" priority />
                <PortfolioTile image={portfolioImages[2]} className="hidden h-[250px] sm:block" />
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

function PortfolioTile({ image, className, priority = false }: { image?: GalleryImage; className: string; priority?: boolean }) {
  if (!image) {
    return (
      <div className={`${className} flex items-center justify-center rounded-[1.45rem] bg-white/8 p-8 text-center text-sm font-bold text-white/50`}>
        Portfolio namunasi
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[1.45rem] bg-slate-100 ring-1 ring-white/10 sm:rounded-[1.65rem] ${className}`}>
      <Image
        src={image.src}
        alt={image.alt || 'Jon.Branding portfolio namunasi'}
        fill
        priority={priority}
        sizes="(max-width: 768px) 92vw, 48vw"
        className="object-cover saturate-[0.92]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-transparent" />
    </div>
  );
}

export default Hero;
