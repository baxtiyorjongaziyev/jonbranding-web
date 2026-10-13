/**
 * Jon Branding olib bergan tovar belgisi guvohnomalari.
 *
 * Manba: `G:\My Drive\JonBranding\Patent` dagi guvohnoma va ilova PDF'lari
 * (Adliya vazirligi). Sanalar guvohnomadan ko'chirilgan, taxmin yo'q.
 * Egasi: ism + familiya va otasining ismi bosh harfi (to'liq F.I.Sh. repoda saqlanmaydi).
 * Mijozlar ko'rsatishga rozilik bergan (egasi tasdiqladi, 2026-10-13).
 * Logotiplar — guvohnoma ilovasidagi ro'yxatdan o'tgan belgi tasviri.
 */

import certificates from '@/data/patent-certificates.json';

export type PatentCertificate = {
  number: string;
  /** Bo'sh bo'lishi mumkin — avtomatik qo'shilgan yozuvda nom PDF matnida yo'q. */
  brand: string;
  owner: string;
  application: string;
  /** Talabnoma kelib tushgan sana — himoya shu kundan boshlanadi. */
  filed: string;
  /** Davlat reestriga kiritilgan sana. */
  registered: string;
  classes: number[];
  industry: string;
  /** `null` — ilova qo'lda yo'q, belgi tasviri mavjud emas. */
  logo: string | null;
};

/**
 * Ro'yxat JSON'da — `scripts/patent-sync/sync.py` Drive papkasidagi yangi
 * guvohnomalarni shu faylga avtomatik qo'shadi. Qo'lda tahrirlash ham mumkin
 * (masalan, `brand` nomini aniqlashtirish) — skript mavjud yozuvlarga tegmaydi.
 */
export const PATENT_CERTIFICATES: PatentCertificate[] = [...(certificates as PatentCertificate[])].sort(
  (a, b) => b.registered.localeCompare(a.registered)
);

/** Talabnomadan reestrgacha o'tgan kunlar. */
export function certificateDays(cert: PatentCertificate): number {
  return Math.round((Date.parse(cert.registered) - Date.parse(cert.filed)) / 86_400_000);
}

/** `2025-05-22` → `22.05.2025` (guvohnomadagi ko'rinish). */
export function formatCertDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** Himoya muddati: talabnoma kunidan 10 yil. */
export function validUntil(cert: PatentCertificate): string {
  const [y, m, d] = cert.filed.split('-');
  return `${d}.${m}.${Number(y) + 10}`;
}

/** Ko'rsatiladigan nom: brend, bo'lmasa guvohnoma raqami. */
export function certificateLabel(cert: PatentCertificate): string {
  return cert.brand || cert.number;
}
