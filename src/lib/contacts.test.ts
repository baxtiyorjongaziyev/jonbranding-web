import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TELEGRAM_CHANNEL_URL, TELEGRAM_CONTACT_URL } from './contacts';

// "Bizga yozing" degan joylar. Ular kanalga (yozib bo'lmaydi) olib bormasligi kerak.
const CONTACT_SURFACES = [
  'src/app/[lang]/aloqa/aloqa-client.tsx',
  'src/components/layout/mobile-nav-bar.tsx',
  'src/components/contact-modal.tsx',
  'src/app/[lang]/diagnostika/diagnostics-client.tsx',
  'src/components/sales/lead-modal.tsx',
] as const;

describe('Telegram contact links', () => {
  it('keeps the messageable account separate from the portfolio channel', () => {
    expect(TELEGRAM_CONTACT_URL).not.toBe(TELEGRAM_CHANNEL_URL);
    expect(TELEGRAM_CONTACT_URL.toLowerCase()).not.toContain('t.me/jonbranding');
  });

  it.each(CONTACT_SURFACES)('%s does not send visitors to the channel', (file) => {
    const source = readFileSync(file, 'utf8');
    expect(source).not.toMatch(/t\.me\/jonbranding\b/i);
  });
});
