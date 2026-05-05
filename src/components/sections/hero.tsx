
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import TiltCard from '../ui/tilt-card';
import Magnetic from '../ui/magnetic';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const portfolioImages: GalleryImage[] = projects
  .filter(p => !p.hiddenInHero)
  .flatMap(p => p.galleryImages || [])
  .sort((a, b) => {
    // Put GIFs first
    const isAGif = a.src.toLowerCase().endsWith('.gif');
    const isBGif = b.src.toLowerCase().endsWith('.gif');
    if (isAGif && !isBGif) return -1;
    if (!isAGif && isBGif) return 1;
    return 0;
  });

interface HeroProps {
  onOpenContact: () => void;
  lang: string;
  dictionary: any;
  renderHeadline: (headline: string, className?: string) => React.ReactNode;
}

const Hero: FC<HeroProps> = ({ onOpenContact, lang, dictionary, renderHeadline }) => {
  if (!dictionary) return null;

  return (
    <section
      className="relative bg-white overflow-hidden min-h-[100svh] flex flex-col justify-center"
      style={{ paddingTop: '110px' }}
      suppressHydrationWarning
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content: Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8 lg:space-y-10"
          >
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full w-fit backdrop-blur-sm group hover:bg-primary/10 transition-colors">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                {dictionary.urgencyBadge}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary/60 mb-2">
                {dictionary.preHeadline}
              </p>
              <div className="relative">
                {renderHeadline(dictionary.title, "text-slate-900 drop-shadow-sm leading-[1.1] tracking-tight")}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                {dictionary.description}
              </p>
            </div>

            {/* Mobile Visual (appears between text and buttons on mobile) */}
            <div className="lg:hidden">
               <HeroCarousel images={portfolioImages} />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <Magnetic>
                <Button 
                  size="xl" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-14 md:h-16 text-base md:text-lg font-bold shadow-2xl shadow-primary/30 group relative overflow-hidden"
                  onClick={onOpenContact}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {dictionary.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Magnetic>

              <Button 
                variant="outline" 
                size="xl" 
                asChild
                className="rounded-2xl px-8 h-14 md:h-16 text-base font-bold border-slate-200 hover:bg-slate-50 transition-all text-slate-700"
              >
                <Link href={`/${lang}/portfolio`}>
                  {dictionary.ctaSecondary}
                </Link>
              </Button>
            </div>

            {/* Trust Indicators / Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              {dictionary.stats?.map((stat: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                  <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {dictionary.guarantees?.map((g: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">{g}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content: Portfolio Carousel (Desktop Only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <TiltCard strength={5}>
              <HeroCarousel images={portfolioImages} />
            </TiltCard>

            {/* Floating Trust Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-12 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 hidden xl:block max-w-[220px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xs font-black text-slate-900 uppercase">Surgical Results</div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Biznesingizni strategik 'skalpel' bilan tahlil qilamiz va natijani kafolatlaymiz.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const HeroCarousel = ({ images }: { images: GalleryImage[] }) => (
  <div className="relative group w-full flex justify-center">
    <div className="relative w-full max-w-[500px] h-[350px] sm:h-[450px] lg:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 bg-slate-100 flex items-center justify-center">
      <Carousel
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        className="w-full h-full"
      >
        <CarouselContent className="h-full ml-0">
          {images.length > 0 ? (
            images.map((image, index) => (
              <CarouselItem key={index} className="h-full pl-0 relative min-h-full w-full">
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt || 'Jon Branding Portfolio'}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    quality={85}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="h-full pl-0 relative flex items-center justify-center bg-slate-200 w-full">
               <span className="text-muted-foreground font-bold italic text-sm">Portfolio rasmlari yuklanmoqda...</span>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
      {/* Decorative Glow */}
      <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full -z-10 opacity-30 animate-pulse" />
    </div>
  </div>
);

export default Hero;
