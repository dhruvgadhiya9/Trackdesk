import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3100';
const local = !process.env.E2E_BASE_URL;

/**
 * Local/CI: runs the app in mock mode (no backend needed). Nightly: E2E_BASE_URL=<staging> runs
 * the same specs against a real environment (tests tagged @mock-only are skipped there).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    {
      name: 'desktop-1280',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  grepInvert: local ? undefined : /@mock-only/,
  webServer: local
    ? {
        command: 'pnpm exec next dev -p 3100',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: { NEXT_PUBLIC_API_MOCKS: '1' },
      }
    : undefined,
});
