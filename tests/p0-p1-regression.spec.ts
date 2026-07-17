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
  await expect(rows).toHaveCount(6, { timeout: 15_000 });

  const layout = await page.evaluate(() => {
    const serviceRows = Array.from(document.querySelectorAll<HTMLElement>('.service-row'));
    return {
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      offenders: Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .filter((element) => !element.closest('.at-marquee-track'))
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

test('English modal traps focus, closes on Escape, and restores focus', async ({ page }) => {
  await page.goto(`${baseUrl}/en`, { waitUntil: 'domcontentloaded' });
  const trigger = page.getByTestId('hero-audit-trigger');
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => trigger.evaluate((element) => Object.keys(element).some((key) => key.startsWith('__reactProps')))).toBe(true);
  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: /Free Brand Audit/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Next step/i })).toBeVisible();
  await expect(dialog.getByText('Keyingi qadam')).toHaveCount(0);
  await expect(page.getByLabel(/Phone number/i)).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
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
