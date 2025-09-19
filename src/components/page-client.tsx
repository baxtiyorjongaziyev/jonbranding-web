
'use client';

import type { FC, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/hero';
import TrustedBy from '@/components/sections/trusted-by';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { calculatePackagePrice } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { Button } from '@/components/ui/button';
import Offer from '@/components/sections/offer';
import { type Brand } from '@/lib/types';
import { motion } from 'framer-motion';

// Dynamically import components that are not immediately visible
const Founder = dynamic(() => import('@/components/sections/founder'));
const LeadMagnet = dynamic(() => import('@/components/sections/lead-magnet'));
const WhyUs = dynamic(() => import('@/components/sections/why-us'));
const Gallery = dynamic(() => import('@/components/sections/gallery'));
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'));
const BeforeAfter = dynamic(() => import('@/components/sections/before-after'));
const Video = dynamic(() => import('@/components/sections/video'));
const Process = dynamic(() => import('@/components/sections/process'));
const ExitIntentModal = dynamic(() => import('@/components/exit-intent-modal'));
const TargetAudience = dynamic(() => import('@/components/sections/target-audience'));
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Faq = dynamic(() => import('@/components/sections/faq'));
const Stats = dynamic(() => import('@/components/sections/stats'));
const PickTwoSelector = dynamic(() => import('@/components/sections/pick-two-selector'));


const MobileCtaBar: FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="sticky bottom-0 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-50 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
            <p className="font-bold text-primary text-base">Loyihangizni muhokama qilamizmi?</p>
        </div>
        <Button onClick={onOpenModal} className="shadow-ocean animate-breathing">
          Murojaat qoldirish
        </Button>
      </div>
    </div>
  );
};


interface PageClientProps {
  children: ReactNode;
  brands: Brand[];
}

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


const PageClient: FC<PageClientProps> = ({ children, brands }) => {
    const [isClient, setIsClient] = useState(false);
    const { tg } = useTelegram();

    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

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
                <main className="flex-grow">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-48 w-full mt-4" />
                </main>
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div>
            <main className="flex-grow">
                <AnimatedSection><Hero onPrimaryClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><TrustedBy brands={brands} /></AnimatedSection>
                <AnimatedSection><TargetAudience /></AnimatedSection>
                <AnimatedSection><Gallery onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><BeforeAfter onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><WhyUs onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><Stats /></AnimatedSection>
                <AnimatedSection><Testimonials /></AnimatedSection>
                <AnimatedSection><Founder /></AnimatedSection>
                <AnimatedSection><Process onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><Video /></AnimatedSection>
                <AnimatedSection><LeadMagnet onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><PickTwoSelector onCtaClick={handleOpenModal}/></AnimatedSection>
                <AnimatedSection><Offer onCTAClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><QueueStatus onCtaClick={handleOpenModal} /></AnimatedSection>
                <AnimatedSection><Faq /></AnimatedSection>
            </main>
            <ExitIntentModal onPrimaryClick={handleOpenModal} />
            <MobileCtaBar onOpenModal={handleOpenModal} />
        </div>
    )
}


export default PageClient;
