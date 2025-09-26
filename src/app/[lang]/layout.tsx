
'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function LangLayout({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return (
    <>
      <Header lang={lang} />
      {children}
      <Footer lang={lang} />
    </>
  );
}
