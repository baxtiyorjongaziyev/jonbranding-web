
import type { FC } from 'react';
import PageClient from '@/components/page-client';
import { type Brand } from '@/lib/types';
import { staticBrands } from '@/lib/static-data';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: "Jon.Branding | Biznesingiz uchun natija keltiradigan brending",
  description: "Biz shunchaki logotip chizmaymiz. Biz biznesingiz uchun natija keltiradigan, strategiyaga asoslangan va mijozlaringiz qalbidan joy oladigan brend tizimini qurib beramiz.",
};

const Home: FC = () => {
  const brands = staticBrands;

  return (
    <PageClient brands={brands} />
  );
};

export default Home;
