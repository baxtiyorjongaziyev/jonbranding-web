
'use client';

import { useEffect, type FC } from 'react';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

const CookieConsentBanner: FC = () => {
    useEffect(() => {
        try {
            // Set cookie (checked by analytics scripts in layout.tsx)
            document.cookie = `${COOKIE_CONSENT_KEY}=true; path=/; max-age=31536000; SameSite=Lax`;
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            // Fire event so already-loaded analytics scripts pick up consent
            window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
        } catch {}
    }, []);

    return null;
};

export default CookieConsentBanner;
