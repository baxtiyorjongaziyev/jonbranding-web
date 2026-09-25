type LoaderIds = {
  gtmId: string;
  gaId: string;
  adsId: string;
};

/** Inline `<script>` ichiga xavfsiz qo'yiladigan JS satr literali. */
const jsString = (value: string) => JSON.stringify(value).replace(/</g, '\\u003c');

/**
 * Cookie roziligidan keyin GTM, GA4/Google Ads, Clarity, Hotjar va Meta Pixel'ni
 * yuklaydigan inline skript.
 *
 * `window.gtag` global bo'lishi shart: `trackEvent`/`trackLead` (Ads "Lead"
 * konversiyasi ham) faqat `typeof window.gtag === 'function'` bo'lsa yuboriladi.
 * Avval `gtag` onload ichida lokal funksiya edi — konversiyalar jimgina tushib qolardi.
 */
export function getAnalyticsLoaderScript({ gtmId, gaId, adsId }: LoaderIds): string {
  return `(function(){
  var loadAnalytics = function () {
    if (window.analyticsLoaded) return;
    window.analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    window.gtag('js', new Date());
    window.gtag('config', ${jsString(gaId)});
    window.gtag('config', ${jsString(adsId)});

    var gtm = document.createElement('script');
    gtm.async = true;
    gtm.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(${jsString(gtmId)});
    document.head.appendChild(gtm);

    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(${jsString(gaId)});
    document.head.appendChild(ga);

    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","w7knsud9mg");
    (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:6527829,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r)})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init','1134785364752294');
    window.fbq('track','PageView');
  };
  window.addEventListener('cookie-consent-accepted', loadAnalytics);
  if (document.cookie.indexOf('cookie_consent_accepted=true') !== -1) loadAnalytics();
})();`;
}
