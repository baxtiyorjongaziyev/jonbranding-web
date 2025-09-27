
'use client';

import type { FC, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/hero';
import TrustedBy from '@/components/sections/trusted-by';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Stats from '@/components/sections/stats';
import { useExitIntent } from '@/hooks/use-exit-intent';
import CtaBlock from '@/components/sections/cta-block';

// Dynamically import components that are not immediately visible
const Founder = dynamic(() => import('@/components/sections/founder'));
const LeadMagnet = dynamic(() => import('@/components/sections/lead-magnet'));
const BeforeAfter = dynamic(() => import('@/components/sections/before-after'));
const Video = dynamic(() => import('@/components/sections/video'));
const Process = dynamic(() => import('@/components/sections/process'));
const ExitIntentModal = dynamic(() => import('@/components/exit-intent-modal'));
const TargetAudience = dynamic(() => import('@/components/sections/target-audience'));
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Gallery = dynamic(() => import('@/components/sections/gallery'));
const Faq = dynamic(() => import('@/components/sections/faq'));
const Offer = dynamic(() => import('@/components/sections/offer'));

const useScrollIntent = (onScrollIntent: () => void, scrollThreshold = 0.8) => {
  useEffect(() => {
    const SESSION_STORAGE_KEY = 'scroll_intent_shown';
    
    if (typeof window === 'undefined') {
        return;
    }

    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrolledPercentage = (scrollPosition + windowHeight) / documentHeight;

      if (scrolledPercentage >= scrollThreshold) {
        trigger();
      }
    };

    const trigger = () => {
        if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
            onScrollIntent();
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
            removeListeners();
        }
    };

    const removeListeners = () => {
        window.removeEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('scroll', handleScroll);

    return () => {
        removeListeners();
    };
  }, [onScrollIntent, scrollThreshold]);
};


const MobileCtaBar: FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="sticky bottom-0 z-50 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-50 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <div className="text-sm flex-shrink">
            <p className="font-bold text-primary text-base">Loyihangizni muhokama qilamizmi?</p>
        </div>
        <Button onClick={onOpenModal} className="shadow-ocean flex-shrink-0 whitespace-normal h-auto py-2 px-4 text-center">
          Murojaat qoldirish
        </Button>
      </div>
    </div>
  );
};


const AnimatedSection: FC<{children: ReactNode}> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};


const HomeComponent: FC<{ params: { lang: string } }> = ({ params }) => {
    const { lang } = params;
    const [isClient, setIsClient] = useState(false);
    const { tg } = useTelegram();

    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    const handleOpenServiceModal = useCallback(() => {
        const servicesSection = document.getElementById('package-builder');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useScrollIntent(handleOpenModal, 0.8);
    
    useEffect(() => {
        if (tg) {
            tg.BackButton.show();
        }
    }, [tg]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div>
                <Skeleton className="h-20 w-full" />
                <main>
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-48 w-full mt-4" />
                </main>
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <>
            <main>
                <AnimatedSection><Hero onPrimaryClick={handleOpenModal} lang={lang} /></AnimatedSection>
                <AnimatedSection><Stats /></AnimatedSection>
                <AnimatedSection><TrustedBy /></AnimatedSection>
                <AnimatedSection><TargetAudience /></AnimatedSection>
                <AnimatedSection><Offer onCTAClick={handleOpenServiceModal}/></AnimatedSection>
                <AnimatedSection><BeforeAfter onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><Testimonials /></AnimatedSection>
                <AnimatedSection><Gallery /></AnimatedSection>
                <AnimatedSection><Video /></AnimatedSection>
                 <AnimatedSection>
                    <CtaBlock 
                        title="Sizning brendingiz ham shunday ko'rinishga ega bo'lishi mumkin."
                        description="Professional dizayn orqali biznesingizni yangi cho'qqilarga olib chiqing. Biznesingiz uchun mos yechimni topishga yordam beramiz."
                        buttonText="Mening biznesim uchun ham"
                        onCtaClick={handleOpenModal}
                    />
                </AnimatedSection>
                <AnimatedSection><Founder /></AnimatedSection>
                <AnimatedSection><Process onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><LeadMagnet onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><Faq /></AnimatedSection>
            </main>
            <ExitIntentModal onPrimaryClick={handleOpenServiceModal} />
            <MobileCtaBar onOpenModal={handleOpenModal} />
        </>
    )
};


const Page = ({ params }: { params: { lang: string } }) => {
  return <HomeComponent params={params} />;
};

export default Page;
