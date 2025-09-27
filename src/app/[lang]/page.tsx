import dynamic from 'next/dynamic';
import { getDictionary } from '@/lib/dictionaries';

const HomeComponent = dynamic(() => import('@/components/home-component'));

const Page = async ({ params }: { params: { lang: 'uz' | 'ru' } }) => {
  const dictionary = await getDictionary(params.lang);
  return <HomeComponent lang={params.lang} dictionary={dictionary} />;
};

export default Page;
