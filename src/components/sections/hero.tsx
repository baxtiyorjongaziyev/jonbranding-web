'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';

const portfolioImages: GalleryImage[] = projects
  .filter((project) => !project.hiddenInHero)
  .flatMap((project) => project.galleryImages || [])
  .filter((image) => !image.src.toLowerCase().endsWith('.gif'))
  .slice(0, 10);

interface HeroProps {
  onOpenContact: () => void;
  lang: string;
  dictionary: any;
  renderHeadline: (headline: string, className?: string) => React.ReactNode;
}

const heroCopyByLang = {
  uz: {
    preHeadline: 'Bepul Brand Audit',
    title: "Brendingiz **arzon ko'rinmasin**.",
    description:
      "Nom, logo, qadoq, sayt va kommunikatsiyangiz mijozda ishonch uyg'otyaptimi yoki sotuvni sekinlashtiryaptimi - aniq ko'rsatib beramiz.",
    cta: 'Bepul Brand Audit olish',
    ctaSecondary: "Auditda nima olaman?",
    proofItems: ["5 ta ishonch yo'qotadigan nuqta", "Raqobatchiga nisbatan ko'rinish", "Qaysi xizmat hozir kerakligini bilasiz"],
  },
  ru: {
    preHeadline: 'Free Brand Audit',
    title: 'Your brand should not look cheap.',
    description: 'We show where your name, logo, packaging, website, and message lose trust or slow down the buying decision.',
    cta: 'Get the free brand audit',
    ctaSecondary: 'What is inside?',
    proofItems: ['5 trust gaps', 'Competitor view', 'Clear next step'],
  },
  en: {
    preHeadline: 'Free Brand Audit',
    title: 'Your brand should not look cheap.',
    description: 'We show where your name, logo, packaging, website, and message lose trust or slow down the buying decision.',
    cta: 'Get the free brand audit',
    ctaSecondary: 'What is inside?',
    proofItems: ['5 trust gaps', 'Competitor view', 'Clear next step'],
  },
  zh: {
    preHeadline: 'Free Brand Audit',
    title: 'Your brand should not look cheap.',
    description: 'We show where your name, logo, packaging, website, and message lose trust or slow down the buying decision.',
    cta: 'Get the free brand audit',
    ctaSecondary: 'What is inside?',
    proofItems: ['5 trust gaps', 'Competitor view', 'Clear next step'],
  },
};

const Hero: FC<HeroProps> = ({ onOpenContact, lang, dictionary, renderHeadline }) => {
  if (!dictionary) return null;

  const heroCopy = heroCopyByLang[(lang as keyof typeof heroCopyByLang) || 'uz'] || heroCopyByLang.uz;

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#060a16]">
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[5%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute right-[15%] top-[15%] h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(var(--brand-paper))] to-transparent" />
      </div>

      <div className="container mx-auto flex min-h-[100svh] max-w-[1360px] items-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid w-full gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-0">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col justify-center text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-sm lg:self-start">
              <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">{heroCopy.preHeadline}</span>
            </div>

            <h1 className="text-balance text-[clamp(2.2rem,6vw,6.5rem)] font-black leading-[0.92] tracking-[-0.04em] text-white">
              {renderHeadline(heroCopy.title, 'text-white')}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-400 lg:mx-0">
              {heroCopy.description}
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                onClick={onOpenContact}
                size="lg"
                className="group h-14 rounded-2xl bg-blue-600 px-8 text-base font-bold text-white shadow-[0_20px_60px_-20px_rgba(37,99,235,0.7)] transition-all duration-200 hover:bg-brand-cyan hover:text-slate-950 hover:shadow-[0_20px_60px_-20px_rgba(58,225,255,0.5)] active:scale-[0.97] sm:h-16"
              >
                {heroCopy.cta}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-14 rounded-2xl border border-white/10 px-6 text-base font-bold text-white/80 transition-all duration-200 hover:bg-white/10 sm:h-16"
              >
                <Link href="#audit-offer">{heroCopy.ctaSecondary}</Link>
              </Button>
            </div>

            {/* Proof chips */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              {heroCopy.proofItems.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Portfolio showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:max-w-none">
              <CaseWall images={portfolioImages} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function CaseWall({ images }: { images: GalleryImage[] }) {
  const firstColumn = images.filter((_, index) => index % 2 === 0);
  const secondColumn = images.filter((_, index) => index % 2 === 1);

  return (
    <div className="grid h-[300px] gap-2 overflow-hidden rounded-[1.5rem] sm:h-[520px] sm:grid-cols-2">
      <CaseColumn images={firstColumn} duration={28} priority />
      <CaseColumn images={secondColumn.length ? secondColumn : firstColumn} duration={34} reverse className="hidden sm:block" />
    </div>
  );
}

function CaseColumn({
  images,
  duration,
  reverse = false,
  priority = false,
  className = '',
}: {
  images: GalleryImage[];
  duration: number;
  reverse?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const loopImages = [...images, ...images];

  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      <motion.div
        className="flex flex-col gap-2"
        animate={{ y: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {loopImages.map((image, index) => (
          <PortfolioTile
            key={`${image?.src || 'fallback'}-${index}`}
            image={image}
            priority={priority && index < 2}
            ratioClass={index % 3 === 0 ? 'aspect-[4/3]' : index % 3 === 1 ? 'aspect-[16/10]' : 'aspect-[5/4]'}
          />
        ))}
      </motion.div>
    </div>
  );
}

function PortfolioTile({ image, ratioClass, priority = false }: { image?: GalleryImage; ratioClass: string; priority?: boolean }) {
  if (!image) {
    return (
      <div className={`${ratioClass} flex items-center justify-center rounded-xl bg-white/5 p-8 text-center text-sm font-medium text-white/40`}>
        Portfolio
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-white ring-1 ring-white/10 ${ratioClass}`}>
      <Image
        src={image.src}
        alt={image.alt || 'Jon.Branding portfolio'}
        fill
        priority={priority}
        sizes="(max-width: 768px) 92vw, 48vw"
        className="object-contain p-2"
      />
    </div>
  );
}

export default Hero;
