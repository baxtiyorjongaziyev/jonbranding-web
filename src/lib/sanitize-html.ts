const ALLOWED_TAGS = new Set(['strong', 'b', 'em', 'i', 'br']);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeTag(rawTag: string): string {
  const tag = rawTag.trim();
  const isClosing = tag.startsWith('/');
  const normalized = isClosing ? tag.slice(1).trim().toLowerCase() : tag.toLowerCase();

  if (!ALLOWED_TAGS.has(normalized)) {
    return escapeHtml(`<${rawTag}>`);
  }

  if (normalized === 'br' && !isClosing) {
    return '<br />';
  }

  return isClosing ? `</${normalized}>` : `<${normalized}>`;
}

export function sanitizeRichText(value: string): string {
  if (!value) return '';

  return escapeHtml(value).replace(/&lt;([^&]*)&gt;/g, (_match, rawTag: string) => {
    return sanitizeTag(String(rawTag));
  });
}
