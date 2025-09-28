
import { getDictionary, Locale } from '@/lib/dictionaries';
import PackageBuilder from '@/components/sections/package-builder';
import Comparison from '@/components/sections/comparison';
import Offer from '@/components/sections/offer';
import QueueStatus from '@/components/sections/queue-status';
import XizmatlarClient from './xizmatlar-client';


const XizmatlarPage = async ({ params: { lang } }: { params: { lang: Locale } }) => {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex-grow">
            <PackageBuilder onOrderNow={() => {}} lang={lang} dictionary={dictionary.packageBuilder} />
            <Comparison onCtaClick={() => {}} lang={lang} />
            <Offer onCTAClick={() => {}} lang={lang} dictionary={dictionary.offer} />
            <QueueStatus onCtaClick={() => {}} />
            <XizmatlarClient lang={lang} dictionary={dictionary.mobileCtaBar} />
        </main>
    );
};

export default XizmatlarPage;
