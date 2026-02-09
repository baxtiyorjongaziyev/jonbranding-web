
'use client';

import { useState, useEffect, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { getDictionary, type Locale } from '@/lib/dictionaries';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

const CookieConsentBanner: FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const params = useParams();
    const lang = (params.lang || 'uz') as Locale;
    const [translations, setTranslations] = useState<any>(null);

    useEffect(() => {
        getDictionary(lang).then(dict => {
            if (dict.cookieConsent) {
                setTranslations(dict.cookieConsent);
            }
        });
    }, [lang]);

    useEffect(() => {
        try {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (consent !== 'true') {
                const timer = setTimeout(() => setIsVisible(true), 3000);
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error('Could not read from localStorage', error);
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        } catch (error) {
            console.error('Could not write to localStorage', error);
        }
        setIsVisible(false);
    };

    if (!translations || !isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 p-4 z-[100] transition-all duration-500 ease-in-out transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}>
            <Card className="container mx-auto max-w-4xl p-4 shadow-2xl bg-background/95 backdrop-blur-md border-primary/20">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0 text-primary bg-primary/10 p-2 rounded-full">
                        <Cookie className="w-6 h-6" />
                    </div>
                    <p className="flex-grow text-sm text-muted-foreground text-center sm:text-left">
                        {translations.message}
                    </p>
                    <Button onClick={handleAccept} size="sm" className="w-full sm:w-auto flex-shrink-0 shadow-lg">
                        {translations.acceptButton}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default CookieConsentBanner;
