#!/usr/bin/env node
/**
 * Jon Branding — Proactive Secret Scanner
 * ========================================
 * Repozitoriy fayllarida tasodifan qolib ketgan API kalitlar, tokenlar va
 * private key'larni commit/CI bosqichida bloklaydi.
 *
 * Ishga tushirish:
 *   node scripts/check-secrets.mjs           # Barcha kuzatilayotgan fayllar
 *   node scripts/check-secrets.mjs --staged  # Faqat staged (pre-commit) fayllar
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SECRET_PATTERNS = [
  { name: 'Sanity API token', regex: /\bsk[A-Za-z0-9]{80,}\b/g },
  { name: 'Google/Gemini API key', regex: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { name: 'Telegram Bot token', regex: /\b\d{8,10}:AA[A-Za-z0-9_-]{30,}\b/g },
  { name: 'AWS Access Key ID', regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { name: 'GitHub PAT', regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/g },
  { name: 'Private key PEM block', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
];

const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.gif',
  '.svg',
  '.mp4',
  '.mov',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.ico',
  '.pdf',
  '.gz',
  '.enc',
  '.zip',
]);

const SKIP_BASENAMES = new Set(['package-lock.json']);

export function shouldSkipFile(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const base = normalized.split('/').pop() || '';
  if (SKIP_BASENAMES.has(base)) return true;
  if (normalized.endsWith('.json.gz.enc')) return true;
  const ext = extname(base).toLowerCase();
  return SKIP_EXTENSIONS.has(ext);
}

export function scanText(text, filePath = '<memory>') {
  if (!text || text.includes('\u0000')) return [];
  const findings = [];
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of SECRET_PATTERNS) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        findings.push({
          file: filePath,
          line: i + 1,
          rule: rule.name,
          preview: `${match[0].slice(0, 6)}...`,
        });
      }
    }
  }
  return findings;
}

function getTargetFiles(stagedOnly) {
  const args = stagedOnly
    ? ['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR']
    : ['ls-files', '-z'];
  const stdout = execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return stdout.split('\0').filter(Boolean);
}

export function runSecretScan(argv = process.argv.slice(2)) {
  const stagedOnly = argv.includes('--staged');
  const files = getTargetFiles(stagedOnly);
  const allFindings = [];
  let scannedCount = 0;

  for (const file of files) {
    if (shouldSkipFile(file) || !existsSync(file)) continue;
    scannedCount++;
    const content = readFileSync(file, 'utf8');
    const findings = scanText(content, file);
    allFindings.push(...findings);
  }

  if (allFindings.length > 0) {
    console.error(`\n❌ ${allFindings.length} ta ehtimoliy maxfiy kalit (secret) aniqlandi:\n`);
    for (const f of allFindings) {
      console.error(`  - ${f.file}:${f.line} [${f.rule}] (${f.preview})`);
    }
    console.error("\nKalitlarni kodga yozmang — .env / GitHub Secrets / Wrangler secrets ishlating.\n");
    return 1;
  }

  console.log(`✓ Secret scanner: ${scannedCount} ta fayl tekshirildi (${stagedOnly ? 'staged' : 'tracked'}), 0 ta sizish.`);
  return 0;
}

const isDirectExecution =
  Boolean(process.argv[1]) && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  process.exit(runSecretScan());
}
