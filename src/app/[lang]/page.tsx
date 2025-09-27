
import dynamic from 'next/dynamic';

const HomeComponent = dynamic(() => import('@/components/home-component'));

const Page = ({ params }: { params: { lang: string } }) => {
  return <HomeComponent lang={params.lang} />;
};

export default Page;
