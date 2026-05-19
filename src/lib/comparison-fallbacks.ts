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
  {
    _id: 'fallback-savod',
    brand: 'Savod',
    oldImg: '/images/cms/savod-avval.png',
    newImg: '/images/cms/savod-hozir.png',
    oldHint: 'Avvalgi vizual ko\'rinish',
    newHint: 'Savod (Yangi premium aydentika)',
    order: 2,
  },
  {
    _id: 'fallback-fidda',
    brand: 'Fidda by Sevara',
    oldImg: '/images/cms/fidda-avval.jpeg',
    newImg: '/images/cms/fidda-hozir.png',
    oldHint: 'Oddiy logotip dizayni',
    newHint: 'Fidda (Premium aydentika)',
    order: 3,
  },
  {
    _id: 'fallback-boyarin',
    brand: 'Boyarin',
    oldImg: '/images/cms/boyarin-avval.jpeg',
    newImg: '/images/cms/boyarin-hozir.png',
    oldHint: 'Eski mahsulot uslubi',
    newHint: 'Boyarin (Premium qadoq va brend)',
    order: 4,
  },
];

export function withFallbackComparisons<T extends { brand?: string | null; order?: number | null }>(comparisons: T[]) {
  const hasDenAroma = comparisons.some((item) => (item.brand || '').toLowerCase().replace(/\s+/g, '').includes('denaroma'));
  const hasSavod = comparisons.some((item) => (item.brand || '').toLowerCase().replace(/\s+/g, '').includes('savod'));
  const hasFidda = comparisons.some((item) => (item.brand || '').toLowerCase().replace(/\s+/g, '').includes('fidda'));
  const hasBoyarin = comparisons.some((item) => (item.brand || '').toLowerCase().replace(/\s+/g, '').includes('boyarin'));

  let merged = [...comparisons];
  
  if (!hasDenAroma) {
    const item = FALLBACK_COMPARISONS.find(x => x.brand === 'Den Aroma');
    if (item) merged.push(item as any);
  }
  if (!hasSavod) {
    const item = FALLBACK_COMPARISONS.find(x => x.brand === 'Savod');
    if (item) merged.push(item as any);
  }
  if (!hasFidda) {
    const item = FALLBACK_COMPARISONS.find(x => x.brand === 'Fidda by Sevara');
    if (item) merged.push(item as any);
  }
  if (!hasBoyarin) {
    const item = FALLBACK_COMPARISONS.find(x => x.brand === 'Boyarin');
    if (item) merged.push(item as any);
  }

  // Ensure displaying order is respected
  return merged.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
