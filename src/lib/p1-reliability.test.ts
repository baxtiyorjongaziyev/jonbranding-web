import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string) {
  return readFileSync(join(root, relativePath), 'utf8');
}

describe('P1 reliability configuration', () => {
  it('keeps TypeScript build errors fatal in Next.js production builds', () => {
    const config = read('next.config.js');
    expect(config).not.toContain('ignoreBuildErrors: true');
  });

  it('runs Playwright Chromium tests in a separate CI job', () => {
    const workflow = read('.github/workflows/test.yml');
    const packageJson = JSON.parse(read('package.json'));
    const playwrightConfig = read('playwright.config.ts');

    expect(packageJson.scripts['test:e2e']).toBe('playwright test --project=chromium');
    expect(workflow).toContain('e2e:');
    expect(workflow).toContain('npx playwright install --with-deps chromium');
    expect(workflow).toContain('npm run test:e2e');
    expect(playwrightConfig).toContain('webServer:');
    expect(playwrightConfig).toContain("http://127.0.0.1:9002");
  });
});
