// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests/',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.HEROKU_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    navigationTimeout: 30000, // Extra buffer for Heroku
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
