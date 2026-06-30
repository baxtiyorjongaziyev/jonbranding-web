import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import NamingClient from './naming-client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.namingPage?.metadata;

  return {
    title: metadata?.title || "Neyming Xizmati | Jon.Branding",
    description: metadata?.description || "Professional brend neyming xizmatlari.",
    keywords: metadata?.keywords || "neyming, naming, brend nomi",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  
  return <NamingClient lang={lang as Locale} translations={dictionary.namingPage} />;
}