import { defineConfig } from 'vitest/config';

// Ildiz (sayt) vitest konfiguratsiyasidan mustaqil — faqat Node muhitida skript testlari.
export default defineConfig({
  test: { environment: 'node', include: ['scripts/**/*.test.ts'] },
});
