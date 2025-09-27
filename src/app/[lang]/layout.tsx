
'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useParams } from 'next/navigation';

export default function LangLayout({
  children,
}: {
  children: ReactNode;
  params?: { lang: string };
}) {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  return (
    <>
      <Header lang={lang} />
      {children}
      <Footer lang={lang} />
    </>
  );
}
