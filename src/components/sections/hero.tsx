
'use client';

import type {FC} from 'react';
import { useState, useEffect, useRef } from 'react';
import {Button} from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import React from 'react';
import TiltCard from '../ui/tilt-card';

interface HeroProps {
  onPrimaryClick: () => void;
  lang: string;
  dictionary: any;
}

const portfolioImages = [
  'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/6747f48137e17a98411d6346_LOGO.gif',
  'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/67513d8fe1caee5495e0f9bd_ezgif-6-3f24b1faa6.gif',
  'https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png',
  'https://img2.teletype.in/files/17/9c/179c7811-8cf7-4ee9-87ad-66709208b115.png',
  'https://img1.teletype.in/files/84/db/84dbe512-edc1-4386-a986-29114e8d8be2.png'
];


const Hero: FC<HeroProps> = ({ onPrimaryClick, lang, dictionary }) => {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setHeadlineIndex((prevIndex) => (prevIndex + 1) % dictionary.headlines.length);
        setIsAnimating(false);
      }, 500); // half a second for fade out
    }, 4000); // 4 seconds per headline

    const buttonInterval = setInterval(() => {
      setButtonIndex((prevIndex) => (prevIndex + 1) % dictionary.buttonTexts.length);
    }, 4000);

    return () => {
      clearInterval(headlineInterval);
      clearInterval(buttonInterval);
    };
  }, [dictionary]);

  return (
    <section className="relative bg-background py-20 sm:py-28 lg:py-32 overflow-hidden">
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
                )} dangerouslySetInnerHTML={{ __html: dictionary.headlines[headlineIndex] }}>
                </h1>
                <p className="mx-auto lg:mx-0 mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.description }}>
                </p>
                <div className="mt-10 flex justify-center lg:justify-start">
                    <Button onClick={() => onPrimaryClick()} size="lg" variant="default" className="w-full sm:w-auto text-base px-8 py-6 shadow-lg">
                        {dictionary.buttonTexts[buttonIndex]}
                        <ArrowRight className="w-5 h-5"/>
                    </Button>
                </div>
                <div className="mt-6 text-sm text-muted-foreground">
                    {dictionary.buttonHint}
                </div>
            </div>
            <div className="flex justify-center items-center mt-10 lg:mt-0">
                <TiltCard strength={10} className="w-full max-w-[500px] h-auto aspect-square">
                    <Card className="rounded-2xl shadow-2xl overflow-hidden w-full h-full">
                        <Carousel
                            plugins={[Autoplay({ delay: 2500, stopOnInteraction: true })]}
                            className="w-full h-full"
                        >
                            <CarouselContent>
                                {portfolioImages.map((src, index) => (
                                    <CarouselItem key={index}>
                                        <div className="w-full h-full relative aspect-square">
                                            <Image 
                                                src={src}
                                                alt={`Portfolio ishi ${index + 1}`}
                                                layout="fill"
                                                objectFit="cover"
                                                unoptimized={src.endsWith('.gif')}
                                                className="bg-white"
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
