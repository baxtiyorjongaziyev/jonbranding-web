/**
 * Public Portfolio Content Sanitizer
 * 
 * Ushbu modul saytning public sahifalariga (portfolio, case study, home)
 * Sanity CMS yoki tashqi integratsiyalardan tasodifan tushib qolishi mumkin bo'lgan
 * har qanday ichki CRM havolalari (AmoCRM, Kommo), lid raqamlari, bot loglari,
 * qo'ng'iroq tahlili va shaxsiy telefon raqamlarini tozalaydi.
 */

const CRM_PATTERNS = [
  // AmoCRM va Kommo havolalari
  /https?:\/\/[a-zA-Z0-9.-]*(?:amocrm\.ru|kommo\.com)[^\s)\]]*/gi,
  // Lid yoki sdelka identifikatorlari (masalan: 👤 Lid: [AmoCRM Lead #45365927](...))
  /👤?\s*(?:Lid|Lead|Sdelka):\s*(?:\[[^\]]*\]\([^)]*\)|#?\d+)/gi,
  // AI Qo'ng'iroq Tahlili va bot xabarlari
  /🎙?\s*AI\s+Qo['’`]?ng['’`]?iroq\s+Tahlili[^\n]*/gi,
  // Telefon raqamlar va kontaktlar (ichki xabarlardagi)
  /📞\s*Telefon:\s*[\d\s+()-]+/gi,
  // Menejer / bot nishonlari
  /🧑‍💼\s*Menejer:\s*@?[\w.-]+/gi,
  // Davomiyligi, kayfiyat, sifat bahosi
  /⏱\s*Davomiyligi:[^\n]*/gi,
  /🎭\s*Kayfiyat:[^\n]*/gi,
  /⭐️\s*Sifat\s+Bahosi:[^\n]*/gi,
  // Natija va konversiya tavsiyalari (Call intelligence)
  /📊\s*Natija:\s*[\w_]+/gi,
  /🎯\s*Keyingi\s+qadam:[^\n]*/gi,
  /💡\s*Konversiya\s+Tavsiyalari:[^\n]*/gi,
  // Bo'sh qolgan gorizontal chiziqlar
  /━{4,}/g,
];

export function sanitizePublicText(text?: string | null): string {
  if (!text || typeof text !== 'string') return '';
  
  let cleaned = text;
  for (const pattern of CRM_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Qatorlarni tozalash va ortiqcha bo'shliqlarni yo'qotish
  return cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n\n')
    .trim();
}

export function sanitizePortfolioProject<T extends {
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  body?: any[];
}>(project: T): T {
  let modified = false;
  const next = { ...project };

  if (next.description) {
    const cleanDesc = sanitizePublicText(next.description);
    if (cleanDesc !== next.description) {
      next.description = cleanDesc;
      modified = true;
    }
  }

  if (next.title) {
    const cleanTitle = sanitizePublicText(next.title);
    if (cleanTitle !== next.title) {
      next.title = cleanTitle;
      modified = true;
    }
  }

  if (next.metaTitle) {
    const cleanMeta = sanitizePublicText(next.metaTitle);
    if (cleanMeta !== next.metaTitle) {
      next.metaTitle = cleanMeta;
      modified = true;
    }
  }

  if (next.metaDescription) {
    const cleanMetaDesc = sanitizePublicText(next.metaDescription);
    if (cleanMetaDesc !== next.metaDescription) {
      next.metaDescription = cleanMetaDesc;
      modified = true;
    }
  }

  if (Array.isArray(next.body)) {
    const cleanBody = next.body
      .map((block) => {
        if (!block) return null;
        // PortableText block
        if (block._type === 'block' && Array.isArray(block.children)) {
          const cleanChildren = block.children
            .map((child: any) => {
              if (child && typeof child.text === 'string') {
                const cleanT = sanitizePublicText(child.text);
                return cleanT ? { ...child, text: cleanT } : null;
              }
              return child;
            })
            .filter(Boolean);

          if (cleanChildren.length === 0) return null;
          return { ...block, children: cleanChildren };
        }

        // Standard heading/paragraph block
        if (typeof block.heading === 'string' || typeof block.paragraph === 'string') {
          const cleanHeading = block.heading ? sanitizePublicText(block.heading) : '';
          const cleanPara = block.paragraph ? sanitizePublicText(block.paragraph) : '';
          if (!cleanHeading && !cleanPara) return null;
          return { ...block, heading: cleanHeading, paragraph: cleanPara };
        }

        return block;
      })
      .filter(Boolean);

    if (cleanBody.length !== next.body.length || JSON.stringify(cleanBody) !== JSON.stringify(next.body)) {
      next.body = cleanBody;
      modified = true;
    }
  }

  return modified ? next : project;
}
