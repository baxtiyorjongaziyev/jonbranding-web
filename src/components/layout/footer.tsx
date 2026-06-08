'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, Send } from 'lucide-react';
import { Separator } from '../ui/separator';
import { FC } from 'react';
import { trackContactClick } from '@/lib/analytics';

type Dictionary = {
    contact: string;
    by_telegram: string;
    by_phone: string;
    main_page: string;
    portfolio: string;
    founder: string;
    process: string;
    faq: string;
    services: string;
    brand_strategy: string;
    naming: string;
    brandbook: string;
    packaging_design: string;
    logo_design: string;
    corporate_style: string;
    additional: string;
    service_prices: string;
    branding_test: string;
    blog: string;
    sitemap: string;
    all_rights_reserved: string;
    back_to_top: string;
    patent_calculator: string;
    solutions?: string;
    resources?: string;
    agency?: string;
    contact_us?: string;
    explore_work?: string;
    read_blogs?: string;
    privacy_policy_link?: string;
    terms_of_use_link?: string;
}

const Footer: FC<{ lang: string, dictionary: Dictionary }> = ({ lang = 'uz', dictionary }) => {
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.replace(/^\/(uz|ru|en|zh)(?=\/|$)/, '') || '/';
  if (pathnameWithoutLocale === '/pro-preview') return null;

  const currentYear = new Date().getFullYear();
  if (!dictionary) return null;
  const copy = {
    solutions: lang === 'uz' ? 'Yechimlar' : 'Solutions',
    resources: lang === 'uz' ? 'Resurslar' : 'Resources',
    agency: lang === 'uz' ? 'Agentlik' : 'Agency',
    contact_us: lang === 'uz' ? "Bog'lanish" : 'Contact',
    explore_work: lang === 'uz' ? "Ishlarni ko'rish" : 'Explore Work',
    read_blogs: lang === 'uz' ? "Blogni o'qish" : 'Read Blog',
    privacy_policy_link: lang === 'uz' ? 'Maxfiylik siyosati' : 'Privacy Policy',
    terms_of_use_link: lang === 'uz' ? 'Foydalanish shartlari' : 'Terms',
    ...dictionary,
  };
  const getLocalizedPath = (path: string) => {
    if (path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (lang === 'uz') return cleanPath;
    return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  };

  return (
    <footer className="relative overflow-hidden bg-[#0a0a10] text-white mobile-nav-clearance" suppressHydrationWarning>
      <div className="relative bg-[#0a0a10] pt-16 pb-0 sm:pt-24">
        {/* Background gradient effects */}
        <div 
          className="absolute bottom-0 left-[-20%] w-[140%] h-[35%] pointer-events-none overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(44, 43, 245, 0.86) 0%, rgba(47, 107, 255, 0.34) 48%, rgba(10, 10, 16, 0) 85%)',
            filter: 'blur(100px)',
            opacity: 0.85
          }}
        />
        <div 
          className="absolute bottom-[-50px] right-[-10%] w-[60%] h-[20%] pointer-events-none overflow-hidden select-none"
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(61, 58, 255, 0.62) 0%, rgba(10, 10, 16, 0) 70%)',
            filter: 'blur(80px)',
            opacity: 0.6
          }}
        />
        <div className="absolute bottom-0 right-0 h-[30%] w-[100%] pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_110%,rgba(44,43,245,0.22),transparent_75%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Section: Multi-Column Grid */}
          <div className="grid grid-cols-2 gap-8 mb-10 sm:grid-cols-3 sm:gap-10 sm:mb-14 lg:grid-cols-5 lg:gap-12 lg:mb-16">
            {/* Services */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.services}</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-400">
                <li><Link href={getLocalizedPath('/xizmatlar/neyming')} className="hover:text-white transition-colors">{copy.naming}</Link></li>
                <li><Link href={getLocalizedPath('/xizmatlar/logo-dizayni')} className="hover:text-white transition-colors">{copy.logo_design}</Link></li>
                <li><Link href={getLocalizedPath('/xizmatlar/firmenniy-stil')} className="hover:text-white transition-colors">{copy.corporate_style}</Link></li>
                <li><Link href={getLocalizedPath('/xizmatlar/brandbook')} className="hover:text-white transition-colors">{copy.brandbook}</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.solutions}</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-400">
                <li><Link href={getLocalizedPath('/xizmatlar/qadoq-dizayni')} className="hover:text-white transition-colors">{copy.packaging_design}</Link></li>
                <li><Link href={getLocalizedPath('/xizmatlar/brand-strategiyasi')} className="hover:text-white transition-colors">{copy.brand_strategy}</Link></li>
                <li><Link href={getLocalizedPath('/xizmatlar')} className="hover:text-white transition-colors">{copy.service_prices}</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.resources}</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-400">
                <li><Link href={getLocalizedPath('/blog')} className="hover:text-white transition-colors">{copy.blog}</Link></li>
                <li><Link href={getLocalizedPath('/quiz')} className="hover:text-white transition-colors">{copy.branding_test}</Link></li>
                <li><Link href={getLocalizedPath('/xizmatlar/patent-kalkulyatori')} className="hover:text-white transition-colors">{copy.patent_calculator}</Link></li>
                <li><Link href={getLocalizedPath('/sitemap')} className="hover:text-white transition-colors">{copy.sitemap}</Link></li>
              </ul>
            </div>

            {/* Agency */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.agency}</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-400">
                <li><Link href={getLocalizedPath('/#portfolio')} className="hover:text-white transition-colors">{copy.portfolio}</Link></li>
                <li><Link href={getLocalizedPath('/#founder')} className="hover:text-white transition-colors">{copy.founder}</Link></li>
                <li><Link href={getLocalizedPath('/#process')} className="hover:text-white transition-colors">{copy.process}</Link></li>
                <li><Link href={getLocalizedPath('/#faq')} className="hover:text-white transition-colors">{copy.faq}</Link></li>
              </ul>
            </div>

            {/* Contact CTA — spans full width on mobile */}
            <div className="col-span-2 space-y-4 sm:col-span-3 sm:space-y-6 lg:col-span-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.contact_us}</h3>
              <div className="flex flex-col gap-2.5 sm:gap-3 sm:max-w-xs lg:max-w-none">
                <a 
                  href="tel:+998336450097"
                  onClick={() => trackContactClick('phone', 'footer')}
                  className="inline-flex h-11 items-center justify-center px-6 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-[#0a0a10] transition-all duration-300 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  +998 33 645 00 97
                </a>
                <a 
                  href="https://t.me/baxtiyorjon_gaziyev"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick('telegram', 'footer')}
                  className="inline-flex h-11 items-center justify-center px-6 bg-[linear-gradient(135deg,#3d3aff_0%,#1b18c2_100%)] rounded-full text-sm font-medium hover:-translate-y-0.5 transition-all duration-300 w-full gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Send size={15} /> Telegram
                </a>
              </div>
              <div className="flex gap-5 sm:flex-col sm:gap-2.5 lg:gap-2.5">
                <Link 
                  href={getLocalizedPath('/#portfolio')}
                  className="text-[11px] font-bold text-[#8f9cff] hover:text-white flex items-center gap-1.5 uppercase tracking-widest transition-colors"
                >
                  {copy.explore_work}
                </Link>
                <Link 
                  href={getLocalizedPath('/blog')}
                  className="text-[11px] font-bold text-[#8f9cff] hover:text-white flex items-center gap-1.5 uppercase tracking-widest transition-colors"
                >
                  {copy.read_blogs}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center gap-5 py-8 border-t border-white/10 sm:flex-row sm:justify-between sm:gap-6 sm:py-10">
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500 uppercase tracking-tight font-medium sm:justify-start sm:gap-3">
              <span>&copy; {currentYear} Jon.Branding Agency. {copy.all_rights_reserved}</span>
              <span className="text-white/10 hidden sm:inline">/</span>
              <Link href={getLocalizedPath('/privacy')} className="hover:text-white transition-colors">
                {copy.privacy_policy_link}
              </Link>
              <span className="text-white/10 hidden sm:inline">/</span>
              <Link href={getLocalizedPath('/terms')} className="hover:text-white transition-colors">
                {copy.terms_of_use_link}
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/jon.branding/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/8 transition-all duration-200 active:scale-90"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://t.me/JonBranding"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/8 transition-all duration-200 active:scale-90"
                aria-label="Telegram Channel"
              >
                <Send size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/baxtiyorjongaziyev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/8 transition-all duration-200 active:scale-90"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Large text watermark */}
        <div className="relative z-10 select-none pointer-events-none mt-12 sm:mt-20 pb-0 overflow-hidden leading-none w-full">
          <h2 className="text-[9vw] font-semibold leading-[0.8] text-white/95 tracking-[-0.05em] text-center transition-all whitespace-nowrap mb-[-0.15em] uppercase">
            Jon Branding Agency
          </h2>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
