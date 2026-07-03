const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sch', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
  // O'zbek kirilchasiga xos harflar
  ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join('');
}

/**
 * Sarlavhadan URL-safe slug yasaydi. Kirill matnni avval lotinga
 * transliteratsiya qiladi, aks holda "Декор" kabi nomlar bo'sh
 * stringga aylanib, Sanity dedup tekshiruvini buzardi.
 * Natija bo'sh bo'lib qolsa, `fallback` (masalan Drive folder ID) ishlatiladi.
 */
export function slugify(text: string, fallback?: string): string {
  const slug = transliterate(text)
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

  if (slug) return slug;
  return fallback ? `case-${fallback}`.slice(0, 96) : `case-${Date.now()}`;
}
