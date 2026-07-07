import { test, expect } from '@playwright/test';

test('JonBranding homepage has correct brand title and main elements', async ({ page }) => {
  // Bosh sahifani o'zbek tilida yuklash
  await page.goto('https://www.jonbranding.uz/uz');

  // Title tarkibida "Jon.Branding" borligini tekshirish
  await expect(page).toHaveTitle(/Jon\.?Branding/i);

  // Aloqa yoki Brief (onlayn-brief) tugmalari borligini tekshirish
  const briefButton = page.locator('a:has-text("Brief"), button:has-text("Aloqa"), a:has-text("brief")').first();
  await expect(briefButton).toBeVisible();
});

test('JonBranding services page or services content is accessible', async ({ page }) => {
  await page.goto('https://www.jonbranding.uz/uz');

  // Sahifadagi menyu havolasidan "Xizmatlar"ni topish
  const servicesLink = page.locator('a:has-text("Xizmatlar"), a:has-text("xizmatlar")').first();
  await expect(servicesLink).toBeVisible();
});


