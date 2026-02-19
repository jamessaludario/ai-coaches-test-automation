import type { BrowserContext, Page } from '@playwright/test'
import process from 'node:process'
import { test as base } from '@playwright/test'

/**
 * Lifecycle Fixtures
 *
 * Extended fixtures for lifecycle integration tests that span multiple apps
 */

interface LifecycleFixtures {
  /**
   * Additional browser context for multi-role testing
   * Use for admin operations while main page is used for coach/client
   */
  adminContext: BrowserContext

  /**
   * Additional browser context for coach operations
   */
  coachContext: BrowserContext

  /**
   * Additional browser context for client operations
   */
  clientContext: BrowserContext

  /**
   * Helper to create isolated page contexts for different roles
   */
  createRolePage: (context: BrowserContext) => Promise<Page>
}

export const test = base.extend<LifecycleFixtures>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL: process.env.ADMIN_BASE_URL || 'http://localhost:3213',
    })
    await use(context)
    await context.close()
  },

  coachContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3212',
    })
    await use(context)
    await context.close()
  },

  clientContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3212',
    })
    await use(context)
    await context.close()
  },

  createRolePage: async ({ browser: _browser }, use) => {
    const pages: Page[] = []

    const createPage = async (context: BrowserContext): Promise<Page> => {
      const page = await context.newPage()
      pages.push(page)
      return page
    }

    await use(createPage)

    // Cleanup all created pages in parallel
    const results = await Promise.allSettled(
      pages.map(async (page) => {
        try {
          await page.close()
        }
        catch (error) {
          // Only ignore known benign errors - pages may already be closed during teardown
          const errorMessage = error instanceof Error ? error.message : String(error)
          const errorName = error instanceof Error ? error.name : ''

          const isBenignError
            = errorMessage.includes('Target closed')
              || errorMessage.includes('NoSuchPage')
              || errorName === 'TargetClosedError'
              || errorName === 'NoSuchPageError'

          if (!isBenignError) {
            // Log unexpected errors so they're visible during tests
            console.error('Unexpected error closing page:', error)
            throw error
          }
        }
      }),
    )

    // Re-throw any unexpected errors that were captured
    const unexpectedErrors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map(r => r.reason)
    if (unexpectedErrors.length > 0) {
      throw unexpectedErrors[0]
    }
  },
})
