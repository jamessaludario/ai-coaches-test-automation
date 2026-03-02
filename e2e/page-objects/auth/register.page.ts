import { BasePage } from '../base.page'

export class RegisterPage extends BasePage {
  get firstNameInput() {
    return this.page.getByLabel(/first.*name/i)
  }

  get lastNameInput() {
    return this.page.getByLabel(/last.*name/i)
  }

  get emailInput() {
    return this.page.getByLabel(/email/i)
  }

  get passwordInput() {
    return this.page.getByLabel(/password/i)
  }

  get submitButton() {
    return this.page.getByRole('button', { name: /register|sign up|create account/i })
  }

  async fillRegistrationForm(data: { firstName: string, lastName: string, email: string, password: string }) {
    await this.firstNameInput.fill(data.firstName)
    await this.lastNameInput.fill(data.lastName)
    await this.emailInput.fill(data.email)
    await this.passwordInput.fill(data.password)
  }

  async submit() {
    await this.submitButton.click()
  }
}
