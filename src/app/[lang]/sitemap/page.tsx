
import { getSortedPostsData } from '@/lib/blog-posts';
import Link from 'next/link';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Home, List, PenSquare, Rss, Settings, Package, BrainCircuit, ScanText, Paintbrush, Fingerprint, Book, ImageIcon } from 'lucide-react';

type Props = {
  params: Promise<{ lang: string }>;
};

const SitemapPage = async (props: Props) => {
  const { lang } = await props.params;
  const sortedPosts = getSortedPostsData(lang);
  const dictionary = await getDictionary(lang as Locale);
  
  const t = dictionary.sitemapPage || {
    sections: {
        main: 'Asosiy bo\'limlar',
        services: 'Xizmatlar',
        blog: 'Blog maqolalari'
    },
    links: {
        home: 'Bosh sahifa',
        quiz: 'Brending testi',
        portfolio: 'Portfolio',
        process: 'Ishlash tartibi',
        faq: 'Savol-javoblar'
    }
  };

  const sections = [
    {
      title: t.sections?.main || 'Asosiy bo\'limlar',
      icon: Home,
      links: [
        { href: '/', label: t.links?.home || 'Bosh sahifa' },
        { href: '/quiz', label: t.links?.quiz || 'Brending testi' },
        { href: '/#portfolio', label: t.links?.portfolio || 'Portfolio' },
        { href: '/#process', label: t.links?.process || 'Ishlash tartibi' },
        { href: '/#faq', label: t.links?.faq || 'Savol-javoblar' },
      ],
    },
    {
      title: t.sections?.services || 'Xizmatlar',
      icon: Settings,
      links: [
        { href: '/xizmatlar/neyming', label: t.links?.naming || 'Neyming', icon: ScanText },
        { href: '/xizmatlar/logo-dizayni', label: t.links?.logo_design || 'Logotip dizayni', icon: Fingerprint },
        { href: '/xizmatlar/firmenniy-stil', label: t.links?.corporate_style || 'Firma uslubi', icon: Paintbrush },
        { href: '/xizmatlar/brandbook', label: t.links?.brandbook || 'Brendbuk', icon: Book },
        { href: '/xizmatlar/qadoq-dizayni', label: t.links?.packaging_design || 'Qadoq dizayni', icon: Package },
        { href: '/xizmatlar', label: t.links?.services_prices || 'Xizmatlar va narxlar', icon: List },
        { href: '/xizmatlar/brand-strategy', label: t.links?.brand_strategy || 'Brend strategiyasi', icon: BrainCircuit },
        { href: '/xizmatlar/patent-kalkulyatori', label: t.links?.patent_calculator || 'Patent kalkulyatori', icon: PenSquare },
        { href: '/pricing/sotuvchi-kartochka', label: t.links?.marketplace_cover || 'Sotuvchi kartochka dizayni', icon: ImageIcon },
      ],
    },
    {
      title: t.sections?.blog || 'Blog maqolalari',
      icon: Rss,
      links: sortedPosts.map(post => ({ href: `/blog/${post.slug}`, label: post.title })),
    },
  ];

  return (
    <main className="flex-grow bg-white" suppressHydrationWarning>
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
              {t.title || 'Sayt xaritasi'}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
              {t.subtitle || 'Barcha sahifalar haqida umumiy ma\'lumot.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-secondary/50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <section.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h2 className="text-2xl font-bold text-dark-blue">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={`/${lang}${link.href}`} 
                        className="group flex items-start gap-2 text-gray-700 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
                        aria-label={link.label}
                      >
                        {link.icon && <link.icon className="h-5 w-5 mt-0.5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" aria-hidden="true" />}
                        <span className="flex-grow">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SitemapPage;
