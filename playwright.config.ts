import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { defineConfig } from '@playwright/test'
import { config as loadDotenv } from 'dotenv'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

loadDotenv({
  path: resolve(rootDir, 'e2e/.env.test'),
  override: false,
})

const getBaseURL = (project: 'web' | 'admin') =>
  process.env[
    project === 'admin'
      ? 'NUXT_PUBLIC_ADMIN_BASE'
      : 'NUXT_PUBLIC_WEB_BASE'
  ] || ''

const headless = process.env.PLAYWRIGHT_HEADLESS !== 'false'

const projectConfigs = [
  { name: 'auth', dir: 'e2e/tests/auth', app: 'web' },
  { name: 'onboarding', dir: 'e2e/tests/onboarding', app: 'web' },
  { name: 'marketing', dir: 'e2e/tests/marketing', app: 'web' },
  { name: 'client', dir: 'e2e/tests/client', app: 'web' },
  { name: 'coach', dir: 'e2e/tests/coach', app: 'web' },
  { name: 'admin', dir: 'e2e/tests/admin', app: 'admin' },
  { name: 'workflows', dir: 'e2e/tests/workflows', app: 'web' },
]

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  maxFailures: process.env.CI ? 1 : undefined,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  reporter: 'list',

  globalSetup: resolve(rootDir, 'e2e/global-setup.ts'),
  globalTeardown: resolve(rootDir, 'e2e/global-teardown.ts'),

  use: {
    browserName: 'chromium',
    viewport: headless ? { width: 1920, height: 1080 } : null,
    launchOptions: headless
      ? { headless: true }
      : { headless: false, args: ['--start-maximized'] },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: projectConfigs.map(p => ({
    name: p.name,
    testDir: p.dir,
    use: {
      baseURL: getBaseURL(p.app === 'admin' ? 'admin' : 'web'),
    },
  })),
})
