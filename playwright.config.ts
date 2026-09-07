import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'

config()

const BASE_URL = 'http://127.0.0.1:4173/dieta-app'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
