'use client';

import { type FC, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BadgeCheck, CheckCircle2, Star } from 'lucide-react';
import ContactTriggerButton from '@/components/contact-trigger-button';
import { motion, useScroll, useTransform } from 'framer-motion';

type HeroDictionary = {
  agencyTagline?: string;
  preHeadline?: string;
  title?: string;
  descriptionPlain?: string;
  description?: string;
  cta?: string;
  ctaSecondary?: string;
  proofItems?: string[];
  showcaseTags?: string[];
  mobileStats?: { val: string; label: string }[];
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
    showcaseTags: dictionary.showcaseTags?.length ? dictionary.showcaseTags : [],
    mobileStats: dictionary.mobileStats?.length ? dictionary.mobileStats : [],
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

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const blobScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const taglineY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const descY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const ctaY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const panelY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-brand-paper text-foreground" onMouseMove={onMouseMove}>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-brand-paper" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,45,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,45,0.04)_1px,transparent_1px)] bg-[size:92px_92px] [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_78%)]" />
        <motion.div style={{ y: blobY, scale: blobScale }} className="absolute left-1/2 top-[-12%] h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute inset-0 transition-opacity duration-500" style={{ background: `radial-gradient(700px circle at ${spot.x}% ${spot.y}%, hsl(238 72% 50% / 0.08), transparent 55%)` }} />
      </div>

      <div className="container relative mx-auto flex min-h-[100dvh] max-w-[1360px] items-center px-4 pb-28 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)] lg:gap-14 xl:gap-20">

          {/* Left: Text Content */}
          <motion.div style={{ opacity: contentOpacity }} className="w-full min-w-0">
            {heroCopy.agencyTagline && (
              <motion.div style={{ y: taglineY }} className="mb-4 inline-flex items-center gap-3 border-l border-primary/50 pl-4 text-[11px] font-bold uppercase tracking-normal text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {heroCopy.agencyTagline}
              </motion.div>
            )}

            <motion.h1 style={{ y: titleY }} className="max-w-[21rem] text-balance text-[2.25rem] font-bold leading-[1.05] tracking-tight text-foreground [overflow-wrap:normal] sm:max-w-[780px] sm:text-5xl sm:leading-[0.98] lg:text-[4.35rem] xl:text-[4.85rem]">
              {renderHeadline(heroCopy.title)}
            </motion.h1>

            <motion.p style={{ y: descY }} className="mt-5 max-w-2xl text-pretty text-[15px] leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              {heroCopy.description}
            </motion.p>

            {/* Mobile-only: service chips */}
            {heroCopy.showcaseTags.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:hidden" style={{ scrollbarWidth: 'none' }}>
                {heroCopy.showcaseTags.map((tag) => (
                  <span key={tag} className="flex shrink-0 items-center rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-[12px] font-bold text-primary whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Mobile-only: stats grid */}
            {heroCopy.mobileStats.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
                {heroCopy.mobileStats.map((s) => (
                  <div key={s.val} className="rounded-2xl border border-border bg-white px-2 py-3 text-center shadow-sm">
                    <div className="text-[15px] font-extrabold text-primary">{s.val}</div>
                    <div className="mt-0.5 text-[10px] font-medium leading-tight text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <motion.div style={{ y: ctaY }} className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
              <ContactTriggerButton
                section="hero"
                ctaText={heroCopy.cta}
                size="lg"
                showArrow={false}
                className="group flex h-14 w-full items-center justify-between rounded-2xl bg-[linear-gradient(135deg,#3d3aff_0%,#1b18c2_100%)] py-2 pl-5 pr-2 text-[15px] font-extrabold text-white shadow-[0_20px_60px_-24px_rgba(44,43,245,0.75)] transition-all duration-300 hover:shadow-[0_24px_70px_-20px_rgba(44,43,245,0.9)] active:scale-[0.98] sm:h-16 sm:w-auto sm:min-w-[260px] sm:rounded-full sm:text-base"
              >
                <span>{heroCopy.cta}</span>
                <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:rounded-full sm:h-12 sm:w-12">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </ContactTriggerButton>
              <Link
                href="#audit-offer"
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-white px-6 text-[15px] font-extrabold text-foreground transition-all duration-300 hover:border-primary hover:text-primary active:scale-[0.98] sm:h-16 sm:w-auto sm:rounded-full"
              >
                {heroCopy.ctaSecondary}
              </Link>
            </motion.div>

            {/* Proof items */}
            {heroCopy.proofItems.length > 0 && (
              <div className="mt-7 sm:mt-9">
                <div className="flex gap-3 overflow-x-auto pb-1 sm:hidden" style={{ scrollbarWidth: 'none' }}>
                  {heroCopy.proofItems.map((item) => (
                    <div key={item} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                      <p className="whitespace-nowrap text-[13px] font-semibold text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="hidden max-w-3xl gap-4 sm:grid sm:grid-cols-3">
                  {heroCopy.proofItems.map((item) => (
                    <div key={item} className="border-l border-border pl-4">
                      <CheckCircle2 className="mb-3 h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold leading-6 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile-only trust strip */}
            <div className="mt-6 flex items-center gap-3 sm:hidden">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-primary/40 to-indigo-600/40"
                    style={{ zIndex: 4 - i }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[12px] font-semibold text-muted-foreground">150+ loyiha</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Portfolio Panel — hidden on mobile, shown sm+ */}
          <motion.div style={{ y: panelY, opacity: contentOpacity }} className="relative mx-auto hidden w-full min-w-0 max-w-[540px] sm:block lg:mr-0">
            <HeroPortfolio />
          </motion.div>

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
