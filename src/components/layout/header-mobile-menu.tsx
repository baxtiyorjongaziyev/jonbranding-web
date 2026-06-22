'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Send, X, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackContactClick } from '@/lib/analytics';
import LanguageSwitcher from '../language-switcher';
import { motion } from 'framer-motion';

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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 28 } },
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
            'bg-[#0a0d14] text-white'
          )}
        >
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between border-b border-white/8 px-5 py-4">
            <SheetTitle className="text-base font-bold tracking-wide text-white">
              <span className="font-serif italic text-primary">Jon</span>
              <span className="ml-1 text-white/80">.Branding</span>
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]"
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
                <div className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
                  {dictionary.services}
                </div>
                <div className="flex flex-col gap-1">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      onClick={() => {
                        onLinkClick(service.title);
                        onOpenChange(false);
                      }}
                      className="group flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.04] px-4 py-3.5 transition-all duration-200 hover:border-white/12 hover:bg-white/[0.07] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]"
                    >
                      <span className="text-[15px] font-medium text-white/85 group-hover:text-white">
                        {service.title}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={slideIn} className="my-2 h-px bg-white/8" />

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
                    className="flex h-12 items-center rounded-2xl px-4 text-[17px] font-semibold text-white/75 transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]"
                  >
                    {item.label}
                  </Link>
                ))}
              </motion.div>

              {/* Divider */}
              <motion.div variants={slideIn} className="my-3 h-px bg-white/8" />

              {/* Contact links */}
              <motion.div variants={slideIn} className="flex flex-col gap-2">
                <div className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
                  Aloqa
                </div>
                <a
                  href="tel:+998336450097"
                  onClick={() => trackContactClick('phone', 'mobile_menu')}
                  className="flex h-14 items-center gap-4 rounded-2xl border border-white/6 bg-white/[0.04] px-4 transition-all duration-200 hover:bg-white/[0.07] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">+998 33 645 00 97</div>
                    <div className="text-[11px] text-white/40">Qo'ng'iroq qiling</div>
                  </div>
                </a>
                <a
                  href="https://t.me/baxtiyorjon_gaziyev"
                  onClick={() => trackContactClick('telegram', 'mobile_menu')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center gap-4 rounded-2xl border border-white/6 bg-white/[0.04] px-4 transition-all duration-200 hover:bg-white/[0.07] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">{dictionary.contact_by_telegram}</div>
                    <div className="text-[11px] text-white/40">Telegram</div>
                  </div>
                </a>
              </motion.div>
            </motion.nav>

            {/* Sticky CTA at bottom */}
            <div className="mt-auto p-4">
              <button
                onClick={() => {
                  onContactClick();
                  onOpenChange(false);
                }}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-5 py-4 text-white shadow-[0_16px_48px_-16px_rgba(27,77,255,0.65)] transition-all duration-300 hover:shadow-[0_20px_56px_-14px_rgba(27,77,255,0.75)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]"
              >
                <div className="flex flex-col">
                  <span className="text-[15px] font-black">{dictionary.free_consultation}</span>
                  <span className="mt-0.5 text-[12px] font-medium text-white/70">Bepul · 30 daqiqa</span>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
