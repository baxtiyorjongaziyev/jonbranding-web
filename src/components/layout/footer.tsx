
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { ArrowUp, Instagram, Send } from 'lucide-react';
import { Separator } from '../ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, FC } from 'react';

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
    corporate_style: string;
    packaging_design: string;
    logo_design: string;
    additional: string;
    service_prices: string;
    branding_test: string;
    blog: string;
    sitemap: string; // Added sitemap
    all_rights_reserved: string;
    back_to_top: string;
    patent_calculator: string;
}

const Footer: FC<{ lang: string, dictionary: Dictionary }> = ({ lang = 'uz', dictionary }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mainPageLinks = [
      { href: `/${lang}/#portfolio`, label: dictionary.portfolio },
      { href: `/${lang}/#founder`, label: dictionary.founder },
      { href: `/${lang}/#process`, label: dictionary.process },
      { href: `/${lang}/#faq`, label: dictionary.faq },
  ];

  const serviceLinks = [
      { href: `/${lang}/xizmatlar/brand-strategy`, label: dictionary.brand_strategy },
      { href: `/${lang}/xizmatlar/neyming`, label: dictionary.naming },
      { href: `/${lang}/xizmatlar/firmenniy-stil`, label: dictionary.corporate_style },
      { href: `/${lang}/xizmatlar/qadoq-dizayni`, label: dictionary.packaging_design },
      { href: `/${lang}/xizmatlar/logo-dizayni`, label: dictionary.logo_design },
  ];
  
  const additionalLinks = [
      { href: `/${lang}/xizmatlar`, label: dictionary.service_prices },
      { href: `/${lang}/quiz`, label: dictionary.branding_test },
      { href: `/${lang}/blog`, label: dictionary.blog },
      { href: `/${lang}/xizmatlar/patent-kalkulyatori`, label: dictionary.patent_calculator },
      { href: `/${lang}/sitemap`, label: dictionary.sitemap }, // Added sitemap link
  ];

  return (
    <footer className="bg-black text-gray-300 pt-16 sm:pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{dictionary.contact}</h3>
            <div className="mt-4 space-y-4">
               <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">@baxtiyorjon_gaziyev</p>
                  <p className="text-xs text-gray-400">{dictionary.by_telegram}</p>
               </a>
               <a href="tel:+998336450097" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">+998 33 645 00 97</p>
                  <p className="text-xs text-gray-400">{dictionary.by_phone}</p>
               </a>
            </div>
          </div>
          
          {/* Main Page Links */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{dictionary.main_page}</h3>
            <ul className="mt-4 space-y-2">
              {mainPageLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{dictionary.services}</h3>
            <ul className="mt-4 space-y-2">
              {serviceLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{dictionary.additional}</h3>
             <ul className="mt-4 space-y-2">
                {additionalLinks.map(link => (
                    <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link></li>
                ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-gray-700" />
        
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
           <motion.div
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative flex items-center text-sm text-gray-400 order-2 sm:order-1 cursor-pointer"
            >
              <p>&copy; {new Date().getFullYear()} Jon.Branding.</p>
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, width: 'auto', marginLeft: '0.25rem' }}
                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <span>{dictionary.all_rights_reserved}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
           
           <div className="flex items-center gap-6 order-1 sm:order-2">
             <a href="https://www.instagram.com/jon.branding" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Instagram size={20} />
             </a>
             <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Send size={20} />
             </a>
           </div>

           <div className="hidden lg:flex order-3">
              <button onClick={handleScrollTop} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                {dictionary.back_to_top} <ArrowUp size={16} />
              </button>
           </div>
        </div>

        <div className="mt-16 text-center">
             <Link href={`/${lang}`}>
                <Logo isWhite />
             </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
