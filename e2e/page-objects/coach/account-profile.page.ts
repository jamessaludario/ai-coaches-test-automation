import { expect } from '@nuxt/test-utils/playwright'
import { timeouts, userRoutes } from '../../constants'
import { nuxtGoto } from '../../helpers'
import { BasePage } from '../base.page'

export class CoachAccountProfilePage extends BasePage {
  get pageHeading() { return this.page.getByRole('heading', { name: /profile|account/i }) }
  get introductionVideoSection() { return this.page.getByRole('heading', { name: /introduction.*video/i }) }
  get avatarSection() { return this.page.getByRole('heading', { name: /avatar/i }) }
  get displayNameField() { return this.page.getByLabel(/display.*name/i) }
  get headlineField() { return this.page.getByLabel(/headline/i) }
  get bioField() { return this.page.getByLabel(/bio/i) }
  get usernameField() { return this.page.getByLabel(/username/i) }
  get emailField() { return this.page.getByLabel(/email/i) }
  get phoneNumberField() { return this.page.getByLabel(/phone.*number/i) }
  get countryField() { return this.page.getByLabel(/country/i) }
  get saveButton() { return this.page.getByRole('button', { name: /save|update/i }) }
  get successMessage() { return this.page.getByText(/(saved|updated).*successfully/i) }

  async goto() { await nuxtGoto(this.page, userRoutes.coach.account) }
  async updateHeadline(headline: string) { await this.headlineField.fill(headline) }
  async updateBio(bio: string) { await this.bioField.fill(bio) }
  async saveProfile() { await this.saveButton.click() }
  async expectSaveSuccess() { await expect(this.successMessage).toBeVisible({ timeout: timeouts.notification.success }) }
}
