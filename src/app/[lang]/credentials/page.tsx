import type { Metadata } from 'next';
import { Locale } from '@/lib/dictionaries';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { fetchTestimonials } from '@/lib/data/testimonials';
import { fetchBrands } from '@/lib/data/brands';
import CredentialsClient from './credentials-client';
import { getPageAlternates } from '@/lib/seo';
import type { CredCase, CredLogo, CredQuote } from './credentials-client';

const VALID_LOCALES: Locale[] = ['uz', 'ru', 'en', 'zh'];

const TITLE = 'Credentials';
const DESCRIPTION =
  'Jon Branding agentligi taqdimoti: ishlar, xizmatlar, narxlar va ish jarayoni bitta sahifada.';

/**
 * Sotuvchi uchun taqdimot sahifasi. Link bilan ochiq, lekin qidiruv tizimlari
 * indekslamaydi — narxlar ochiq turgani uchun sahifa faqat suhbat davomida beriladi.
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const safeLang: Locale = (['uz', 'ru', 'en', 'zh'] as const).includes(lang as Locale) ? (lang as Locale) : 'uz';
  const alternates = await getPageAlternates(safeLang, '/credentials');
  return {
    title: TITLE,
    description: DESCRIPTION,
    robots: { index: false, follow: false, nocache: true },
    alternates,
  } as Metadata;
}


const CredentialsPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await props.params;
  const safeLang = VALID_LOCALES.includes(lang) ? lang : 'uz';

  const [projects, testimonials, brands] = await Promise.all([
    fetchPortfolioList(safeLang),
    fetchTestimonials(safeLang),
    fetchBrands(),
  ]);

  const cases: CredCase[] = projects
    .filter((project) => project.coverImage)
    .slice(0, 6)
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      client: project.client,
      categoryLabel: project.categoryLabel,
      coverImage: project.coverImage,
      result: project.results?.[0],
    }));

  const quotes: CredQuote[] = testimonials
    .filter((item) => item.quote && item.quote.length > 60)
    .slice(0, 3)
    .map((item) => ({ name: item.name, company: item.company, quote: item.quote }));

  const logos: CredLogo[] = brands
    .flatMap((brand) => (brand.logo ? [{ name: brand.name, logo: brand.logo }] : []))
    .slice(0, 18);

  return (
    <div className="flex-grow">
      <CredentialsClient cases={cases} quotes={quotes} logos={logos} />
    </div>
  );
};

export default CredentialsPage;
