import type { FC, ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { locales, defaultLocale } from '@/lib/i18n/locale';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
};

const LocalizedLayout: FC<Props> = async ({ children, params }) => {
  const { lang: rawLang } = await params;
  const lang = locales.includes(rawLang) ? rawLang : defaultLocale;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dictionary={dictionary.header} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer lang={lang} dictionary={dictionary.footer} />
    </>
  );
}

export default LocalizedLayout;