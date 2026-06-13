'use client';

import { type FC, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BadgeCheck, CheckCircle2 } from 'lucide-react';
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

const HERO_BRANDS = [
  { name: 'Boyarin', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/e3f60742daeebc03b51ab018d630a87eb62ae7b1-546x140.png' },
  { name: 'Sarmilk', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/397532414b3865441a468b33dacc295f195030d1-511x112.png' },
  { name: 'Velzo', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/5789862c43bcf1423a4e7d9abfa9e976dcdce4c9-383x141.png' },
];

const HERO_STATS = [
  { value: '150+', label: 'Loyiha' },
  { value: '9 yil', label: 'Tajriba' },
  { value: '30+', label: 'Soha' },
  { value: '4 til', label: 'Bozor' },
] as const;

const Hero: FC<HeroProps> = ({ dictionary }) => {
  if (!dictionary) return null;

  const heroCopy = getHeroCopy(dictionary);
  const [spot, setSpot] = useState({ x: 50, y: 40 });
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

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

            <h1 className="max-w-[21rem] text-balance text-4xl font-bold leading-[1.02] tracking-tight text-foreground [overflow-wrap:normal] sm:max-w-[780px] sm:text-6xl sm:leading-[0.98] lg:text-[4.35rem] xl:text-[4.85rem]">
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
                className="group h-14 w-full justify-between rounded-full bg-[linear-gradient(135deg,#4448e8_0%,#2d31d4_100%)] py-2 pl-6 pr-2 text-[15px] font-extrabold text-white shadow-[0_26px_80px_-30px_rgba(68,72,232,0.85)] transition-[background-color,color,box-shadow,transform] duration-300 hover:shadow-[0_30px_90px_-26px_rgba(68,72,232,0.95)] active:scale-[0.98] sm:h-16 sm:w-auto sm:min-w-[260px] sm:text-base"
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
            <HeroPortfolio />
          </div>
        </div>
      </div>
    </section>
  );
};

function HeroPortfolio() {
  return (
    <div className="flex flex-col gap-3">
      {/* Main portfolio showcase image */}
      <div className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_120px_-60px_rgba(20,20,60,0.3)] ring-1 ring-black/[0.06]">
        <Image
          src="/images/cms/packaging-shelf.webp"
          alt="Jon.Branding — portfolio: qadoq dizayni"
          width={600}
          height={420}
          className="w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Portfolio · Case study</p>
            <p className="mt-0.5 text-base font-extrabold text-white">Qadoq dizayni</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur-sm">
            <BadgeCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Yakunlandi</span>
          </div>
        </div>
      </div>

      {/* Client brand logos */}
      <div className="grid grid-cols-3 gap-3">
        {HERO_BRANDS.map((brand) => (
          <div
            key={brand.name}
            className="flex h-16 items-center justify-center rounded-2xl border border-border bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)]"
          >
            <Image
              src={brand.logo}
              alt={`${brand.name} — Jon.Branding mijozi`}
              width={100}
              height={36}
              className="max-h-7 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div className="flex items-center divide-x divide-border rounded-2xl border border-border bg-white py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="flex-1 px-4 text-center">
            <div className="font-mono text-xl font-black tabular-nums text-foreground">{stat.value}</div>
            <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
