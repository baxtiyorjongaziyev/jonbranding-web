'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import TrustedBy from '@/components/sections/trusted-by';
import Founder from '@/components/sections/founder';
import Stats from '@/components/sections/stats';
import WhyUs from '@/components/sections/why-us';
import TargetAudience from '@/components/sections/target-audience';
import Services from '@/components/sections/services';
import Video from '@/components/sections/video';
import PackageBuilder from '@/components/sections/package-builder';
import BeforeAfter from '@/components/sections/before-after';
import Testimonials from '@/components/sections/testimonials';
import Process from '@/components/sections/process';
import Gallery from '@/components/sections/gallery';
import Faq from '@/components/sections/faq';
import Offer from '@/components/sections/offer';
import ContactModal from '@/components/contact-modal';
import ExitIntentModal from '@/components/exit-intent-modal';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { calculatePackagePrice, generateSummary } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';
import CtaBlock from '@/components/sections/cta-block';
import { useTelegram } from '@/hooks/use-telegram';
import QueueStatus from '@/components/sections/queue-status';
import Footer from '@/components/layout/footer';

const MobileCtaBar: FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [selectedServices] = useLocalStorage('selectedServices', {
    naming: false,
    logo: true,
    style: false,
    brandbook: false,
  });
  const [isPcgMember] = useLocalStorage('isPcgMember', true);
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
        <div className="sticky bottom-0 md:hidden bg-white/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
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
    <div className="sticky bottom-0 md:hidden bg-white/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
            <p className="font-bold text-dark-blue text-lg">${price.toLocaleString('en-US')}</p>
            <p className="text-xs text-gray-600">Yakuniy narx</p>
        </div>
        <Button onClick={onOpenModal} className="shadow-ocean animate-subtle-pulse">
          Bepul konsultatsiya olish
        </Button>
      </div>
    </div>
  );
};


const Home: FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedServices] = useLocalStorage('selectedServices', {
    naming: false,
    logo: true,
    style: false,
    brandbook: false,
  });
  const [isPcgMember] = useLocalStorage('isPcgMember', true);
  
  const [packageDetails, setPackageDetails] = useState({ summary: '', price: 0 });

  const [isClient, setIsClient] = useState(false);

  const { tg } = useTelegram();

  useEffect(() => {
    if (tg) {
      tg.BackButton.show();
    }
  }, [tg]);

  useEffect(() => {
      setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const selections = { selectedServices, isPcgMember };
      const priceDetails = calculatePackagePrice(selections);
      const summary = generateSummary(selections);
      setPackageDetails({ summary, price: priceDetails.final });
    }
  }, [selectedServices, isPcgMember, isClient]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
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
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header onContactClick={handleOpenModal} />
      <main className="flex-grow">
        <Hero onPrimaryClick={handleOpenModal} />
        <TrustedBy />
        <Founder />
        <Stats />
        <WhyUs />
        <QueueStatus />
        <CtaBlock 
          onCtaClick={handleOpenModal}
          title="Brendingiz shunchaki chiroyli emas, sotadigan bo'lishini xohlaysizmi?"
          description="Bizning strategik yondashuvimiz biznesingiz uchun qanday qiymat yaratishini bilib oling."
          buttonText="Strategiyani muhokama qilish"
        />
        <TargetAudience />
        <Services />
        <Testimonials />
        <BeforeAfter />
        <Video />
        <PackageBuilder onOrderNow={handleOpenModal} />
        <Process />
        <Gallery />
        <CtaBlock 
          onCtaClick={handleOpenModal}
          title="Biznesingizni raqobatchilardan bir umrga ajratib turadigan brend yarating."
          description="Portfolio sizga ma'qul keldimi? Keling, sizning biznesingiz uchun ham shunday ajoyib natijalar yaratamiz."
          buttonText="Loyiha uchun bog'lanish"
        />
        <Faq />
        <Offer onCTAClick={handleOpenModal} />
      </main>
      <Footer />
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        packageSummary={packageDetails.summary}
        totalPrice={packageDetails.price}
      />
      <ExitIntentModal onPrimaryClick={handleOpenModal} />
      <MobileCtaBar onOpenModal={handleOpenModal} />
    </div>
  );
};

export default Home;
