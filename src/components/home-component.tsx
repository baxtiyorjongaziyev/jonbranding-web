'use client';

import { FC, useState, useEffect } from 'react';
import {
  ATMasthead,
  ATNav,
  ATHero,
  ATMarquee,
  ATMiniQuotes,
  ATManifesto,
  ATLedger,
  ATDiagnosis,
  ATServices,
  ATShowcase,
  ATFeatured,
  ATBrandSystem,
  ATGallery,
  ATAudit,
  ATSampleReport,
  ATLossCalc,
  ATIndex,
  ATProcess,
  ATPricing,
  ATQuotes,
  ATFAQ,
  ATFinal,
  ATFooter,
  ATStickyCta,
  ATTweaks,
  ATStats
} from './atelier/atelier-sections';

interface HomeComponentProps {
  lang: string;
  dictionary: any;
  comparisons?: any[];
  brands?: any[];
  testimonials?: any[];
}

const HomeComponent: FC<HomeComponentProps> = ({ lang, dictionary, comparisons, brands, testimonials }) => {
  const [theme, setTheme] = useState('light');
  const [grain, setGrain] = useState(false);
  const [accent, setAccent] = useState('cobalt');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#0B0C10' : '#F2EFE6';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  useEffect(() => {
    document.body.classList.toggle('grain', grain);
  }, [grain]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const m = e.data;
      if (!m || typeof m !== 'object') return;
      if (m.type === '__activate_edit_mode') setEdit(true);
      if (m.type === '__deactivate_edit_mode') setEdit(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const persist = (edits: any) => {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    } catch {}
  };

  const setThemeP = (t: string) => {
    setTheme(t);
    persist({ theme: t });
  };

  const setGrainP = (g: boolean) => {
    setGrain(g);
    persist({ grain: g });
  };

  const setAccentP = (a: string) => {
    setAccent(a);
    persist({ accent: a });
  };

  const closeEdit = () => {
    setEdit(false);
    try {
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    } catch {}
  };

  const open = () => {
    window.dispatchEvent(
      new CustomEvent('openContactModal', {
        detail: { section: 'atelier_homepage', ctaText: 'Bepul mini-tashxis', source: 'atelier' },
      })
    );
  };

  const atelierDict = dictionary?.atelier || {};

  return (
    <div className="atelier-theme">
      <ATMasthead />
      
      <ATNav 
        dictionary={atelierDict} 
        onOpen={open} 
        theme={theme} 
        setTheme={setThemeP} 
      />
      
      <ATHero 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATMarquee 
        dictionary={atelierDict} 
      />
      
      <ATMiniQuotes />
      
      <ATManifesto 
        dictionary={atelierDict} 
      />
      
      <ATLedger 
        dictionary={atelierDict} 
      />
      
      <ATDiagnosis 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATServices 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATShowcase 
        dictionary={atelierDict} 
        onOpen={open}
        comparisons={comparisons}
        lang={lang}
      />
      
      <ATFeatured 
        dictionary={atelierDict}
        comparison={comparisons && comparisons.length > 0 ? comparisons[0] : undefined}
        lang={lang}
      />
      
      <ATBrandSystem 
        dictionary={atelierDict} 
      />
      
      <ATGallery 
        dictionary={atelierDict} 
        onOpen={open}
        comparisons={comparisons}
        lang={lang}
      />
      
      <ATAudit 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATSampleReport 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATLossCalc 
        dictionary={atelierDict} 
        onOpen={open} 
        lang={lang}
      />
      
      <ATIndex 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATProcess 
        dictionary={atelierDict} 
        lang={lang}
      />
      
      <ATStats 
        dictionary={atelierDict} 
      />
      
      <ATPricing 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATQuotes 
        dictionary={atelierDict}
        testimonials={testimonials}
        lang={lang}
      />
      
      <ATFAQ 
        dictionary={atelierDict} 
      />
      
      <ATFinal 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATFooter 
        dictionary={atelierDict}
      />
      
      <ATStickyCta 
        dictionary={atelierDict} 
        onOpen={open} 
      />
      
      <ATTweaks
        visible={edit}
        onClose={closeEdit}
        theme={theme}
        setTheme={setThemeP}
        grain={grain}
        setGrain={setGrainP}
        accent={accent}
        setAccent={setAccentP}
      />
    </div>
  );
};

export default HomeComponent;
