import type { Browser, Page, TestInfo } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'
import { test as base } from '@playwright/test'
import { loginAsAdmin, loginAsClient, loginAsCoach } from '../helpers/auth-helpers'
import { createNuxtGoto } from '../helpers/navigation-helpers'
import { LoginPage } from '../page-objects/login-page'

type AuthRole = 'admin' | 'client' | 'coach'

type NuxtGoto = ReturnType<typeof createNuxtGoto>

interface AuthFixtures {
  authenticatedClientPage: Page
  authenticatedCoachPage: Page
  authenticatedAdminPage: Page
}

const AUTH_DIR = path.join(process.cwd(), 'packages/layer-base/app/tests/.auth')

// Lazy evaluation to ensure env vars are loaded by global setup
function getBaseUrl(role: AuthRole): string {
  const baseUrl = role === 'admin'
    ? process.env.NUXT_PUBLIC_ADMIN_BASE
    : process.env.NUXT_PUBLIC_WEB_BASE

  if (!baseUrl) {
    const varName = role === 'admin' ? 'NUXT_PUBLIC_ADMIN_BASE' : 'NUXT_PUBLIC_WEB_BASE'
    throw new Error(`Missing required environment variable: ${varName} for ${role} role`)
  }

  return baseUrl
}

export function getAuthFilePath(role: AuthRole, workerIndex: number): string {
  return path.join(AUTH_DIR, `${role}-auth-${workerIndex}.json`)
}

export function cleanupAuthFile(role: AuthRole, workerIndex: number): void {
  const authPath = getAuthFilePath(role, workerIndex)
  try {
    fs.unlinkSync(authPath)
  }
  catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
  }
}

async function setupAuth(
  browser: Browser,
  role: AuthRole,
  loginFn: (goto: NuxtGoto, loginPage: LoginPage) => Promise<void>,
  workerIndex: number,
): Promise<void> {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true })
  }

  const authPath = getAuthFilePath(role, workerIndex)
  if (fs.existsSync(authPath))
    return

  const baseURL = getBaseUrl(role)
  const context = await browser.newContext({ baseURL })
  const page = await context.newPage()
  const loginPage = new LoginPage(page)

  const nuxtGoto = createNuxtGoto(page)

  try {
    await loginFn(nuxtGoto, loginPage)
    await context.storageState({ path: authPath })
  }
  finally {
    await page.close()
    await context.close()
  }
}

async function getAuthenticatedPage(browser: Browser, role: AuthRole, workerIndex: number) {
  const authPath = getAuthFilePath(role, workerIndex)

  try {
    const stats = fs.statSync(authPath)
    if (!stats.isFile()) {
      throw new Error(`Auth file is not a regular file: ${authPath}`)
    }

    const content = fs.readFileSync(authPath, 'utf-8')
    JSON.parse(content)
  }
  catch (err: unknown) {
    throw new Error(`Failed to read or parse auth file for ${role}: ${(err as Error).message}`)
  }

  const baseURL = getBaseUrl(role)
  const context = await browser.newContext({
    storageState: authPath,
    baseURL,
  })
  const page = await context.newPage()
  return { page, context }
}

const loginFunctions: Record<AuthRole, (goto: NuxtGoto, loginPage: LoginPage) => Promise<void>> = {
  admin: loginAsAdmin,
  client: loginAsClient,
  coach: loginAsCoach,
}

function createAuthFixture(role: AuthRole) {
  return async (
    { browser }: { browser: Browser },
    use: (page: Page) => Promise<void>,
    testInfo: TestInfo,
  ) => {
    await setupAuth(browser, role, loginFunctions[role], testInfo.workerIndex)
    const { page, context } = await getAuthenticatedPage(browser, role, testInfo.workerIndex)
    try {
      await use(page)
    }
    finally {
      await page.close()
      await context.close()
    }
  }
}

export const test = base.extend<AuthFixtures>({
  authenticatedClientPage: createAuthFixture('client'),
  authenticatedCoachPage: createAuthFixture('coach'),
  authenticatedAdminPage: createAuthFixture('admin'),
})

export { expect } from '@nuxt/test-utils/playwright'
