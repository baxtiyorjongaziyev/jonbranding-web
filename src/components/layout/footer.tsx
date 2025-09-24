
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Phone, Send, Instagram, ArrowUp } from 'lucide-react';
import { Separator } from '../ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mainPageLinks = [
      { href: '/#portfolio', label: 'Portfolio' },
      { href: '/#founder', label: 'Asoschi' },
      { href: '/#process', label: 'Jarayon' },
      { href: '/#faq', label: 'FAQ' },
  ];

  const serviceLinks = [
      { href: '/xizmatlar/brand-strategy', label: 'Brend Strategiyasi' },
      { href: '/xizmatlar/neyming', label: 'Neyming' },
      { href: '/xizmatlar/firmenniy-stil', label: 'Firma Uslubi' },
      { href: '/xizmatlar/qadoq-dizayni', label: 'Qadoq Dizayni' },
  ];
  
  const additionalLinks = [
      { href: '/xizmatlar', label: 'Xizmat Narxlari' },
      { href: '/quiz', label: 'Brending Testi' },
      { href: '/blog', label: 'Blog' },
  ];

  return (
    <footer className="bg-black text-gray-300 pt-16 sm:pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Biz bilan bog'laning</h3>
            <div className="mt-4 space-y-4">
               <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">@baxtiyorjon_gaziyev</p>
                  <p className="text-xs text-gray-400">Telegram orqali</p>
               </a>
               <a href="tel:+998336450097" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">+998 33 645 00 97</p>
                  <p className="text-xs text-gray-400">Telefon orqali</p>
               </a>
            </div>
          </div>
          
          {/* Main Page Links */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Asosiy sahifa</h3>
            <ul className="mt-4 space-y-2">
              {mainPageLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Xizmatlarimiz</h3>
            <ul className="mt-4 space-y-2">
              {serviceLinks.map(link => (
                  <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Qo'shimcha</h3>
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
                    <span>Barcha huquqlar himoyalangan.</span>
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
                Yuqoriga qaytish <ArrowUp size={16} />
              </button>
           </div>
        </div>

        <div className="mt-16 text-center">
             <Link href="/">
                <Logo isWhite />
             </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
