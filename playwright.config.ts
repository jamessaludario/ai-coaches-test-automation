import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { defineConfig } from '@playwright/test'
import { config as loadDotenv } from 'dotenv'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

// -------------------------------------
// Detect running project (simplified)
// -------------------------------------
const projectArg =
  process.argv.find(a => a.startsWith('--project='))?.split('=')[1] ||
  process.argv[process.argv.indexOf('--project') + 1]

const runningProject =
  projectArg === 'admin' || projectArg === 'lifecycles'
    ? projectArg
    : 'web'

// -------------------------------------
// Load correct env once
// -------------------------------------
loadDotenv({
  path: resolve(rootDir, `apps/${runningProject}/.env`),
  override: false,
})

process.env.__PLAYWRIGHT_ENV_LOADED__ = runningProject

// -------------------------------------
// Shared helpers
// -------------------------------------
const getBaseURL = (project: 'web' | 'admin') =>
  process.env[
  project === 'admin'
    ? 'NUXT_PUBLIC_ADMIN_BASE'
    : 'NUXT_PUBLIC_WEB_BASE'
  ] || ''

const createNuxtConfig = (project: 'web' | 'admin' | 'lifecycles') => ({
  rootDir: resolve(rootDir, `apps/${project}`),
  server: false,
  build: false,
  loadDotenv: false,
  dotenv: false,
  ...(getBaseURL(project === 'admin' ? 'admin' : 'web') && {
    host: getBaseURL(project === 'admin' ? 'admin' : 'web'),
  }),
})

const headless = process.env.PLAYWRIGHT_HEADLESS !== 'false'

// -------------------------------------
// Project definitions (no repetition)
// -------------------------------------
const projectConfigs = [
  { name: 'web-client', dir: 'apps/web/tests/e2e/client', app: 'web' },
  { name: 'web-coach', dir: 'apps/web/tests/e2e/coach', app: 'web' },
  { name: 'web-marketing', dir: 'apps/web/tests/e2e/marketing', app: 'web' },
  { name: 'admin', dir: 'apps/admin/tests/e2e', app: 'admin' },
  {
    name: 'lifecycles',
    dir: 'packages/layer-base/app/tests/lifecycles/workflows',
    app: 'lifecycles',
  },
]

// -------------------------------------
// Final config
// -------------------------------------
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  maxFailures: process.env.CI ? 1 : undefined,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  reporter: 'list',

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
      // @ts-expect-error
      nuxt: createNuxtConfig(p.app),
    },
  })),
})