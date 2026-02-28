
'use client';

import type { FC, ReactNode } from 'react';
import { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';
import { Toaster } from '@/components/ui/toaster';
import { calculatePackagePrice, generateSummary } from '@/lib/pricing';
import CookieConsentBanner from '@/components/cookie-consent-banner';
import { getDictionary } from '@/lib/dictionaries';
import { initAmplitude, trackEvent } from '@/lib/amplitude';

const ContactModal = dynamic(() => import('@/components/contact-modal'), {
    loading: () => null,
    ssr: false
});

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Amplitude initialization
    initAmplitude();
  }, []);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    // Google Analytics pageview
    pageview(url);
    // Amplitude pageview
    trackEvent('Page View', { url, pathname });
  }, [pathname, searchParams]);

  return null;
}

const MainLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [packageSummary, setPackageSummary] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    
    const pathname = usePathname();
    const lang = (pathname.split('/')[1] || 'uz') as 'uz' | 'ru' | 'en' | 'zh';

    const handleOpenModal = useCallback(() => {
        if (typeof window === 'undefined') return;

        const selectionsJSON = localStorage.getItem('selectedServices');
        const discountType = localStorage.getItem('discountOption') || 'none';
        const promoCode = localStorage.getItem('promoCode') || '';
        
        setPackageSummary('');
        setTotalPrice(0);

        if (selectionsJSON) {
            try {
                const selectedServices = JSON.parse(selectionsJSON);
                const selections = { 
                    selectedServices, 
                    discountType: discountType.replace(/"/g, ''), 
                    promoCode: promoCode.replace(/"/g, '') 
                };
                
                const priceDetails = calculatePackagePrice(selections, lang);
                if (priceDetails.base > 0) {
                    const summary = generateSummary(selections, lang);
                    setPackageSummary(summary);
                    setTotalPrice(priceDetails.final);
                }
            } catch (e) {
                console.error("Failed to parse package details from localStorage", e);
            }
        }
        
        trackEvent('Open Contact Modal', { lang, packageSummary, totalPrice });
        setModalOpen(true);
    }, [lang, packageSummary, totalPrice]);

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    
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
        window.addEventListener('openContactModal', handleOpenModal);
        window.addEventListener('error', reportError);

        return () => {
            window.removeEventListener('openContactModal', handleOpenModal);
            window.removeEventListener('error', reportError);
        };
    }, [handleOpenModal, reportError]);

    return (
        <div className="flex min-h-screen flex-col bg-secondary/50">
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
