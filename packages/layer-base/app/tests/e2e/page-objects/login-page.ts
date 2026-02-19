import type { NuxtGoto } from '../helpers/navigation-helpers'
import { authContent, loginRoutes, timeouts } from '../constants'
import { escapeRegExp } from '../utils'
import { BasePage } from './base-page'

/**
 * Login Page Object
 *
 * Handles login page interactions.
 * For assertions, use helpers from `helpers/auth-helpers.ts`
 */
export class LoginPage extends BasePage {
  get emailInput() {
    return this.page.getByLabel('Email')
  }

  get passwordInput() {
    return this.page.getByLabel('Password')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: authContent.loginButton })
  }

  getErrorMessage(message: string | RegExp) {
    return this.page.getByText(message)
  }

  async navigateToLogin(goto: NuxtGoto, redirect: string, baseUrl?: string) {
    const loginPath = `${loginRoutes.loginRedirect}${redirect}`
    const url = baseUrl
      ? `${baseUrl.replace(/\/$/, '')}${loginPath}`
      : loginPath
    await goto(url, { waitUntil: 'networkidle' })
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
  }

  async submit() {
    await this.submitButton.click()
  }

  async login(goto: NuxtGoto, email: string, password: string, redirect: string, baseUrl?: string) {
    await this.navigateToLogin(goto, redirect, baseUrl)
    await this.fillCredentials(email, password)
    await this.submit()
    await this.page.waitForLoadState('networkidle', { timeout: timeouts.page.networkIdle })
  }

  /**
   * Wait for redirect to a specific URL
   * Returns the promise for flexibility in test files
   */
  async waitForRedirect(url: string | RegExp, timeout = timeouts.page.networkIdle, baseUrl?: string) {
    if (baseUrl && url instanceof RegExp) {
      const escapedBase = escapeRegExp(baseUrl.replace(/\/$/, ''))
      const urlSource = url.source.replace(/^\^/, '').replace(/\$$/, '')
      const hasStartAnchor = url.source.startsWith('^')
      const hasEndAnchor = url.source.endsWith('$')
      const combinedPattern = (hasStartAnchor ? '^' : '') + escapedBase + urlSource + (hasEndAnchor ? '$' : '')
      const fullPattern = new RegExp(combinedPattern, url.flags)
      await this.page.waitForURL(fullPattern, { timeout })
    }
    else {
      const fullUrl = baseUrl && typeof url === 'string'
        ? `${baseUrl.replace(/\/$/, '')}${url}`
        : url
      await this.page.waitForURL(fullUrl, { timeout })
    }
  }
}
