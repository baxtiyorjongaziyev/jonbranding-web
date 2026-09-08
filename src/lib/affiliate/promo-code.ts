const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

function transliterate(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => (ch in CYRILLIC_MAP ? CYRILLIC_MAP[ch] : ch))
    .join('');
}

export function normalizePromoBase(fullName: string): string {
  const firstWord = String(fullName || '').trim().split(/\s+/)[0] || '';
  const cleaned = transliterate(firstWord).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length < 4) return 'HAMKOR';
  return cleaned.slice(0, 20);
}

function randomSuffix(len: number): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function generatePromoCode(
  fullName: string,
  isTaken: (code: string) => Promise<boolean>,
): Promise<string> {
  const base = normalizePromoBase(fullName);
  if (!(await isTaken(base))) return base;

  for (let n = 2; n <= 99; n++) {
    const candidate = `${base}${n}`;
    if (!(await isTaken(candidate))) return candidate;
  }

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `${base}${randomSuffix(attempt < 10 ? 3 : 4)}`.slice(0, 24);
    if (!(await isTaken(candidate))) return candidate;
  }

  // Deyarli imkonsiz — vaqt tamg'asi bilan.
  return `${base}${Date.now().toString(36).toUpperCase().slice(-4)}`;
}
