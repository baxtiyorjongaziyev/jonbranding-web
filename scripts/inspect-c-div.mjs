import { chromium, devices } from '@playwright/test';

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ ...devices['Pixel 7'] });
  await page.goto('https://www.jonbranding.uz/uz', { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  const html = await page.evaluate(() => {
    const el = document.querySelector('div[style*="--c"]');
    if (!el) return 'NOT FOUND';
    return {
      outer: el.outerHTML,
      shadow: el.shadowRoot ? el.shadowRoot.innerHTML : null
    };
  });
  console.log('HTML OF --c div:', JSON.stringify(html, null, 2));
  await browser.close();
}

run();
