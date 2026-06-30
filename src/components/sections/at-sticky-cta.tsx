'use client';

import { useState, useEffect, useCallback, type FC } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

interface Props {
  dictionary?: any;
  onOpen: () => void;
}

const stages = ['belgilar', 'tashxis', 'narxlar', 'jarayon', 'savol'] as const;

type Stage = typeof stages[number];
type StickyCtaVariant = { num: string; text: string; cta: string };

const AtStickyCta: FC<Props> = ({ dictionary, onOpen }) => {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<Stage>('belgilar');
  const { scrollY } = useScroll();
  const variants = dictionary?.sticky_cta?.variants as Partial<Record<Stage, StickyCtaVariant>> | undefined;

  const handleScroll = useCallback((y: number) => {
    const h = window.innerHeight;
    setShow(y > h * 0.6);

    let active: Stage = 'belgilar';
    let activeTop = Number.NEGATIVE_INFINITY;
    for (const id of stages) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= 200 && top > activeTop) {
        active = id;
        activeTop = top;
      }
    }
    setStage(active);
  }, []);

  useMotionValueEvent(scrollY, 'change', handleScroll);

  useEffect(() => {
    handleScroll(window.scrollY);
  }, [handleScroll]);

  const v = variants?.[stage] || variants?.belgilar;

  if (!v) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-40"
      initial={{ x: '-50%', y: 80, opacity: 0 }}
      animate={{ x: '-50%', y: show ? 0 : 80, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ pointerEvents: show ? 'auto' : 'none' }}
    >
      <div
        className="flex max-w-[90vw] items-center gap-3 rounded-full px-4 py-3 shadow-2xl sm:max-w-none sm:gap-4 sm:px-5"
        style={{
          background: 'var(--at-ink)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px -10px rgba(14,16,21,0.5)',
        }}
      >
        <span
          className="shrink-0 text-xs font-semibold"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--at-accent)',
            letterSpacing: '0.06em',
          }}
        >
          {v.num}
        </span>
        <span className="min-w-[100px] flex-1 truncate text-[11px] sm:text-sm" style={{ color: 'rgba(244,241,232,.7)' }}>
          {v.text}
        </span>
        <motion.button
          onClick={onOpen}
          whileHover={{ opacity: 0.9 }}
          className="group relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
          style={{ background: 'var(--at-accent)', color: '#fff', whiteSpace: 'nowrap' }}
        >
          <span className="relative z-10">{v.cta}</span>
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: 'var(--at-accent)' }}
            animate={{ scale: [1, 1.6], opacity: [0.2, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AtStickyCta;
