'use client';

import type { FC } from 'react';
import { MessageCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const copy = {
  uz: { cta: 'Bepul Tahlil + Video olish', hint: "Bu hafta faqat 5 ta joy — keyin pullik", badge: "BEPUL" },
  ru: { cta: 'Бесплатный анализ + видео', hint: 'Только 5 мест в неделю — затем платно', badge: "FREE" },
  en: { cta: 'Free analysis + video', hint: 'Only 5 spots per week — then paid', badge: "FREE" },
  zh: { cta: '免费分析+视频', hint: '每周仅5个名额——之后收费', badge: "FREE" },
};

const MobileCtaBar: FC<{ onOpenModal: () => void; lang: string; dictionary: any }> = ({ onOpenModal, lang }) => {
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/94 px-4 py-3 shadow-[0_-18px_55px_-30px_rgba(15,23,42,0.65)] backdrop-blur-xl md:hidden" suppressHydrationWarning>
      <div className="mx-auto w-full max-w-[340px]">
        <Button onClick={onOpenModal} className="h-12 w-full animate-pulse-glow rounded-2xl bg-blue-700 px-4 text-sm font-black text-white shadow-none hover:bg-blue-800">
          <Zap className="h-4 w-4" />
          {t.cta}
          <span className="ml-1.5 rounded bg-white/20 px-1.5 py-0.5 text-[10px]">{t.badge}</span>
        </Button>
        <p className="mt-1 text-center text-[11px] font-semibold leading-4 text-red-500">{t.hint}</p>
      </div>
    </div>
  );
};

export default MobileCtaBar;
