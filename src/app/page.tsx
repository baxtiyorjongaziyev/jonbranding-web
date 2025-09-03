
import type { FC } from 'react';
import dynamic from 'next/dynamic';
import PageClient from '@/components/page-client';
import Offer from '@/components/sections/offer';
import { type Brand } from '@/lib/airtable';

// Dynamically import components that are not immediately visible
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Faq = dynamic(() => import('@/components/sections/faq'));


const staticBrands: Brand[] = [
  { name: 'Korsun', logo: null }, { name: 'Boyarin', logo: null }, { name: 'Sarmilk', logo: null }, { name: 'M-Karim', logo: null }, { name: 'Prime Fit', logo: null }, { name: 'Revo', logo: null }, { name: 'To\'maris', logo: null }, 
  { name: 'Aisha Mebel', logo: null }, { name: 'Den Aroma', logo: null }, { name: 'Velzo', logo: null }, { name: 'Bodomchi', logo: null },
  { name: 'Fidda by Sevara', logo: null }, { name: 'Viton', logo: null }, { name: 'Ravza Mebel', logo: null }, { name: 'Coloray', logo: null }, { name: 'Dayan Color', logo: null }, { name: 'Bekbazar', logo: null }, 
  { name: 'Climart', logo: null }, { name: 'Sunnah Products', logo: null }, { name: 'Petron Polymer', logo: null }, { name: 'Perfona', logo: null }, { name: 'Esviro', logo: null }, { name: 'Savod', logo: null }
];


const getBrands = async (): Promise<Brand[]> => {
    // We are now returning a static list of brands instead of fetching from Airtable.
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
