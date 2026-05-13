'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Hero from '@/components/sections/hero';
import WhyUs from '@/components/sections/why-us';
import AuditOffer from '@/components/sections/audit-offer';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { cn } from '@/lib/utils';

const BeforeAfter = dynamic(() => import('@/components/sections/before-after'), {
  loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
});
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), {
  loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
});
const Gallery = dynamic(() => import('@/components/sections/gallery'), {
  loading: () => <Skeleton className="h-screen w-full" />,
});
const FeaturedCaseStudy = dynamic(() => import('@/components/sections/featured-case-study'), {
  loading: () => <Skeleton className="h-[500px] w-full rounded-3xl" />,
});
const Founder = dynamic(() => import('@/components/sections/founder'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});
const Faq = dynamic(() => import('@/components/sections/faq'), {
  loading: () => <Skeleton className="h-64 w-full" />,
});
const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const Process = dynamic(() => import('@/components/sections/process'), { ssr: false });
const CtaBlock = dynamic(() => import('@/components/sections/cta-block'), {
  loading: () => <Skeleton className="h-48 w-full rounded-2xl" />,
});
const Guarantee = dynamic(() => import('@/components/sections/guarantee'), {
  loading: () => <Skeleton className="h-64 w-full" />,
});
const ProcessVideo = dynamic(() => import('@/components/sections/process-video'), {
  loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
});

const fadeInVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
};

const HomeComponent: FC<{ lang: string; dictionary: any }> = ({ lang, dictionary }) => {
  const [mounted, setMounted] = useState(false);
  const { tg } = useTelegram();

  const handleOpenModal = useCallback(() => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('openContactModal');
      window.dispatchEvent(event);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (tg?.BackButton) {
      tg.BackButton.show();
    }
  }, [tg]);

  const renderHeadline = (headline: string, className?: string) => {
    if (!headline) return '';

    const segments = headline.split(/(\*\*.*?\*\*|\|.*?\|)/g);

    return (
      <span className={cn('inline', className)}>
        {segments.map((segment, i) => {
          if (!segment) return null;

          const isDoubleStar = segment.startsWith('**') && segment.endsWith('**');
          const isPipe = segment.startsWith('|') && segment.endsWith('|');

          if (isDoubleStar || isPipe) {
            const text = isDoubleStar ? segment.slice(2, -2) : segment.slice(1, -1);
            return (
              <span key={i} className="text-brand-cyan">
                {text}
              </span>
            );
          }

          return <span key={i}>{segment}</span>;
        })}
      </span>
    );
  };

  if (!dictionary?.hero) {
    return (
      <div className="py-20 text-center">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  return (
    <div className="relative pb-24 md:pb-0">
      <main>
        {/* 1. HEADLINE — og'riqni chaqir, va'da ber */}
        <Hero onOpenContact={handleOpenModal} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />

        {/* 2. SOCIAL PROOF — ishonch qur (Sabri: "proof early") */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <Testimonials lang={lang} dictionary={dictionary.testimonials} />
        </motion.div>

        {/* 3. GODFATHER OFFER — rad eta olmaydigan taklif */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }}>
          <AuditOffer lang={lang} onCtaClick={handleOpenModal} />
        </motion.div>

        {/* 4. BEFORE/AFTER — transformatsiya ko'rsat */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }}>
          <BeforeAfter onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.beforeAfter} />
        </motion.div>

        {/* 4.5. PROCESS VIDEO — jarayonni ko'rsat (Vimeo) */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <ProcessVideo lang={lang} />
        </motion.div>

        {/* 5. CASE STUDY + GALLERY — visual natija (proof stacking) */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <FeaturedCaseStudy lang={lang} dictionary={dictionary.featuredCaseStudy || {}} />
        </motion.div>

        <Gallery lang={lang} dictionary={dictionary.gallery} />

        {/* 6. WHY US — differentiator (nega biz, raqobatchidan farq) */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }}>
          <WhyUs onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.whyUs} />
        </motion.div>

        {/* 7. PROCESS — qanday ishlaydi (3-4 qadam, oddiy) */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <Process onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.process} />
        </motion.div>

        {/* 8. GUARANTEE — risk yo'q qil */}
        {mounted && (
          <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            <Guarantee dictionary={dictionary.guaranteeBlock} />
          </motion.div>
        )}

        {/* 9. FAQ — e'tirozlarni yoq qil */}
        <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <Faq lang={lang} dictionary={dictionary.faq} />
        </motion.div>

        {/* 10. FINAL CTA — oxirgi harakat (e'tirozlar yoqilgandan KEYIN) */}
        <CtaBlock
          title={lang === 'uz' ? "Hali ham brendingiz arzon ko'rinyaptimi?" : dictionary.home?.cta1_title}
          description={
            lang === 'uz'
              ? "5 daqiqalik bepul tahlil + shaxsiy video sharh olasiz. Hech narsa to'lamaysiz. Agar foydali bo'lmasa — davom ettirish shart emas."
              : dictionary.home?.cta1_desc
          }
          buttonText={lang === 'uz' ? 'Bepul Tahlil + Video Sharh olish' : dictionary.home?.cta1_button}
          onCtaClick={handleOpenModal}
        />

        {/* 11. FOUNDER — authority, yuz ko'rsat */}
        {mounted ? (
          <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            <Founder lang={lang} dictionary={dictionary.founder} />
          </motion.div>
        ) : (
          <div className="container mx-auto space-y-20 py-20">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        )}
      </main>
      {mounted && <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />}
    </div>
  );
};

export default HomeComponent;
