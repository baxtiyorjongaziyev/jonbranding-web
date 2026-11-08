import { expect, test } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9002';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/testimonials**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ testimonials: [] }) })
  );
  await page.route('**/_next/image**', (route) => route.abort());
});

test('320px services stay inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`${baseUrl}/en`, { waitUntil: 'domcontentloaded' });
  const rows = page.locator('.service-row');
  await expect(rows).toHaveCount(3, { timeout: 15_000 });

  const layout = await page.evaluate(() => {
    const serviceRows = Array.from(document.querySelectorAll<HTMLElement>('.service-row'));
    return {
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      offenders: Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .filter((element) => !element.closest('.at-marquee-track, .client-logos-track'))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            element: `${element.tagName.toLowerCase()}.${element.className}`,
            left: rect.left,
            right: rect.right,
          };
        })
        .filter(({ left, right }) => left < -0.5 || right > document.documentElement.clientWidth + 0.5)
        .slice(0, 12),
      rows: serviceRows.map((row) => {
        const rect = row.getBoundingClientRect();
        return { left: rect.left, right: rect.right, scrollWidth: row.scrollWidth, clientWidth: row.clientWidth };
      }),
    };
  });

  expect(layout.pageWidth, JSON.stringify(layout.offenders, null, 2)).toBeLessThanOrEqual(layout.viewportWidth);
  for (const row of layout.rows) {
    expect(row.left).toBeGreaterThanOrEqual(0);
    expect(row.right).toBeLessThanOrEqual(layout.viewportWidth + 0.5);
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
  }
});

test('language routes expose one main landmark and one skip target', async ({ page }) => {
  for (const path of ['/', '/en', '/xizmatlar', '/en/xizmatlar']) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('#main-content')).toHaveCount(1);
  }
});

// Oisha vidjeti faqat uz/ru tillarini biladi, shuning uchun u faqat shu sahifalarda yuklanadi.
test('Russian hero CTA opens the Oisha callback form, not a second site form', async ({ page }) => {
  // Haqiqiy vidjet tashqi serverdan keladi; stub faqat saytdagi bog'lanishni tekshiradi.
  await page.route('https://oisha.jonbranding.uz/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `window.OishaCallback = { applyPhones() {} };
      document.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest('[data-oisha-callback]')) window.__oishaOpens = (window.__oishaOpens || 0) + 1;
      });`,
    })
  );
  await page.goto(`${baseUrl}/ru`, { waitUntil: 'domcontentloaded' });

  const script = page.locator('script[src="https://oisha.jonbranding.uz/api/callback-widget.js"]');
  await expect(script).toHaveCount(1, { timeout: 15_000 });
  await expect(script).toHaveAttribute('data-call-tracking', '1');
  await expect(script).toHaveAttribute('data-lang', 'ru');

  const trigger = page.getByTestId('hero-audit-trigger');
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await expect(trigger).toHaveAttribute('data-oisha-callback', '');
  await expect.poll(() => page.evaluate(() => typeof (window as any).OishaCallback)).toBe('object');
  await expect.poll(() => trigger.evaluate((element) => Object.keys(element).some((key) => key.startsWith('__reactProps')))).toBe(true);
  await trigger.click();

  await expect.poll(() => page.evaluate(() => (window as any).__oishaOpens || 0)).toBe(1);
  await page.waitForTimeout(1_000);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

// Inglizcha mehmonga ruscha vidjet emas, o'z tilidagi sayt formasi (konversiya auditi, K-3).
test('English hero CTA opens the site lead form in English, without the Oisha widget', async ({ page }) => {
  await page.route('https://oisha.jonbranding.uz/**', (route) => route.fulfill({ status: 404, body: '' }));
  await page.goto(`${baseUrl}/en`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('script[src*="oisha.jonbranding.uz/api/callback-widget.js"]')).toHaveCount(0);

  const trigger = page.getByTestId('hero-audit-trigger');
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => trigger.evaluate((element) => Object.keys(element).some((key) => key.startsWith('__reactProps')))).toBe(true);
  await trigger.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveCount(1);
  await expect(dialog).toHaveAccessibleName('Free 20-minute consultation');
  // LeadModal'da xizmat tanlovi dropdown emas, checkbox'lar (238d9bd). Vidjetsiz
  // ochilganda "maslahat kerak" tanlangan bo'lishi va CRM'ga aynan shu qiymat
  // ketishi kerak — mijozga tasodifiy xizmat belgilanib qolmasin.
  await expect(dialog.getByRole('checkbox', { name: 'Need advice', exact: true })).toBeChecked();
  for (const service of ['Naming', 'Logo', 'Patent', 'Packaging']) {
    await expect(dialog.getByRole('checkbox', { name: service, exact: true })).not.toBeChecked();
  }
  await expect(dialog.locator('#tariflar-service')).toHaveValue('Not sure — I need advice');
  await expect(page.getByRole('dialog', { name: /Free Brand Audit/i })).toHaveCount(0);
});

test('mobile quick actions keep a visible Oisha callback CTA after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/en`, { waitUntil: 'domcontentloaded' });
  const cta = page.locator('[data-mobile-quick-actions] [data-oisha-callback]');
  await expect(cta).toBeVisible({ timeout: 15_000 });
  await page.mouse.wheel(0, 2_500);
  await page.waitForTimeout(1_000);
  await expect(cta).toBeVisible();
});

test('Vimeo is click-to-load and the text fallback remains available', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('at_modal_auto_popup_v1', '1'));
  await page.goto(`${baseUrl}/en`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('iframe[src*="player.vimeo.com"]')).toHaveCount(0);
  const play = page.getByTestId('process-video-play');
  await expect.poll(() => play.evaluate((element) => Object.keys(element).some((key) => key.startsWith('__reactProps')))).toBe(true);
  await play.scrollIntoViewIfNeeded();
  await play.click();
  await expect(page.locator('iframe[src*="player.vimeo.com"][src*="dnt=1"]')).toHaveCount(1);
  await expect(page.getByTestId('process-video-fallback')).toBeVisible();
});
