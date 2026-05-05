
'use client';

import type {FC} from 'react';
import {Button} from '@/components/ui/button';
import { ArrowRight, Shield, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import TiltCard from '../ui/tilt-card';
import Magnetic from '../ui/magnetic';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';
import { BrandBadge, BrandCard } from '@/components/ui/design-system';

const portfolioImages: GalleryImage[] = projects
  .filter(p => !p.hiddenInHero)
  .flatMap(p => p.galleryImages || []);

interface HeroProps {
    onPrimaryClick: () => void;
    lang: string;
    dictionary: any;
    renderHeadline: (headline: string) => React.ReactNode;
}

const Hero: FC<HeroProps> = ({ onPrimaryClick, lang, dictionary, renderHeadline }) => {
  if (!dictionary) return null;

  const stats: { value: string; label: string }[] = dictionary.stats || [
    { value: '150+', label: "brend yaratilgan" },
    { value: '2-3x', label: "sotuv o'sishi" },
    { value: '98%', label: "mijozlar mamnun" },
  ];

  const guarantees: string[] = dictionary.guarantees || [
    '100% natija kafolati',
    '30 kun ichida tayyor',
    '150+ muvaffaqiyatli loyiha',
  ];
  const primaryCta =
    lang === 'uz'
      ? 'Brendimni bepul tahlil qildirish'
      : lang === 'ru'
        ? 'Получить бесплатный аудит бренда'
        : lang === 'zh'
          ? '免费分析我的品牌'
          : 'Get my free brand audit';
  const secondaryCta =
    lang === 'uz'
      ? 'Natijalarni ko‘rish'
      : dictionary.ctaSecondary;

  return (
    <section
      className="relative overflow-hidden min-h-[100svh] flex flex-col justify-center bg-brand-paper"
      style={{ paddingTop: '72px' }}
      suppressHydrationWarning
    >
      {/* Background glows */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 right-[-12rem] h-[42rem] w-[42rem] rounded-full bg-brand-cyan/20 blur-3xl" />
        <div className="absolute bottom-12 left-[-16rem] h-[46rem] w-[46rem] rounded-full bg-brand-blue/10 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white/70 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.98fr_1.02fr] gap-8 lg:gap-14 items-center">

          {/* ── LEFT: Copy ── */}
          <div className="text-center lg:text-left">

            {/* Audience Call-out (Sabri Suby Step 1) */}
            {dictionary.preHeadline && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-primary text-[12px] sm:text-sm font-black uppercase tracking-[0.3em] mb-4 drop-shadow-sm flex items-center justify-center lg:justify-start gap-2"
              >
                <span className="w-8 h-[2px] bg-primary hidden sm:block" />
                {dictionary.preHeadline}
              </motion.div>
            )}

            {/* Urgency Badge */}
            {dictionary.urgencyBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-xl text-red-500 text-[11px] font-black uppercase tracking-[0.25em] mb-8 shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
                <Zap className="w-3.5 h-3.5 fill-red-500 text-red-500 relative z-10 animate-pulse" />
                <span className="relative z-10 drop-shadow-sm">{dictionary.urgencyBadge}</span>
              </motion.div>
            )}

            {/* Audience tag */}
            {dictionary.audienceTag && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mb-4 inline-flex rounded-full border border-brand-line bg-white/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-brand-blue shadow-sm"
              >
                {dictionary.audienceTag}
              </motion.div>
            )}

            {/* Headline — plain h1 for immediate LCP; CSS handles fade-in */}
            <h1
              data-testid="hero-title"
              className="text-balance text-[36px] leading-[0.98] sm:text-[54px] lg:text-[68px] xl:text-[78px] font-black text-brand-ink tracking-[-0.07em] mb-6"
            >
              {renderHeadline(dictionary.title || '')}
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto lg:mx-0 max-w-2xl text-lg sm:text-xl text-brand-slate leading-8 mb-8"
              dangerouslySetInnerHTML={{ __html: dictionary.description }}
            />

            {/* Guarantees — horizontal row */}
            {guarantees.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5"
              >
                {guarantees.map((g: string, i: number) => (
                  <BrandBadge key={i} className="text-green-800">
                    <Shield className="w-3 h-3 text-green-600" />
                    {g}
                  </BrandBadge>
                ))}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2.5 mb-2"
            >
              <Magnetic>
                <Button
                  onClick={() => onPrimaryClick()}
                  size="lg"
                  variant="default"
                  className="w-full sm:w-auto min-h-14 text-base px-8 py-4 shadow-xl rounded-2xl relative group overflow-hidden bg-brand-ink hover:bg-brand-blue transition-all duration-300 hover:scale-[1.02] active:scale-95 btn-premium"
                  aria-label={primaryCta}
                >
                  <span className="relative z-10 flex items-center font-black text-base uppercase tracking-tight">
                    {primaryCta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </Magnetic>

              {secondaryCta && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-base px-6 py-4 rounded-2xl font-bold text-brand-ink hover:bg-white border border-brand-line bg-white/65"
                  onClick={() => {
                    const el = document.getElementById('results');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {secondaryCta}
                  <ChevronRight className="w-5 h-5 ml-1.5" />
                </Button>
              )}
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-[11px] text-brand-slate text-center lg:text-left mb-4"
            >
              {dictionary.buttonHint}
            </motion.p>

          </div>

          {/* ── RIGHT: Image + Stats below ── */}
          <div className="flex flex-col gap-4 self-center mt-12 lg:mt-0">
            <TiltCard strength={5} className="w-full">
              <BrandCard className="relative group overflow-hidden p-2 sm:p-3">
                <Carousel
                  plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
                  className="w-full relative z-10"
                >
                  <CarouselContent>
                    {portfolioImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full rounded-[1.65rem] overflow-hidden shadow-2xl border border-white/70">
                          <Image
                            src={image.src}
                            alt={image.alt || 'Jon Branding Portfolio'}
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover"
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <div className="absolute -inset-8 bg-brand-blue/10 blur-[80px] rounded-full -z-10 opacity-25 group-hover:opacity-50 transition-opacity duration-1000" />
              </BrandCard>
            </TiltCard>

            {/* Stats below image */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="brand-card grid grid-cols-3 gap-2 px-4 py-4"
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-brand-ink tracking-tighter">{s.value}</div>
                    <div className="text-[10px] text-brand-slate font-semibold uppercase tracking-widest leading-tight mt-0.5">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
