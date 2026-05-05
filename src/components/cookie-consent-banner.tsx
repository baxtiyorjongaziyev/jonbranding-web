
'use client';

import { useEffect, type FC } from 'react';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

const CookieConsentBanner: FC = () => {
    useEffect(() => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        } catch {}
    }, []);

    return null;
};

export default CookieConsentBanner;
