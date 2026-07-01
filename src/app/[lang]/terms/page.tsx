import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { defaultLocale, locales } from '@/lib/i18n/locale';

type TermsPageProps = {
  params: Promise<{ lang: string }>;
};

function toSafeLocale(lang: string): Locale {
  return locales.includes(lang as Locale) ? (lang as Locale) : defaultLocale;
}

<<<<<<< Updated upstream
export async function generateMetadata(props: TermsPageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const titles: Record<string, string> = {
    uz: 'Foydalanish Shartlari | Jon.Branding',
    ru: 'Условия Использования | Jon.Branding',
    en: 'Terms of Service | Jon.Branding',
    zh: '服务条款 | Jon.Branding',
  };
  const descs: Record<string, string> = {
    uz: 'Jon.Branding agentligi xizmatlaridan foydalanish shartlari — shaffof va professional hamkorlik.',
    ru: 'Условия использования услуг агентства Jon.Branding — прозрачное и профессиональное сотрудничество.',
    en: 'Terms of use for Jon.Branding agency services — transparent and professional cooperation.',
    zh: 'Jon.Branding 机构服务使用条款 — 透明、专业的合作。',
  };
  return {
    title: titles[safeLang] || titles.uz,
    description: descs[safeLang] || descs.uz,
    openGraph: { title: titles[safeLang], description: descs[safeLang], images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: titles[safeLang], description: descs[safeLang], images: ['/images/cms/og-image.jpeg'] },
  };
}

const TermsPage = async ({ params }: TermsPageProps) => {
=======
export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
>>>>>>> Stashed changes
  const { lang } = await params;
  const dictionary = await getDictionary(toSafeLocale(lang));
  const { metadata } = dictionary.termsPage;

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(toSafeLocale(lang));
  const terms = dictionary.termsPage;

  return (
    <div className="min-h-screen bg-brand-paper pt-32 pb-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-6 text-4xl font-black tracking-tight">
          {terms.title}
        </h1>
        <p className="mb-12 leading-relaxed text-muted-foreground">
          {terms.intro}
        </p>
        <div className="space-y-10">
          {terms.sections.map((section: { title: string; text: string }) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-bold">{section.title}</h2>
              <p className="leading-relaxed text-muted-foreground">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
