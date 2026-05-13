'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CtaBlockProps {
  title: string;
  description: string;
  buttonText: string;
  onCtaClick: () => void;
}

const CtaBlock: FC<CtaBlockProps> = ({ title, description, buttonText, onCtaClick }) => {
  return (
    <section className="bg-brand-paper py-16 lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-ink p-8 text-center text-white shadow-2xl sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(58,225,255,0.28),transparent_34rem),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.2),transparent_30rem)]" />
          <div className="relative z-10">
            <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white">
              <Zap className="h-3.5 w-3.5" />
              Cheklangan taklif
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/72">{description}</p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <Button
                onClick={onCtaClick}
                size="lg"
                variant="default"
                className="h-auto w-full animate-pulse-glow whitespace-normal rounded-2xl bg-white px-6 py-4 text-base font-black text-brand-ink shadow-lg hover:bg-brand-lime sm:w-auto sm:text-lg"
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <ShieldCheck className="h-4 w-4" />
                Majburiyatsiz, bosim yo'q
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
