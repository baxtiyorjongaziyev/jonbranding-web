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
    naming: string;
    brandbook: string;
    packaging_design: string;
    logo_design: string;
    corporate_style: string;
    additional: string;
    service_prices: string;
    branding_test: string;
    online_brief?: string;
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
    solutions: lang === 'uz' ? 'Yechimlar' : lang === 'ru' ? 'Решения' : lang === 'zh' ? '解决方案' : 'Solutions',
    resources: lang === 'uz' ? 'Resurslar' : lang === 'ru' ? 'Ресурсы' : lang === 'zh' ? '资源' : 'Resources',
    agency: lang === 'uz' ? 'Agentlik' : lang === 'ru' ? 'Агентство' : lang === 'zh' ? '机构' : 'Agency',
    contact_us: lang === 'uz' ? "Bog'lanish" : lang === 'ru' ? 'Контакты' : lang === 'zh' ? '联系我们' : 'Contact',
    explore_work: lang === 'uz' ? "Ishlarni ko'rish" : lang === 'ru' ? 'Смотреть работы' : lang === 'zh' ? '查看作品' : 'Explore Work',
    read_blogs: lang === 'uz' ? "Blogni o'qish" : lang === 'ru' ? 'Читать блог' : lang === 'zh' ? '阅读博客' : 'Read Blog',
    privacy_policy_link: lang === 'uz' ? 'Maxfiylik siyosati' : lang === 'ru' ? 'Политика конфиденциальности' : lang === 'zh' ? '隐私政策' : 'Privacy Policy',
    terms_of_use_link: lang === 'uz' ? 'Foydalanish shartlari' : lang === 'ru' ? 'Условия использования' : lang === 'zh' ? '使用条款' : 'Terms',
    about_us: lang === 'uz' ? 'Haqimizda' : lang === 'ru' ? 'О нас' : lang === 'zh' ? '关于我们' : 'About Us',
    contacts_page: lang === 'uz' ? 'Aloqa' : lang === 'ru' ? 'Контакты' : lang === 'zh' ? '联系我们' : 'Contact',
    ...dictionary,
  };
  const getLocalizedPath = (path: string) => {
    if (path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (lang === 'uz') return cleanPath;
    return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  };

  return (
    <footer className="relative overflow-hidden bg-[#0a0a10] text-white" suppressHydrationWarning>
      <div className="relative bg-[#0a0a10] pt-24 pb-[calc(env(safe-area-inset-bottom)+4.5rem)] md:pb-0">
        {/* Finch-style Vivid Background Gradient - Anchored to very bottom */}
        <div 
          className="absolute bottom-0 left-[-20%] w-[140%] h-[35%] pointer-events-none overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(44, 43, 245, 0.86) 0%, rgba(47, 107, 255, 0.34) 48%, rgba(10, 10, 16, 0) 85%)',
            filter: 'blur(100px)',
            opacity: 0.85
          }}
        />
        
        {/* Secondary Vibrant Splash */}
        <div 
          className="absolute bottom-[-50px] right-[-10%] w-[60%] h-[20%] pointer-events-none overflow-hidden select-none"
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(61, 58, 255, 0.62) 0%, rgba(10, 10, 16, 0) 70%)',
            filter: 'blur(80px)',
            opacity: 0.6
          }}
        />
        
        {/* Intense Corner Splash - Brighter */}
        <div className="absolute bottom-0 right-0 h-[30%] w-[100%] pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_110%,rgba(44,43,245,0.22),transparent_75%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Multi-Column Grid (Finch.design style) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.services}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={getLocalizedPath('/xizmatlar/neyming')} className="hover:text-white transition-colors">{copy.naming}</Link></li>
              <li><Link href={getLocalizedPath('/xizmatlar/logo-dizayni')} className="hover:text-white transition-colors">{copy.logo_design}</Link></li>
              <li><Link href={getLocalizedPath('/xizmatlar/firmenniy-stil')} className="hover:text-white transition-colors">{copy.corporate_style}</Link></li>
              <li><Link href={getLocalizedPath('/xizmatlar/brandbook')} className="hover:text-white transition-colors">{copy.brandbook}</Link></li>
            </ul>
          </div>

          {/* Solutions / Packaging */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.solutions}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={getLocalizedPath('/xizmatlar/qadoq-dizayni')} className="hover:text-white transition-colors">{copy.packaging_design}</Link></li>
              <li><Link href={getLocalizedPath('/xizmatlar')} className="hover:text-white transition-colors">{copy.service_prices}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.resources}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={getLocalizedPath('/blog')} className="hover:text-white transition-colors">{copy.blog}</Link></li>
              <li><Link href={getLocalizedPath('/online-brief')} className="hover:text-white transition-colors">{copy.online_brief || 'Onlayn-brief'}</Link></li>
              <li><Link href={getLocalizedPath('/quiz')} className="hover:text-white transition-colors">{copy.branding_test}</Link></li>
              <li><Link href={getLocalizedPath('/checklist')} className="hover:text-white transition-colors">{lang === 'uz' ? 'Brending chek-listi' : lang === 'ru' ? 'Чек-лист по брендингу' : lang === 'zh' ? '品牌清单' : 'Branding Checklist'}</Link></li>
              <li><Link href={getLocalizedPath('/xizmatlar/patent-kalkulyatori')} className="hover:text-white transition-colors">{copy.patent_calculator}</Link></li>
              <li><Link href={getLocalizedPath('/sitemap')} className="hover:text-white transition-colors">{copy.sitemap}</Link></li>
            </ul>
          </div>

          {/* Agency */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.agency}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={getLocalizedPath('/#portfolio')} className="hover:text-white transition-colors">{copy.portfolio}</Link></li>
              <li><Link href={getLocalizedPath('/#founder')} className="hover:text-white transition-colors">{copy.founder}</Link></li>
              <li><Link href={getLocalizedPath('/haqimizda')} className="hover:text-white transition-colors">{copy.about_us}</Link></li>
              <li><Link href={getLocalizedPath('/aloqa')} className="hover:text-white transition-colors">{copy.contacts_page}</Link></li>
              <li><Link href={getLocalizedPath('/#faq')} className="hover:text-white transition-colors">{copy.faq}</Link></li>
            </ul>
          </div>

          {/* Hire Us Section */}
          <div className="space-y-8 lg:col-span-1">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{copy.contact_us}</h3>
              <div className="space-y-4">
                <a 
                  href="tel:+998336450097"
                  onClick={() => trackContactClick('phone', 'footer')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-[#0a0a10] transition-all duration-300 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  +998 33 645 00 97
                </a>
                <a 
                  href="https://t.me/baxtiyorjon_gaziyev"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick('telegram', 'footer')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[linear-gradient(135deg,#3d3aff_0%,#1b18c2_100%)] rounded-full text-sm font-medium hover:-translate-y-0.5 transition-all duration-300 w-full gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Send size={16} /> Telegram
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href={getLocalizedPath('/#portfolio')}
                className="text-xs font-bold text-[#8f9cff] hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors"
              >
                {copy.explore_work}
              </Link>
              <Link 
                href={getLocalizedPath('/blog')}
                className="text-xs font-bold text-[#8f9cff] hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors"
              >
                {copy.read_blogs}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 border-t border-white/10 mt-6 relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[11px] text-gray-500 uppercase tracking-tight font-medium">
            <span>&copy; {currentYear} Jon.Branding Agency. {copy.all_rights_reserved}</span>
            <span className="text-white/10 px-1">/</span>
            <Link href={getLocalizedPath('/privacy')} className="hover:text-white transition-colors">
              {copy.privacy_policy_link}
            </Link>
            <span className="text-white/10 px-1">/</span>
            <Link href={getLocalizedPath('/terms')} className="hover:text-white transition-colors">
              {copy.terms_of_use_link}
            </Link>
          </div>


          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5">
              <a href="https://www.instagram.com/jon.branding/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-110 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://t.me/JonBranding" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-110 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-label="Telegram Channel">
                <Send size={20} />
              </a>
              <a href="https://www.linkedin.com/in/baxtiyorjongaziyev/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-110 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
            
            <Separator orientation="vertical" className="h-4 bg-white/10 hidden sm:block" />

          </div>
        </div>
        </div>

        <div className="relative z-10 select-none pointer-events-none mt-20 pb-0 overflow-hidden leading-none w-full">
          <h2 className="text-[9vw] font-semibold leading-[0.8] text-white/95 tracking-[-0.05em] text-center transition-all whitespace-nowrap mb-[-0.15em] uppercase">
            Jon Branding Agency
          </h2>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
