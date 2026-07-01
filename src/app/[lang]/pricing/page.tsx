import { Locale } from '@/lib/dictionaries';
import { redirect } from 'next/navigation';

const PricingPage = async (props: { params: Promise<{ lang: Locale }> }) => {
    const { lang } = await props.params;
    const target = lang === 'uz' ? '/narxlar' : `/${lang}/narxlar`;
    redirect(target);
};

export default PricingPage;
