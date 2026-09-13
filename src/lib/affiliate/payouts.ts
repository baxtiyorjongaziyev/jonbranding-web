export const PAYOUT_AMOUNTS = {
  naming: 500_000,
  logo: 500_000,
  patent: 500_000,
  packaging: 800_000,
  full_branding: 1_200_000,
} as const;

export type PayoutService = keyof typeof PAYOUT_AMOUNTS;

// Kalkulyator xizmat id'lari (selectedServices kalitlari) → bonus xizmati.
const HINT_MAP: Record<string, PayoutService> = {
  naming: 'naming',
  namingcheck: 'naming',
  namingstandard: 'naming',
  namingpremium: 'naming',
  namingvip: 'naming',
  logo: 'logo',
  logostandard: 'logo',
  logopremium: 'logo',
  logovip: 'logo',
  patent: 'patent',
  patentcheck: 'patent',
  packaging: 'packaging',
  packagingdesign: 'packaging',
  qadoq: 'packaging',
  fullbranding: 'full_branding',
  full_branding: 'full_branding',
  branding: 'full_branding',
};

// Eng qimmatdan arzonga — "eng qimmati"ni tanlash uchun.
const VALUE_ORDER: PayoutService[] = ['full_branding', 'packaging', 'logo', 'naming', 'patent'];

export function payoutAmount(service: PayoutService): number {
  return PAYOUT_AMOUNTS[service];
}

function tokenize(hint: string | string[] | null | undefined): string[] {
  if (!hint) return [];
  const raw = Array.isArray(hint) ? hint : String(hint).split(/[,+/|;]+/);
  return raw
    .map((part) => String(part).trim().toLowerCase().replace(/[^a-z_]/g, ''))
    .filter(Boolean);
}

export function serviceFromHint(hint: string | string[] | null | undefined): PayoutService | null {
  const matched = new Set<PayoutService>();
  for (const token of tokenize(hint)) {
    const svc = HINT_MAP[token];
    if (svc) matched.add(svc);
  }
  if (matched.size === 0) return null;
  if (matched.has('full_branding')) return 'full_branding';
  for (const svc of VALUE_ORDER) {
    if (matched.has(svc)) return svc;
  }
  return null;
}
