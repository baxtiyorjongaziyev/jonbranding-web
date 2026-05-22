import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import ContactTriggerButton from '@/components/contact-trigger-button';
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
  lang: string;
  dictionary: HeroDictionary;
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

function renderHeadline(headline: string, className?: string) {
  if (!headline) return '';

  const segments = headline.split(/(\*\*.*?\*\*|\|.*?\|)/g);

  return (
    <span className={className ? `inline ${className}` : 'inline'}>
      {segments.map((segment, i) => {
        if (!segment) return null;

        const isDoubleStar = segment.startsWith('**') && segment.endsWith('**');
        const isPipe = segment.startsWith('|') && segment.endsWith('|');

        if (isDoubleStar || isPipe) {
          const text = isDoubleStar ? segment.slice(2, -2) : segment.slice(1, -1);
          return (
            <span key={i} className="text-brand-lime">
              {text}
            </span>
          );
        }

        return <span key={i}>{segment}</span>;
      })}
    </span>
  );
}

const Hero: FC<HeroProps> = ({ dictionary }) => {
  if (!dictionary) return null;

  const heroCopy = getHeroCopy(dictionary);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#06080d] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#06080d_0%,#11151f_58%,#132016_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:86px_86px] opacity-28" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,13,0.96)_0%,rgba(6,8,13,0.75)_48%,rgba(6,8,13,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-paper via-brand-paper/[0.35] to-transparent pointer-events-none" />
      </div>

      <div 
        className="container mx-auto flex min-h-[100svh] max-w-[1400px] items-center px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-28"
      >
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div
              className="mb-6 inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md lg:self-start"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
              <span className="text-[11px] font-black uppercase tracking-normal text-white/78">{heroCopy.preHeadline}</span>
            </div>
            <h1
              className="mx-auto max-w-[292px] text-balance text-4xl font-black leading-[0.96] tracking-normal text-white drop-shadow-md sm:max-w-3xl sm:text-6xl sm:drop-shadow-none lg:mx-0 xl:text-7xl"
            >
              {renderHeadline(heroCopy.title, 'text-white')}
            </h1>

            <p
              className="mx-auto mt-5 max-w-[292px] text-pretty text-base leading-7 text-white/70 drop-shadow-sm sm:mt-6 sm:max-w-xl sm:text-lg sm:leading-8 sm:drop-shadow-none lg:mx-0"
            >
              {heroCopy.description}
            </p>

            <div
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center lg:justify-start"
            >
              <ContactTriggerButton
                section="hero"
                ctaText={heroCopy.cta}
                size="lg"
                className="group h-14 rounded-[8px] bg-white px-8 text-base font-black text-brand-ink shadow-[0_24px_70px_-24px_rgba(255,255,255,0.75)] transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-brand-lime hover:text-brand-ink hover:shadow-[0_24px_70px_-24px_rgba(84,213,233,0.72)] active:scale-[0.98] sm:h-16"
              >
                {heroCopy.cta}
              </ContactTriggerButton>
              <Link
                href="#audit-offer"
                className="inline-flex h-14 items-center justify-center rounded-[8px] border border-white/15 bg-white/[0.03] px-6 text-base font-black text-white/85 transition-[background-color,color,border-color] duration-200 hover:bg-white/10 hover:text-white sm:h-16"
              >
                {heroCopy.ctaSecondary}
              </Link>
            </div>

            <div
              className="mt-6 grid max-w-xl grid-cols-1 gap-2 self-center sm:mt-8 sm:grid-cols-3 lg:self-start"
            >
              {heroCopy.proofItems.map((item) => (
                <div
                  key={item}
                  className="flex min-h-11 items-center gap-2 rounded-[8px] border border-white/[0.09] bg-white/[0.055] px-3 py-2 text-left text-xs font-bold leading-5 text-white/80 backdrop-blur-md sm:min-h-14 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-lime" />
                  <span className="min-w-0">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative hidden items-center justify-center lg:flex"
          >
            <div className="jb-dark-panel relative w-full max-w-xl overflow-hidden p-2 backdrop-blur-xl lg:max-w-none">
              <div className="pointer-events-none absolute inset-0 rounded-[8px] ring-1 ring-inset ring-white/10" />
              <CaseWall images={portfolioImages} />
              <AuditPanel copy={heroCopy} />
              <div className="mt-3 hidden grid-cols-3 gap-3 lg:grid">
                {heroCopy.showcaseTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-center gap-2 rounded-[8px] border border-white/[0.1] bg-white/[0.055] px-4 py-3 text-[11px] font-black uppercase tracking-normal text-white/80"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-lime" />
                    <span className="truncate">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function CaseWall({ images }: { images: GalleryImage[] }) {
  const visibleImages = images.slice(0, 6);

  return (
    <div className="grid h-[300px] gap-2 overflow-hidden rounded-[8px] sm:h-[440px] sm:grid-cols-2 sm:grid-rows-3 lg:h-[470px]">
      {visibleImages.map((image, index) => (
        <PortfolioTile
          key={`${image?.src || 'fallback'}-${index}`}
          image={image}
          className={index > 0 ? 'hidden sm:block' : ''}
        />
      ))}
    </div>
  );
}

function PortfolioTile({ image, className = '' }: { image?: GalleryImage; className?: string }) {
  if (!image) {
    return (
      <div className={`flex h-full min-h-[180px] items-center justify-center rounded-[8px] bg-white/5 p-8 text-center text-sm font-medium text-white/40 ${className}`}>
        Portfolio
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-[180px] overflow-hidden rounded-[8px] bg-white ring-1 ring-white/10 ${className}`}>
      <Image
        src={image.src}
        alt={image.alt || 'Jon.Branding portfolio'}
        fill
        sizes="(max-width: 768px) 92vw, 48vw"
        className="object-contain p-2.5"
      />
    </div>
  );
}

function AuditPanel({ copy }: { copy: ReturnType<typeof getHeroCopy> }) {
  return (
    <div className="mt-2 rounded-[8px] border border-white/15 bg-[#06080d]/86 p-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-normal text-brand-lime">
            <ShieldCheck className="h-4 w-4" />
            <span>{copy.auditScoreLabel}</span>
          </div>
          <h2 className="text-lg font-black tracking-normal text-white sm:text-xl">{copy.auditTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-white/60">{copy.auditSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[8px] bg-brand-lime text-sm font-black text-brand-ink shadow-[0_16px_40px_-18px_rgba(84,213,233,0.8)]">
            {copy.auditScore}
          </div>
          <BarChart3 className="hidden h-7 w-7 text-brand-lime sm:block" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {copy.auditSignals.map((signal) => (
          <div key={signal} className="flex items-start gap-2 text-xs font-bold leading-5 text-white/80">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-lime" />
            <span>{signal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
