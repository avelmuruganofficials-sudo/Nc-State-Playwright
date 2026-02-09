// @ts-check
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  timeout: 20 * 60 * 1000, // 20 minutes
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  // :white_check_mark: HTML + Allure reporter
  reporter: [
   ['html'],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
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