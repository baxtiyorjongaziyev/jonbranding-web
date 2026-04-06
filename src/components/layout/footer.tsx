'use client';

import Link from 'next/link';
import { ArrowUp, Instagram, Linkedin, Send } from 'lucide-react';
import { Separator } from '../ui/separator';
import { motion } from 'framer-motion';
import { useState, FC } from 'react';
import { trackContactClick, trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

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
    solutions: string;
    resources: string;
    agency: string;
    contact_us: string;
    explore_work: string;
    read_blogs: string;
    privacy_policy_link: string;
    terms_of_use_link: string;
}

const Footer: FC<{ lang: string, dictionary: Dictionary }> = ({ lang = 'uz', dictionary }) => {
  if (!dictionary) return null;
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-white pt-24 pb-0 overflow-hidden" suppressHydrationWarning>
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a20] pointer-events-none opacity-50" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Multi-Column Grid (Finch.design style) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{dictionary.services}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={`/${lang}/xizmatlar/neyming`} className="hover:text-white transition-colors">{dictionary.naming}</Link></li>
              <li><Link href={`/${lang}/xizmatlar/logo-dizayni`} className="hover:text-white transition-colors">{dictionary.logo_design}</Link></li>
              <li><Link href={`/${lang}/xizmatlar/firmenniy-stil`} className="hover:text-white transition-colors">{dictionary.corporate_style}</Link></li>
              <li><Link href={`/${lang}/xizmatlar/brandbook`} className="hover:text-white transition-colors">{dictionary.brandbook}</Link></li>
            </ul>
          </div>

          {/* Solutions / Packaging */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{dictionary.solutions}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={`/${lang}/xizmatlar/qadoq-dizayni`} className="hover:text-white transition-colors">{dictionary.packaging_design}</Link></li>
              <li><Link href={`/${lang}/xizmatlar/brand-strategiyasi`} className="hover:text-white transition-colors">{dictionary.brand_strategy}</Link></li>
              <li><Link href={`/${lang}/xizmatlar`} className="hover:text-white transition-colors">{dictionary.service_prices}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{dictionary.resources}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={`/${lang}/blog`} className="hover:text-white transition-colors">{dictionary.blog}</Link></li>
              <li><Link href={`/${lang}/quiz`} className="hover:text-white transition-colors">{dictionary.branding_test}</Link></li>
              <li><Link href={`/${lang}/xizmatlar/patent-kalkulyatori`} className="hover:text-white transition-colors">{dictionary.patent_calculator}</Link></li>
              <li><Link href={`/${lang}/sitemap`} className="hover:text-white transition-colors">{dictionary.sitemap}</Link></li>
            </ul>
          </div>

          {/* Agency */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{dictionary.agency}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href={`/${lang}/#portfolio`} className="hover:text-white transition-colors">{dictionary.portfolio}</Link></li>
              <li><Link href={`/${lang}/#founder`} className="hover:text-white transition-colors">{dictionary.founder}</Link></li>
              <li><Link href={`/${lang}/#process`} className="hover:text-white transition-colors">{dictionary.process}</Link></li>
              <li><Link href={`/${lang}/#faq`} className="hover:text-white transition-colors">{dictionary.faq}</Link></li>
            </ul>
          </div>

          {/* Hire Us Section */}
          <div className="space-y-8 lg:col-span-1">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{dictionary.contact_us}</h3>
              <div className="space-y-4">
                <a 
                  href="tel:+998336450097"
                  onClick={() => trackContactClick('phone')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 w-full"
                >
                  +998 33 645 00 97
                </a>
                <a 
                  href="https://t.me/baxtiyorjon_gaziyev"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick('telegram')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 w-full gap-2"
                >
                  <Send size={16} /> Telegram
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href={`/${lang}/portfolio`}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-2 uppercase tracking-widest transition-colors"
              >
                {dictionary.explore_work}
              </Link>
              <Link 
                href={`/${lang}/blog`}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-2 uppercase tracking-widest transition-colors"
              >
                {dictionary.read_blogs}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Meta Links */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 py-8 border-t border-white/5">
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 text-xs text-gray-500 uppercase tracking-wider">
            <p suppressHydrationWarning>© {new Date().getFullYear()} Jon.Branding Agency.</p>
            <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">{dictionary.privacy_policy_link}</Link>
            <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">{dictionary.terms_of_use_link}</Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/jon.branding/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-110" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://t.me/JonBranding" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-110" aria-label="Telegram Channel">
                <Send size={18} />
              </a>
              <a href="https://www.linkedin.com/in/baxtiyorjongaziyev/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-110" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
            
            <Separator orientation="vertical" className="h-4 bg-white/10 hidden sm:block" />

            <button 
              onClick={handleScrollTop} 
              className="group flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              {dictionary.back_to_top} 
              <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Massive Brand Footer (Finch Style) */}
        <div className="relative select-none pointer-events-none pt-10 pb-16">
          <h2 className="text-[9vw] font-light leading-[0.8] text-white/90 tracking-[-0.06em] text-center transition-all drop-shadow-[0_0_30px_rgba(37,99,235,0.4)] whitespace-nowrap">
            Jon.Branding Agency
          </h2>
          {/* Finch-style Vibrant Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-80 bg-blue-500/40 blur-[120px] rounded-full -z-10 transition-opacity duration-1000" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
