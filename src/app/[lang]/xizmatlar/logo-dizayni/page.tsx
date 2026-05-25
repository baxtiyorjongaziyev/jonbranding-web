import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import LogoClient from './logo-client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = lang as Locale;
  const dictionary = await getDictionary(safeLang);
  const metadata = dictionary.logoDesignPage?.metadata;

  const baseUrl = 'https://www.jonbranding.uz';
  const canonicalUrl = `${baseUrl}/${safeLang}/xizmatlar/logo-dizayni`;

  return {
    title: metadata?.title || "Logotip Dizayni | Professional Logo Yaratish | Jon.Branding",
    description: metadata?.description || "Biznesingiz uchun unikal va natijador logotiplar yaratamiz.",
    keywords: metadata?.keywords || "logo dizayn, logotip yaratish, brending, aydentika",
    openGraph: {
      title: metadata?.title || "Logotip Dizayni | Professional Logo Yaratish",
      description: metadata?.description || "Premium logotip dizayni va aydentika sistemi",
      url: canonicalUrl,
      type: 'website',
      siteName: 'Jon.Branding',
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630, alt: 'Logo Dizayni Xizmati' }],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  
  return <LogoClient lang={lang as Locale} translations={dictionary.logoDesignPage} />;
}
