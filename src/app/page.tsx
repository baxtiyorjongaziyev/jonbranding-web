
import type { FC } from 'react';
import dynamic from 'next/dynamic';
import PageClient from '@/components/page-client';
import Offer from '@/components/sections/offer';
import { type Brand } from '@/lib/types';

// Dynamically import components that are not immediately visible
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Faq = dynamic(() => import('@/components/sections/faq'));


const staticBrands: Brand[] = [
  { name: 'Goodwell', logo: 'https://img3.teletype.in/files/ee/42/ee42432f-65c8-4f2a-a982-5f34a469d95b.png' },
  { name: 'Korsun', logo: 'https://img4.teletype.in/files/fc/d0/fcd09308-b559-4818-8570-dc078bfa0915.png' }, { name: 'Boyarin', logo: null }, { name: 'Sarmilk', logo: null }, { name: 'M-Karim', logo: 'https://img4.teletype.in/files/ff/4e/ff4e4596-2b83-47f2-8fdd-59b36e6df4d5.png' }, { name: 'Prime Fit', logo: null }, { name: 'Revo', logo: 'https://img4.teletype.in/files/75/02/7502c144-d092-4e18-9f26-782628ddc49c.png' }, { name: 'To\'maris', logo: null }, 
  { name: 'Aisha Mebel', logo: null }, { name: 'Den Aroma', logo: 'https://img3.teletype.in/files/e2/90/e290fd28-87f2-4175-bc39-f15f945ac215.png' }, { name: 'Velzo', logo: null }, { name: 'Bodomchi', logo: null },
  { name: 'Fidda by Sevara', logo: null }, { name: 'Viton', logo: null }, { name: 'Ravza Mebel', logo: null }, { name: 'Coloray', logo: null }, { name: 'Dayan Color', logo: null }, { name: 'Bekbazar', logo: null }, { name: 'InControl', logo: 'https://img4.teletype.in/files/39/cd/39cdc07a-f3ec-4cb7-abf8-8d80281621c0.png' }, 
  { name: 'Climart', logo: null }, { name: 'Sunnah Products', logo: 'https://img1.teletype.in/files/0f/a6/0fa6fe98-f227-4046-9cfa-6e4114adfc84.png' }, { name: 'Petron Polymer', logo: null }, { name: 'Perfona', logo: 'https://img1.teletype.in/files/0c/2c/0c2c079a-40f7-4b0e-93f3-87fcf124ea5e.png' }, { name: 'Esviro', logo: 'https://img3.teletype.in/files/a6/97/a6977482-12ab-43e9-a896-74475b97b869.png' }, { name: 'Savod', logo: 'https://img4.teletype.in/files/bd/2e/bd2e4311-fe77-4b14-a784-5409028a305f.png' },
  { name: 'Sherzod Beknazarov', logo: 'https://img3.teletype.in/files/e0/be/e0bef570-3d46-43be-9479-3fb56e64e94f.png' }, { name: 'O\'rman', logo: 'https://img4.teletype.in/files/f1/19/f11904e6-d300-4bd1-b9f0-a1d715eefc96.png' },
  { name: 'R Studio', logo: 'https://img2.teletype.in/files/d2/aa/d2aa2d6e-22e7-44c3-a941-6fc441560619.png' },
  { name: 'Jafiko light', logo: 'https://img2.teletype.in/files/16/ff/16ff7f19-7a74-4771-9c78-55b810979273.png' },
];


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
