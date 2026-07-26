import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:9002';

test('JonBranding homepage has correct brand title and main elements', async ({ page }) => {
  await page.goto(`${baseUrl}/uz`);

  await expect(page).toHaveTitle(/Jon\.?Branding/i);

  const briefButton = page.locator('a:has-text("Brief"), button:has-text("Aloqa"), a:has-text("brief")').first();
  await expect(briefButton).toBeVisible();
});

test('JonBranding services page or services content is accessible', async ({ page }) => {
  await page.goto(`${baseUrl}/uz`);

  const servicesLink = page.locator('a:has-text("Xizmatlar"), a:has-text("xizmatlar")').first();
  await expect(servicesLink).toBeVisible();
});
