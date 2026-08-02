import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
] as const;

for (const viewport of viewports) {
  test(`homepage renders through the full scroll on ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/uz', { waitUntil: 'domcontentloaded' });

    await page.evaluate(async () => {
      const step = Math.max(320, Math.floor(window.innerHeight * 0.75));
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 60));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    await expect(page.locator('#xizmat')).toBeVisible();
    await expect(page.locator('#process')).toBeVisible();
    await expect(page.locator('#savol')).toBeVisible();

    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      visibleText: document.body.innerText.trim().length,
    }));

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
    expect(layout.visibleText).toBeGreaterThan(1_000);

    await page.screenshot({
      path: testInfo.outputPath(`homepage-${viewport.name}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  });
}

test('homepage remains usable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/uz', { waitUntil: 'domcontentloaded' });

  const services = page.locator('#xizmat .service-row');
  await expect(services.first()).toBeVisible();
  await expect(services).toHaveCount(6);
});
