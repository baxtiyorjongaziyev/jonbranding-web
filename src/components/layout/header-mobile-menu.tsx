'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Briefcase,
  ChevronRight,
  FileText,
  Globe,
  LayoutGrid,
  Menu,
  Phone,
  Printer,
  Send,
  Sparkles,
  Tag,
  Type,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackContactClick } from '@/lib/analytics';
import LanguageSwitcher from '../language-switcher';

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

const SERVICE_ICONS = [Type, LayoutGrid, Briefcase, FileText, Printer, Tag, Globe, Sparkles];

function NavRow({
  href,
  label,
  icon: Icon,
  onClick,
  description,
}: {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  description?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex min-h-[56px] items-center gap-3.5 rounded-2xl px-4 py-3 transition-colors duration-150 active:bg-white/5 hover:bg-white/5"
    >
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-white/60 transition-colors group-hover:bg-brand-blue/20 group-hover:text-brand-blue">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-white leading-tight">{label}</p>
        {description && (
          <p className="mt-0.5 truncate text-[12px] font-medium text-white/40 leading-tight">{description}</p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

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
              'flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 press-effect',
              useDarkHeaderText
                ? 'border-black/15 text-foreground hover:bg-black/8'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/15'
            )}
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full max-w-[340px] border-l border-white/[0.08] bg-[#080c14] p-0 text-white shadow-[0_0_80px_rgba(0,0,0,0.8)]"
        >
          {/* Header */}
          <SheetHeader className="flex-row items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <SheetTitle className="text-[15px] font-black text-white">Jon.Branding</SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Yopish"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.07] text-white/50 transition-colors hover:bg-white/10 hover:text-white press-effect"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </SheetHeader>

          {/* Scrollable content */}
          <div className="flex h-[calc(100dvh-65px)] flex-col overflow-y-auto overscroll-contain pb-6">

            {/* Services group */}
            <div className="px-3 pt-4">
              <p className="mb-1 px-4 text-[11px] font-black uppercase tracking-widest text-white/30">
                {dictionary.services}
              </p>
              <div className="space-y-0.5">
                {services.map((service, i) => {
                  const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
                  return (
                    <NavRow
                      key={service.href}
                      href={service.href}
                      label={service.title}
                      icon={Icon}
                      description={service.description}
                      onClick={() => onLinkClick(service.title)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 my-3 h-px bg-white/[0.06]" />

            {/* Nav links */}
            <div className="px-3">
              <p className="mb-1 px-4 text-[11px] font-black uppercase tracking-widest text-white/30">
                Sahifalar
              </p>
              <div className="space-y-0.5">
                {navItems.map((item) => (
                  <NavRow
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    icon={User}
                    onClick={() => onLinkClick(item.label)}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 my-3 h-px bg-white/[0.06]" />

            {/* Contact */}
            <div className="px-3">
              <p className="mb-1 px-4 text-[11px] font-black uppercase tracking-widest text-white/30">
                Aloqa
              </p>
              <a
                href="tel:+998336450097"
                onClick={() => trackContactClick('phone', 'mobile_menu')}
                className="group flex min-h-[56px] items-center gap-3.5 rounded-2xl px-4 py-3 transition-colors duration-150 active:bg-white/5 hover:bg-white/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <Phone className="h-4 w-4" />
                </div>
                <p className="text-[15px] font-bold text-white">+998 33 645 00 97</p>
              </a>
              <a
                href="https://t.me/baxtiyorjon_gaziyev"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('telegram', 'mobile_menu')}
                className="group flex min-h-[56px] items-center gap-3.5 rounded-2xl px-4 py-3 transition-colors duration-150 active:bg-white/5 hover:bg-white/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <Send className="h-4 w-4" />
                </div>
                <p className="text-[15px] font-bold text-white">{dictionary.contact_by_telegram}</p>
              </a>
            </div>

            {/* CTA */}
            <div className="mt-auto px-5 pt-4">
              <button
                type="button"
                onClick={() => { onContactClick(); onOpenChange(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-[15px] font-black text-white shadow-[0_8px_32px_rgba(37,99,235,0.4)] transition-all duration-200 active:scale-[0.97] hover:from-blue-500 hover:to-indigo-500 press-effect"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {dictionary.free_consultation}
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
