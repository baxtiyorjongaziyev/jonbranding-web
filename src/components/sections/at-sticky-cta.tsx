'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { onOpen: () => void; lang?: string; }

type Stage = 'belgilar' | 'tashxis' | 'narxlar' | 'jarayon' | 'savol';

const t: Record<Lang, Record<Stage, { num: string; text: string; cta: string }>> = {
  uz: {
    belgilar: { num: '§ 01', text: "Brendingiz yo'qotyaptimi?", cta: 'Audit →' },
    tashxis:  { num: '12/12', text: '12 mezon · Bepul brand audit', cta: 'Boshlash →' },
    narxlar:  { num: '§ 05', text: 'Har oy sifat uchun cheklangan qabul', cta: 'Audit olish →' },
    jarayon:  { num: '100%', text: '14 kun · Kafolatlangan natija', cta: 'Boshlash →' },
    savol:    { num: '24h',   text: 'Savol bormi? 24 soatda javob', cta: "Bog'lanish →" },
  },
  ru: {
    belgilar: { num: '§ 01', text: 'Сколько теряет ваш бренд?', cta: 'Аудит →' },
    tashxis:  { num: '12/12', text: '12 критериев · Бесплатный аудит', cta: 'Начать →' },
    narxlar:  { num: '§ 05', text: 'Ограниченный прием для гарантии качества', cta: 'Получить аудит →' },
    jarayon:  { num: '100%', text: '14 дней · Гарантия результата', cta: 'Начать →' },
    savol:    { num: '24h',   text: 'Есть вопросы? Ответим за 24ч', cta: 'Связаться →' },
  },
  en: {
    belgilar: { num: '§ 01', text: 'How much is your brand losing?', cta: 'Audit →' },
    tashxis:  { num: '12/12', text: '12 criteria · Free brand audit', cta: 'Start →' },
    narxlar:  { num: '§ 05', text: 'Limited monthly intake for quality control', cta: 'Get Audit →' },
    jarayon:  { num: '100%', text: '14 days · Guaranteed quality', cta: 'Start →' },
    savol:    { num: '24h',   text: 'Questions? Reply in 24h', cta: 'Contact →' },
  },
  zh: {
    belgilar: { num: '§ 01', text: '您的品牌在损失多少？', cta: '诊断 →' },
    tashxis:  { num: '12/12', text: '12项标准 · 免费品牌诊断', cta: '开始 →' },
    narxlar:  { num: '§ 05', text: '每月限量接单以保证交付质量', cta: '获取诊断 →' },
    jarayon:  { num: '100%', text: '14天 · 结果保障', cta: '开始 →' },
    savol:    { num: '24h',   text: '有问题？24小时内回复', cta: '联系 →' },
  },
};

export default function AtStickyCta({ onOpen, lang = 'uz' }: Props) {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<Stage>('belgilar');
  const variants = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  const { scrollY } = useScroll();
  const sectionOffsetsRef = useRef<Array<{ id: Stage; top: number }>>([]);

  const handleScroll = useCallback((y: number) => {
    if (typeof window === 'undefined') return;
    const h = window.innerHeight;
    setShow(y > h * 0.6);
    let active: Stage = 'belgilar';
    for (const section of sectionOffsetsRef.current) {
      if (y + 200 >= section.top) active = section.id;
    }
    setStage(active);
  }, []);

  useMotionValueEvent(scrollY, "change", handleScroll);

  useEffect(() => {
    const updateOffsets = () => {
      const sections: Array<{ id: string; stage: Stage }> = [
        { id: 'belgilar', stage: 'belgilar' },
        { id: 'tashxis', stage: 'tashxis' },
        { id: 'narxlar', stage: 'narxlar' },
        { id: 'process', stage: 'jarayon' },
        { id: 'savol', stage: 'savol' },
      ];
      sectionOffsetsRef.current = sections.flatMap(({ id, stage }) => {
        const element = document.getElementById(id);
        return element ? [{ id: stage, top: element.offsetTop }] : [];
      });
    };

    updateOffsets();
    handleScroll(window.scrollY);
    window.addEventListener('resize', updateOffsets, { passive: true });
    return () => window.removeEventListener('resize', updateOffsets);
  }, [handleScroll]);

  const v = variants[stage];

  return (
    <div data-sticky-audit="" aria-hidden={!show} inert={!show ? true : undefined} className="hidden md:block fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 z-40 transition-[transform,opacity] duration-300 motion-reduce:transition-none" style={{ transform: `translateX(-50%) translateY(${show ? '0' : '80px'})`, opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none' }}>
      <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 rounded-full shadow-2xl max-w-[90vw] sm:max-w-none" style={{ background: 'var(--at-ink)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px -10px rgba(14,16,21,0.5)' }}>
        <span className="text-xs font-semibold shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-accent)', letterSpacing: '0.06em' }}>{v.num}</span>
        <span className="text-[11px] sm:text-sm line-clamp-1 truncate flex-1 min-w-[100px]" style={{ color: 'rgba(244,241,232,.7)' }}>{v.text}</span>
        <button data-oisha-callback="" onClick={onOpen} tabIndex={show ? 0 : -1} className="relative min-h-11 overflow-hidden font-semibold text-xs sm:text-sm rounded-full px-4 py-2 transition-opacity duration-200 hover:opacity-90 group shrink-0" style={{ background: 'var(--at-accent)', color: '#fff', whiteSpace: 'nowrap' }}>
          <span className="relative z-10">{v.cta}</span>
          <span aria-hidden="true" className="absolute inset-0 rounded-full motion-safe:animate-ping opacity-20" style={{ background: 'var(--at-accent)' }}></span>
        </button>
      </div>
    </div>
  );
}
