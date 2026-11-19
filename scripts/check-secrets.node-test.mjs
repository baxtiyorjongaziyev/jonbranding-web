import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { scanText, shouldSkipFile } from './check-secrets.mjs';

describe('proactive secret scanner', () => {
  it('passes clean code and masks previews when secrets are found', () => {
    const clean = scanText("const apiUrl = 'https://www.jonbranding.uz/api/oisha';\nexport const ok = true;\n", 'src/clean.ts');
    assert.equal(clean.length, 0);

    const syntheticGemini = 'AIza' + 'Sy' + 'A'.repeat(33);
    const geminiFindings = scanText(`const k = "${syntheticGemini}";`, 'src/test.ts');
    assert.equal(geminiFindings.length, 1);
    assert.equal(geminiFindings[0].rule, 'Google/Gemini API key');
    assert.equal(geminiFindings[0].preview, 'AIzaSy...');
    assert.equal(geminiFindings[0].preview.includes(syntheticGemini), false);
  });

  it('detects Sanity, Telegram, AWS, GitHub, and PEM private key patterns', () => {
    const syntheticSanity = 'sk' + 'A'.repeat(80);
    const syntheticTelegram = '123456789:AA' + 'B'.repeat(31);
    const syntheticAws = 'AKIA' + 'IOSFODNN7EXAMPLE';
    const syntheticGh = 'ghp_' + 'C'.repeat(36);
    const syntheticPem = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ');

    const findings = scanText(
      [
        `SANITY=${syntheticSanity}`,
        `TG=${syntheticTelegram}`,
        `AWS=${syntheticAws}`,
        `GH=${syntheticGh}`,
        syntheticPem,
      ].join('\n'),
      'config.env',
    );

    assert.deepEqual(
      findings.map((f) => f.rule),
      [
        'Sanity API token',
        'Telegram Bot token',
        'AWS Access Key ID',
        'GitHub PAT',
        'Private key PEM block',
      ],
    );
  });

  it('skips binary assets and package-lock.json', () => {
    assert.equal(shouldSkipFile('public/images/hero.webp'), true);
    assert.equal(shouldSkipFile('package-lock.json'), true);
    assert.equal(shouldSkipFile('backups/latest.json.gz.enc'), true);
    assert.equal(shouldSkipFile('src/app/page.tsx'), false);
  });
});
