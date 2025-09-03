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

// Dynamically import components that are not immediately visible
const Founder = dynamic(() => import('@/components/sections/founder'));
const LeadMagnet = dynamic(() => import('@/components/sections/lead-magnet'));
const Stats = dynamic(() => import('@/components/sections/stats'));
const WhyUs = dynamic(() => import('@/components/sections/why-us'));
const Gallery = dynamic(() => import('@/components/sections/gallery'));
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'));
const TargetAudience = dynamic(() => import('@/components/sections/target-audience'));
const PickTwoSelector = dynamic(() => import('@/components/sections/pick-two-selector'));
const BeforeAfter = dynamic(() => import('@/components/sections/before-after'));
const Video = dynamic(() => import('@/components/sections/video'));
const PackageBuilder = dynamic(() => import('@/components/sections/package-builder'));
const Comparison = dynamic(() => import('@/components/sections/comparison'));
const Process = dynamic(() => import('@/components/sections/process'));
const ExitIntentModal = dynamic(() => import('@/components/exit-intent-modal'));


const MobileCtaBar: FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  'use client';
  const [selectedServices] = useLocalStorage('selectedServices', {
    strategy: false,
    commStrategy: false,
    naming: false,
    logo: true,
    designSystem: false,
    brandbook: false,
    packaging: false,
    smm: false,
    merch: false,
    illustrations: false,
    audit: false,
    namingCheck: false,
    consultation: false,
    urgency: false,
    nda: false,
  });
  const [isPcgMember] = useLocalStorage('isPcgMember', false);
  const [price, setPrice] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const priceDetails = calculatePackagePrice({ selectedServices, isPcgMember });
      setPrice(priceDetails.final);
    }
  }, [selectedServices, isPcgMember, isClient]);

  if (!isClient) {
    return (
        <div className="sticky bottom-0 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-sm space-y-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    );
  }

  return (
    <div className="sticky bottom-0 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
            <p className="font-bold text-primary text-lg">{price.toLocaleString('fr-FR')} so'm</p>
            <p className="text-xs text-muted-foreground">Yakuniy narx</p>
        </div>
        <Button onClick={onOpenModal} className="shadow-ocean animate-subtle-pulse">
          Bepul konsultatsiya olish
        </Button>
      </div>
    </div>
  );
};


const PageClient: FC<{ children: ReactNode }> = ({ children }) => {
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
            <div className="flex min-h-screen flex-col overflow-x-hidden">
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
        <div className="flex flex-col overflow-x-hidden animate-fade-in">
            <main className="flex-grow">
                <Hero onPrimaryClick={handleOpenModal} />
                <TrustedBy />
                <Founder />
                <LeadMagnet onCtaClick={handleOpenModal} />
                <Stats />
                <WhyUs onCtaClick={handleOpenModal} />
                <Gallery onCtaClick={handleOpenModal} />
                <QueueStatus onCtaClick={handleOpenModal} />
                <TargetAudience />
                <PickTwoSelector onCtaClick={() => {
                    const el = document.getElementById('package-builder');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} />
                {children}
                 <Offer onCTAClick={handleOpenModal} />
                <BeforeAfter onCtaClick={handleOpenModal} />
                <Video />
                <PackageBuilder onOrderNow={handleOpenModal} />
                <Comparison onCtaClick={handleOpenModal} />
                <Process onCtaClick={handleOpenModal} />
            </main>
            <ExitIntentModal onPrimaryClick={handleOpenModal} />
            <MobileCtaBar onOpenModal={handleOpenModal} />
        </div>
    )
}


export default PageClient;
