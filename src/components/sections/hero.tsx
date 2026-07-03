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
            <span key={i} className="font-serif font-normal italic text-indigo-400 drop-shadow-[0_2px_8px_rgba(99,102,241,0.2)]">
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

  if (!dictionary) return null;

  const heroCopy = getHeroCopy(dictionary);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-[#05070f] text-white" onMouseMove={onMouseMove}>
      {/* Background & Spotlight Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#05070f]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
        <motion.div style={{ y: blobY, scale: blobScale }} className="absolute left-1/2 top-[-10%] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute inset-0 transition-opacity duration-500" style={{ background: `radial-gradient(800px circle at ${spot.x}% ${spot.y}%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)` }} />
      </div>

      <div className="container relative mx-auto flex min-h-[100dvh] max-w-[1360px] items-center px-4 pb-28 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)] lg:gap-14 xl:gap-20">

          {/* Left: Text Content */}
          <motion.div style={{ opacity: contentOpacity }} className="w-full min-w-0">
            {heroCopy.agencyTagline && (
              <motion.div style={{ y: taglineY }} className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-indigo-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {heroCopy.agencyTagline}
              </motion.div>
            )}

            <motion.h1 style={{ y: titleY }} className="max-w-[21rem] text-balance text-[2.25rem] font-bold leading-[1.05] tracking-tight text-white [overflow-wrap:normal] sm:max-w-[780px] sm:text-5xl sm:leading-[0.98] lg:text-[4.35rem] xl:text-[4.85rem]">
              {renderHeadline(heroCopy.title)}
            </motion.h1>

            <motion.p style={{ y: descY }} className="mt-5 max-w-2xl text-pretty text-[15px] leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              {heroCopy.description}
            </motion.p>

            {/* Mobile-only: service chips */}
            {heroCopy.showcaseTags.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:hidden" style={{ scrollbarWidth: 'none' }}>
                {heroCopy.showcaseTags.map((tag) => (
                  <span key={tag} className="flex shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-bold text-indigo-300 whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Mobile-only: stats grid */}
            {heroCopy.mobileStats.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
                {heroCopy.mobileStats.map((s) => (
                  <div key={s.val} className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center shadow-lg">
                    <div className="text-[15px] font-extrabold text-indigo-300">{s.val}</div>
                    <div className="mt-0.5 text-[10px] font-medium leading-tight text-slate-400">{s.label}</div>
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
                className="group flex h-14 w-full items-center justify-between rounded-full bg-[linear-gradient(135deg,#3d3aff_0%,#1b18c2_100%)] py-2 pl-5 pr-2 text-[15px] font-extrabold text-white shadow-[0_20px_50px_-20px_rgba(61,58,255,0.5)] transition-all duration-300 hover:shadow-[0_24px_60px_-15px_rgba(61,58,255,0.7)] active:scale-[0.98] sm:h-16 sm:w-auto sm:min-w-[260px] sm:text-base"
              >
                <span>{heroCopy.cta}</span>
                <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-12 sm:w-12">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </ContactTriggerButton>
              <Link
                href="#audit-offer"
                className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-[15px] font-extrabold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/35 active:scale-[0.98] sm:h-16 sm:w-auto"
              >
                {heroCopy.ctaSecondary}
              </Link>
            </motion.div>

            {/* Desktop Integrated Stats */}
            <div className="mt-12 hidden grid-cols-4 gap-6 border-t border-white/10 pt-8 sm:grid">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="border-l border-white/10 pl-4">
                  <div className="font-mono text-2xl font-black text-white tabular-nums">{stat.value}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Proof items */}
            {heroCopy.proofItems.length > 0 && (
              <div className="mt-8 sm:mt-10">
                <div className="flex gap-3 overflow-x-auto pb-1 sm:hidden" style={{ scrollbarWidth: 'none' }}>
                  {heroCopy.proofItems.map((item) => (
                    <div key={item} className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-indigo-400" aria-hidden="true" />
                      <p className="whitespace-nowrap text-[13px] font-semibold text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="hidden max-w-3xl gap-4 sm:grid sm:grid-cols-3">
                  {heroCopy.proofItems.map((item) => (
                    <div key={item} className="border-l border-white/10 pl-4">
                      <CheckCircle2 className="mb-3 h-4 w-4 text-indigo-400" aria-hidden="true" />
                      <p className="text-sm font-semibold leading-6 text-slate-400">{item}</p>
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
                    className="h-7 w-7 rounded-full border-2 border-[#05070f] bg-gradient-to-br from-indigo-500/40 to-purple-600/40"
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
                <span className="text-[12px] font-semibold text-slate-400">150+ loyiha</span>
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
    <div className="relative w-full h-[520px] select-none">
      {/* Card 1: Top Right/Foreground - Den Aroma (Packaging) */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 1 }}
        animate={{ opacity: 1, y: 0, rotate: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
        whileHover={{ y: -15, scale: 1.04, rotate: 0, zIndex: 30 }}
        className="absolute right-[5%] top-[10%] z-20 w-[72%] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-2.5 backdrop-blur-md shadow-[0_30px_70px_rgba(0,0,0,0.6)] cursor-pointer transition-shadow duration-300 hover:shadow-[0_40px_80px_rgba(99,102,241,0.25)]"
      >
        <div className="relative overflow-hidden rounded-[1.5rem]">
          <Image
            src="/images/cms/denaroma-hozir.webp"
            alt="Den Aroma — Premium Qadoq dizayni"
            width={450}
            height={320}
            className="w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Den Aroma</p>
              <p className="text-sm font-extrabold text-white">Qadoq dizayni</p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-emerald-400 border border-emerald-500/30">
              Identika
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Middle Left/Behind - Savod Naming */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
        whileHover={{ y: -15, scale: 1.04, rotate: 0, zIndex: 30 }}
        className="absolute left-[2%] top-[38%] z-10 w-[64%] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-2.5 backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.6)] cursor-pointer transition-shadow duration-300 hover:shadow-[0_40px_80px_rgba(99,102,241,0.25)]"
      >
        <div className="relative overflow-hidden rounded-[1.5rem]">
          <Image
            src="/images/cms/savod-hozir.webp"
            alt="Savod — Neyming & Logo"
            width={380}
            height={270}
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Savod</p>
              <p className="text-sm font-extrabold text-white">Neyming & Logo</p>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-indigo-400 border border-indigo-500/30">
              Logotip
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Far Behind/Top Left - Brandbook Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 3 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
        whileHover={{ y: -15, scale: 1.04, rotate: 0, zIndex: 30 }}
        className="absolute left-[12%] top-[5%] z-0 w-[54%] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-2.5 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer transition-shadow duration-300 hover:shadow-[0_40px_80px_rgba(99,102,241,0.25)]"
      >
        <div className="relative overflow-hidden rounded-[1.5rem]">
          <Image
            src="/images/cms/brandbook-guide.webp"
            alt="Jon Branding — Brandbook"
            width={320}
            height={220}
            className="w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Brandbook</p>
              <p className="text-sm font-extrabold text-white">Qoidalar kitobi</p>
            </div>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-purple-400 border border-purple-500/30">
              Tizim
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
