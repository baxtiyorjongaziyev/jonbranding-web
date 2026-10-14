import { chromium, devices } from '@playwright/test';
import path from 'path';

const outDir = path.resolve('public/temp_screenshots');

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  } catch {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  }

  const context = await browser.newContext({
    ...devices['Pixel 7'],
  });

  const page = await context.newPage();
  await page.goto('https://www.jonbranding.uz/uz', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Scroll 600px (hero card section)
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '04_hero_cards.png') });

  // 2. Scroll 1800px (services section)
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '05_services.png') });

  // 3. Scroll 3200px (portfolio / before-after)
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '06_portfolio.png') });

  // 4. Scroll 5000px (pricing)
  await page.evaluate(() => window.scrollTo(0, 5000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '07_pricing.png') });

  // 5. Open mobile menu directly via header hamburger
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const hamburger = await page.$('header button');
  if (hamburger) {
    await hamburger.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, '08_mobile_menu_open.png') });
  }

  await browser.close();
  console.log('Done capturing additional sections!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
