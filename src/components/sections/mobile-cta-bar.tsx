'use client';

import { FC, useState, useEffect } from 'react';
import { calculatePackagePrice, formatPrice } from '@/lib/pricing';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const MobileCtaBar: FC<{ onOpenModal: () => void, lang: string, dictionary: any }> = ({ onOpenModal, lang, dictionary }) => {
  const [selectedServices] = useLocalStorage('selectedServices', {
    strategy: false,
    commStrategy: false,
    naming: false,
    logo: true,
    designSystem: false,
    brandbook: false,
    packaging: false,
    smm: false,
    merch: false,
    illustrations: false,
    audit: false,
    namingCheck: false,
    consultation: false,
    urgency: false,
    nda: false,
  });
  const [wantsUpfrontPayment] = useLocalStorage('wantsUpfrontPayment', false);
  const [currency] = useLocalStorage<'uzs' | 'usd'>('currency', 'usd');
  const [price, setPrice] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const translations = dictionary;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const priceDetails = calculatePackagePrice({ selectedServices, wantsUpfrontPayment }, lang as 'uz' | 'ru' | 'en' | 'zh');
      setPrice(priceDetails.final);
    }
  }, [selectedServices, wantsUpfrontPayment, isClient, lang]);

  if (!isClient || !translations) {
    return (
        <div className="sticky bottom-0 z-50 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-sm space-y-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    );
  }
  
  const agreedPriceText = lang === 'uz' ? 'Kelishiladi' : lang === 'ru' ? 'По догов.' : lang === 'en' ? 'Agreed' : '面议';


  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md md:hidden rounded-2xl bg-background/80 backdrop-blur-xl border border-white/20 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/5" suppressHydrationWarning>
      <div className="flex justify-between items-center gap-4">
        <div className="text-left text-sm">
            <p className="font-black text-primary text-xl tracking-tighter leading-none">{price > 0 ? formatPrice(price, lang as 'uz' | 'ru' | 'en' | 'zh', currency) : agreedPriceText}</p>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-70">{translations.final_price}</p>
        </div>
        <Button onClick={onOpenModal} size="lg" className="flex-grow shadow-2xl rounded-xl font-black uppercase tracking-tight text-sm bg-primary hover:bg-primary/90 transition-all active:scale-95">
          {translations.get_offer}
        </Button>
      </div>
    </div>
  );
};

export default MobileCtaBar;