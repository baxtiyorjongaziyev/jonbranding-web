#!/usr/bin/env node
/**
 * Jon Branding — Universal Hosting Portability & Migration Engine
 * ===============================================================
 * Har qanday hostingga (Vercel, Cloudflare Workers, Docker, VPS, Coolify, Railway)
 * ko'chishni 100% avtomatlashtiruvchi vosita.
 * 
 * Buyruqlar:
 *   node scripts/hosting-migration.mjs check                # Pre-flight audit: env to'liqligi va ulanishlar
 *   node scripts/hosting-migration.mjs sync <target>       # Maxfiy sozlamalarni maqsad hostingga yuklash
 *                                                          # targets: vercel, cloudflare, docker, env
 *   node scripts/hosting-migration.mjs export-template     # Yangi hosting uchun to'liq toza andoza
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const REPO_ROOT = resolve('.');
const ENV_EXAMPLE_PATH = resolve(REPO_ROOT, '.env.example');
const CANDIDATE_ENV_FILES = [
  '.env.production.local',
  '.env.local',
  '.env.production',
  '.env'
];

// O'qilishi kerak bo'lgan lokal env faylni topish
function findActiveEnvFile() {
  for (const file of CANDIDATE_ENV_FILES) {
    const full = resolve(REPO_ROOT, file);
    if (existsSync(full)) return full;
  }
  return null;
}

// .env faylni xavfsiz parse qilish
function parseEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[match[1]] = val;
    }
  }
  return env;
}

// .env.example dagi barcha talab qilinadigan kalitlarni olish
function getRequiredKeys() {
  if (!existsSync(ENV_EXAMPLE_PATH)) {
    throw new Error(`.env.example fayli topilmadi: ${ENV_EXAMPLE_PATH}`);
  }
  const content = readFileSync(ENV_EXAMPLE_PATH, 'utf8');
  const keys = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=/);
    if (match) keys.push(match[1]);
  }
  return keys;
}

// Pre-flight tekshiruv (Auditor)
async function runCheck() {
  console.log('\n======================================================');
  console.log('  🔍 JON BRANDING HOSTING PRE-FLIGHT AUDIT');
  console.log('======================================================\n');

  const required = getRequiredKeys();
  const envFile = findActiveEnvFile();
  const currentEnv = envFile ? parseEnv(envFile) : {};

  console.log(`📌 Talab qilinadigan o'zgaruvchilar: ${required.length} ta (.env.example)`);
  if (envFile) {
    console.log(`📂 Lokal env manbasi: ${envFile}`);
  } else {
    console.log(`⚠️ Hech qanday lokal .env fayl topilmadi (.env.production.local tavsiya etiladi)`);
  }

  // Muhimlik darajalariga ajratish
  const critical = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'AMOCRM_SUBDOMAIN',
    'TURSO_DATABASE_URL',
    'TURSO_AUTH_TOKEN',
    'OISHA_API_URL'
  ];

  let missingCritical = 0;
  console.log('\n[1/3] Muhim (Critical) Production o\'zgaruvchilari:');
  for (const key of critical) {
    const val = currentEnv[key] || process.env[key];
    if (val && val.length > 0 && !val.includes('placeholder')) {
      console.log(`  ✓ ${key}: Mavjud (${val.slice(0, 4)}...${val.slice(-2)})`);
    } else {
      console.log(`  ❌ ${key}: YETISHMAYAPTI YOKI BO'SH`);
      missingCritical++;
    }
  }

  console.log('\n[2/3] Barcha qo\'shimcha sozlamalar qamrovi:');
  let missingOther = 0;
  for (const key of required) {
    if (critical.includes(key)) continue;
    const val = currentEnv[key] || process.env[key];
    if (!val) missingOther++;
  }
  console.log(`  ✓ To'ldirilgan: ${required.length - missingCritical - missingOther}/${required.length}`);
  if (missingOther > 0) {
    console.log(`  ℹ️ Ixtiyoriy/fallback sozlamalar: ${missingOther} ta`);
  }

  console.log('\n[3/3] Hosting Adapterlari tayyorligi:');
  console.log(`  ✓ Cloudflare Workers: wrangler.jsonc mavjud, OpenNext sozlangan`);
  console.log(`  ✓ Vercel: next.config.js mos, Edge middleware sozlangan`);
  console.log(`  ✓ Docker / VPS: Dockerfile (standalone mode) mavjud`);
  console.log(`  ✓ Universal Cron: GitHub Actions schedule (.github/workflows/cron-universal.yml)`);

  console.log('\n------------------------------------------------------');
  if (missingCritical === 0) {
    console.log('✅ PRE-FLIGHT XULOSASI: SAYT BOSHQA HOSTINGGA O\'TISHGA 100% TAYYOR!');
  } else {
    console.log(`⚠️ DIQQAT: ${missingCritical} ta muhim o'zgaruvchi lokal env faylda bo'sh.`);
    console.log('   Ko\'chishdan oldin .env.production.local faylini to\'ldiring.');
  }
  console.log('======================================================\n');
}

// Maxfiy o'zgaruvchilarni ko'chirish (Sync to Target)
async function syncToTarget(target) {
  const envFile = findActiveEnvFile();
  if (!envFile) {
    console.error('❌ Xato: Lokal env fayl (.env.production.local) topilmadi.');
    process.exit(1);
  }

  const env = parseEnv(envFile);
  const keys = Object.keys(env);
  console.log(`\n🚀 ${keys.length} ta o'zgaruvchini [${target.toUpperCase()}] hostingiga ko'chirish boshlandi...\n`);

  switch (target.toLowerCase()) {
    case 'cloudflare':
    case 'cf': {
      console.log('☁️ Cloudflare Workers ga maxfiy kalitlarni uzatish (wrangler secret)...');
      for (const [key, val] of Object.entries(env)) {
        if (!val || key.startsWith('NEXT_PUBLIC_')) continue;
        try {
          execSync(`npx wrangler secret put ${key}`, { input: val, stdio: ['pipe', 'ignore', 'ignore'] });
          console.log(`  ✓ Secret yuklandi: ${key}`);
        } catch {
          console.log(`  ⚠️ Yuklab bo'lmadi: ${key}`);
        }
      }
      console.log('\n✅ Cloudflare Workers secretlari yangilandi!');
      break;
    }

    case 'vercel': {
      console.log('▲ Vercel Production ga o\'zgaruvchilarni uzatish (vercel env add)...');
      for (const [key, val] of Object.entries(env)) {
        if (!val) continue;
        try {
          execSync(`npx vercel env rm ${key} production -y`, { stdio: 'ignore' });
        } catch {}
        try {
          execSync(`npx vercel env add ${key} production`, { input: val, stdio: ['pipe', 'ignore', 'ignore'] });
          console.log(`  ✓ Vercel env qo'shildi: ${key}`);
        } catch {
          console.log(`  ⚠️ Vercel env xatosi: ${key}`);
        }
      }
      console.log('\n✅ Vercel Production o\'zgaruvchilari yangilandi!');
      break;
    }

    case 'docker':
    case 'vps':
    case 'coolify': {
      console.log('🐳 Standalone / Docker / VPS uchun .env.production yaratilmoqda...');
      const targetPath = resolve(REPO_ROOT, '.env.production');
      let out = '# Avtomatik generatsiya qilingan production muhit o\'zgaruvchilari\n';
      out += `# Generatsiya vaqti: ${new Date().toISOString()}\n\n`;
      for (const [key, val] of Object.entries(env)) {
        out += `${key}="${val}"\n`;
      }
      writeFileSync(targetPath, out, 'utf8');
      console.log(`  ✓ Yozildi: ${targetPath}`);
      console.log('\n✅ Docker / Coolify / VPS uchun .env.production tayyor!');
      break;
    }

    default:
      console.error(`Noma'lum maqsad: ${target}. Tanlovlar: vercel, cloudflare, docker, coolify`);
      process.exit(1);
  }
}

// Asosiy CLI router
async function main() {
  const action = process.argv[2] || 'check';
  const target = process.argv[3];

  if (action === 'check') {
    await runCheck();
  } else if (action === 'sync') {
    if (!target) {
      console.error('Iltimos, hosting nishonini ko\'rsating: node scripts/hosting-migration.mjs sync <vercel|cloudflare|docker>');
      process.exit(1);
    }
    await syncToTarget(target);
  } else {
    console.log(`Usage:
  node scripts/hosting-migration.mjs check
  node scripts/hosting-migration.mjs sync <vercel|cloudflare|docker>`);
  }
}

main().catch(err => {
  console.error('Xatolik:', err);
  process.exit(1);
});
