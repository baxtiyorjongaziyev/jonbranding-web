
'use client';

import type {FC} from 'react';
import { useState, useEffect } from 'react';
import {Button} from '@/components/ui/button';
import {CheckCircle, Search} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';


interface HeroProps {
  onPrimaryClick: () => void;
}

const headlines = [
  <>Brendingiz <span className="text-accent">sotmayaptimi?</span> Biz buni to'g'rilaymiz.</>,
  <>Raqobatchilardan <span className="text-accent">keskin ajralib</span> turing.</>,
  <>Brendingizni shunchaki "chiroyli" emas, <span className="text-accent">daromadli</span> qiling.</>,
  <>Mijozlar sizni <span className="text-accent">sevib qolsin</span>. Qayta va qayta.</>,
  <>Kichik biznesdan <span className="text-accent">kuchli brendgacha</span>. Bir qadamda.</>,
];

const buttonTexts = [
  "Brendimni tahlil qiling",
  "Sotuvni oshirishga yordam bering",
  "Bepul strategik konsultatsiya",
  "Menga kuchli brend kerak"
];


const Hero: FC<HeroProps> = ({ onPrimaryClick }) => {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setHeadlineIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        setIsAnimating(false);
      }, 500); // half a second for fade out
    }, 4000); // 4 seconds per headline

    const buttonInterval = setInterval(() => {
      setButtonIndex((prevIndex) => (prevIndex + 1) % buttonTexts.length);
    }, 4000);

    return () => {
      clearInterval(headlineInterval);
      clearInterval(buttonInterval);
    };
  }, []);

  return (
    <section className="relative bg-background py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          
            <h1 data-testid="hero-title" className={cn(
              "text-4xl leading-tight sm:text-5xl md:text-6xl font-extrabold text-foreground transition-opacity duration-500",
              isAnimating ? 'animate-text-fade-out' : 'animate-text-fade-in'
            )}>
              {headlines[headlineIndex]}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
              Biz shunchaki logotip chizmaymiz. Biz biznesingiz uchun <span className="font-bold text-foreground">natija keltiradigan</span>, strategiyaga asoslangan va mijozlaringiz qalbidan joy oladigan brend tizimini qurib beramiz.
            </p>
            <div className="mt-10 flex justify-center">
              <Button onClick={() => onPrimaryClick()} size="lg" variant="default" className="w-full sm:w-auto text-lg px-10 py-7 bg-accent text-accent-foreground hover:bg-accent/90 shadow-ocean animate-breathing">
                {buttonTexts[buttonIndex]}
              </Button>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
                Bepul. Majburiyatlarsiz.
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
