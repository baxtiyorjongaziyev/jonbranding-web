

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
  const [price, setPrice] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const translations = dictionary;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const priceDetails = calculatePackagePrice({ selectedServices, wantsUpfrontPayment }, lang as 'uz' | 'ru' | 'en');
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
  
  const agreedPriceText = lang === 'uz' ? 'Kelishiladi' : lang === 'ru' ? 'По догов.' : 'Agreed';

  return (
    <div className="sticky bottom-0 z-50 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
            <p className="font-bold text-primary text-lg">{price > 0 ? formatPrice(price, lang as 'uz' | 'ru' | 'en') : agreedPriceText}</p>
            <p className="text-xs text-muted-foreground">{translations.final_price}</p>
        </div>
        <Button onClick={onOpenModal} className="shadow-ocean animate-subtle-pulse">
          {translations.get_offer}
        </Button>
      </div>
    </div>
  );
};

export default MobileCtaBar;

    