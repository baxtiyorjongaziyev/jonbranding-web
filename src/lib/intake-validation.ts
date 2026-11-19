/** Business-field validation is primary; scanner patterns only reduce known abuse. */
export function canonicalText(text: string): string {
  let result = text.normalize('NFKC');
  for (let pass = 0; pass < 3; pass++) {
    result = result.replace(/&#(?:x([0-9a-f]{1,6})|(\d{1,7}));?/gi, (_, hex, dec) => {
      const value = Number.parseInt(hex || dec, hex ? 16 : 10);
      return value <= 0x10ffff ? String.fromCodePoint(value) : '';
    }).replace(/&(?:lt|gt|quot|apos|amp);/gi, entity => ({ '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&amp;': '&' })[entity.toLowerCase()] || entity);
    try { result = decodeURIComponent(result); } catch { /* Keep malformed input for validation. */ }
  }
  return result;
}

export function isScannerInput(value: string): boolean {
  const text = canonicalText(value);
  return /\b(?:print|eval|assert|system|exec|passthru|shell_exec|sleep|pg_sleep|benchmark)\s*\(/i.test(text)
    || /\b(?:union\s+(?:all\s+)?select|select\s+\d+\s*[*+]|waitfor\s+delay|dbms_pipe\.|load_file\s*\(|into\s+outfile|information_schema|sysobjects|syscolumns|extractvalue\s*\(|updatexml\s*\(|char\s*\(\s*\d+\s*,)\b/i.test(text)
    || /\bor\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?\s*(?:--|#|\/\*)/i.test(text)
    || /<\?(?:php|=)|\$\{\s*@|\$\{\s*(?:jndi|env|sys|lower|upper)\s*:|<\s*\/?(?:script|iframe|object|embed|svg|img|esi:include)\b|\bon\w+\s*=\s*["']?[^\s]/i.test(text)
    || /\(\s*\)\s*\{\s*:\s*;\s*\}|<!ENTITY\b|169\.254\.169\.254|metadata\.google\.internal|file:\/\/\//i.test(text)
    || /(?:\|\||&&|;)\s*(?:cat|ls|id|whoami|uname|passwd|sh|bash|cmd|powershell|nc|netcat|python|perl|ruby|php)\b|\/etc\/(?:passwd|shadow|hosts|shells)\b/i.test(text)
    || /(?:javascript|vbscript)\s*:|\b(?:nslookup|curl|wget)\s+|(?:\.\.\/){2,}|\b(?:bxss\.me|oast\.(?:pro|live|site)|interactsh\.com)\b/i.test(text)
    || /\bdfb[\s\S]{0,80}xca\b|98991\s*\*\s*97996|198766\s*\*\s*667891|#set\s*\(|\{\{\s*[\w"'\d][\s\S]{0,80}\}\}|\[\s*\$(?:eq|ne|gt|gte|lt|lte|in|nin|regex|where)\s*\]/i.test(text)
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\ufffd]/u.test(text);
}

export function isMaliciousHeaderValue(value: string): boolean {
  const text = canonicalText(value);
  return /\$\{\s*(?:jndi|env|sys|lower|upper)\s*:/i.test(text)
    || /\(\s*\)\s*\{\s*:\s*;\s*\}/.test(text)
    || /<\?(?:php|=)|\$\{\s*@|<\s*\/?(?:script|iframe|svg)\b/i.test(text)
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text);
}

export function validChatMessage(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const text = value.trim().normalize('NFKC');
  return text.length >= 2 && text.length <= 1500
    && (text.match(/[\p{L}\p{N}]/gu)?.length || 0) >= 2
    && !/^(?:testing|555-666-0606)$/i.test(text)
    && !isScannerInput(text);
}

export function validIntakeName(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const name = value.trim().normalize('NFKC');
  return name.length >= 2 && name.length <= 100
    && /^[\p{L}\p{M} .‘’'ʻʼ`\-]+$/u.test(name)
    && (name.match(/\p{L}/gu)?.length || 0) >= 2;
}

export function intakePhone(value: unknown): string | null {
  if (typeof value !== 'string' || !/^(?:\+|00)?[\d ()\-.]{7,32}$/.test(value.trim())) return null;
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 9) digits = `998${digits}`;
  return /^[1-9]\d{9,14}$/.test(digits) ? `+${digits}` : null;
}

export function intakeTelegram(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const username = value.trim().replace(/^https:\/\/(?:t\.me|telegram\.me)\//i, '').replace(/^@/, '');
  return /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(username) ? username.toLowerCase() : null;
}

export function safeIntakeObject(body: unknown): body is Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  const pending: Array<{ value: unknown; depth: number }> = [{ value: body, depth: 0 }];
  let nodes = 0;
  while (pending.length) {
    const { value, depth } = pending.pop()!;
    if (++nodes > 300 || depth > 6) return false;
    if (typeof value === 'string' && (value.length > 5000 || isScannerInput(value))) return false;
    if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        if (['__proto__', 'constructor', 'prototype'].includes(key) || key.startsWith('$')) return false;
        pending.push({ value: child, depth: depth + 1 });
      }
    }
  }
  return true;
}
