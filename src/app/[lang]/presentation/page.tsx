import { redirect } from 'next/navigation';
import { Locale } from '@/lib/dictionaries';

const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

/**
 * Eski slaydli taqdimot `/credentials` bilan almashtirildi.
 * Undagi raqamlar eskirgan edi ("50+ loyiha"), yangi sahifa esa
 * ma'lumotni Sanity'dan va `src/lib/sales-content.ts` dan oladi.
 * Link tarqatilgan bo'lishi mumkin, shuning uchun o'chirilmay yo'naltiriladi.
 */
const PresentationPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';
  redirect(safeLang === 'uz' ? '/credentials' : `/${safeLang}/credentials`);
};

export default PresentationPage;
