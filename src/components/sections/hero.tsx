'use client';

import type { FC, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';

const portfolioImages: GalleryImage[] = projects
  .filter((project) => !project.hiddenInHero)
  .flatMap((project) => project.galleryImages || [])
  .filter((image) => !image.src.toLowerCase().endsWith('.gif'))
  .slice(0, 10);

type HeroDictionary = {
  preHeadline?: string;
  title?: string;
  descriptionPlain?: string;
  description?: string;
  cta?: string;
  ctaSecondary?: string;
  proofItems?: string[];
  auditTitle?: string;
  auditSubtitle?: string;
  auditScore?: string;
  auditScoreLabel?: string;
  auditSignals?: string[];
  showcaseTags?: string[];
};

interface HeroProps {
  onOpenContact: () => void;
  lang: string;
  dictionary: HeroDictionary;
  renderHeadline: (headline: string, className?: string) => ReactNode;
}

function getHeroCopy(dictionary: HeroDictionary) {
  return {
    preHeadline: dictionary.preHeadline || '',
    title: dictionary.title || '',
    description: dictionary.descriptionPlain || dictionary.description || '',
    cta: dictionary.cta || '',
    ctaSecondary: dictionary.ctaSecondary || '',
    proofItems: dictionary.proofItems?.length ? dictionary.proofItems : [],
    auditTitle: dictionary.auditTitle || '',
    auditSubtitle: dictionary.auditSubtitle || '',
    auditScore: dictionary.auditScore || '',
    auditScoreLabel: dictionary.auditScoreLabel || '',
    auditSignals: dictionary.auditSignals?.length ? dictionary.auditSignals : [],
    showcaseTags: dictionary.showcaseTags?.length ? dictionary.showcaseTags : [],
  };
}

const Hero: FC<HeroProps> = ({ onOpenContact, dictionary, renderHeadline }) => {
  if (!dictionary) return null;

  const heroCopy = getHeroCopy(dictionary);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#070b12] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#070b12_0%,#101735_52%,#06252b_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,18,0.95)_0%,rgba(7,11,18,0.72)_43%,rgba(7,11,18,0.3)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[hsl(var(--brand-paper))] to-transparent" />
      </div>

      <div className="container mx-auto flex min-h-[100svh] max-w-[1400px] items-center px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-28">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col justify-center text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md lg:self-start">
              <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-100">{heroCopy.preHeadline}</span>
            </div>
            <h1 className="mx-auto max-w-[292px] sm:max-w-3xl text-balance text-[clamp(2.35rem,5.9vw,6.25rem)] font-black leading-[0.94] tracking-tight text-white drop-shadow-md sm:drop-shadow-none sm:text-[clamp(2.65rem,6.2vw,6.25rem)] lg:mx-0">
              {renderHeadline(heroCopy.title, 'text-white')}
            </h1>

            <p className="mx-auto mt-5 max-w-[292px] sm:max-w-xl text-pretty text-base leading-7 text-blue-100/78 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0 drop-shadow-sm sm:drop-shadow-none">
              {heroCopy.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                onClick={onOpenContact}
                size="lg"
                className="group h-14 rounded-lg bg-brand-blue px-8 text-base font-black text-white shadow-[0_22px_70px_-24px_rgba(37,99,235,0.95)] transition-all duration-200 hover:bg-brand-cyan hover:text-brand-ink hover:shadow-[0_22px_70px_-24px_rgba(58,225,255,0.65)] active:scale-[0.98] sm:h-16"
              >
                {heroCopy.cta}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-14 rounded-lg border border-white/15 bg-white/[0.03] px-6 text-base font-black text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-white sm:h-16"
              >
                <Link href="#audit-offer">{heroCopy.ctaSecondary}</Link>
              </Button>
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-1 gap-2 self-center sm:mt-8 sm:grid-cols-3 lg:self-start">
              {heroCopy.proofItems.map((item) => (
                <div
                  key={item}
                  className="flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.055] px-3 py-2 text-left text-xs font-bold leading-5 text-blue-50/86 backdrop-blur-md sm:min-h-14 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" />
                  <span className="min-w-0">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-white/15 bg-white/[0.055] p-2 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.95)] backdrop-blur-xl lg:max-w-none">
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
              <CaseWall images={portfolioImages} />
              <AuditPanel copy={heroCopy} />
              <div className="mt-3 hidden grid-cols-3 gap-3 lg:grid">
                {heroCopy.showcaseTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.055] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/80"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-cyan" />
                    <span className="truncate">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function CaseWall({ images }: { images: GalleryImage[] }) {
  const visibleImages = images.slice(0, 6);

  return (
    <div className="grid h-[300px] gap-2 overflow-hidden rounded-lg sm:h-[440px] sm:grid-cols-2 sm:grid-rows-3 lg:h-[470px]">
      {visibleImages.map((image, index) => (
        <PortfolioTile
          key={`${image?.src || 'fallback'}-${index}`}
          image={image}
          priority={index < 2}
          className={index > 0 ? 'hidden sm:block' : ''}
        />
      ))}
    </div>
  );
}

function PortfolioTile({ image, priority = false, className = '' }: { image?: GalleryImage; priority?: boolean; className?: string }) {
  if (!image) {
    return (
      <div className={`flex h-full min-h-[180px] items-center justify-center rounded-lg bg-white/5 p-8 text-center text-sm font-medium text-white/40 ${className}`}>
        Portfolio
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-[180px] overflow-hidden rounded-lg bg-white ring-1 ring-white/10 ${className}`}>
      <Image
        src={image.src}
        alt={image.alt || 'Jon.Branding portfolio'}
        fill
        priority={priority}
        sizes="(max-width: 768px) 92vw, 48vw"
        className="object-contain p-2.5"
      />
    </div>
  );
}

function AuditPanel({ copy }: { copy: ReturnType<typeof getHeroCopy> }) {
  return (
    <div className="mt-2 rounded-lg border border-white/15 bg-[#070b12]/82 p-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-brand-cyan">
            <ShieldCheck className="h-4 w-4" />
            <span>{copy.auditScoreLabel}</span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-white sm:text-xl">{copy.auditTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-white/60">{copy.auditSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-lime text-sm font-black text-brand-ink shadow-[0_16px_40px_-18px_rgba(163,230,53,0.9)]">
            {copy.auditScore}
          </div>
          <BarChart3 className="hidden h-7 w-7 text-brand-cyan sm:block" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {copy.auditSignals.map((signal) => (
          <div key={signal} className="flex items-start gap-2 text-xs font-bold leading-5 text-white/78">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-cyan" />
            <span>{signal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
