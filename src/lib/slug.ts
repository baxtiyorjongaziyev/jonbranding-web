// Rus va o'zbek kirill harflari → lotin. Xitoycha kabi boshqa yozuvlar uchun
// `toSlug` fallback'ga qaytadi, aks holda slug bo'sh yoki "-zh" bo'lib qolardi.
const CYRILLIC: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ў: 'o', ф: 'f', х: 'x', ҳ: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

export function slugify(text: string, maxLength = 96): string {
  return text
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC[char] ?? char)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’‘ʻʼ`]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength)
    .replace(/-$/, '');
}

/** Sarlavhadan slug; lotinga o'girib bo'lmasa (masalan xitoycha) — fallback'dan. */
export function toSlug(title: string, fallback: string): string {
  const fromTitle = slugify(title);
  return fromTitle.length >= 3 ? fromTitle : slugify(fallback);
}
