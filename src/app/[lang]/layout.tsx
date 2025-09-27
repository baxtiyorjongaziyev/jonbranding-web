import { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary } from '@/lib/dictionaries';

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: 'uz' | 'ru' };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <>
      <Header lang={lang} dictionary={dictionary.header} />
      {children}
      <Footer lang={lang} dictionary={dictionary.footer} />
    </>
  );
}
