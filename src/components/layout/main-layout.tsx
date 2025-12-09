
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
import Script from 'next/script';

const ContactModal = dynamic(() => import('@/components/contact-modal'));

function AnalyticsPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

const MainLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [packageSummary, setPackageSummary] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    
    const pathname = usePathname();
    const lang = pathname.split('/')[1] as 'uz' | 'ru' || 'uz';
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        getDictionary(lang).then(setDictionary);
    }, [lang]);
    
    const handleOpenModal = useCallback(() => {
        const selectionsJSON = localStorage.getItem('selectedServices');
        const wantsUpfrontPaymentJSON = localStorage.getItem('wantsUpfrontPayment');
        
        setPackageSummary('');
        setTotalPrice(0);

        if (selectionsJSON) {
            try {
                const selectedServices = JSON.parse(selectionsJSON);
                const wantsUpfrontPayment = wantsUpfrontPaymentJSON ? JSON.parse(wantsUpfrontPaymentJSON) : false;
                const selections = { selectedServices, wantsUpfrontPayment };
                
                const priceDetails = calculatePackagePrice(selections, lang);
                if (priceDetails.base > 0) {
                    const summary = generateSummary(selections, lang);
                    setPackageSummary(summary);
                    setTotalPrice(priceDetails.final);
                }

            } catch (e) {
                console.error("Failed to parse package details from localStorage", e);
                 setPackageSummary('');
                 setTotalPrice(0);
            }
        }
        setModalOpen(true);
    }, [lang]);

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    
    const reportError = (error: ErrorEvent) => {
        const { message, filename, lineno, colno, error: errorObj } = error;
        // Avoid reporting errors from browser extensions or third-party scripts
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
    };


    useEffect(() => {
        const handleOpen = () => handleOpenModal();
        window.addEventListener('openContactModal', handleOpen);
        window.addEventListener('error', reportError);

        return () => {
            window.removeEventListener('openContactModal', handleOpen);
            window.removeEventListener('error', reportError);
        };
    }, [handleOpenModal]);
    
    if (!dictionary) return null; // Or a loading spinner

    return (
        <div className="flex min-h-screen flex-col bg-secondary/50">
            <Suspense fallback={null}>
                <AnalyticsPageviewTracker />
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
