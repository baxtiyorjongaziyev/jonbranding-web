export const FALLBACK_COMPARISONS = [
  {
    _id: 'fallback-den-aroma',
    brand: 'Den Aroma',
    oldImg: '/images/cms/denaroma-avval.png',
    newImg: '/images/cms/denaroma-hozir.png',
    oldHint: '3 Atirchi (Eski brending)',
    newHint: 'Den Aroma (Yangi brending)',
    order: 1,
  },
];

export function withFallbackComparisons<T extends { brand?: string | null; order?: number | null }>(comparisons: T[]) {
  const hasDenAroma = comparisons.some((item) => (item.brand || '').toLowerCase().replace(/\s+/g, '').includes('denaroma'));
  const merged = hasDenAroma ? comparisons : ([...FALLBACK_COMPARISONS, ...comparisons] as Array<T & (typeof FALLBACK_COMPARISONS)[number]>);

  return merged.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
