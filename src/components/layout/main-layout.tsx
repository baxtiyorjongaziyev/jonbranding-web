
'use client';

import type { FC, ReactNode } from 'react';
import { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';
import { Toaster } from '@/components/ui/toaster';
import { calculatePackagePrice, generateSummary } from '@/lib/pricing';
import CookieConsentBanner from '@/components/cookie-consent-banner';
import { initAmplitude, trackEvent } from '@/lib/amplitude';

const ContactModal = dynamic(() => import('@/components/contact-modal'), {
    loading: () => null,
    ssr: false
});

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
    trackEvent('Page View', { url, pathname });
  }, [pathname, searchParams]);

  return null;
}

const MainLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [packageSummary, setPackageSummary] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    
    const pathname = usePathname();
    const lang = (pathname.split('/')[1] || 'uz') as any;

    const handleOpenModal = useCallback(() => {
        if (typeof window === 'undefined') return;

        let summary = '';
        let finalPrice = 0;

        try {
            const selectionsJSON = localStorage.getItem('selectedServices');
            const discountType = (localStorage.getItem('discountOption') || 'none').replace(/"/g, '');
            const promoCode = (localStorage.getItem('promoCode') || '').replace(/"/g, '');
            
            if (selectionsJSON) {
                const selectedServices = JSON.parse(selectionsJSON);
                const selections = { selectedServices, discountType, promoCode };
                const priceDetails = calculatePackagePrice(selections, lang);
                
                if (priceDetails.base > 0) {
                    summary = generateSummary(selections, lang);
                    finalPrice = priceDetails.final;
                }
            }
        } catch (e) {
            console.error("Failed to parse package details from localStorage", e);
        }
        
        setPackageSummary(summary);
        setTotalPrice(finalPrice);
        trackEvent('Open Contact Modal', { lang, packageSummary: summary, totalPrice: finalPrice });
        setModalOpen(true);
    }, [lang]);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);
    
    const reportError = useCallback((error: ErrorEvent) => {
        const { message, filename, lineno, colno, error: errorObj } = error;
        if (!message || message.includes('Telegram API Error') || message === 'Script error.' || (filename && !filename.includes(window.location.origin))) return;

        fetch('/api/report-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                stack: errorObj ? errorObj.stack : `${filename}:${lineno}:${colno}`,
                pathname: window.location.pathname,
                userInfo: navigator.userAgent,
            }),
        }).catch(e => console.error("Failed to report error:", e));
    }, []);


    useEffect(() => {
        // Use a wrapper to ensure we always have the current handleOpenModal reference
        const listener = () => handleOpenModal();
        window.addEventListener('openContactModal', listener);
        window.addEventListener('error', reportError);

        return () => {
            window.removeEventListener('openContactModal', listener);
            window.removeEventListener('error', reportError);
        };
    }, [handleOpenModal, reportError]);

    return (
        <div className="flex min-h-screen flex-col bg-secondary/50" suppressHydrationWarning>
            <Suspense fallback={null}>
                <AnalyticsTracker />
            </Suspense>
            {children}
            <Toaster />
            <ContactModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                packageSummary={packageSummary}
                totalPrice={totalPrice}
                onFormSubmitSuccess={handleCloseModal}
                lang={lang}
            />
            <CookieConsentBanner />
        </div>
    );
}

export default MainLayout;
