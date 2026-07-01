<<<<<<< Updated upstream

import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Home, List, PenSquare, Rss, Settings, Package, BrainCircuit, ScanText, Paintbrush, Fingerprint, Book, ImageIcon, Truck } from 'lucide-react';
import fs from 'fs';
import path from 'path';
=======
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Book,
  BrainCircuit,
  Fingerprint,
  Home,
  ImageIcon,
  List,
  Package,
  Paintbrush,
  PenSquare,
  Rss,
  ScanText,
  Settings,
  Truck,
} from 'lucide-react';
import { getSortedPostsData } from '@/lib/blog-posts';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { defaultLocale, getLocalizedPath, locales } from '@/lib/i18n/locale';
>>>>>>> Stashed changes

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = locales.includes(lang as Locale) ? (lang as Locale) : defaultLocale;
  const dictionary = await getDictionary(safeLang);

  return { title: `${dictionary.sitemapPage.title} | Jon.Branding` };
}

function getSitemapBlogPosts(lang: string) {
  try {
    const dir = path.join(process.cwd(), 'src/posts', ['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(dir, fileName), 'utf8');
      const title = content.startsWith('---') ? content.split('---')[1]?.split('\n').find(l => l.startsWith('title:'))?.replace(/^title:\s*/,'').replace(/^["']|["']$/g,'').trim() : slug;
      return { slug, title: title || slug };
    }).sort((a, b) => a.slug.localeCompare(b.slug));
  } catch { return []; }
}

const SitemapPage = async (props: Props) => {
  const { lang } = await props.params;
<<<<<<< Updated upstream
  const sortedPosts = getSitemapBlogPosts(lang);
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
        faq: 'Savol-javoblar',
        naming: 'Neyming',
        logo_design: 'Logotip dizayni',
        corporate_style: 'Firma uslubi',
        brandbook: 'Brendbuk',
        packaging_design: 'Qadoq dizayni',
        car_wrap_design: 'Creative Car Wrap Design',
        services_prices: 'Xizmatlar va narxlar',
        brand_strategy: 'Brend strategiyasi',
        patent_calculator: 'Patent kalkulyatori',
        marketplace_cover: 'Sotuvchi kartochka dizayni'
    }
  };
=======
  const safeLang = locales.includes(lang as Locale) ? (lang as Locale) : defaultLocale;
  const sortedPosts = getSortedPostsData(safeLang);
  const dictionary = await getDictionary(safeLang);
  const t = dictionary.sitemapPage;
>>>>>>> Stashed changes

  const sections = [
    {
      title: t.sections.main,
      icon: Home,
      links: [
        { href: '/', label: t.links.home },
        { href: '/quiz', label: t.links.quiz },
        { href: '/portfolio', label: t.links.portfolio },
        { href: '/#process', label: t.links.process },
        { href: '/#faq', label: t.links.faq },
      ],
    },
    {
      title: t.sections.services,
      icon: Settings,
      links: [
        { href: '/xizmatlar/neyming', label: t.links.naming, icon: ScanText },
        { href: '/xizmatlar/logo-dizayni', label: t.links.logo_design, icon: Fingerprint },
        { href: '/xizmatlar/firmenniy-stil', label: t.links.corporate_style, icon: Paintbrush },
        { href: '/xizmatlar/brandbook', label: t.links.brandbook, icon: Book },
        { href: '/xizmatlar/qadoq-dizayni', label: t.links.packaging_design, icon: Package },
        { href: '/xizmatlar/car-wrap-design', label: t.links.car_wrap_design, icon: Truck },
        { href: '/narxlar', label: t.links.services_prices, icon: List },
        { href: '/xizmatlar/brand-strategiyasi', label: t.links.brand_strategy, icon: BrainCircuit },
        { href: '/xizmatlar/patent-kalkulyatori', label: t.links.patent_calculator, icon: PenSquare },
        { href: '/pricing/sotuvchi-kartochka', label: t.links.marketplace_cover, icon: ImageIcon },
      ],
    },
    {
      title: t.sections.blog,
      icon: Rss,
      links: sortedPosts.map((post) => ({ href: `/blog/${post.slug}`, label: post.title })),
    },
  ];

  return (
    <main className="flex-grow bg-white" suppressHydrationWarning>
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-extrabold text-dark-blue sm:text-5xl md:text-6xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-700 md:text-xl">
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title} className="rounded-2xl bg-secondary/50 p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <section.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-dark-blue">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={getLocalizedPath(safeLang, link.href)}
                        className="group flex items-start gap-2 rounded-sm text-gray-700 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={link.label}
                      >
                        {'icon' in link && link.icon && (
                          <link.icon
                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-primary"
                            aria-hidden="true"
                          />
                        )}
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
