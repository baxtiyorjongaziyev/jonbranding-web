/**
 * Lid manbasi (konversiya auditi, K-2): mehmon reklama havolasi bilan kirib, boshqa sahifada
 * ariza qoldirsa ham UTM yo'qolmasin. Kirishda bir marta saqlanadi, har bir forma
 * `getLeadAttribution()` ni so'rovga qo'shadi va amoCRM eslatmasiga tushadi.
 *
 * Faqat kampaniya ma'lumoti: UTM, tashqi sayt manzili (so'rov qismisiz) va kirish sahifasi.
 * Click ID (gclid, fbclid) saqlanmaydi — bu Consent Mode qaroriga bog'liq.
 */

export type LeadAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
};

const STORAGE_KEY = 'jb_lead_attribution_v1';
/** Reklamadan kelib, bir necha kun o'ylab, keyin yozadigan mijoz ham hisobga olinsin. */
export const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type UtmKey = 'utmSource' | 'utmMedium' | 'utmCampaign' | 'utmContent' | 'utmTerm';

const UTM_PARAMS: ReadonlyArray<readonly [string, UtmKey]> = [
  ['utm_source', 'utmSource'],
  ['utm_medium', 'utmMedium'],
  ['utm_campaign', 'utmCampaign'],
  ['utm_content', 'utmContent'],
  ['utm_term', 'utmTerm'],
];

const clip = (value: string, max: number) => value.trim().slice(0, max);
const bareHost = (host: string) => host.toLowerCase().replace(/^www\./, '');

function isOwnHost(host: string, siteHost: string): boolean {
  const h = bareHost(host);
  return h === bareHost(siteHost) || h === 'jonbranding.uz' || h.endsWith('.jonbranding.uz');
}

/** Tashqi sayt bo'lsa — faqat origin + yo'l (qidiruv so'rovi va boshqa parametrlar tashlanadi). */
function externalReferrer(referrer: string, siteHost: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const ref = new URL(referrer);
    if (isOwnHost(ref.hostname, siteHost)) return undefined;
    return clip(`${ref.origin}${ref.pathname === '/' ? '' : ref.pathname}`, 300);
  } catch {
    return undefined;
  }
}

/**
 * Joriy kirish bo'yicha manba. UTM ham, tashqi referrer ham bo'lmasa (to'g'ridan-to'g'ri yoki
 * sayt ichidan o'tish) — `null`: avval saqlangan manba ustidan yozilmaydi.
 */
export function attributionFromVisit(href: string, referrer: string): LeadAttribution | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const utm: Partial<Record<UtmKey, string>> = Object.fromEntries(
    UTM_PARAMS.flatMap(([param, key]) => {
      const value = url.searchParams.get(param)?.trim();
      return value ? [[key, clip(value, 200)]] : [];
    }),
  );
  const ref = externalReferrer(referrer, url.hostname);
  if (Object.keys(utm).length === 0 && !ref) return null;
  return { ...utm, ...(ref ? { referrer: ref } : {}), landingPage: clip(url.pathname, 300) };
}

type Stored = LeadAttribution & { capturedAt: number };

function readStored(now: number): LeadAttribution {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const { capturedAt, ...rest } = parsed as Stored;
    if (typeof capturedAt !== 'number' || now - capturedAt > ATTRIBUTION_TTL_MS) return {};
    return Object.fromEntries(Object.entries(rest).filter(([, value]) => typeof value === 'string'));
  } catch {
    return {};
  }
}

const hasUtm = (a: LeadAttribution) => Boolean(a.utmSource || a.utmMedium || a.utmCampaign || a.utmContent || a.utmTerm);

/**
 * Har sahifa yuklanishida chaqiriladi: yangi manba bo'lsa, eskisining o'rniga yoziladi.
 * Sahifa yangilanganda (F5) `document.referrer` o'sha tashqi sayt bo'lib qoladi — UTM'siz shunday
 * "tashrif" saqlangan kampaniyani o'chirmaydi. Boshqa tashqi saytdan yangi kirish esa yozadi.
 */
export function captureLeadAttribution(now = Date.now()): void {
  const visit = attributionFromVisit(window.location.href, document.referrer);
  if (!visit) return;
  if (!hasUtm(visit) && readStored(now).referrer === visit.referrer) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...visit, capturedAt: now } satisfies Stored));
  } catch {
    // Saqlash bloklangan (maxfiy rejim) — forma joriy sahifa manbasini baribir yuboradi.
  }
}

/**
 * Formaga qo'shiladigan manba. URL'da UTM bo'lsa — joriy kirish; aks holda saqlangani.
 * Next.js ichki o'tishida `document.referrer` kirishdagi tashqi sayt bo'lib qoladi, shuning uchun
 * UTM'siz joriy "tashrif" saqlangan kampaniyadan ustun qo'yilmaydi.
 */
export function getLeadAttribution(now = Date.now()): LeadAttribution {
  if (typeof window === 'undefined') return {};
  const visit = attributionFromVisit(window.location.href, document.referrer);
  if (visit && hasUtm(visit)) return visit;
  const stored = readStored(now);
  if (Object.keys(stored).length > 0) return stored;
  return visit ?? {};
}
