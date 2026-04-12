
'use client';

import type {FC} from 'react';
import { useState, useEffect } from 'react';
import {Button} from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card } from '../ui/card';
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

  return (
    <section className="relative bg-background py-20 sm:py-28 lg:py-32 overflow-hidden" suppressHydrationWarning>
      <div aria-hidden="true" className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="max-w-2xl text-center lg:text-left pt-6 lg:pt-10">
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  data-testid="hero-title" 
                  className="text-4xl leading-[1.1] sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight"
                >
                  {renderHeadline(dictionary.title || dictionary.headlines?.[0] || '')}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                  className="mx-auto lg:mx-0 mt-6 lg:mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: dictionary.description }}
                >
                </motion.p>
                <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                    <Magnetic>
                        <motion.div 
                            className="w-full sm:w-auto"
                        >
                            <Button 
                                onClick={() => onPrimaryClick()} 
                                size="lg" 
                                variant="default" 
                                className="w-full sm:w-auto text-base px-8 py-7 shadow-xl rounded-full relative group overflow-hidden bg-primary hover:bg-primary/95 transition-all duration-300 hover:shadow-ocean hover:scale-105 active:scale-95" 
                                aria-label={dictionary.cta || dictionary.buttonTexts?.[0]}
                            >
                                <span className="relative z-10 flex items-center font-bold">
                                    {dictionary.cta || dictionary.buttonTexts?.[0]}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                            </Button>
                        </motion.div>
                    </Magnetic>
                </div>
                <div className="mt-6 text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2 italic opacity-80">
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    {dictionary.buttonHint}
                </div>
            </div>
            <div className="flex justify-center items-start mt-10 lg:mt-0 px-8 lg:px-16 h-full">
                <TiltCard strength={5} className="w-full max-w-[800px] h-fit">
                    <div className="relative group perspective-1000 h-fit">
                        <Carousel
                            plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
                            className="w-full transition-all duration-700 h-auto -m-20 p-20"
                        >
                            <CarouselContent className="items-start h-auto">
                                {portfolioImages.map((image, index) => (
                                    <CarouselItem key={index} className="flex justify-center h-full py-6">
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                            className="relative w-full h-auto flex items-center justify-center p-4"
                                        >
                                            <Image 
                                                src={image.src}
                                                alt={image.alt || 'Jon Branding Portfolio'}
                                                width={1000}
                                                height={667}
                                                className="w-full h-auto object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                                            />
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        
                        {/* Dynamic background glow that follows the card */}
                        <div className="absolute -inset-6 bg-primary/5 blur-3xl rounded-[3rem] -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="absolute -inset-10 bg-accent/5 blur-[100px] rounded-full -z-20 animate-pulse" />
                    </div>
                </TiltCard>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
