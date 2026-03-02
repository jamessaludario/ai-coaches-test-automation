import type { Browser, Page, TestInfo } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'
import { test as base } from '@playwright/test'
import { loginAsAdmin, loginAsClient, loginAsCoach } from '../helpers/auth.helper'
import { createNuxtGoto } from '../helpers/navigation.helper'
import { LoginPage } from '../page-objects/auth/login.page'

type AuthRole = 'admin' | 'client' | 'coach'

interface AuthFixtures {
  authenticatedClientPage: Page
  authenticatedCoachPage: Page
  authenticatedAdminPage: Page
}

const AUTH_DIR = path.join(process.cwd(), 'e2e/.auth')

function getBaseUrl(role: AuthRole): string {
  const baseUrl = role === 'admin'
    ? process.env.NUXT_PUBLIC_ADMIN_BASE
    : process.env.NUXT_PUBLIC_WEB_BASE

  if (!baseUrl) {
    const varName = role === 'admin' ? 'NUXT_PUBLIC_ADMIN_BASE' : 'NUXT_PUBLIC_WEB_BASE'
    throw new Error(`[Auth Fixture] Missing required environment variable: ${varName} for "${role}" role.`)
  }

  return baseUrl
}

export function getAuthFilePath(role: AuthRole, workerIndex: number): string {
  return path.join(AUTH_DIR, `${role}-auth-${workerIndex}.json`)
}

export function cleanupAuthFile(role: AuthRole, workerIndex: number): void {
  const authPath = getAuthFilePath(role, workerIndex)
  if (fs.existsSync(authPath)) {
    try {
      fs.unlinkSync(authPath)
    }
    catch (err: unknown) {
      console.warn(`[Auth Fixture] Failed to delete auth file ${authPath}:`, err)
    }
  }
}

async function ensureAuthenticated(
  browser: Browser,
  role: AuthRole,
  workerIndex: number,
): Promise<string> {
  const authPath = getAuthFilePath(role, workerIndex)

  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true })
  }

  if (fs.existsSync(authPath)) {
    try {
      const content = fs.readFileSync(authPath, 'utf-8')
      JSON.parse(content)
      return authPath
    }
    catch {
      console.warn(`[Auth Fixture] Invalid auth file found for ${role}, re-authenticating...`)
      cleanupAuthFile(role, workerIndex)
    }
  }

  const baseURL = getBaseUrl(role)
  const context = await browser.newContext({ baseURL })
  const page = await context.newPage()
  const loginPage = new LoginPage(page)
  const nuxtGoto = createNuxtGoto(page)

  const loginFn = role === 'admin' ? loginAsAdmin : (role === 'client' ? loginAsClient : loginAsCoach)

  try {
    await loginFn(nuxtGoto, loginPage)
    await context.storageState({ path: authPath })
    return authPath
  }
  catch (err: unknown) {
    throw new Error(`[Auth Fixture] Authentication failed for role "${role}": ${(err as Error).message}`)
  }
  finally {
    await page.close()
    await context.close()
  }
}

function createAuthFixture(role: AuthRole) {
  return async (
    { browser }: { browser: Browser },
    use: (page: Page) => Promise<void>,
    testInfo: TestInfo,
  ) => {
    const authPath = await ensureAuthenticated(browser, role, testInfo.workerIndex)
    const baseURL = getBaseUrl(role)

    const context = await browser.newContext({
      storageState: authPath,
      baseURL,
    })

    const page = await context.newPage()

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

export { expect } from '@playwright/test'
