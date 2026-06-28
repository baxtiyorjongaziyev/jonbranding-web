'use client';
import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';
import AtHero from '@/components/sections/at-hero';
import AtMarquee from '@/components/sections/at-marquee';
import AtManifesto from '@/components/sections/at-manifesto';
import AtServices from '@/components/sections/at-services';
import AtPricing from '@/components/sections/at-pricing';
import AtFaq from '@/components/sections/at-faq';
import AtFinalCta from '@/components/sections/at-final-cta';
import AtModal from '@/components/sections/at-modal';
import AtStickyCta from '@/components/sections/at-sticky-cta';
import { ATGallery, ATQuotes } from '@/components/atelier/atelier-sections';
import ExitIntentPopup from '@/components/exit-intent-popup';
import ScrollDepthAnalytics from '@/components/scroll-depth-analytics';
import Founder from '@/components/sections/founder';
import AtProcess from '@/components/sections/at-process';
import ProcessVideo from '@/components/sections/process-video';
import InstagramFeed from '@/components/sections/instagram-feed';
const HomeComponent: FC<{ lang: string; dictionary: any; comparisons?: any[]; brands?: any[]; testimonials?: any[]; portfolioProjects?: any[] }> = ({ lang, dictionary, testimonials = [], portfolioProjects = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  const heroImages = useMemo(() => {
    return portfolioProjects
      .filter((p: any) => p.coverImage)
      .map((p: any) => ({
        src: p.coverImage,
        name: p.title?.split(' ')[0] || p.client,
        year: '2026',
      }));
  }, [portfolioProjects]);

  // Chuqur scroll'da (85%) lead modalini sessiyada bir marta avtomatik ochish
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const KEY = 'at_modal_auto_popup_v1';
    if (sessionStorage.getItem(KEY)) return;
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const doc = document.documentElement;
      const ratio = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (ratio >= 0.85) {
        fired = true;
        sessionStorage.setItem(KEY, '1');
        setModalOpen(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global CTA hodisalarini (mobil nav, boshqa triggerlar) Atelier modaliga yo'naltirish
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const openHandler = () => setModalOpen(true);
    window.addEventListener('openContactModal', openHandler);
    return () => window.removeEventListener('openContactModal', openHandler);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--at-bg)',
        color: 'var(--at-ink)',
        fontFamily: 'var(--font-hanken, "Hanken Grotesk", sans-serif)',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <AtHero onOpen={open} lang={lang} portfolioImages={heroImages} />
      <AtMarquee lang={lang} />
      <AtManifesto lang={lang} />
      <AtServices onOpen={open} lang={lang} />
      
      <div className="atelier-theme" style={{ background: 'var(--at-bg)', color: 'var(--at-ink)' }}>
        <ATGallery dictionary={dictionary.atelier || dictionary} onOpen={open} lang={lang} projects={portfolioProjects} />
      </div>

      <ATQuotes dictionary={dictionary.atelier || dictionary} testimonials={testimonials} lang={lang} />
      <InstagramFeed dictionary={dictionary.atelier?.instagram || dictionary.instagram || {}} lang={lang} />
      <ProcessVideo lang={lang} />
      <AtProcess lang={lang} onOpen={open} />
      <Founder lang={lang} dictionary={dictionary.founder} />
      <AtPricing onOpen={open} lang={lang} />
      <AtFaq lang={lang} onOpen={open} />
      <AtFinalCta onOpen={open} lang={lang} />
      <AtModal open={modalOpen} onClose={close} lang={lang} />
      <AtStickyCta onOpen={open} lang={lang} />
      <ExitIntentPopup onOpen={open} lang={lang} />
      <ScrollDepthAnalytics />
    </div>
  );
};

export default HomeComponent;
