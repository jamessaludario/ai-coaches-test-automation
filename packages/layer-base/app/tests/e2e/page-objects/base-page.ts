import type { Locator, Page } from 'playwright'

/**
 * Base Page Object
 *
 * Provides common page interaction methods.
 * NO assertions - page objects should only interact with the page.
 * Assertions belong in test files or helper functions.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' })
  }

  async clickAndWait(locator: Locator, urlPattern?: string | RegExp) {
    await locator.click()
    if (urlPattern) {
      await this.page.waitForURL(urlPattern)
    }
  }
}
