'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

const CookieConsentBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (consent !== 'true') {
                // Delay showing the banner slightly
                const timer = setTimeout(() => setIsVisible(true), 2000);
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error('Could not read from localStorage', error);
            // Fallback to showing the banner if localStorage is unavailable
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
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
                        Мы используем куки на всех своих сайтах, включая этот, потому что без кук вообще весь интернет работал бы через жопу.
                    </p>
                    <Button onClick={handleAccept} className="w-full sm:w-auto flex-shrink-0">
                        Прекрасно
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default CookieConsentBanner;
