#!/usr/bin/env node

/**
 * JonBranding Quality & Agent Verification Harness
 * 
 * Usage:
 *   node scripts/harness/verify.mjs
 *   npm run verify
 *   npm run harness
 * 
 * Options:
 *   --fast     Skip full typecheck, run i18n + code standards + unit tests
 *   --strict   Fail on any file exceeding 500 lines or warnings
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const isFast = process.argv.includes('--fast');
const isStrict = process.argv.includes('--strict');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function logStep(step, total, title) {
  console.log(`\n${colors.cyan}[${step}/${total}]${colors.reset} ${colors.bold}${title}${colors.reset}`);
}

function logSuccess(msg) {
  console.log(`  ${colors.green}✓${colors.reset} ${msg}`);
}

function logWarn(msg) {
  console.log(`  ${colors.yellow}⚠${colors.reset} ${msg}`);
}

function logFail(msg) {
  console.log(`  ${colors.red}✗${colors.reset} ${msg}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const fullCmd = args.length > 0 ? `${command} ${args.join(' ')}` : command;
    const child = spawn(fullCmd, {
      cwd: ROOT,
      shell: true,
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });

    let stdout = '';
    let stderr = '';

    if (options.silent) {
      child.stdout?.on('data', (d) => (stdout += d.toString()));
      child.stderr?.on('data', (d) => (stderr += d.toString()));
    }

    child.on('close', (code) => {
      const durationMs = Date.now() - startTime;
      resolve({ code: code ?? 0, durationMs, stdout, stderr });
    });
  });
}

// -------------------------------------------------------------
// 1. i18n Parity Check
// -------------------------------------------------------------
function checkI18nParity() {
  const localesDir = path.join(ROOT, 'src/locales');
  const locales = ['uz.json', 'ru.json', 'en.json', 'zh.json'];

  const loaded = {};
  for (const f of locales) {
    const filePath = path.join(localesDir, f);
    if (!fs.existsSync(filePath)) {
      return { ok: false, error: `Missing locale file: ${f}` };
    }
    try {
      loaded[f] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return { ok: false, error: `Invalid JSON in ${f}: ${e.message}` };
    }
  }

  function getFlatKeys(obj, prefix = '') {
    let keys = [];
    for (const [k, v] of Object.entries(obj)) {
      const full = prefix ? `${prefix}.${k}` : k;
      keys.push(full);
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        keys = keys.concat(getFlatKeys(v, full));
      }
    }
    return keys;
  }

  const baseFile = 'uz.json';
  const baseKeys = new Set(getFlatKeys(loaded[baseFile]));
  let hasMissing = false;
  const issues = [];

  for (const f of locales) {
    if (f === baseFile) continue;
    const currentKeys = new Set(getFlatKeys(loaded[f]));
    const missing = [...baseKeys].filter((k) => !currentKeys.has(k));
    const extra = [...currentKeys].filter((k) => !baseKeys.has(k));

    if (missing.length > 0) {
      hasMissing = true;
      issues.push(`${f} missing ${missing.length} keys (e.g. ${missing.slice(0, 3).join(', ')})`);
    }
    if (extra.length > 0) {
      issues.push(`${f} has ${extra.length} extra keys (e.g. ${extra.slice(0, 3).join(', ')})`);
    }
  }

  return {
    ok: !hasMissing,
    totalBaseKeys: baseKeys.size,
    issues,
  };
}

// -------------------------------------------------------------
// 2. Code Standards & Anti-Bloat Guard
// -------------------------------------------------------------
function checkCodeStandards() {
  const srcDir = path.join(ROOT, 'src');
  const oversized = [];
  const conflictMarkers = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
          walk(full);
        }
      } else if (entry.isFile() && /\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        const lines = content.split('\n').length;
        const rel = path.relative(ROOT, full);

        if (lines > 500) {
          oversized.push({ path: rel, lines });
        }

        if (content.includes('<<<<<<<') && content.includes('>>>>>>>')) {
          conflictMarkers.push(rel);
        }
      }
    }
  }

  walk(srcDir);
  return {
    ok: conflictMarkers.length === 0,
    conflictMarkers,
    oversized,
  };
}

// -------------------------------------------------------------
// Main Harness Pipeline
// -------------------------------------------------------------
async function runHarness() {
  const totalSteps = isFast ? 3 : 4;
  let currentStep = 1;
  const startAll = Date.now();

  console.log(`\n${colors.bold}${colors.magenta}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}   JONBRANDING-WEB QUALITY & AGENT HARNESS LOOP     ${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}====================================================${colors.reset}`);

  // Step 1: i18n Parity
  logStep(currentStep++, totalSteps, 'i18n Parity & Dictionary Integrity');
  const i18nResult = checkI18nParity();
  if (!i18nResult.ok) {
    logFail('i18n keys are missing across locales:');
    i18nResult.issues.forEach(logFail);
    process.exit(1);
  } else {
    logSuccess(`All 4 locales synchronized (${i18nResult.totalBaseKeys} keys each)`);
    if (i18nResult.issues.length > 0) {
      i18nResult.issues.forEach(logWarn);
    }
  }

  // Step 2: Code Standards & Conflict Guard
  logStep(currentStep++, totalSteps, 'Code Standards & Clean Architecture');
  const standards = checkCodeStandards();
  if (!standards.ok) {
    logFail('Merge conflict markers found in source:');
    standards.conflictMarkers.forEach((f) => logFail(`  ${f}`));
    process.exit(1);
  } else {
    logSuccess('Zero conflict markers found in src/');
  }

  if (standards.oversized.length > 0) {
    logWarn(`${standards.oversized.length} files exceed 500 lines (consider refactoring):`);
    standards.oversized.slice(0, 5).forEach((f) => {
      logWarn(`  ${f.path} (${f.lines} lines)`);
    });
    if (isStrict) {
      logFail('--strict mode active: oversized files rejected');
      process.exit(1);
    }
  }

  // Step 3: TypeScript Check (if not --fast)
  if (!isFast) {
    logStep(currentStep++, totalSteps, 'TypeScript Typecheck (tsc)');
    const tsc = await runCommand('npm', ['run', 'typecheck'], { silent: false });
    if (tsc.code !== 0) {
      logFail(`TypeScript check failed with code ${tsc.code}`);
      process.exit(1);
    }
    logSuccess(`Typecheck passed cleanly in ${(tsc.durationMs / 1000).toFixed(1)}s`);
  }

  // Step 4: Vitest Unit & Integration Suite
  logStep(currentStep++, totalSteps, 'Unit & Integration Tests (Vitest)');
  const testRun = await runCommand('npx', ['vitest', 'run'], { silent: false });
  if (testRun.code !== 0) {
    logFail(`Vitest test suite failed with code ${testRun.code}`);
    process.exit(1);
  }
  logSuccess(`Vitest suite passed in ${(testRun.durationMs / 1000).toFixed(1)}s`);

  const totalDuration = ((Date.now() - startAll) / 1000).toFixed(1);
  console.log(`\n${colors.green}${colors.bold}====================================================${colors.reset}`);
  console.log(`${colors.green}${colors.bold}  ✓ ALL HARNESS CHECKS PASSED (${totalDuration}s) — READY TO SHIP! ${colors.reset}`);
  console.log(`${colors.green}${colors.bold}====================================================${colors.reset}\n`);
}

runHarness().catch((err) => {
  console.error('\nHarness execution error:', err);
  process.exit(1);
});
