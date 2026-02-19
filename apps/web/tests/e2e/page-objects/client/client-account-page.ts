import { expect } from '@nuxt/test-utils/playwright'
import { timeouts, userRoutes } from '../../constants'
import { nuxtGoto } from '../../helpers'
import { BasePage } from '../../page-objects'

/**
 * Client Account Page Object
 *
 * Encapsulates client account profile interactions
 */
export class ClientAccountPage extends BasePage {
  get pageHeading() {
    return this.page.getByRole('heading', { name: /profile|account/i })
  }

  get usernameField() {
    return this.page.getByLabel(/username/i)
  }

  get emailField() {
    return this.page.getByLabel(/email/i)
  }

  get phoneNumberField() {
    return this.page.getByLabel(/phone.*number/i)
  }

  get countryField() {
    return this.page.getByLabel(/country/i)
  }

  get saveButton() {
    return this.page.getByRole('button', { name: /save|update/i })
  }

  get successMessage() {
    return this.page.getByText(/(saved|updated).*successfully/i)
  }

  async goto() {
    await nuxtGoto(this.page, userRoutes.client.account)
  }

  async expectPageLoaded() {
    await expect(this.pageHeading).toBeVisible({ timeout: timeouts.page.pageLoad })
  }

  async expectAccountFieldsVisible() {
    await expect(this.usernameField).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await expect(this.emailField).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await expect(this.countryField).toBeVisible({ timeout: timeouts.ui.elementVisible })
  }

  async updatePhoneNumber(phoneNumber: string) {
    await this.phoneNumberField.fill(phoneNumber)
    await this.saveButton.click()
  }

  async expectSaveSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: timeouts.notification.success })
  }
}
