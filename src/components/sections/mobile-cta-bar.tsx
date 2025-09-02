'use client';

import { FC, useState, useEffect } from 'react';
import { calculatePackagePrice } from '@/lib/pricing';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const MobileCtaBar: FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
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
  const [isPcgMember] = useLocalStorage('isPcgMember', false);
  const [price, setPrice] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const priceDetails = calculatePackagePrice({ selectedServices, isPcgMember });
      setPrice(priceDetails.final);
    }
  }, [selectedServices, isPcgMember, isClient]);

  if (!isClient) {
    return (
        <div className="sticky bottom-0 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
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

  return (
    <div className="sticky bottom-0 md:hidden bg-background/80 backdrop-blur-sm border-t p-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
            <p className="font-bold text-primary text-lg">{price.toLocaleString('fr-FR')} so'm</p>
            <p className="text-xs text-muted-foreground">Yakuniy narx</p>
        </div>
        <Button onClick={onOpenModal} className="shadow-ocean animate-subtle-pulse" variant="secondary">
          Bepul konsultatsiya olish
        </Button>
      </div>
    </div>
  );
};

export default MobileCtaBar;
