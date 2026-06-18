#!/usr/bin/env node
/**
 * AI Portfolio Sync — jonbranding.uz portfolio loyihalarini
 * Telegram va Instagram postlaridan tahlil qilib,
 * Google Drive'dan rasmlarni yuklab, Sanity CMS ga joylashtiradi.
 *
 * Ishga tushirish:
 *   cd services/portfolio-bot && npm run workflow:once
 *   yoki
 *   cd services/portfolio-bot && npm run workflow:all    (doimiy kuzatish)
 *
 * Bu fayl faqat eski havola (legacy bridge) — yangi kod services/portfolio-bot/ da
 */

import { runWorkflow } from '../../services/portfolio-bot/src/workflow.js';
import { resolve } from 'path';
import { config } from 'dotenv';

// .env.local yuklash
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), 'services/portfolio-bot/.env') });

async function main() {
  console.log('=== AI Portfolio Sync (via services/portfolio-bot) ===');
  console.log('');

  await runWorkflow({
    telegramChannels: ['@JonBranding'],
    instagramAccounts: ['jonbranding'],
    instagramHashtags: ['#jonbranding', '#brandinguz', '#logodesignuz'],
    postsPerSource: 15,
    requireDriveLink: true,
    autoUpload: true,
    intervalMinutes: 60,
  });

  console.log('');
  console.log('=== Done ===');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});