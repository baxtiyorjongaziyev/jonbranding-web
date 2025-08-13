'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Founder from '@/components/sections/founder';
import WhyUs from '@/components/sections/why-us';
import TargetAudience from '@/components/sections/target-audience';
import Services from '@/components/sections/services';
import PackageBuilder from '@/components/sections/package-builder';
import BeforeAfter from '@/components/sections/before-after';
import Testimonials from '@/components/sections/testimonials';
import Process from '@/components/sections/process';
import Gallery from '@/components/sections/gallery';
import Faq from '@/components/sections/faq';
import Footer from '@/components/layout/footer';
import ContactModal from '@/components/contact-modal';
import ExitIntentModal from '@/components/exit-intent-modal';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { calculatePackagePrice, generateSummary } from '@/lib/pricing';
import { Skeleton } from '@/components/ui/skeleton';

const Home: FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [packageSummary, setPackageSummary] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedPackage, setSelectedPackage] = useLocalStorage('selectedPackage', 'B');
  const [includeNaming, setIncludeNaming] = useLocalStorage('includeNaming', false);
  const [paymentOption, setPaymentOption] = useLocalStorage('paymentOption', '50');
  const [isPcgMember, setIsPcgMember] = useLocalStorage('isPcgMember', true);
  
  const [mobileCtaPrice, setMobileCtaPrice] = useState(0);
  const [packageDetailsForModal, setPackageDetailsForModal] = useState({ summary: '', price: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
  }, []);


  useEffect(() => {
    if (isClient) {
      const selections = { selectedPackage, includeNaming, paymentOption, isPcgMember };
      const { final } = calculatePackagePrice(selections);
      setMobileCtaPrice(final);

      const summary = generateSummary(selections);
      setPackageDetailsForModal({ summary, price: final });
    }
  }, [selectedPackage, includeNaming, paymentOption, isPcgMember, isClient]);

  const handleOpenModal = (summary = 'Umumiy so\'rov', price = 0) => {
    setPackageSummary(summary);
    setTotalPrice(price);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  const handleOrderNow = (summary: string, price: number) => {
    handleOpenModal(summary, price);
  };

  const handleMobileCtaClick = () => {
    handleOpenModal(packageDetailsForModal.summary, packageDetailsForModal.price);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header onContactClick={() => handleOpenModal()} />
      <main className="flex-grow">
        <Hero onPrimaryClick={() => handleOpenModal('Bosh sahifadagi asosiy tugma')} />
        <Founder />
        <WhyUs />
        <TargetAudience />
        <Services />
        <PackageBuilder onOrderNow={handleOrderNow} />
        <BeforeAfter />
        <Testimonials />
        <Process />
        <Gallery />
        <Faq />
      </main>
      <Footer />
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        packageSummary={packageSummary}
        totalPrice={totalPrice}
      />
      <ExitIntentModal onPrimaryClick={() => handleOpenModal('Chiqish taklifi', 0)} />

      {/* Mobile Sticky CTA Bar */}
      <div className="sticky bottom-0 md:hidden bg-white/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto flex justify-between items-center">
          {isClient ? (
              <div className="text-sm">
                  <p className="font-bold text-dark-blue text-lg">${mobileCtaPrice.toLocaleString('en-US')}</p>
                  <p className="text-xs text-gray-600">Yakuniy narx</p>
              </div>
          ) : (
            <div className="text-sm space-y-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          )}
            <Button onClick={handleMobileCtaClick} className="shadow-ocean">
                Hoziroq buyurtma berish
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
