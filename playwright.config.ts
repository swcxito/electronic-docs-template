import { defineConfig } from '@playwright/test';
const [owner, name] = (process.env.GITHUB_REPOSITORY || 'swcxito/electronic-docs-template').split('/');
const base = process.env.BASE_PATH ?? (name === `${owner}.github.io` ? '/' : `/${name}`);
const baseURL = `http://127.0.0.1:4321${base.replace(/\/$/, '')}/`;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: { baseURL, browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 4321',
    // Let Playwright own the process even when Astro detects an agent environment.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
