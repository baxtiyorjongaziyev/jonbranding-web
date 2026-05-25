'use client';

import { type FC, useCallback, useRef } from 'react';
import Link from 'next/link';
import { BarChart3, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import ContactTriggerButton from '@/components/contact-trigger-button';

type HeroDictionary = {
  agencyTagline?: string;
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
    agencyTagline: dictionary.agencyTagline || '',
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
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!spotlightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(132,213,180,0.07), transparent 70%)`;
  }, []);

  if (!dictionary) return null;

  const heroCopy = getHeroCopy(dictionary);

  return (
    <section
      className="relative isolate min-h-[760px] overflow-hidden bg-[#06080d] text-white sm:min-h-[780px] lg:min-h-[820px]"
      onMouseMove={handleMouseMove}
    >
      <div ref={spotlightRef} className="pointer-events-none absolute inset-0 z-0 transition-[background] duration-300" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#06080d_0%,#11151f_58%,#132016_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:86px_86px] opacity-28" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,13,0.96)_0%,rgba(6,8,13,0.75)_48%,rgba(6,8,13,0.28)_100%)]" />
      </div>

      <div
        className="container relative z-10 mx-auto flex min-h-[760px] max-w-[1400px] items-center px-4 pb-16 pt-24 sm:min-h-[780px] sm:px-6 sm:pb-20 lg:min-h-[820px] lg:px-8 lg:pb-20 lg:pt-28"
      >
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div
              className="mb-6 inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md lg:self-start"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
              <span className="text-[11px] font-black uppercase tracking-normal text-white/78">{heroCopy.preHeadline}</span>
            </div>

            {heroCopy.agencyTagline && (
              <div className="mb-4 flex items-center justify-center gap-2 self-center lg:self-start text-[11px] font-black uppercase tracking-widest text-brand-lime">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime"></span>
                </span>
                {heroCopy.agencyTagline}
              </div>
            )}
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
                className="group h-14 rounded-full bg-white px-8 text-base font-black text-brand-ink shadow-[0_24px_70px_-24px_rgba(255,255,255,0.75)] transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-brand-lime hover:text-brand-ink hover:shadow-[0_24px_70px_-24px_rgba(84,213,233,0.72)] active:scale-[0.98] sm:h-16"
              >
                {heroCopy.cta}
              </ContactTriggerButton>
              <Link
                href="#audit-offer"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 text-base font-black text-white/85 transition-[background-color,color,border-color] duration-200 hover:bg-white/10 hover:text-white sm:h-16"
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
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.055] px-3 py-2 text-left text-xs font-bold leading-5 text-white/80 backdrop-blur-md sm:min-h-14 sm:px-4 sm:py-3 sm:text-sm"
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
            <div className="jb-dark-panel relative w-full max-w-xl overflow-hidden p-5 backdrop-blur-xl lg:max-w-none">
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
              <AuditPanel copy={heroCopy} />
              <div className="mt-4 grid gap-3">
                {heroCopy.auditSignals.map((signal, index) => (
                  <div key={signal} className="grid grid-cols-[44px_1fr] items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.055] p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-lime text-sm font-black text-brand-ink">
                      0{index + 1}
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-normal text-brand-lime">Audit signal</div>
                      <div className="mt-0.5 text-sm font-bold leading-5 text-white/82">{signal}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 hidden grid-cols-3 gap-3 lg:grid">
                {heroCopy.showcaseTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.055] px-4 py-3 text-[11px] font-black uppercase tracking-normal text-white/80"
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

function AuditPanel({ copy }: { copy: ReturnType<typeof getHeroCopy> }) {
  return (
    <div className="mt-2 rounded-2xl border border-white/15 bg-[#06080d]/86 p-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-5">
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
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-lime text-sm font-black text-brand-ink shadow-[0_16px_40px_-18px_rgba(84,213,233,0.8)]">
            {copy.auditScore}
          </div>
          <BarChart3 className="hidden h-7 w-7 text-brand-lime sm:block" />
        </div>
      </div>

    </div>
  );
}

export default Hero;
