
import { GoogleTagManager } from '@next/third-parties/google';
import type { FC, ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary, Locale } from '@/lib/i18n/locale';
import { locales, defaultLocale } from '@/lib/i18n/locale';
import { Poppins } from 'next/font/google';
import '../globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800']
});

type Props = {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
};

const LocalizedLayout: FC<Props> = async (props) => {
  const { lang: rawLang } = await props.params;
  const lang = locales.includes(rawLang as Locale) ? (rawLang as Locale) : defaultLocale;
  const dictionary = await getDictionary(lang);
  const { children } = props;

  return (
    <html lang={lang} suppressHydrationWarning className={poppins.variable}>
      <body className="font-body bg-white antialiased" suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-5GRQBW84" />
        <Header lang={lang} dictionary={dictionary.header} />
        <div className="flex-grow">
          {children}
        </div>
        <Footer lang={lang} dictionary={dictionary.footer} />
      </body>
    </html>
  );
};

export default LocalizedLayout;
