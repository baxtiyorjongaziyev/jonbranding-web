// Keys (portfolio) nomlari standarti. Batafsil: docs/KEYS-NOMLARI.md.
// Format: "{Brend} — {ish turi}", masalan "Rash Milk — qadoq dizayni".

import type { PortfolioProject } from '@/lib/portfolio-fallbacks';

export type CaseCategory = PortfolioProject['category'];
export type CaseLang = 'uz' | 'ru' | 'en' | 'zh';

/** Kategoriyalarning rasmiy nomlari (kartochka yorlig'i va filtr uchun). */
export const CASE_CATEGORY_LABELS: Record<CaseLang, Record<CaseCategory, string>> = {
  uz: {
    'brand-strategy': 'Brend-strategiya',
    'logo-design': 'Logotip dizayni',
    brandbook: 'Brendbuk',
    'corporate-style': 'Firma uslubi',
    packaging: 'Qadoq dizayni',
    naming: 'Neyming',
  },
  ru: {
    'brand-strategy': 'Бренд-стратегия',
    'logo-design': 'Дизайн логотипа',
    brandbook: 'Брендбук',
    'corporate-style': 'Фирменный стиль',
    packaging: 'Дизайн упаковки',
    naming: 'Нейминг',
  },
  en: {
    'brand-strategy': 'Brand strategy',
    'logo-design': 'Logo design',
    brandbook: 'Brandbook',
    'corporate-style': 'Corporate identity',
    packaging: 'Packaging design',
    naming: 'Naming',
  },
  zh: {
    'brand-strategy': '品牌战略',
    'logo-design': '标志设计',
    brandbook: '品牌手册',
    'corporate-style': '企业形象',
    packaging: '包装设计',
    naming: '命名',
  },
};

export const CASE_TITLE_SEPARATOR = ' — ';
export const CASE_TITLE_MAX = 48;

/** Yuridik shakl qo'shimchalari brend nomida bo'lmaydi. */
const LEGAL_FORMS = /(^|\s)(MChJ|XK|AJ|OOO|ООО|LLC|Ltd|Inc)\.?(?=\s|$)/i;

export function caseCategoryLabel(category: string | undefined, lang: string): string {
  if (!category) return '';
  const labels = CASE_CATEGORY_LABELS[(lang as CaseLang)] ?? CASE_CATEGORY_LABELS.uz;
  return labels[category as CaseCategory] ?? category;
}

/** Sarlavhadagi ish turi: kategoriya nomi, uz/ru/en'da kichik harf bilan boshlanadi. */
export function caseServiceLabel(category: CaseCategory, lang: CaseLang): string {
  const label = CASE_CATEGORY_LABELS[lang][category];
  return lang === 'zh' ? label : label.charAt(0).toLocaleLowerCase(lang) + label.slice(1);
}

/** Standart sarlavha: "{Brend} — {ish turi}". */
export function buildCaseTitle(brand: string, category: CaseCategory, lang: CaseLang): string {
  return `${brand.trim()}${CASE_TITLE_SEPARATOR}${caseServiceLabel(category, lang)}`;
}

/** Kartochkada ko'rsatiladigan qisqa nom — sarlavhaning brend qismi. */
export function caseBrandName(title: string): string {
  return title.split(CASE_TITLE_SEPARATOR)[0].split(':')[0].trim();
}

/** Sarlavhani standartga tekshiradi; bo'sh massiv — xato yo'q. */
export function validateCaseTitle(title: string, brand: string): string[] {
  const errors: string[] = [];
  const parts = title.split(CASE_TITLE_SEPARATOR);
  if (parts.length !== 2) errors.push(`"${title}": aynan bitta " — " ajratuvchi bo'lishi kerak`);
  if (parts[0] !== brand) errors.push(`"${title}": brend qismi "${brand}" bo'lishi kerak`);
  if (title.length > CASE_TITLE_MAX) errors.push(`"${title}": ${CASE_TITLE_MAX} belgidan uzun`);
  if (/[:!?"«»“”]/.test(title)) errors.push(`"${title}": ":", "!", "?" va qo'shtirnoq ishlatilmaydi`);
  if (LEGAL_FORMS.test(brand)) errors.push(`"${brand}": brend nomida yuridik shakl bo'lmaydi`);
  return errors;
}
