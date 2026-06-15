import { getDictionary, Locale } from '@/lib/dictionaries';
import PricingClient from './pricing-client';

const PricingPage = async (props: { params: Promise<{ lang: Locale }> }) => {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);

    return (
      <main className="flex-grow">
          <PricingClient lang={lang} dictionary={dictionary} />
      </main>
    );
};

export default PricingPage;
