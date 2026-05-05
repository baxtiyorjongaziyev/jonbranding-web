'use client';

import type { FC } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const copy = {
  uz: { cta: 'Bepul Brand Audit olish', hint: "Brendingizdagi ishonch yo'qotadigan joylarni ko'ramiz" },
  ru: { cta: 'Book free brand audit', hint: 'Find the trust gaps in your brand' },
  en: { cta: 'Book free brand audit', hint: 'Find the trust gaps in your brand' },
  zh: { cta: 'Book free brand audit', hint: 'Find the trust gaps in your brand' },
};

const MobileCtaBar: FC<{ onOpenModal: () => void; lang: string; dictionary: any }> = ({ onOpenModal, lang }) => {
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/94 px-4 py-3 shadow-[0_-18px_55px_-30px_rgba(15,23,42,0.65)] backdrop-blur-xl md:hidden" suppressHydrationWarning>
      <div className="mx-auto w-full max-w-[340px]">
        <Button onClick={onOpenModal} className="h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-none hover:bg-blue-700">
          <MessageCircle className="h-4 w-4" />
          {t.cta}
        </Button>
        <p className="mt-1 text-center text-[11px] font-semibold leading-4 text-slate-500">{t.hint}</p>
      </div>
    </div>
  );
};

export default MobileCtaBar;
