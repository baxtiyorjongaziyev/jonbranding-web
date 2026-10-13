/**
 * Jon Branding olib bergan tovar belgisi guvohnomalari.
 *
 * Manba: `G:\My Drive\JonBranding\Patent` dagi guvohnoma va ilova PDF'lari
 * (Adliya vazirligi). Sanalar guvohnomadan ko'chirilgan, taxmin yo'q.
 * Egasi: ism + familiya va otasining ismi bosh harfi (to'liq F.I.Sh. repoda saqlanmaydi).
 * Mijozlar ko'rsatishga rozilik bergan (egasi tasdiqladi, 2026-10-13).
 * Logotiplar — guvohnoma ilovasidagi ro'yxatdan o'tgan belgi tasviri.
 */

export type PatentCertificate = {
  number: string;
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

export const PATENT_CERTIFICATES: PatentCertificate[] = [
  { number: 'MGU 63414', brand: 'Rutera', owner: '"QAYROQ GAVXARI" MCHJ', application: 'TB 202600495', filed: '2026-01-21', registered: '2026-02-07', classes: [35, 39], industry: 'Logistika', logo: '/images/patent/mgu-63414.webp' },
  { number: 'MGU 64569', brand: 'Nevera', owner: 'AKMALJON T. D.', application: 'TB 202601037', filed: '2026-02-05', registered: '2026-04-12', classes: [37], industry: 'Qurilish', logo: '/images/patent/mgu-64569.webp' },
  { number: 'MGU 62436', brand: 'FIDDA by Sevara', owner: 'SEVARA X. E.', application: 'TB 202503796', filed: '2025-05-22', registered: '2025-12-13', classes: [14, 35], industry: 'Zargarlik', logo: '/images/patent/mgu-62436.webp' },
  { number: 'MGU 65842', brand: 'Dilbaroy Clinic', owner: 'XOSHIMJON U. M.', application: 'TB 202509178', filed: '2025-11-06', registered: '2026-06-15', classes: [44], industry: 'Tibbiyot', logo: '/images/patent/mgu-65842.webp' },
  { number: 'MGU 63094', brand: 'Velzo', owner: 'UMID R. N.', application: 'TB 202504298', filed: '2025-06-09', registered: '2026-01-20', classes: [4, 7, 35, 37], industry: 'Avto servis', logo: '/images/patent/mgu-63094.webp' },
  { number: 'MGU 65065', brand: 'Viton', owner: 'FARHOD S. E.', application: 'TB 202503115', filed: '2025-04-29', registered: '2026-05-05', classes: [11], industry: 'Isitish qozonlari', logo: '/images/patent/mgu-65065.webp' },
  { number: 'MGU 63161', brand: 'O‘rman', owner: 'AKBARJON R. A.', application: 'TB 202503265', filed: '2025-05-03', registered: '2026-01-23', classes: [20], industry: 'Mebel', logo: '/images/patent/mgu-63161.webp' },
  { number: 'MGU 63962', brand: 'Bekson Shoes', owner: 'BEKZOD S. S.', application: 'TB 202505790', filed: '2025-07-28', registered: '2026-03-09', classes: [25], industry: 'Poyabzal', logo: '/images/patent/mgu-63962.webp' },
  { number: 'MGU 63493', brand: 'Revo', owner: 'TULQIN X. U.', application: 'TB 202505462', filed: '2025-07-17', registered: '2026-02-12', classes: [7], industry: 'Ehtiyot qismlar', logo: '/images/patent/mgu-63493.webp' },
  { number: 'MGU 66245', brand: 'Zayyan', owner: 'SHERZOD J. D.', application: 'TB 202510178', filed: '2025-12-05', registered: '2026-07-06', classes: [35], industry: 'Onlayn savdo', logo: '/images/patent/mgu-66245.webp' },
  { number: 'MGU 67303', brand: 'Nurion', owner: 'BURXONXO‘JA A. B.', application: 'TB 202600527', filed: '2026-01-22', registered: '2026-08-19', classes: [3, 5, 35], industry: 'Kosmetika', logo: '/images/patent/mgu-67303.webp' },
  { number: 'MGU 67304', brand: 'Qomus', owner: 'BURXONXO‘JA A. B.', application: 'TB 202600530', filed: '2026-01-22', registered: '2026-08-19', classes: [3, 5, 35], industry: 'Kosmetika', logo: '/images/patent/mgu-67304.webp' },
  { number: 'MGU 68379', brand: '—', owner: 'ODILJON H. O.', application: 'TB 202602310', filed: '2026-03-13', registered: '2026-10-12', classes: [35], industry: 'Savdo', logo: null },
];

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
