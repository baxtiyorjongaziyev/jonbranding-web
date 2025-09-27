
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
const Offer = dynamic(() => import('@/components/sections/offer'));
const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const Faq = dynamic(() => import('@/components/sections/faq'));


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


const HomeComponent: FC<{ lang: string }> = ({ lang }) => {
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
    
    const t = {
        uz: {
            cta1_title: "Sizning brendingiz ham shunday ko'rinishga ega bo'lishi mumkin.",
            cta1_desc: "Professional dizayn orqali biznesingizni yangi cho'qqilarga olib chiqing. Biznesingiz uchun mos yechimni topishga yordam beramiz.",
            cta1_button: "Mening biznesim uchun ham",
        },
        ru: {
            cta1_title: "Ваш бренд может выглядеть так же.",
            cta1_desc: "Выведите свой бизнес на новый уровень с помощью профессионального дизайна. Мы поможем найти идеальное решение для вашего бизнеса.",
            cta1_button: "И для моего бизнеса тоже",
        }
    }
    const translations = lang === 'ru' ? t.ru : t.uz;


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
                <AnimatedSection><Stats lang={lang} /></AnimatedSection>
                <AnimatedSection><TrustedBy lang={lang} /></AnimatedSection>
                <AnimatedSection><TargetAudience lang={lang} /></AnimatedSection>
                <AnimatedSection><Offer onCTAClick={handleOpenServiceModal} lang={lang}/></AnimatedSection>
                <AnimatedSection><BeforeAfter onCtaClick={handleOpenModal} lang={lang} /></AnimatedSection>
                <AnimatedSection><Testimonials lang={lang} /></AnimatedSection>
                <AnimatedSection><Gallery lang={lang} /></AnimatedSection>
                <AnimatedSection><Video /></AnimatedSection>
                 <AnimatedSection>
                    <CtaBlock 
                        title={translations.cta1_title}
                        description={translations.cta1_desc}
                        buttonText={translations.cta1_button}
                        onCtaClick={handleOpenModal}
                    />
                </AnimatedSection>
                <AnimatedSection><Founder lang={lang} /></AnimatedSection>
                <AnimatedSection><Process onCtaClick={handleOpenModal} lang={lang} /></AnimatedSection>
                <AnimatedSection><LeadMagnet onCtaClick={handleOpenModal} lang={lang} /></AnimatedSection>
                <AnimatedSection><Faq lang={lang} /></AnimatedSection>
            </main>
            <ExitIntentModal onPrimaryClick={handleOpenServiceModal} lang={lang} />
            <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} />
        </>
    )
};

export default HomeComponent;
