#!/usr/bin/env node
/**
 * Jon Branding — Automated Encrypted Off-site Backup Runner
 * =========================================================
 * Eksport qiladi:
 *   1. Sanity CMS production dataset (barcha loyihalar, keyslar, blog, postlar)
 *   2. Turso Database (leads, affiliates, referrals — maxfiy tokenlarsiz, AES-256-GCM shifrlangan)
 *
 * Ishga tushirish:
 *   node scripts/backup-offsite.mjs
 *   node scripts/backup-offsite.mjs --ci-public-safe
 *   node scripts/backup-offsite.mjs --decrypt <file.json.gz.enc> [output.json.gz]
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
} from 'node:crypto';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const BACKUP_DIR = resolve('.', 'backups');
const MAGIC_HEADER = Buffer.from('JBBAK1', 'ascii');
const SALT_BYTES = 16;
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;
const MIN_KEY_LENGTH = 16;

export const EXCLUDED_TURSO_TABLES = new Set(['oauth_tokens', 'rate_limits']);

export function shouldExportTurso({ ciPublicSafe, hasTursoCreds, hasEncryptionKey }) {
  if (!hasTursoCreds) return false;
  if (ciPublicSafe && !hasEncryptionKey) return false;
  return true;
}

export function encryptBuffer(plainBuf, passphrase) {
  if (typeof passphrase !== 'string' || passphrase.length < MIN_KEY_LENGTH) {
    throw new Error(`BACKUP_ENCRYPTION_KEY kamida ${MIN_KEY_LENGTH} ta belgidan iborat bo'lishi shart.`);
  }
  const salt = randomBytes(SALT_BYTES);
  const iv = randomBytes(IV_BYTES);
  const key = scryptSync(passphrase, salt, 32);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plainBuf), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([MAGIC_HEADER, salt, iv, authTag, ciphertext]);
}

export function decryptBuffer(encBuf, passphrase) {
  if (typeof passphrase !== 'string' || passphrase.length < MIN_KEY_LENGTH) {
    throw new Error(`BACKUP_ENCRYPTION_KEY kamida ${MIN_KEY_LENGTH} ta belgidan iborat bo'lishi shart.`);
  }
  const minLength = MAGIC_HEADER.length + SALT_BYTES + IV_BYTES + AUTH_TAG_BYTES;
  if (!Buffer.isBuffer(encBuf) || encBuf.length < minLength) {
    throw new Error('Shifrlangan zaxira fayli shikastlangan yoki formati noto‘g‘ri.');
  }
  const header = encBuf.subarray(0, MAGIC_HEADER.length);
  if (!header.equals(MAGIC_HEADER)) {
    throw new Error('Noma’lum zaxira fayl formati (JBBAK1 sarlavhasi topilmadi).');
  }
  let offset = MAGIC_HEADER.length;
  const salt = encBuf.subarray(offset, (offset += SALT_BYTES));
  const iv = encBuf.subarray(offset, (offset += IV_BYTES));
  const authTag = encBuf.subarray(offset, (offset += AUTH_TAG_BYTES));
  const ciphertext = encBuf.subarray(offset);

  const key = scryptSync(passphrase, salt, 32);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

async function exportSanity() {
  console.log("📦 [1/2] Sanity CMS ma'lumotlarini eksport qilish...");
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-04-14/data/export/${SANITY_DATASET}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) {
    throw new Error(`Sanity export xatosi: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  const lines = text.trim().split('\n').filter(Boolean);
  console.log(`  ✓ Sanity: ${lines.length} ta hujjat yuklandi (${(text.length / 1024).toFixed(1)} KB)`);
  return {
    documentsCount: lines.length,
    rawNdjson: text,
  };
}

async function exportTurso() {
  console.log("🗄️ [2/2] Turso ma'lumotlar bazasini eksport qilish...");
  const dbUrl = (process.env.TURSO_DATABASE_URL || '').trim();
  const authToken = (process.env.TURSO_AUTH_TOKEN || '').trim();

  const { createClient } = await import('@libsql/client/web');
  const normalizedUrl = dbUrl.startsWith('libsql://')
    ? 'https://' + dbUrl.slice('libsql://'.length)
    : dbUrl;

  const client = createClient({ url: normalizedUrl, authToken });
  const tablesRes = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
  );
  const tableNames = tablesRes.rows
    .map((r) => String(r.name))
    .filter((name) => !EXCLUDED_TURSO_TABLES.has(name));

  const dbDump = {};
  for (const table of tableNames) {
    const safeIdentifier = `"${table.replace(/"/g, '""')}"`;
    const dataRes = await client.execute(`SELECT * FROM ${safeIdentifier};`);
    dbDump[table] = dataRes.rows;
    console.log(`  ✓ Jadval '${table}': ${dataRes.rows.length} ta qator`);
  }

  return {
    tables: tableNames,
    excludedTables: [...EXCLUDED_TURSO_TABLES],
    data: dbDump,
  };
}

function runDecryptCli(args) {
  const decryptIdx = args.indexOf('--decrypt');
  const inputPath = args[decryptIdx + 1];
  if (!inputPath) {
    throw new Error("Foydalanish: node scripts/backup-offsite.mjs --decrypt <file.json.gz.enc> [output.json.gz]");
  }
  const passphrase = (process.env.BACKUP_ENCRYPTION_KEY || '').trim();
  if (!passphrase) {
    throw new Error('BACKUP_ENCRYPTION_KEY muhit o‘zgaruvchisi talab qilinadi.');
  }
  const resolvedInput = resolve(inputPath);
  const defaultOut = resolvedInput.endsWith('.enc')
    ? resolvedInput.slice(0, -4)
    : `${resolvedInput}.json.gz`;
  const resolvedOutput = resolve(args[decryptIdx + 2] || defaultOut);

  const encrypted = readFileSync(resolvedInput);
  const decrypted = decryptBuffer(encrypted, passphrase);
  writeFileSync(resolvedOutput, decrypted);
  console.log(`🔓 Deshifrlangan zaxira saqlandi: ${resolvedOutput} (${decrypted.length} bayt)`);
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('--decrypt')) {
    runDecryptCli(argv);
    return;
  }

  const ciPublicSafe = argv.includes('--ci-public-safe');
  const rawEncryptionKey = (process.env.BACKUP_ENCRYPTION_KEY || '').trim();
  if (rawEncryptionKey.length > 0 && rawEncryptionKey.length < MIN_KEY_LENGTH) {
    throw new Error(`BACKUP_ENCRYPTION_KEY kamida ${MIN_KEY_LENGTH} ta belgidan iborat bo'lishi shart.`);
  }
  const hasEncryptionKey = rawEncryptionKey.length >= MIN_KEY_LENGTH;
  const dbUrl = (process.env.TURSO_DATABASE_URL || '').trim();
  const authToken = (process.env.TURSO_AUTH_TOKEN || '').trim();
  const hasTursoCreds = Boolean(dbUrl && authToken);
  const allowTurso = shouldExportTurso({ ciPublicSafe, hasTursoCreds, hasEncryptionKey });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  console.log('\n======================================================');
  console.log(`  🛡️ JON BRANDING OFFSITE BACKUP (${new Date().toISOString()})`);
  console.log('======================================================\n');

  const sanityData = await exportSanity();
  let tursoData = null;

  if (allowTurso) {
    tursoData = await exportTurso();
  } else if (ciPublicSafe && !hasEncryptionKey) {
    console.log(
      "🗄️ [2/2] BACKUP_ENCRYPTION_KEY sozlanmagan (public-safe rejim): Turso DB zaxirasi xavfsizlik sababli o'tkazib yuborildi. Faqat Sanity CMS eksport qilinadi.",
    );
  } else {
    console.log("🗄️ [2/2] TURSO_DATABASE_URL yoki TURSO_AUTH_TOKEN topilmadi — DB zaxirasi o'tkazib yuborildi.");
  }

  const backupPayload = {
    metadata: {
      timestamp: new Date().toISOString(),
      sanityProject: SANITY_PROJECT_ID,
      sanityDataset: SANITY_DATASET,
      sanityDocsCount: sanityData.documentsCount,
      tursoTablesCount: tursoData?.tables ? tursoData.tables.length : 0,
      encrypted: hasEncryptionKey,
    },
    sanity: sanityData.rawNdjson,
    turso: tursoData,
  };

  const jsonBuffer = Buffer.from(JSON.stringify(backupPayload, null, 2), 'utf8');
  const gzippedBuffer = gzipSync(jsonBuffer);

  let fileName;
  let finalBuffer;
  if (hasEncryptionKey) {
    fileName = `backup-${timestamp}.json.gz.enc`;
    finalBuffer = encryptBuffer(gzippedBuffer, rawEncryptionKey);
  } else if (ciPublicSafe) {
    fileName = `backup-${timestamp}-sanity-public.json.gz`;
    finalBuffer = gzippedBuffer;
  } else {
    fileName = `backup-${timestamp}.json.gz`;
    finalBuffer = gzippedBuffer;
  }

  const outPath = resolve(BACKUP_DIR, fileName);
  writeFileSync(outPath, finalBuffer);

  const sha256 = createHash('sha256').update(finalBuffer).digest('hex');
  const latestMeta = {
    lastBackup: new Date().toISOString(),
    file: fileName,
    encrypted: hasEncryptionKey,
    publicSafeSanityOnly: ciPublicSafe && !hasEncryptionKey,
    sha256,
    compressedBytes: finalBuffer.length,
    uncompressedKb: (jsonBuffer.length / 1024).toFixed(1),
    sanityDocs: sanityData.documentsCount,
    tursoTables: tursoData?.tables?.length || 0,
  };
  writeFileSync(resolve(BACKUP_DIR, 'latest.json'), JSON.stringify(latestMeta, null, 2), 'utf8');

  console.log('\n------------------------------------------------------');
  console.log('✅ Zaxira muvaffaqiyatli yaratildi:');
  console.log(`   📂 ${outPath}`);
  console.log(`   🔐 Shifrlangan (AES-256-GCM): ${hasEncryptionKey ? 'HA' : 'YO‘Q (faqat Sanity CMS)'}`);
  console.log(`   🔒 SHA-256: ${sha256}`);
  console.log(`   📊 Hajmi: ${(finalBuffer.length / 1024).toFixed(1)} KB | Sanity: ${latestMeta.sanityDocs} | Turso jadval: ${latestMeta.tursoTables}`);
  if (ciPublicSafe && !hasEncryptionKey) {
    console.log("   ℹ️ Eslatma: Turso DB ni ham shifrlangan zaxiraga qo'shish uchun GitHub Secrets ga BACKUP_ENCRYPTION_KEY, TURSO_DATABASE_URL va TURSO_AUTH_TOKEN kiriting.");
  }
  console.log('======================================================\n');
}

const isDirectExecution =
  Boolean(process.argv[1]) && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  main().catch((err) => {
    console.error('Fatal backup error:', err.message || err);
    process.exit(1);
  });
}
