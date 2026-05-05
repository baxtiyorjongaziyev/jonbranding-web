'use client';

import type { FC } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const copy = {
  uz: { cta: 'Bepul audit', hint: '15 daqiqada 3 ta xato' },
  ru: { cta: 'Бесплатный аудит', hint: '3 ошибки за 15 минут' },
  en: { cta: 'Free audit', hint: '3 issues in 15 minutes' },
  zh: { cta: '免费审计', hint: '15 分钟找出 3 个问题' },
};

const MobileCtaBar: FC<{ onOpenModal: () => void; lang: string; dictionary: any }> = ({ onOpenModal, lang, dictionary }) => {
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  if (!dictionary) {
    return (
      <div className="sticky bottom-0 z-50 border-t border-brand-line bg-white/88 p-3 shadow-[0_-18px_50px_-30px_rgba(8,15,35,0.45)] backdrop-blur-xl md:hidden">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-50 border-t border-brand-line bg-white/88 p-3 shadow-[0_-18px_50px_-30px_rgba(8,15,35,0.45)] backdrop-blur-xl md:hidden" suppressHydrationWarning>
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-black text-brand-ink">{t.cta}</p>
          <p className="truncate text-[11px] font-semibold text-brand-slate">{t.hint}</p>
        </div>
        <Button onClick={onOpenModal} className="h-12 rounded-2xl bg-brand-ink px-5 shadow-none hover:bg-brand-blue">
          <MessageCircle className="h-4 w-4" />
          {t.cta}
        </Button>
      </div>
    </div>
  );
};

export default MobileCtaBar;
