'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import AtServices from '@/components/sections/at-services';
import AtFinalCta from '@/components/sections/at-final-cta';
import { getSalesContent } from '@/lib/sales-content';

function openContactModal() {
  window.dispatchEvent(
    new CustomEvent('openContactModal', { detail: { section: 'xizmatlar', source: 'xizmatlar_page' } })
  );
}

const copyByLang: Record<string, { eyebrow: string; title: string; titleEm: string; sub: string; viewPrices: string; getConsultation: string }> = {
  uz: {
    eyebrow: 'Jon.Branding xizmatlari',
    title: 'Biznesingiz uchun aniq va ishlaydigan',
    titleEm: 'brend tizimi.',
    sub: "Nomlashdan tortib to to'liq brendbuk va patentgacha — har bir xizmat alohida yoki kompleks paket sifatida taqdim etiladi.",
    viewPrices: "Barcha narxlar va paketlar →",
    getConsultation: "Bepul maslahat olish",
  },
  ru: {
    eyebrow: 'Услуги Jon.Branding',
    title: 'Четкая и работающая',
    titleEm: 'система бренда.',
    sub: 'От нейминга до полного брендбука и патента — каждая услуга доступна отдельно или в рамках комплексного пакета.',
    viewPrices: 'Все цены и пакеты →',
    getConsultation: 'Получить консультацию',
  },
  en: {
    eyebrow: 'Jon.Branding Services',
    title: 'A clear and actionable',
    titleEm: 'brand system.',
    sub: 'From naming to a complete brandbook and trademark — each service is delivered individually or as a comprehensive package.',
    viewPrices: 'All prices & packages →',
    getConsultation: 'Get free consultation',
  },
  zh: {
    eyebrow: 'Jon.Branding 服务',
    title: '清晰且实用的',
    titleEm: '品牌系统。',
    sub: '从命名到完整品牌手册与商标保护——每项服务均可单独提供或作为综合品牌系统交付。',
    viewPrices: '查看所有价格与套餐 →',
    getConsultation: '获取免费咨询',
  },
};

export function XizmatlarHero({ lang }: { lang: string; dictionary?: any }) {
  const content = getSalesContent(lang);
  const copy = copyByLang[lang] || copyByLang.uz;
  const services = content.serviceGroups.flatMap((g) => g.items);

  const getLocalizedPath = (path: string) => {
    if (lang === 'uz') return path;
    return `/${lang}${path === '/' ? '' : path}`;
  };

  const serviceSubpageMap: Record<string, string> = {
    'brand-strategy': '/brand-strategy',
    naming: '/xizmatlar/neyming',
    logo: '/xizmatlar/logo-dizayni',
    'visual-identity': '/xizmatlar/firmenniy-stil',
    brandbook: '/xizmatlar/brandbook',
    packaging: '/xizmatlar/qadoq-dizayni',
    'trademark-search': '/xizmatlar/patent',
  };

  return (
    <section className="atelier-theme jon-home bg-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-[var(--at-line)] relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative z-10">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-blue-500/20 bg-blue-50/80 px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2554FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2554FF] animate-pulse" />
            {copy.eyebrow}
          </div>
          <h1
            className="font-bold text-[#0A0B0E] mb-6 text-4xl sm:text-6xl lg:text-7xl tracking-tight"
            style={{ lineHeight: 1.04, letterSpacing: '-0.035em' }}
          >
            <span className="block">{copy.title}</span>
            <span className="block font-[family-name:var(--font-serif)] italic font-normal text-[#2554FF]">
              {copy.titleEm}
            </span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-[620px] mb-8 font-normal">
            {copy.sub}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={getLocalizedPath('/narxlar')}
              className="inline-flex items-center justify-center gap-2 bg-[#2554FF] hover:bg-[#1D4ED8] text-white rounded-full px-8 py-4 font-semibold text-sm shadow-[0_12px_32px_-8px_rgba(37,84,255,0.4)] hover:-translate-y-0.5 transition-[background-color,transform,box-shadow]"
            >
              {copy.viewPrices}
            </Link>
            <button
              type="button"
              data-oisha-callback=""
              onClick={openContactModal}
              className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-400 rounded-full px-8 py-4 text-sm font-semibold text-slate-800 hover:text-black transition-colors bg-white shadow-sm"
            >
              {copy.getConsultation}
            </button>
          </div>
        </div>

        {/* 6 Core Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(0, 6).map((service) => {
            const href = getLocalizedPath(serviceSubpageMap[service.id] || '/narxlar');
            return (
              <Link
                key={service.id}
                href={href}
                className="group flex flex-col justify-between p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-white hover:border-[#2554FF]/40 hover:shadow-xl transition-all duration-300 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-slate-500">
                      {service.duration || 'Jon.Branding'}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-[#2554FF] group-hover:border-[#2554FF] group-hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0A0B0E] mb-2 tracking-tight group-hover:text-[#2554FF] transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6 font-normal">
                    {service.lead}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between tabular-nums">
                  <span className="text-xs text-slate-500 font-medium">
                    {content.ui.services.price}:
                  </span>
                  <span className="text-base font-bold text-[#0A0B0E]">
                    {service.price} {content.ui.currency}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function XizmatlarServices({ lang }: { lang: string }) {
  return <AtServices onOpen={openContactModal} lang={lang} />;
}

export function XizmatlarFinalCta({ lang }: { lang: string }) {
  return <AtFinalCta onOpen={openContactModal} lang={lang} />;
}
