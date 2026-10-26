/**
 * .env yuklash: CLI'lar birinchi bo'lib shu modulni import qiladi (sanity.ts va boshqalar process.env'ni import paytida o'qiydi).
 * Tartib: services/case-reels/.env, keyin repo ildizidagi .env. Shell'dan berilgan qiymatlar ustun turadi.
 */
import { existsSync } from 'node:fs';

for (const file of ['.env', '../../.env']) {
  if (existsSync(file)) process.loadEnvFile(file);
}
