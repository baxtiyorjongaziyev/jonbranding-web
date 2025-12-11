
'use client';

import type { FC, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/hero';
import TrustedBy from '@/components/sections/trusted-by';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import Stats from '@/components/sections/stats';
import CtaBlock from '@/components/sections/cta-block';

// Dynamically import components that are not immediately visible
const Founder = dynamic(() => import('@/components/sections/founder'));
const LeadMagnet = dynamic(() => import('@/components/sections/lead-magnet'));
const BeforeAfter = dynamic(() => import('@/components/sections/before-after'));
const Video = dynamic(() => import('@/components/sections/video'));
const Process = dynamic(() => import('@/components/sections/process'));
const TargetAudience = dynamic(() => import('@/components/sections/target-audience'));
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Gallery = dynamic(() => import('@/components/sections/gallery'));
const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const Faq = dynamic(() => import('@/components/sections/faq'));
const WhyUs = dynamic(() => import('@/components/sections/why-us'));
const FeaturedCaseStudy = dynamic(() => import('@/components/sections/featured-case-study'), { ssr: false });


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


const HomeComponent: FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
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

    const renderHeadline = (headline: string) => {
        const parts = headline.split('|');
        if (parts.length === 3) {
            return (
                <>
                    {parts[0]}
                    <span className="gradient">{parts[1]}</span>
                    {parts[2]}
                </>
            );
        }
        return headline.replace(/\|/g, '');
    };
    
    if (!isClient || !dictionary.home) {
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
                <Hero onPrimaryClick={handleOpenModal} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />
                <Stats dictionary={dictionary.stats} />
                <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
                <TargetAudience lang={lang} dictionary={dictionary.targetAudience} />
                <WhyUs onCtaClick={handleOpenModal} lang={lang} />
                <BeforeAfter onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.beforeAfter} />
                <Testimonials lang={lang} dictionary={dictionary.testimonials} />
                <Gallery lang={lang} dictionary={dictionary.gallery} />
                <FeaturedCaseStudy lang={lang} dictionary={dictionary.testimonials} />
                <Video />
                <CtaBlock 
                    title={dictionary.home.cta1_title}
                    description={dictionary.home.cta1_desc}
                    buttonText={dictionary.home.cta1_button}
                    onCtaClick={handleOpenModal}
                />
                <Founder lang={lang} dictionary={dictionary.founder} />
                <Process onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.process} />
                <LeadMagnet onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.leadMagnet} />
                <Faq lang={lang} dictionary={dictionary.faq} />
            </main>
            <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />
        </>
    )
};

export default HomeComponent;
