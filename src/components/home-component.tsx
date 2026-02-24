
'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/hero';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import CtaBlock from '@/components/sections/cta-block';

// Dynamically import components that are below the fold
const Stats = dynamic(() => import('@/components/sections/stats'), {
  loading: () => <div className="h-32 w-full animate-pulse bg-secondary/20" />,
});
const Founder = dynamic(() => import('@/components/sections/founder'));
const LeadMagnet = dynamic(() => import('@/components/sections/lead-magnet'));
const BeforeAfter = dynamic(() => import('@/components/sections/before-after'));
const Video = dynamic(() => import('@/components/sections/video'));
const Process = dynamic(() => import('@/components/sections/process'));
const TargetAudience = dynamic(() => import('@/components/sections/target-audience'));
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), {
  loading: () => <Skeleton className="h-[500px] w-full" />,
});
const Gallery = dynamic(() => import('@/components/sections/gallery'));
const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const Faq = dynamic(() => import('@/components/sections/faq'));
const WhyUs = dynamic(() => import('@/components/sections/why-us'), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'), {
  loading: () => <div className="h-24 w-full animate-pulse bg-white" />,
});
const FeaturedCaseStudy = dynamic(() => import('@/components/sections/featured-case-study'), { ssr: false });


const useScrollIntent = (onScrollIntent: () => void, scrollThreshold = 0.8) => {
  useEffect(() => {
    const SESSION_STORAGE_KEY = 'scroll_intent_shown';
    
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) return;

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
    return () => removeListeners();
  }, [onScrollIntent, scrollThreshold]);
};


const HomeComponent: FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
    const [mounted, setMounted] = useState(false);
    const { tg } = useTelegram();

    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    useScrollIntent(handleOpenModal, 0.8);
    
    useEffect(() => {
        setMounted(true);
        if (tg) {
            tg.BackButton.show();
        }
    }, [tg]);

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
    
    if (!dictionary || !dictionary.hero) {
        return <Skeleton className="h-screen w-full" />;
    }

    return (
        <>
            <main>
                {/* Hero is rendered immediately for best LCP */}
                <Hero onPrimaryClick={handleOpenModal} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />
                
                {/* Sequential loading for other blocks to keep initial JS small */}
                {mounted ? (
                    <>
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
                    </>
                ) : (
                    <div className="space-y-20 py-20">
                        <div className="h-32 w-full animate-pulse bg-secondary/20" />
                        <div className="h-96 w-full animate-pulse bg-white" />
                    </div>
                )}
            </main>
            {mounted && <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />}
        </>
    )
};

export default HomeComponent;
