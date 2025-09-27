
import dynamic from 'next/dynamic';
import { getDictionary, Locale } from '@/lib/dictionaries';

const HomeComponent = dynamic(() => import('@/components/home-component'));

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params.lang);
  return <HomeComponent lang={params.lang} dictionary={dictionary} />;
};

export default Page;

    