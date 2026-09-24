'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import type { SectionProps } from './types';

export const ATStickyCta: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState('belgilar');
  const { scrollY } = useScroll();

  const handleScroll = useCallback((y: number) => {
    if (typeof window === 'undefined') return;
    const h = window.innerHeight;
    setShow(y > h * 0.6);

    const sections = ['belgilar', 'tashxis', 'narxlar', 'jarayon', 'savol'];
    let active = 'belgilar';
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && y + 200 >= el.offsetTop) active = id;
    }
    setStage(active);
  }, []);

  useMotionValueEvent(scrollY, 'change', handleScroll);

  useEffect(() => {
    handleScroll(window.scrollY);
  }, [handleScroll]);

  const variants: Record<string, any> = {
    belgilar: {
      num: '§ 01',
      text: dictionary?.sticky_belgilar_text || "Belgilarni ko'ryapsizmi?",
      cta: dictionary?.sticky_belgilar_cta || 'Tashxis →',
    },
    tashxis: {
      num: '12/12',
      text: dictionary?.sticky_tashxis_text || '12 mezon · 14 kun · 4.8M dan',
      cta: dictionary?.sticky_tashxis_cta || 'Boshlash →',
    },
    narxlar: {
      num: '4/6',
      text: dictionary?.sticky_narxlar_text || 'Iyul oyida 4 joy qoldi',
      cta: dictionary?.sticky_narxlar_cta || 'Buyurtma →',
    },
    jarayon: {
      num: '14',
      text: dictionary?.sticky_jarayon_text || '14 kun · 100% kafolat',
      cta: dictionary?.sticky_jarayon_cta || 'Tashxis →',
    },
    savol: {
      num: '24h',
      text: dictionary?.sticky_savol_text || 'Savol bormi? 24h ichida javob',
      cta: dictionary?.sticky_savol_cta || 'Yozish →',
    },
  };
  const v = variants[stage] || variants.belgilar;

  return (
    <div className={`stick ${show ? 'show' : ''}`}>
      <span className="num">{v.num}</span>
      <span>{v.text}</span>
      <button onClick={onOpen}>{v.cta}</button>
    </div>
  );
};

/* ── TWEAKS ────────────────────────────────────── */
interface ATTweaksProps {
  visible: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (t: string) => void;
  grain: boolean;
  setGrain: (g: boolean) => void;
  accent: string;
  setAccent: (a: string) => void;
}
