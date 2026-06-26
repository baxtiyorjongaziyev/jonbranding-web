'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ExitIntentPopupProps {
  onOpen: () => void;
  lang?: string;
}

const t = {
  uz: {
    headline: 'Ketishdan oldin...',
    sub: 'Brendingiz haqida 30 soniyalik bepul tashxis oling. Hech qanday majburiyat yo\'q.',
    cta: 'Bepul tashxis olish',
    dismiss: 'Yo\'q, rahmat',
  },
  ru: {
    headline: 'Перед уходом...',
    sub: 'Получите бесплатную 30-секундную диагностику бренда. Без обязательств.',
    cta: 'Получить диагностику',
    dismiss: 'Нет, спасибо',
  },
  en: {
    headline: 'Before you go...',
    sub: 'Get a free 30-second brand diagnosis. No obligations.',
    cta: 'Get free diagnosis',
    dismiss: 'No thanks',
  },
  zh: {
    headline: '离开之前...',
    sub: '获取免费30秒品牌诊断。无任何义务。',
    cta: '获取免费诊断',
    dismiss: '不用了，谢谢',
  },
} as const;

export default function ExitIntentPopup({ onOpen, lang = 'uz' }: ExitIntentPopupProps) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const l = t[(lang as keyof typeof t) || 'uz'];

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (dismissed) return;
    if (e.clientY <= 0 && !show) {
      const hasSeen = sessionStorage.getItem('exit_intent_seen');
      if (!hasSeen) {
        setShow(true);
        sessionStorage.setItem('exit_intent_seen', 'true');
      }
    }
  }, [show, dismissed]);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  const handleAccept = () => {
    setShow(false);
    onOpen();
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative max-w-md w-full rounded-[2rem] overflow-hidden"
            style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30 pointer-events-none"
              style={{ background: 'var(--at-accent)', filter: 'blur(80px)' }} />

            <div className="relative p-8 sm:p-10 text-center space-y-6">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ color: 'var(--at-muted)' }}
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <h3
                  className="font-bold leading-tight"
                  style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--at-ink)', letterSpacing: '-0.03em' }}
                >
                  {l.headline}
                </h3>
                <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.6 }}>
                  {l.sub}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="btn btn-primary btn-lg w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  onClick={handleAccept}
                >
                  {l.cta} <span className="ar">↗</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{ color: 'var(--at-muted)' }}
                >
                  {l.dismiss}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
