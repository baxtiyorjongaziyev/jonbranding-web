
'use client';

import type { FC, ReactNode } from 'react';
import { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';
import { Toaster } from '@/components/ui/toaster';
import { calculatePackagePrice, generateSummary } from '@/lib/pricing';
import AiAssistant from '@/components/ai-assistant';
import CookieConsentBanner from '@/components/cookie-consent-banner';

const ContactModal = dynamic(() => import('@/components/contact-modal'));

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

const MainLayout: FC<Readonly<{ children: ReactNode, lang: string }>> = ({ children, lang }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [packageSummary, setPackageSummary] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    
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
                
                const priceDetails = calculatePackagePrice(selections);
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

    useEffect(() => {
        const handleOpen = () => handleOpenModal();
        window.addEventListener('openContactModal', handleOpen);

        const handleError = (event: ErrorEvent) => {
            const { message, filename, lineno, colno, error } = event;
            if (!message || message.includes('Telegram API Error') || message === 'Script error.') return;

            fetch('/api/report-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    stack: error ? error.stack : `${filename}:${lineno}:${colno}`,
                    pathname: window.location.pathname,
                    userInfo: navigator.userAgent,
                }),
            }).catch(e => console.error("Failed to report error:", e));
        };

        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener('openContactModal', handleOpen);
            window.removeEventListener('error', handleError);
        };
    }, [handleOpenModal]);

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
            <AiAssistant />
            <CookieConsentBanner />
        </div>
    );
}

export default MainLayout;
