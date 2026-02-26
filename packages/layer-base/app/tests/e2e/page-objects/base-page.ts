import type { Locator, Page } from 'playwright'
import { timeouts } from '../constants'

/**
 * Base Page Object
 *
 * Provides common page interaction methods.
 * NO assertions - page objects should only interact with the page.
 * Assertions belong in test files or helper functions.
 */
export class BasePage {
  constructor(protected readonly page: Page) { }

  /**
   * Common Locators
   */
  get toastMessage() {
    return this.page.locator('[role="alert"], .toast, .notification')
  }

  get loadingIndicator() {
    return this.page.locator('.loading, .spinner, [aria-busy="true"]')
  }

  get modal() {
    return this.page.getByRole('dialog')
  }

  /**
   * Utility Methods
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle', { timeout: timeouts.page.pageLoad })
  }

  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' })
  }

  async clickAndWait(locator: Locator, urlPattern?: string | RegExp) {
    await locator.click()
    if (urlPattern) {
      await this.page.waitForURL(urlPattern, { timeout: timeouts.page.navigation })
    }
  }

  async waitForLoadingHidden() {
    await this.loadingIndicator.first().waitFor({ state: 'hidden', timeout: timeouts.ui.elementVisible })
  }

  async waitForURL(url: string | RegExp) {
    await this.page.waitForURL(url, { timeout: timeouts.page.navigation })
  }
}
