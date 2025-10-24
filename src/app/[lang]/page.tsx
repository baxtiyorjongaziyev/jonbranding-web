
import dynamic from 'next/dynamic';
import { getDictionary, Locale } from '@/lib/dictionaries';

const HomeComponent = dynamic(() => import('@/components/home-component'));

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return <HomeComponent lang={lang} dictionary={dictionary} />;
};

export default Page;
