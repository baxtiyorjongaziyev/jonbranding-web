import { describe, it, expect } from 'vitest';
import { sanitizePublicText, sanitizePortfolioProject } from './sanitize-portfolio-content';

describe('sanitizePublicText', () => {
  it('strips AmoCRM lead URLs and markdown links', () => {
    const raw = '👤 Lid: [AmoCRM Lead #45365927](https://jonbranding.amocrm.ru/leads/detail/45365927)';
    expect(sanitizePublicText(raw)).toBe('');
  });

  it('strips raw amocrm and kommo domains', () => {
    const raw = 'Batafsil https://jonbranding.amocrm.ru/leads/detail/123456 ko\'ring';
    expect(sanitizePublicText(raw)).toBe("Batafsil  ko'ring");
  });

  it('strips call intelligence and phone numbers', () => {
    const raw = `
🎙 AI Qo'ng'iroq Tahlili (Call Intelligence)
━━━━━━━━━━━━━━━━━━━━
👤 Lid: [AmoCRM Lead #45365927](https://jonbranding.amocrm.ru/leads/detail/45365927)
📞 Telefon: 909166355
🧑‍💼 Menejer: @jonbranding_assistant
⏱ Davomiyligi: 0m 55s
🎭 Kayfiyat: Ijobiy | Toifa: Mijoz
⭐️ Sifat Bahosi: 81/100
    `.trim();

    expect(sanitizePublicText(raw)).toBe('');
  });

  it('preserves clean public brand storytelling text', () => {
    const clean = 'Premium parfyumeriya brendi uchun to\'liq vizual aydentika — atir flakonidan do\'kon vitrinasigacha yagona oltin uslub.';
    expect(sanitizePublicText(clean)).toBe(clean);
  });
});

describe('sanitizePortfolioProject', () => {
  it('cleans description and body if containing CRM leaks', () => {
    const project = {
      title: 'Arfadel',
      description: '👤 Lid: [AmoCRM Lead #45365927](https://jonbranding.amocrm.ru/leads/detail/45365927)',
      body: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: '🎙 AI Qo\'ng\'iroq Tahlili\n👤 Lid: #45365927' }]
        },
        {
          heading: 'Vazifa',
          paragraph: 'Bozorga chiqish'
        }
      ]
    };

    const sanitized = sanitizePortfolioProject(project);
    expect(sanitized.description).toBe('');
    expect(sanitized.body).toHaveLength(1);
    expect(sanitized.body?.[0].heading).toBe('Vazifa');
  });
});
