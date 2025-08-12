'use client';

import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  onPrimaryClick: () => void;
}

const trustPills = [
    { title: "Xizmatlar", description: "Logo, Korporativ uslub, Brandbook" },
    { title: "Aynan bizdan", description: "50+ loyiha, 3 mamlakat, tez aloqa" },
    { title: "Aynan hozir", description: "PCG Tez Natija 3 uchun -50% chegirma" }
];

const Hero: FC<HeroProps> = ({ onPrimaryClick }) => {
  return (
    <section className="bg-secondary py-20 sm:py-28">
      <div className="container mx-auto px-4 text-center">
        <h1 data-testid="hero-title" className="text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark-blue">
          Shunchaki chiroyli emas, <br className="hidden sm:block" />
          balki <span className="text-primary">ishlaydigan</span> brending.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-700">
          Jon.Branding bilan strategiyaga asoslangan vizual ko‘rinishga ega bo‘ling va raqobatchilardan ajralib turing.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => onPrimaryClick()} size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-ocean">
            Hoziroq buyurtma berish
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
