// @ts-check
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  timeout: 10 * 60 * 1000, // 10 minutes
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  // :white_check_mark: HTML + Allure reporter
  reporter: [
    ['html', { open: 'always' }],
    // ['allure-playwright']
  ],
  use: {
    headless: true,
    slowMo: 300,
    viewport: null,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});