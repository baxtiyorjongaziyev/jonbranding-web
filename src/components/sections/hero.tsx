
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
import React from 'react';
import TiltCard from '../ui/tilt-card';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';

const portfolioImages: GalleryImage[] = projects.flatMap(p => p.galleryImages || []);

interface HeroProps {
    onPrimaryClick: () => void;
    lang: string;
    dictionary: any;
    renderHeadline: (headline: string) => React.ReactNode;
}

const Hero: FC<HeroProps> = ({ onPrimaryClick, lang, dictionary, renderHeadline }) => {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!dictionary?.headlines) return;
    
    const headlineInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setHeadlineIndex((prevIndex) => (prevIndex + 1) % dictionary.headlines.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    const buttonInterval = setInterval(() => {
      setButtonIndex((prevIndex) => (prevIndex + 1) % dictionary.buttonTexts.length);
    }, 4000);

    return () => {
      clearInterval(headlineInterval);
      clearInterval(buttonInterval);
    };
  }, [dictionary]);

  if (!dictionary) return null;

  return (
    <section className="relative bg-background py-20 sm:py-28 lg:py-32 overflow-hidden" suppressHydrationWarning>
      <div aria-hidden="true" className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="max-w-2xl text-center lg:text-left">
                <h1 data-testid="hero-title" className={cn(
                "text-4xl leading-tight sm:text-5xl md:text-6xl font-extrabold text-foreground transition-opacity duration-500",
                isAnimating ? 'animate-text-fade-out' : 'animate-text-fade-in'
                )}>
                  {renderHeadline(dictionary.headlines[headlineIndex])}
                </h1>
                <p className="mx-auto lg:mx-0 mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.description }}>
                </p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-10 flex justify-center lg:justify-start"
                >
                    <Button 
                        onClick={() => onPrimaryClick()} 
                        size="lg" 
                        variant="default" 
                        className="w-full sm:w-auto text-base px-8 py-6 shadow-xl rounded-full relative group overflow-hidden bg-primary hover:bg-primary/95 transition-all duration-300" 
                        aria-label={dictionary.buttonTexts[buttonIndex]}
                    >
                        <span className="relative z-10 flex items-center">
                            {dictionary.buttonTexts[buttonIndex]}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </span>
                        <motion.div 
                            className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        />
                    </Button>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2"
                >
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    {dictionary.buttonHint}
                </motion.div>
            </div>
            <div className="flex justify-center items-center mt-10 lg:mt-0">
                <TiltCard strength={10} className="w-full max-w-[500px]">
                    <Card className="rounded-[2.5rem] shadow-2xl overflow-hidden w-full aspect-square border-none bg-white">
                        <Carousel
                            plugins={[Autoplay({ delay: 2500, stopOnInteraction: true })]}
                            className="w-full h-full"
                        >
                            <CarouselContent className="h-full">
                                {portfolioImages.map((image, index) => (
                                    <CarouselItem key={index} className="h-full">
                                        <div className="w-full h-full relative aspect-square">
                                            <Image 
                                                src={image.src}
                                                alt={image.alt || 'Jon Branding Portfolio'}
                                                fill
                                                priority={index === 0}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                                                className="object-cover bg-white"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </Card>
                </TiltCard>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
