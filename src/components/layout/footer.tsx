
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Phone, Send, Instagram, ArrowUp } from 'lucide-react';
import { Separator } from '../ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const t = {
  uz: {
    contact: "Biz bilan bog'laning",
    by_telegram: "Telegram orqali",
    by_phone: "Telefon orqali",
    main_page: "Asosiy sahifa",
    portfolio: "Portfolio",
    founder: "Asoschi",
    process: "Jarayon",
    services: "Xizmatlarimiz",
    brand_strategy: "Brend Strategiyasi",
    naming: "Neyming",
    corporate_style: "Firma Uslubi",
    packaging_design: "Qadoq Dizayni",
    additional: "Qo'shimcha",
    service_prices: "Xizmat Narxlari",
    branding_test: "Brending Testi",
    blog: "Blog",
    all_rights_reserved: "Barcha huquqlar himoyalangan.",
    back_to_top: "Yuqoriga qaytish",
  },
  ru: {
    contact: "Свяжитесь с нами",
    by_telegram: "Через Telegram",
    by_phone: "По телефону",
    main_page: "Главная страница",
    portfolio: "Портфолио",
    founder: "Основатель",
    process: "Процесс",
    services: "Наши услуги",
    brand_strategy: "Бренд-стратегия",
    naming: "Нейминг",
    corporate_style: "Фирменный стиль",
    packaging_design: "Дизайн упаковки",
    additional: "Дополнительно",
    service_prices: "Цены на услуги",
    branding_test: "Тест по брендингу",
    blog: "Блог",
    all_rights_reserved: "Все права защищены.",
    back_to_top: "Вернуться наверх",
  }
};


const Footer = ({ lang = 'uz' }: { lang: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const translations = lang === 'ru' ? t.ru : t.uz;

  const mainPageLinks = [
      { href: `/${lang}/#portfolio`, label: translations.portfolio },
      { href: `/${lang}/#founder`, label: translations.founder },
      { href: `/${lang}/#process`, label: translations.process },
      { href: `/${lang}/#faq`, label: 'FAQ' },
  ];

  const serviceLinks = [
      { href: `/${lang}/xizmatlar/brand-strategy`, label: translations.brand_strategy },
      { href: `/${lang}/xizmatlar/neyming`, label: translations.naming },
      { href: `/${lang}/xizmatlar/firmenniy-stil`, label: translations.corporate_style },
      { href: `/${lang}/xizmatlar/qadoq-dizayni`, label: translations.packaging_design },
  ];
  
  const additionalLinks = [
      { href: `/${lang}/xizmatlar`, label: translations.service_prices },
      { href: `/${lang}/quiz`, label: translations.branding_test },
      { href: `/${lang}/blog`, label: translations.blog },
  ];

  return (
    <footer className="bg-black text-gray-300 pt-16 sm:pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{translations.contact}</h3>
            <div className="mt-4 space-y-4">
               <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">@baxtiyorjon_gaziyev</p>
                  <p className="text-xs text-gray-400">{translations.by_telegram}</p>
               </a>
               <a href="tel:+998336450097" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">+998 33 645 00 97</p>
                  <p className="text-xs text-gray-400">{translations.by_phone}</p>
               </a>
            </div>
          </div>
          
          {/* Main Page Links */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{translations.main_page}</h3>
            <ul className="mt-4 space-y-2">
              {mainPageLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{translations.services}</h3>
            <ul className="mt-4 space-y-2">
              {serviceLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{translations.additional}</h3>
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
                    <span>{translations.all_rights_reserved}</span>
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
                {translations.back_to_top} <ArrowUp size={16} />
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
