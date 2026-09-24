import type { ATGalleryProject } from './types';

export const TILE_CLASSES = ['t-1', 't-2', 't-3', 't-4', 't-5'];

export const CATEGORY_LABELS: Record<string, Record<string, string>> = {
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
    'brand-strategy': 'Brand Strategy',
    'logo-design': 'Logo Design',
    brandbook: 'Brandbook',
    'corporate-style': 'Corporate Style',
    packaging: 'Packaging Design',
    naming: 'Naming',
  },
  zh: {
    'brand-strategy': '品牌战略',
    'logo-design': '标志设计',
    brandbook: '品牌手册',
    'corporate-style': '企业风格',
    packaging: '包装设计',
    naming: '命名',
  },
};

export function getCategoryLabel(category: string | undefined, lang: string): string {
  if (!category) return '';
  const labels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.uz;
  return labels[category] || category;
}

export function getFirstResult(project: ATGalleryProject): string {
  if (project.results && project.results.length > 0) {
    return project.results[0].value;
  }
  return '';
}

export function getYear(project: ATGalleryProject): string {
  const d = project.publishedAt;
  if (d) return new Date(d).getFullYear().toString();
  return '2025';
}
