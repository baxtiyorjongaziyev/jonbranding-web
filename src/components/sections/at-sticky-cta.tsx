'use client';
import { useState, useEffect } from 'react';

interface Props { onOpen: () => void; }

const variants = {
  belgilar: { num: '§ 01', text: "Belgilarni ko'ryapsizmi?", cta: 'Tashxis →' },
  tashxis:  { num: '12/12', text: '12 mezon · 14 kun · 4.8M dan', cta: 'Boshlash →' },
  narxlar:  { num: '4/6',   text: 'Iyul oyida 4 joy qoldi', cta: 'Buyurtma →' },
  jarayon:  { num: '14',    text: '14 kun · 100% kafolat', cta: 'Tashxis →' },
  savol:    { num: '24h',   text: 'Savol bormi? 24h ichida javob', cta: 'Yozish →' },
} as const;

type Stage = keyof typeof variants;

export default function AtStickyCta({ onOpen }: Props) {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<Stage>('belgilar');

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      setShow(y > h * 0.6);
      const sections: Stage[] = ['belgilar', 'tashxis', 'narxlar', 'jarayon', 'savol'];
      let active: Stage = 'belgilar';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && y + 200 >= el.offsetTop) active = id;
      }
      setStage(active);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const v = variants[stage];

  return (
    <div className="fixed bottom-4 left-1/2 z-40 transition-all duration-300" style={{ transform: `translateX(-50%) translateY(${show?'0':'80px'})`, opacity: show?1:0, pointerEvents: show?'auto':'none' }}>
      <div className="flex items-center gap-4 px-5 py-3 rounded-full shadow-2xl" style={{ background: 'var(--at-ink)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px -10px rgba(14,16,21,0.5)' }}>
        <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-accent)', letterSpacing: '0.06em' }}>{v.num}</span>
        <span className="text-sm hidden sm:inline" style={{ color: 'rgba(244,241,232,.7)' }}>{v.text}</span>
        <button onClick={onOpen} className="font-semibold text-sm rounded-full px-4 py-2 transition-all hover:opacity-90" style={{ background: 'var(--at-accent)', color: '#fff', whiteSpace: 'nowrap' }}>{v.cta}</button>
      </div>
    </div>
  );
}
