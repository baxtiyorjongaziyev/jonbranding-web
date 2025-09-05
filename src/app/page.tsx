
import type { FC } from 'react';
import dynamic from 'next/dynamic';
import PageClient from '@/components/page-client';
import { type Brand } from '@/lib/types';
import { staticBrands } from '@/lib/static-data';


// Dynamically import components that are not immediately visible
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Faq = dynamic(() => import('@/components/sections/faq'));



const getBrands = async (): Promise<Brand[]> => {
    // We are now returning a static list of brands.
    // This is more reliable and faster.
    // To add or remove brands, you can edit the `staticBrands` array above.
    return staticBrands;
}


const Home: FC = async () => {
  const brands = await getBrands();

  return (
    <>
      <PageClient brands={brands}>
          <Testimonials />
          <Faq />
      </PageClient>
    </>
  );
};

export default Home;
