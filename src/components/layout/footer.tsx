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
        {/* Top Section: Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 text-center lg:text-left">
          {/* Email */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-blue-500 uppercase tracking-[0.2em]">Email</h3>
            <div className="space-y-2">
              <a 
                href="mailto:baxtiyorjon.gaziyev@gmail.com" 
                className="text-xl sm:text-2xl font-semibold hover:text-blue-400 transition-colors block"
              >
                baxtiyorjon.gaziyev@gmail.com
              </a>
              <p className="text-sm text-gray-500">(For Business Inquiries)</p>
            </div>
          </div>

          {/* Call */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-blue-500 uppercase tracking-[0.2em]">Call</h3>
            <div className="space-y-2">
              <a 
                href="tel:+998336450097" 
                onClick={() => trackContactClick('phone')}
                className="text-xl sm:text-2xl font-semibold hover:text-blue-400 transition-colors block"
              >
                +998 33 645 00 97
              </a>
              <p className="text-sm text-gray-500">(Direct Line)</p>
            </div>
          </div>

          {/* Socials/Telegram */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-blue-500 uppercase tracking-[0.2em]">Telegram</h3>
            <div className="space-y-2">
              <a 
                href="https://t.me/baxtiyorjon_gaziyev" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => trackContactClick('telegram')}
                className="text-xl sm:text-2xl font-semibold hover:text-blue-400 transition-colors block"
              >
                @baxtiyorjon_gaziyev
              </a>
              <p className="text-sm text-gray-500">(Shadow Advisor)</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Meta Links & Secondary Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 py-10 border-t border-white/10 mt-10">
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 text-sm text-gray-400">
            <p suppressHydrationWarning>© {new Date().getFullYear()} Jon.Branding Agency.</p>
            <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">Terms of Use</Link>
          </div>

          <div className="flex items-center gap-8 order-1 lg:order-2">
            <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/jon.branding/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all transform hover:scale-110" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://t.me/JonBranding" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all transform hover:scale-110" aria-label="Telegram Channel">
                <Send size={20} />
              </a>
              <a href="https://www.linkedin.com/in/baxtiyorjongaziyev/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all transform hover:scale-110" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
            
            <Separator orientation="vertical" className="h-6 bg-white/20 hidden sm:block" />

            <button 
              onClick={handleScrollTop} 
              className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {dictionary.back_to_top} 
              <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative mt-4 select-none pointer-events-none flex justify-center">
          <img 
            src="/assets/logos/logo-white.svg" 
            alt="Jon Branding Agency"
            className="w-full max-w-[90vw] h-auto opacity-90 transition-all filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          />
          {/* Subtle Glow behind the logo */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-600/20 blur-[120px] rounded-full -z-10" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
