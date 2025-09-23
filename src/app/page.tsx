
import type { FC } from 'react';
import PageClient from '@/components/page-client';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: "Jon.Branding | Biznesingiz uchun natija keltiradigan brending",
  description: "Biz shunchaki logotip chizmaymiz. Biz biznesingiz uchun natija keltiradigan, strategiyaga asoslangan va mijozlaringiz qalbidan joy oladigan brend tizimini qurib beramiz.",
};

const Home: FC = () => {
  return (
    <PageClient />
  );
};

export default Home;
