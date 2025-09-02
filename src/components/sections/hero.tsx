
'use client';

import type {FC} from 'react';
import { useState, useEffect } from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {CheckCircle, Search} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface HeroProps {
  onPrimaryClick: () => void;
}

const trustPills = [
    { title: "Nega bu xizmat?", description: "Chunki kuchli brending sizni raqobatchilardan ajratib turadi va daromadingizni oshiradi." },
    { title: "Nega aynan biz?", description: "50+ muvaffaqiyatli loyiha, 3 davlatda tajriba va har bir bosqichda siz bilan hamkorlik." },
    { title: "Nega aynan hozir?", description: "PCG a'zolari uchun maxsus -50% chegirmadan foydalanib qoling!" }
];

const headlines = [
  <>Shunchaki chiroyli emas, balki <span className="text-accent">ishlaydigan</span> brending.</>,
  <>Brendingizni <span className="text-accent">muvaffaqiyatga</span> yetaklang.</>,
  <>PCG kursdoshlar uchun <span className="text-accent">-50% chegirma</span>.</>,
  <>Brendingiz <span className="text-accent">sotuvlaringizni</span> oshirsin.</>,
  <>Kichik biznesdan <span className="text-accent">kuchli brendgacha</span>.</>,
];

const buttonTexts = [
  "Bepul konsultatsiya olish",
  "Brendimni baholatish",
  "Brending audit o'tkazish",
  "Strategiyani muhokama qilish"
];

const heroImages = [
    { src: 'https://img2.teletype.in/files/51/45/5145b60e-aca5-4225-8564-a4d601a148a7.jpeg', alt: 'Brand Style Guide', hint: 'brand styleguide', className: 'rounded-xl col-span-2 row-span-2' },
    { src: 'https://img1.teletype.in/files/83/c2/83c2c300-af89-482e-8052-15189ac22aff.jpeg', alt: 'Logo Design Process', hint: 'logo design process', className: 'rounded-xl' },
    { src: 'https://img1.teletype.in/files/84/76/8476f287-2ba0-4164-898a-d2d7c353a27e.jpeg', alt: 'Packaging Design', hint: 'branding application', className: 'rounded-xl' },
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
    <section className="bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 data-testid="hero-title" className={cn(
              "text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground transition-opacity duration-500",
              isAnimating ? 'animate-text-fade-out' : 'animate-text-fade-in'
            )}>
              {headlines[headlineIndex]}
            </h1>
            <p className="mx-auto lg:mx-0 mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
              Jon.Branding bilan strategiyaga asoslangan vizual ko‘rinishga ega bo‘ling va raqobatchilardan ajralib turing.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button onClick={() => onPrimaryClick()} size="lg" variant="default" className="w-full sm:w-auto text-lg px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90 shadow-ocean animate-subtle-pulse">
                {buttonTexts[buttonIndex]}
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-foreground/20 text-foreground hover:bg-primary hover:text-primary-foreground">
                <Link href="#package-builder">
                  <Search className="mr-2 h-5 w-5" />
                  Brending Audit o'tkazish
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[400px]">
                {heroImages.map((image, index) => (
                     <div key={index} className={cn("relative shadow-lg", image.className)}>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover rounded-xl"
                            data-ai-hint={image.hint}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustPills.map((pill, index) => (
                <Card key={index} className="text-left bg-card/70 backdrop-blur-sm border-border/60 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-card-foreground text-base">{pill.title}</h3>
                            <p className="text-muted-foreground text-sm">{pill.description}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
