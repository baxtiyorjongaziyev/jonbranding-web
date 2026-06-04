'use client';

import { type FC, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Target } from 'lucide-react';
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
            <span key={i} className="font-black italic text-primary">
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
  const [spot, setSpot] = useState({ x: 50, y: 40 });
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  if (!dictionary) return null;

  const heroCopy = getHeroCopy(dictionary);

  return (
    <section className="relative isolate overflow-hidden bg-white text-foreground" onMouseMove={onMouseMove}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,45,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,45,0.04)_1px,transparent_1px)] bg-[size:92px_92px] [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_78%)]" />
        <div className="absolute left-1/2 top-[-12%] h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute inset-0 transition-opacity duration-500" style={{ background: `radial-gradient(700px circle at ${spot.x}% ${spot.y}%, hsl(238 72% 50% / 0.08), transparent 55%)` }} />
      </div>

      <div className="container relative mx-auto flex min-h-[100dvh] max-w-[1360px] items-center px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)] lg:gap-14 xl:gap-20">
          <div className="w-full min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-3xl">
            {heroCopy.agencyTagline && (
              <div className="mb-5 inline-flex items-center gap-3 border-l border-primary/50 pl-4 text-[11px] font-bold uppercase tracking-normal text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {heroCopy.agencyTagline}
              </div>
            )}

            <h1 className="max-w-[21rem] text-balance text-4xl font-light leading-[1.02] tracking-tight text-foreground [overflow-wrap:normal] sm:max-w-[780px] sm:text-6xl sm:leading-[0.98] lg:text-[4.35rem] xl:text-[4.85rem]">
              {renderHeadline(heroCopy.title)}
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
              {heroCopy.description}
            </p>

            <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
              <ContactTriggerButton
                section="hero"
                ctaText={heroCopy.cta}
                size="lg"
                showArrow={false}
                className="group h-14 w-full justify-between rounded-full bg-[linear-gradient(135deg,#3d3aff_0%,#1b18c2_100%)] py-2 pl-6 pr-2 text-[15px] font-extrabold text-white shadow-[0_26px_80px_-30px_rgba(44,43,245,0.85)] transition-[background-color,color,box-shadow,transform] duration-300 hover:shadow-[0_30px_90px_-26px_rgba(44,43,245,0.95)] active:scale-[0.98] sm:h-16 sm:w-auto sm:min-w-[260px] sm:text-base"
              >
                <span>{heroCopy.cta}</span>
                <span className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-12 sm:w-12">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </ContactTriggerButton>
              <Link
                href="#audit-offer"
                className="inline-flex h-14 w-full items-center justify-center rounded-full border border-border bg-white px-6 text-[15px] font-extrabold text-foreground transition-[background-color,color,border-color,transform] duration-300 hover:border-primary hover:text-primary active:scale-[0.98] sm:h-16 sm:w-auto"
              >
                {heroCopy.ctaSecondary}
              </Link>
            </div>

            {heroCopy.proofItems.length > 0 && (
              <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-3">
                {heroCopy.proofItems.map((item) => (
                  <div key={item} className="border-l border-border pl-4">
                    <CheckCircle2 className="mb-3 h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold leading-6 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-[540px] lg:mr-0">
            <div className="rounded-[2rem] border border-border bg-secondary p-2 shadow-[0_40px_120px_-60px_rgba(20,20,60,0.45)]">
              <div className="rounded-[1.55rem] border border-border bg-white p-5 shadow-[0_1px_0_rgba(20,20,60,0.04)] sm:p-7">
                <AuditPanel copy={heroCopy} />

                {heroCopy.auditSignals.length > 0 && (
                  <div className="mt-6 divide-y divide-border border-y border-border">
                    {heroCopy.auditSignals.map((signal, index) => (
                      <div key={signal} className="grid grid-cols-[3.25rem_1fr] gap-4 py-4">
                        <div className="font-mono text-sm font-bold text-primary tabular-nums">0{index + 1}</div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-normal text-muted-foreground">{heroCopy.auditScoreLabel}</div>
                          <p className="mt-1 text-sm font-semibold leading-6 text-foreground">{signal}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {heroCopy.showcaseTags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {heroCopy.showcaseTags.map((tag) => (
                      <div key={tag} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 text-xs font-bold text-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
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
    <div>
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-normal text-primary">
            <Target className="h-4 w-4" aria-hidden="true" />
            <span>{copy.preHeadline || copy.auditScoreLabel}</span>
          </div>
          <h2 className="max-w-sm text-pretty text-2xl font-extrabold leading-tight tracking-normal text-foreground sm:text-3xl">
            {copy.auditTitle}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{copy.auditSubtitle}</p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3d3aff_0%,#1b18c2_100%)] text-sm font-extrabold text-white shadow-[0_18px_40px_-18px_rgba(44,43,245,0.8)]">
          {copy.auditScore}
        </div>
      </div>
    </div>
  );
}

export default Hero;