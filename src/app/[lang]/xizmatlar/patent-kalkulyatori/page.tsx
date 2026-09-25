import { Separator } from '@/components/ui/separator';
import TrademarkCalculator from '@/components/sections/trademark-calculator';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Props = { params: Promise<{ lang: string }> };

// Server komponent: sarlavha va matn HTML'ning o'zida keladi. Avval lug'at
// useEffect'da yuklanardi va server faqat bo'sh skeleton qaytarardi (h1 yo'q edi).
export default async function PatentCalculatorPage({ params }: Props) {
  const { lang } = await params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const translations = (await getDictionary(safeLang)).patentCalculatorPage;

  return (
    <div className="flex-grow pt-20">
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
                {translations.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
                {translations.subtitle}
            </p>
        </div>
      </section>

      <section id="patent-calculator" className="py-16 sm:py-24 bg-secondary">
        <div className="container mx-auto px-4">
            <Separator className="my-12" />
            <TrademarkCalculator translations={translations.trademarkCalculator} />
        </div>
      </section>
    </div>
  );
}
