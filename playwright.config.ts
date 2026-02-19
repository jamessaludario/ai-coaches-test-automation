import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { defineConfig } from '@playwright/test'
import { config as loadDotenv } from 'dotenv'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

/**
 * Determine which project is being run based on CLI arguments
 */
function getRunningProject(): 'admin' | 'web' {
  const args = process.argv
  for (let i = 0; i < args.length; i++) {
    // Match --project=admin or --project admin
    if (args[i] === '--project' && args[i + 1]?.toLowerCase() === 'admin') {
      return 'admin'
    }
    if (args[i].startsWith('--project=') && args[i].toLowerCase().includes('=admin')) {
      return 'admin'
    }
  }
  return 'web'
}
// Load the appropriate env file once at config time
const runningProject = getRunningProject()
const envPath = runningProject === 'admin'
  ? resolve(rootDir, 'apps/admin/.env')
  : resolve(rootDir, 'apps/web/.env')

// Load the correct env and lock it
loadDotenv({ path: envPath, override: false })

// Prevent @nuxt/test-utils from loading wrong env by setting a marker
process.env.__PLAYWRIGHT_ENV_LOADED__ = runningProject

/**
 * Create Nuxt config per Playwright project
 */
function createNuxtConfig(project: 'web' | 'admin') {
  const baseURL = project === 'admin'
    ? process.env.NUXT_PUBLIC_ADMIN_BASE || ''
    : process.env.NUXT_PUBLIC_WEB_BASE || ''

  return {
    rootDir: resolve(rootDir, `apps/${project}`),
    server: false,
    build: false,
    loadDotenv: false, // CRITICAL: Prevent Nuxt from loading any .env files
    dotenv: false, // Extra safeguard
    // Set baseURL for test context
    ...(baseURL && { host: baseURL }),
  }
}

/**
 * Get base URL for Playwright project
 */
function getBaseURL(project: 'web' | 'admin'): string {
  const envar = project === 'admin' ? 'NUXT_PUBLIC_ADMIN_BASE' : 'NUXT_PUBLIC_WEB_BASE'
  const url = process.env[envar]
  if (!url) {
    console.warn(`Warning: ${envar} is not set. Test may fail.`)
  }
  return url || ''
}

const headless = process.env.PLAYWRIGHT_HEADLESS !== 'false'

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

  projects: [
    {
      name: 'web-client',
      testDir: './apps/web/tests/e2e/client',
      use: {
        baseURL: getBaseURL('web'),
        // @ts-expect-error - nuxt config extended by @nuxt/test-utils
        nuxt: createNuxtConfig('web'),
      },
    },
    {
      name: 'web-coach',
      testDir: './apps/web/tests/e2e/coach',
      use: {
        baseURL: getBaseURL('web'),
        // @ts-expect-error - nuxt config extended by @nuxt/test-utils
        nuxt: createNuxtConfig('web'),
      },
    },
    {
      name: 'web-marketing',
      testDir: './apps/web/tests/e2e/marketing',
      use: {
        baseURL: getBaseURL('web'),
        // @ts-expect-error - nuxt config extended by @nuxt/test-utils
        nuxt: createNuxtConfig('web'),
      },
    },
    {
      name: 'admin',
      testDir: './apps/admin/tests/e2e',
      use: {
        baseURL: getBaseURL('admin'),
        // @ts-expect-error - nuxt config extended by @nuxt/test-utils
        nuxt: createNuxtConfig('admin'),
      },
    },
    {
      name: 'lifecycles',
      testDir: './packages/layer-base/app/tests/lifecycles/workflows',
      use: {
        baseURL: getBaseURL('web'),
        // @ts-expect-error - nuxt config extended by @nuxt/test-utils
        nuxt: createNuxtConfig('web'),
      },
    },
  ],
})
