import type { NuxtGoto } from '../../helpers/navigation.helper'
import { authContent, loginRoutes, timeouts } from '../../constants'
import { escapeRegExp } from '../../helpers/date.helper'
import { BasePage } from '../base.page'
import { expect } from 'playwright/test'

export class LoginPage extends BasePage {
  get emailInput() {
    return this.page.getByRole('textbox', { name: /Email/i })
  }

  get passwordInput() {
    return this.page.getByLabel('Password')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: authContent.loginButton })
  }

  get continueButton() {
    return this.page.getByRole('button', { name: authContent.continue, exact: true })
  }

  get verifyButton() {
    return this.page.getByRole('button', { name: 'Verify' })
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
    await this.continueButton.click()
  }

  async fillOTP() {
    await expect(this.page.getByRole('heading', { name: /One-Time Password/i })).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await this.page.locator('.pin-input-group input').first().fill('123456')
    await this.verifyButton.click()
  }

  async submit() {
    await this.submitButton.click()
  }

  async login(goto: NuxtGoto, email: string, password: string, redirect: string, baseUrl?: string) {
    await this.navigateToLogin(goto, redirect, baseUrl)
    await this.fillCredentials(email, password)
    await this.fillOTP()
    await this.page.waitForLoadState('networkidle', { timeout: timeouts.page.networkIdle })
  }

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
