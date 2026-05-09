import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';
import PackagingClient from './packaging-client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  const metadata = dictionary.packagingPage?.metadata;

  return {
    title: metadata?.title || "Qadoq Dizayni | Professional Mahsulot Dizayni | Jon.Branding",
    description: metadata?.description || "Mahsulotingizni javonda ajratib turadigan professional qadoq dizaynlari yaratamiz.",
    keywords: metadata?.keywords || "qadoq dizayn, qadoqlash, mahsulot dizayni, brending, packaging design",
  };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as Locale);
  
  return <PackagingClient lang={lang as Locale} translations={dictionary.packagingPage} />;
}
