import type { FC } from 'react';
import dynamic from 'next/dynamic';
import PageClient from '@/components/page-client';
import Offer from '@/components/sections/offer';

// Dynamically import components that are not immediately visible
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Faq = dynamic(() => import('@/components/sections/faq'));

const Home: FC = () => {
  return (
    <PageClient>
        <Testimonials />
        <Faq />
    </PageClient>
  );
};

export default Home;
