import type { Metadata } from 'next';
import { Locale } from '@/lib/dictionaries';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { optimizeSanityUrl } from '@/lib/portfolio-presentation';
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

  // Taqdimot uchun eng kuchli keyslarni tartib bilan saralash (Neyming, Qadoq, Firma uslubi, Brendbuk)
  const FLAGSHIP_PRIORITY = [
    'savod',
    'shirona',
    'rashmilk',
    'boyarin',
    'fidda-by-sevara-kumush-brendi',
    'fidda',
    'revo',
    'enros',
    'arfadel',
    'geonest',
    'yasira',
    'den-aroma-brend-transformatsiyasi',
    'den-aroma',
  ];

  const withCovers = projects.filter((project) => project.coverImage);
  const sortedProjects = [...withCovers].sort((a, b) => {
    const aIndex = FLAGSHIP_PRIORITY.findIndex((s) => a.slug === s || a.slug.startsWith(`${s}-`));
    const bIndex = FLAGSHIP_PRIORITY.findIndex((s) => b.slug === s || b.slug.startsWith(`${s}-`));
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  const seenTitles = new Set<string>();
  const uniqueProjects: typeof sortedProjects = [];
  for (const p of sortedProjects) {
    const key = (p.title || p.slug).toLowerCase().trim();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueProjects.push(p);
    }
  }

  const cases: CredCase[] = uniqueProjects
    .slice(0, 10)
    .map((project) => {
      const cover = optimizeSanityUrl(project.coverImage, 1000, 75);
      const gallery = (project.galleryImages && project.galleryImages.length > 0)
        ? project.galleryImages.map((img: string) => optimizeSanityUrl(img, 1000, 75))
        : [cover];
      return {
        slug: project.slug,
        title: project.title,
        client: project.client || project.title,
        categoryLabel: project.categoryLabel || 'Brending',
        coverImage: cover,
        galleryImages: gallery,
        result: project.results?.[0],
      };
    });

  const quotes: CredQuote[] = testimonials
    .filter((item) => !item.videoUrl && !item.videoFileUrl && item.quote && item.quote.length > 60)
    .slice(0, 3)
    .map((item) => ({ name: item.name, company: item.company, quote: item.quote }));

  const logos: CredLogo[] = brands
    .flatMap((brand) => (brand.logo ? [{ name: brand.name, logo: brand.logo }] : []));

  return (
    <div className="flex-grow">
      <CredentialsClient cases={cases} quotes={quotes} logos={logos} />
    </div>
  );
};

export default CredentialsPage;
