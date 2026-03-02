import type { Page } from 'playwright'

/**
 * API Helper - Utilities for API interactions in tests
 *
 * Placeholder for future API helper functions such as:
 * - Direct API calls for test setup/teardown
 * - API response validation
 * - API authentication token management
 */

export async function waitForApiResponse(page: Page, urlPattern: string | RegExp, timeout = 15000) {
  return page.waitForResponse(
    response => {
      const url = response.url()
      return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url)
    },
    { timeout },
  )
}

export async function interceptApiCall(page: Page, urlPattern: string, handler: (route: any) => void) {
  await page.route(urlPattern, handler)
}
