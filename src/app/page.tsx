import type { FC } from 'react';
import dynamic from 'next/dynamic';
import PageClient from '@/components/page-client';
import Offer from '@/components/sections/offer';

// Dynamically import components that are not immediately visible
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Faq = dynamic(() => import('@/components/sections/faq'));

const Home: FC = () => {
  const handleOpenModal = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  };
  
  return (
    <PageClient>
        <Offer onCTAClick={handleOpenModal} />
        <Testimonials />
        <Faq />
    </PageClient>
  );
};

export default Home;
