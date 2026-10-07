'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Send, X, ChevronRight, ArrowUpRight, Sparkles, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackContactClick } from '@/lib/analytics';
import LanguageSwitcher from '../language-switcher';
import { motion, type Variants } from 'framer-motion';

type NavItem = { href: string; label: string };
type Service = { title: string; href: string; description: string };

interface MobileMenuProps {
  lang: string;
  navItems: NavItem[];
  services: Service[];
  isOpen: boolean;
  useDarkHeaderText: boolean;
  onOpenChange: (open: boolean) => void;
  onContactClick: () => void;
  onLinkClick: (label: string) => void;
  dictionary: {
    services: string;
    free_consultation: string;
    open_menu: string;
    contact_by_telegram: string;
  };
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as any, stiffness: 260, damping: 28 } },
};

export function MobileMenu({
  lang,
  navItems,
  services,
  isOpen,
  useDarkHeaderText,
  onOpenChange,
  onContactClick,
  onLinkClick,
  dictionary,
}: MobileMenuProps) {
  return (
    <div className="flex items-center gap-2 lg:hidden">
      <LanguageSwitcher lang={lang as any} isInverted={!useDarkHeaderText} />
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <button
            aria-label={dictionary.open_menu}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              useDarkHeaderText
                ? 'border-black/15 bg-white/60 text-foreground hover:bg-black/5 backdrop-blur-sm focus-visible:ring-primary focus-visible:ring-offset-white'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/18 backdrop-blur-sm focus-visible:ring-primary focus-visible:ring-offset-[#0a0d14]'
            )}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </SheetTrigger>

        {/* Full-screen mobile drawer */}
        <SheetContent
          side="right"
          className={cn(
            'w-full max-w-full border-0 p-0 sm:max-w-[420px]',
            'bg-[#FBF9F2] text-[#0E1015] border-l border-[#D8D2C2]'
          )}
        >
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between border-b border-[#D8D2C2] bg-[#F2EFE6] px-5 py-4">
            <SheetTitle className="text-base font-bold tracking-wide text-[#0E1015]">
              <span className="font-serif italic text-primary">Jon</span>
              <span className="ml-1 text-[#0E1015]/90">.Branding</span>
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8D2C2] bg-[#FBF9F2] text-[#4A4845] transition-all duration-200 hover:bg-[#E9E5D9] hover:text-[#0E1015] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close menu"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </SheetHeader>

          {/* Scrollable content */}
          <div className="flex h-[calc(100dvh-64px)] flex-col overflow-y-auto pb-safe-4">
            <motion.nav
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-0 px-4 pt-4"
            >
              {/* Services section */}
              <motion.div variants={slideIn} className="mb-2">
                <div className="mb-3 px-2 text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#8B8779]">
                  {dictionary.services}
                </div>
                <div className="flex flex-col gap-1.5">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      onClick={() => {
                        onLinkClick(service.title);
                        onOpenChange(false);
                      }}
                      className="group flex items-center justify-between rounded-2xl border border-[#D8D2C2] bg-[#F2EFE6] px-4 py-3.5 transition-all duration-200 hover:border-[#0E1015]/30 hover:bg-[#E9E5D9] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="text-[15px] font-medium text-[#0E1015]">
                        {service.title}
                      </span>
                      <ChevronRight className="h-4 w-4 text-[#8B8779] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#0E1015]" />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={slideIn} className="my-2 h-px bg-[#D8D2C2]" />

              {/* Main nav items */}
              <motion.div variants={slideIn} className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      onLinkClick(item.label);
                      onOpenChange(false);
                    }}
                    className="flex h-12 items-center rounded-2xl px-4 text-[17px] font-semibold text-[#0E1015]/85 transition-all duration-200 hover:bg-[#E9E5D9] hover:text-[#0E1015] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </motion.div>

              {/* Divider */}
              <motion.div variants={slideIn} className="my-3 h-px bg-[#D8D2C2]" />

              {/* Contact links */}
              <motion.div variants={slideIn} className="flex flex-col gap-2">
                <div className="mb-1 px-2 text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#8B8779]">
                  Aloqa
                </div>
                <a
                  data-oisha-phone=""
                  data-oisha-phone-text="0"
                  href="tel:+998792000097"
                  onClick={() => trackContactClick('phone', 'mobile_menu')}
                  className="flex h-14 items-center gap-4 rounded-2xl border border-[#D8D2C2] bg-[#F2EFE6] px-4 transition-all duration-200 hover:bg-[#E9E5D9] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600/10 text-green-700">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0E1015]">+998 79 200 00 97</div>
                    <div className="text-[11px] text-[#8B8779]">Qo'ng'iroq qiling</div>
                  </div>
                </a>
                <a
                  href="https://t.me/baxtiyorjongaziyev"
                  onClick={() => trackContactClick('telegram', 'mobile_menu')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center gap-4 rounded-2xl border border-[#D8D2C2] bg-[#F2EFE6] px-4 transition-all duration-200 hover:bg-[#E9E5D9] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/10 text-[#1B4DFF]">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0E1015]">
                      {dictionary.contact_by_telegram}
                    </div>
                    <div className="text-[11px] text-[#8B8779]">Telegram</div>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    window.dispatchEvent(new CustomEvent('openPwaInstallPrompt'));
                  }}
                  className="flex h-14 items-center gap-4 rounded-2xl border border-[#D8D2C2] bg-[#F2EFE6] px-4 transition-all duration-200 hover:bg-[#E9E5D9] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/10 text-[#1B4DFF]">
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-bold text-[#0E1015]">
                      {lang === 'ru' ? 'Установить приложение' : lang === 'en' ? 'Install App' : "Ilovani o'rnatish"}
                    </div>
                    <div className="text-[11px] text-[#8B8779]">
                      {lang === 'ru' ? 'Быстрый доступ на экран' : lang === 'en' ? 'Quick home screen access' : "Bosh ekranga joylash"}
                    </div>
                  </div>
                </button>
              </motion.div>
            </motion.nav>

            {/* Sticky CTA at bottom */}
            <div className="mt-auto p-4 border-t border-[#D8D2C2] bg-[#F2EFE6]">
              <button
                data-oisha-callback=""
                onClick={() => {
                  onContactClick();
                  onOpenChange(false);
                }}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-[#1B4DFF] px-5 py-4 text-white shadow-lg shadow-[#1B4DFF]/25 transition-all duration-300 hover:bg-[#153ecf] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF]"
              >
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold">{dictionary.free_consultation}</span>
                  <span className="mt-0.5 text-[12px] font-medium text-white/80">
                    Bepul Brand Audit · 30 daqiqa
                  </span>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
