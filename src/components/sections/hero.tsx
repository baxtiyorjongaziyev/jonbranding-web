'use client';

import type {FC} from 'react';
import { useState, useEffect } from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {CheckCircle, Package} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroProps {
  onPrimaryClick: () => void;
}

const trustPills = [
    { title: "Nega bu xizmat?", description: "Chunki kuchli brending sizni raqobatchilardan ajratib turadi va daromadingizni oshiradi." },
    { title: "Nega aynan biz?", description: "50+ muvaffaqiyatli loyiha, 3 davlatda tajriba va har bir bosqichda siz bilan hamkorlik." },
    { title: "Nega aynan hozir?", description: "PCG a'zolari uchun maxsus -50% chegirmadan foydalanib qoling!" }
];

const headlines = [
  <>Shunchaki chiroyli emas, balki <span className="text-primary">ishlaydigan</span> brending.</>,
  <>Brendingizni <span className="text-primary">muvaffaqiyatga</span> yetaklang.</>,
  <>PCG kursdoshlar uchun <span className="text-primary">-50% chegirma</span>.</>,
  <>Brendingiz <span className="text-primary">sotuvlaringizni</span> oshirsin.</>,
  <>Kichik biznesdan <span className="text-primary">kuchli brendgacha</span>.</>,
];

const buttonTexts = [
  "Bepul konsultatsiya olish",
  "Brendimni baholatish",
  "Brending audit o'tkazish",
  "Strategiyani muhokama qilish"
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
    <section className="bg-secondary py-20 sm:py-28">
      <div className="container mx-auto px-4 text-center">
        <h1 data-testid="hero-title" className={cn(
          "text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark-blue transition-opacity duration-500",
          isAnimating ? 'animate-text-fade-out' : 'animate-text-fade-in'
        )}>
          {headlines[headlineIndex]}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-700">
          Jon.Branding bilan strategiyaga asoslangan vizual ko‘rinishga ega bo‘ling va raqobatchilardan ajralib turing.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => onPrimaryClick()} size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-ocean animate-subtle-pulse">
            {buttonTexts[buttonIndex]}
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white">
            <Link href="#package-builder">
              <Package className="mr-2 h-5 w-5" />
              Paketlarni tanlash
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustPills.map((pill, index) => (
                <Card key={index} className="text-left bg-white/70 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-dark-blue text-base">{pill.title}</h3>
                            <p className="text-gray-600 text-sm">{pill.description}</p>
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
