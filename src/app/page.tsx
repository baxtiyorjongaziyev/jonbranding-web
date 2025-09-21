
import type { FC } from 'react';
import PageClient from '@/components/page-client';
import { type Brand } from '@/lib/types';
import { staticBrands } from '@/lib/static-data';


const getBrands = async (): Promise<Brand[]> => {
    // We are now returning a static list of brands.
    // This is more reliable and faster.
    // To add or remove brands, you can edit the `staticBrands` array above.
    return staticBrands;
}


const Home: FC = async () => {
  const brands = await getBrands();

  return (
    <PageClient brands={brands} />
  );
};

export default Home;
