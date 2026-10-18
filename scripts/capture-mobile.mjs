import { chromium, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/temp_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  } catch {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  }
  const pixel7 = devices['Pixel 7'] || {
    viewport: { width: 412, height: 915 },
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  };

  const context = await browser.newContext({
    ...pixel7,
  });

  const page = await context.newPage();
  console.log('Navigating to https://www.jonbranding.uz/uz...');
  await page.goto('https://www.jonbranding.uz/uz', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('Capturing initial hero...');
  await page.screenshot({ path: path.join(outDir, '01_mobile_hero.png') });

  console.log('Waiting 6 seconds for client enhancements / popups...');
  await page.waitForTimeout(6500);
  await page.screenshot({ path: path.join(outDir, '02_mobile_with_enhancements.png') });

  console.log('Scrolling down to services and gallery...');
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, '03_mobile_scrolled.png') });

  console.log('Opening mobile menu...');
  const menuBtn = await page.$('button[aria-label="Menyuni ochish"], button[aria-label="Open menu"], header button');
  if (menuBtn) {
    await menuBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, '04_mobile_menu.png') });
  }

  await browser.close();
  console.log('Done! Screenshots saved to', outDir);
}

run().catch((err) => {
  console.error('Error capturing mobile screenshots:', err);
  process.exit(1);
});
