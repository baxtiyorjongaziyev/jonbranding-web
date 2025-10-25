'use client';

import { useState, useEffect, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { Skeleton } from './ui/skeleton';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

const CookieConsentBanner: FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const params = useParams();
    const lang = (params.lang || 'uz') as Locale;
    const [translations, setTranslations] = useState<any>(null);


    useEffect(() => {
        getDictionary(lang).then(dict => setTranslations(dict.cookieConsent));
    }, [lang]);

    useEffect(() => {
        try {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (consent !== 'true') {
                const timer = setTimeout(() => setIsVisible(true), 2000);
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error('Could not read from localStorage', error);
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');

            if (window.gtag) {
                window.gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                });
            }

        } catch (error) {
            console.error('Could not write to localStorage', error);
        }
        setIsVisible(false);
    };

    if (!translations) {
        return (
             <div className="fixed bottom-0 left-0 right-0 p-4 z-[100]">
                <Card className="container mx-auto max-w-4xl p-4 shadow-2xl bg-background/90 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                       <Skeleton className="w-8 h-8 rounded-full" />
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-10 w-28" />
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 p-4 z-[100] transition-transform duration-500 ease-in-out",
            isVisible ? "translate-y-0" : "translate-y-full"
        )}>
            <Card className="container mx-auto max-w-4xl p-4 shadow-2xl bg-background/90 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0 text-primary">
                        <Cookie className="w-8 h-8" />
                    </div>
                    <p className="flex-grow text-sm text-muted-foreground">
                        {translations.message}
                    </p>
                    <Button onClick={handleAccept} className="w-full sm:w-auto flex-shrink-0">
                        {translations.acceptButton}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default CookieConsentBanner;
