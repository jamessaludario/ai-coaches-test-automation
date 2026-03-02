import { timeouts } from '../../constants'
import { BasePage } from '../base.page'

export class OnboardingPage extends BasePage {
  get heading() {
    return this.page.getByRole('heading', { name: /complete.*account|onboarding/i })
  }

  get countrySelect() {
    return this.page.getByLabel(/country/i)
  }

  get termsCheckbox() {
    return this.page.getByRole('checkbox', { name: /agree.*Privacy Policy.*Terms of Use/i })
  }

  get submitButton() {
    return this.page.getByRole('button', { name: /continue|submit|complete/i })
  }

  get usernameInput() {
    return this.page.getByLabel(/username/i)
  }

  get firstNameInput() {
    return this.page.getByLabel(/first.*name/i)
  }

  get lastNameInput() {
    return this.page.getByLabel(/last.*name/i)
  }

  get phoneNumberInput() {
    return this.page.getByLabel(/phone.*number/i)
  }

  async fillOnboardingForm(data: {
    username?: string
    firstName?: string
    lastName?: string
    phoneNumber?: string
    country?: string
  }) {
    if (data.username) await this.usernameInput.fill(data.username)
    if (data.firstName) await this.firstNameInput.fill(data.firstName)
    if (data.lastName) await this.lastNameInput.fill(data.lastName)
    if (data.phoneNumber) await this.phoneNumberInput.fill(data.phoneNumber)
    if (data.country) {
      await this.countrySelect.click()
      await this.page.getByRole('option', { name: data.country }).click()
    }
  }

  async acceptTerms() {
    await this.termsCheckbox.check()
  }

  async submit() {
    await this.submitButton.click()
    await this.page.waitForLoadState('networkidle', { timeout: timeouts.page.networkIdle })
  }
}
