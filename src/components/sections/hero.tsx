
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

  return (
    <section
      className="relative bg-background overflow-hidden min-h-[100svh] flex flex-col justify-center"
      style={{ paddingTop: '72px' }}
      suppressHydrationWarning
    >
      {/* Background glows */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[35rem] h-[35rem] bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 -translate-x-1/4 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── LEFT: Copy ── */}
          <div className="text-center lg:text-left">


            {/* Urgency Badge */}
            {dictionary.urgencyBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/20 backdrop-blur-xl text-red-500 text-[11px] font-black uppercase tracking-[0.25em] mb-8 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
                <Zap className="w-3.5 h-3.5 fill-red-500 text-red-500 relative z-10 animate-pulse" />
                <span className="relative z-10 drop-shadow-sm">{dictionary.urgencyBadge}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
              </motion.div>
            )}

            {/* Audience tag */}
            {dictionary.audienceTag && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-sm font-bold text-muted-foreground mb-3 tracking-wide"
              >
                {dictionary.audienceTag}
              </motion.div>
            )}

            {/* Headline — plain h1 for immediate LCP; CSS handles fade-in */}
            <h1
              data-testid="hero-title"
              className="text-[34px] leading-[1.0] sm:text-[52px] lg:text-[72px] xl:text-[88px] font-black text-foreground tracking-[-0.05em] mb-8 max-w-[1200px] mx-auto relative px-2 animate-fade-in-up"
            >
              {renderHeadline(dictionary.title || '')}
            </h1>

            {/* Description */}
            <p
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:100ms]"
            >
              {renderHeadline ? renderHeadline(dictionary.description || '') : dictionary.description}
            </p>

            {/* Guarantees — horizontal row */}
            {guarantees.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-wrap justify-center lg:justify-start gap-1.5 mb-4"
              >
                {guarantees.map((g: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    <Shield className="w-2.5 h-2.5" />
                    {g}
                  </span>
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
                  className="w-full sm:w-auto text-base px-8 py-4 shadow-xl rounded-xl relative group overflow-hidden bg-primary hover:bg-primary/95 transition-all duration-300 hover:scale-105 active:scale-95 btn-premium"
                  aria-label={dictionary.cta}
                >
                  <span className="relative z-10 flex items-center font-black text-base uppercase tracking-tight">
                    {dictionary.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </Magnetic>

              {dictionary.ctaSecondary && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-base px-6 py-4 rounded-xl font-bold text-primary hover:bg-primary/5 border border-primary/20"
                  onClick={() => {
                    const el = document.getElementById('results');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {dictionary.ctaSecondary}
                  <ChevronRight className="w-5 h-5 ml-1.5" />
                </Button>
              )}
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-[10px] text-muted-foreground text-center lg:text-left mb-4"
            >
              {dictionary.buttonHint}
            </motion.p>

          </div>

          {/* ── RIGHT: Image + Stats below ── */}
          <div className="flex flex-col gap-4 self-center p-4 lg:p-8 mt-12 lg:mt-0">
            <TiltCard strength={5} className="w-full">
              <div className="relative group">
                <Carousel
                  plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
                  className="w-full relative z-10"
                >
                  <CarouselContent>
                    {portfolioImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
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
                <div className="absolute -inset-8 bg-primary/10 blur-[80px] rounded-full -z-10 opacity-25 group-hover:opacity-50 transition-opacity duration-1000" />
              </div>
            </TiltCard>

            {/* Stats below image */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-around border border-border/50 rounded-2xl bg-white/60 backdrop-blur-sm px-4 py-3"
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl md:text-2xl font-black text-foreground tracking-tighter whitespace-nowrap">{s.value}</div>
                    <div className="text-[9px] md:text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-tight mt-0.5">{s.label}</div>
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
